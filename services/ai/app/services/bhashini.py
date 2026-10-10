import base64
import logging
import subprocess
import time
from typing import Any

import httpx

from app.core.config import Settings
from app.services.errors import AIServiceError

logger = logging.getLogger("craftigari.bhashini")

SUPPORTED_INDIAN_LANGUAGES = {
    "hi": "Hindi",
    "en": "English",
    "bn": "Bengali",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "mr": "Marathi",
    "or": "Odia",
    "pa": "Punjabi",
    "ta": "Tamil",
    "te": "Telugu",
    "ur": "Urdu",
    "as": "Assamese",
}

_PIPELINE_CACHE: dict[str, tuple[float, dict[str, Any]]] = {}
CACHE_TTL_SECONDS = 600.0  # 10 minutes cache for pipeline configuration


def validate_language(lang_code: str) -> str:
    cleaned = (lang_code or "").strip().lower()
    if cleaned not in SUPPORTED_INDIAN_LANGUAGES:
        supported = ", ".join(sorted(SUPPORTED_INDIAN_LANGUAGES.keys()))
        raise AIServiceError(
            422,
            f"Language '{lang_code}' is not supported. Supported: {supported}",
            "UNSUPPORTED_LANGUAGE",
        )
    return cleaned


def convert_audio_to_wav(audio_bytes: bytes) -> bytes:
    """Converts audio stream (WebM, Ogg, MP4, etc.) to 16kHz mono WAV PCM for BHASHINI ASR."""
    # If already a valid 16kHz WAV header, we can still standardize or use it
    try:
        import imageio_ffmpeg

        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    except Exception as exc:
        logger.warning("imageio_ffmpeg not available for audio conversion: %s", exc)
        # Fall back to raw bytes if conversion tool is unavailable
        return audio_bytes

    try:
        process = subprocess.Popen(
            [
                ffmpeg_exe,
                "-nostdin",
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                "pipe:0",
                "-vn",
                "-acodec",
                "pcm_s16le",
                "-ar",
                "16000",
                "-ac",
                "1",
                "-f",
                "wav",
                "pipe:1",
            ],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        stdout, stderr = process.communicate(input=audio_bytes, timeout=15)
        if process.returncode != 0:
            err_msg = stderr.decode("utf-8", errors="ignore").strip()
            logger.error("FFmpeg audio conversion failed: %s", err_msg)
            # If input is already wav, pass through; otherwise raise
            if audio_bytes.startswith(b"RIFF"):
                return audio_bytes
            raise AIServiceError(
                422,
                "Failed to convert audio into compatible speech format",
                "AUDIO_CONVERSION_ERROR",
            )
        return stdout
    except subprocess.TimeoutExpired:
        process.kill()
        raise AIServiceError(504, "Audio conversion timed out", "AUDIO_CONVERSION_TIMEOUT")
    except Exception as exc:
        if isinstance(exc, AIServiceError):
            raise
        logger.error("Unexpected error in audio conversion: %s", exc)
        if audio_bytes.startswith(b"RIFF"):
            return audio_bytes
        raise AIServiceError(
            422,
            "Unsupported or malformed audio data",
            "AUDIO_PROCESSING_ERROR",
        )


async def get_pipeline_config(
    task_type: str,
    source_language: str,
    target_language: str | None,
    settings: Settings,
    http_client: httpx.AsyncClient | None = None,
) -> dict[str, Any]:
    """Retrieves pipeline configuration and inference auth token from BHASHINI."""
    if not settings.bhashini_user_id or not settings.bhashini_api_key:
        raise AIServiceError(
            503,
            "BHASHINI speech service is not configured. Missing BHASHINI_USER_ID or BHASHINI_API_KEY.",
            "BHASHINI_NOT_CONFIGURED",
        )

    cache_key = f"{task_type}:{source_language}:{target_language or ''}"
    now = time.time()
    if cache_key in _PIPELINE_CACHE:
        expires_at, cached_data = _PIPELINE_CACHE[cache_key]
        if now < expires_at:
            return cached_data

    task_config: dict[str, Any] = {
        "language": {"sourceLanguage": source_language}
    }
    if target_language and task_type == "translation":
        task_config["language"]["targetLanguage"] = target_language

    request_payload: dict[str, Any] = {
        "pipelineTasks": [
            {
                "taskType": task_type,
                "config": task_config,
            }
        ]
    }
    if settings.bhashini_pipeline_id:
        request_payload["pipelineRequestConfig"] = {
            "pipelineId": settings.bhashini_pipeline_id
        }

    headers = {
        "Content-Type": "application/json",
        "userID": settings.bhashini_user_id,
        "ulcaApiKey": settings.bhashini_api_key,
    }

    client = http_client or httpx.AsyncClient(timeout=settings.bhashini_timeout_seconds)
    try:
        response = await client.post(
            settings.bhashini_config_url,
            json=request_payload,
            headers=headers,
        )
    except httpx.TimeoutException:
        raise AIServiceError(504, "BHASHINI configuration request timed out", "BHASHINI_TIMEOUT")
    except httpx.RequestError as exc:
        logger.error("BHASHINI connection error: %s", exc)
        raise AIServiceError(502, "Unable to reach BHASHINI service", "BHASHINI_NETWORK_ERROR")
    finally:
        if not http_client:
            await client.aclose()

    if response.status_code in (401, 403):
        raise AIServiceError(503, "BHASHINI authorization failed", "BHASHINI_AUTH_FAILED")
    if response.status_code == 429:
        raise AIServiceError(429, "BHASHINI rate limit exceeded", "BHASHINI_RATE_LIMITED")
    if response.status_code >= 400:
        logger.error("BHASHINI config error [%d]: %s", response.status_code, response.text)
        raise AIServiceError(502, "BHASHINI pipeline configuration failed", "BHASHINI_CONFIG_ERROR")

    try:
        data = response.json()
    except Exception:
        raise AIServiceError(502, "Invalid JSON from BHASHINI pipeline configuration", "BHASHINI_INVALID_RESPONSE")

    # Extract callback URL and inference key
    endpoint_info = data.get("pipelineInferenceAPIEndPoint", {})
    callback_url = endpoint_info.get("callbackUrl") or settings.bhashini_inference_url
    inference_api_key = endpoint_info.get("inferenceApiKey", {})

    # Extract service ID
    service_id = None
    response_configs = data.get("pipelineResponseConfig", [])
    for task_resp in response_configs:
        if task_resp.get("taskType") == task_type:
            configs = task_resp.get("config", [])
            if configs and isinstance(configs, list):
                service_id = configs[0].get("serviceId")
            break

    if not service_id:
        raise AIServiceError(
            502,
            f"No service found for task '{task_type}' in BHASHINI for language '{source_language}'",
            "BHASHINI_SERVICE_UNAVAILABLE",
        )

    pipeline_data = {
        "callback_url": callback_url,
        "inference_key_name": inference_api_key.get("name", "Authorization"),
        "inference_key_value": inference_api_key.get("value", ""),
        "service_id": service_id,
    }

    _PIPELINE_CACHE[cache_key] = (now + CACHE_TTL_SECONDS, pipeline_data)
    return pipeline_data


async def transcribe_speech(
    audio_base64: str,
    mime_type: str,
    language: str,
    settings: Settings,
    http_client: httpx.AsyncClient | None = None,
) -> str:
    """Transcribes speech using BHASHINI ASR."""
    norm_lang = validate_language(language)

    try:
        raw_bytes = base64.b64decode(audio_base64)
    except Exception:
        raise AIServiceError(422, "Audio data must be valid base64", "INVALID_AUDIO_DATA")

    if len(raw_bytes) == 0:
        raise AIServiceError(422, "Audio recording is empty", "EMPTY_AUDIO")
    if len(raw_bytes) > settings.max_audio_bytes:
        raise AIServiceError(
            413,
            f"Audio recording exceeds maximum allowed size ({settings.max_audio_bytes // (1024*1024)} MB)",
            "AUDIO_TOO_LARGE",
        )

    # Convert audio to 16kHz mono WAV for BHASHINI ASR
    wav_bytes = convert_audio_to_wav(raw_bytes)
    wav_b64 = base64.b64encode(wav_bytes).decode("ascii")

    config = await get_pipeline_config(
        task_type="asr",
        source_language=norm_lang,
        target_language=None,
        settings=settings,
        http_client=http_client,
    )

    inference_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if config["inference_key_value"]:
        inference_headers[config["inference_key_name"]] = config["inference_key_value"]

    inference_body = {
        "pipelineTasks": [
            {
                "taskType": "asr",
                "config": {
                    "language": {"sourceLanguage": norm_lang},
                    "serviceId": config["service_id"],
                    "audioFormat": "wav",
                    "samplingRate": 16000,
                },
            }
        ],
        "inputData": {
            "audio": [
                {
                    "audioContent": wav_b64,
                }
            ]
        },
    }

    client = http_client or httpx.AsyncClient(timeout=settings.bhashini_timeout_seconds)
    try:
        res = await client.post(
            config["callback_url"],
            json=inference_body,
            headers=inference_headers,
        )
    except httpx.TimeoutException:
        raise AIServiceError(504, "BHASHINI speech transcription timed out", "BHASHINI_TIMEOUT")
    except httpx.RequestError as exc:
        logger.error("BHASHINI inference network error: %s", exc)
        raise AIServiceError(502, "Speech transcription network failure", "BHASHINI_NETWORK_ERROR")
    finally:
        if not http_client:
            await client.aclose()

    if res.status_code in (401, 403):
        raise AIServiceError(503, "BHASHINI inference authorization failed", "BHASHINI_AUTH_FAILED")
    if res.status_code == 429:
        raise AIServiceError(429, "BHASHINI speech rate limit reached", "BHASHINI_RATE_LIMITED")
    if res.status_code >= 400:
        logger.error("BHASHINI ASR inference error [%d]: %s", res.status_code, res.text)
        raise AIServiceError(502, "Speech transcription failed on provider", "BHASHINI_INFERENCE_ERROR")

    try:
        data = res.json()
        transcripts = []
        for task_resp in data.get("pipelineResponse", []):
            if task_resp.get("taskType") == "asr":
                for item in task_resp.get("output", []):
                    text = item.get("source", "").strip()
                    if text:
                        transcripts.append(text)
        transcript = " ".join(transcripts).strip()
    except Exception as exc:
        logger.error("Error parsing BHASHINI ASR output: %s", exc)
        raise AIServiceError(502, "Invalid response from speech transcription provider", "BHASHINI_PARSE_ERROR")

    return transcript


async def translate_text(
    text: str,
    source_language: str,
    target_language: str,
    settings: Settings,
    http_client: httpx.AsyncClient | None = None,
) -> str:
    """Translates text between supported Indian languages / English using BHASHINI."""
    src_norm = validate_language(source_language)
    tgt_norm = validate_language(target_language)

    clean_text = (text or "").strip()
    if not clean_text:
        return ""
    if src_norm == tgt_norm:
        return clean_text

    config = await get_pipeline_config(
        task_type="translation",
        source_language=src_norm,
        target_language=tgt_norm,
        settings=settings,
        http_client=http_client,
    )

    inference_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if config["inference_key_value"]:
        inference_headers[config["inference_key_name"]] = config["inference_key_value"]

    inference_body = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": src_norm,
                        "targetLanguage": tgt_norm,
                    },
                    "serviceId": config["service_id"],
                },
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": clean_text,
                }
            ]
        },
    }

    client = http_client or httpx.AsyncClient(timeout=settings.bhashini_timeout_seconds)
    try:
        res = await client.post(
            config["callback_url"],
            json=inference_body,
            headers=inference_headers,
        )
    except httpx.TimeoutException:
        raise AIServiceError(504, "BHASHINI translation timed out", "BHASHINI_TIMEOUT")
    except httpx.RequestError as exc:
        logger.error("BHASHINI translation network error: %s", exc)
        raise AIServiceError(502, "Translation network failure", "BHASHINI_NETWORK_ERROR")
    finally:
        if not http_client:
            await client.aclose()

    if res.status_code in (401, 403):
        raise AIServiceError(503, "BHASHINI translation authorization failed", "BHASHINI_AUTH_FAILED")
    if res.status_code == 429:
        raise AIServiceError(429, "BHASHINI translation rate limit reached", "BHASHINI_RATE_LIMITED")
    if res.status_code >= 400:
        logger.error("BHASHINI translation error [%d]: %s", res.status_code, res.text)
        raise AIServiceError(502, "Translation failed on provider", "BHASHINI_INFERENCE_ERROR")

    try:
        data = res.json()
        translated_parts = []
        for task_resp in data.get("pipelineResponse", []):
            if task_resp.get("taskType") == "translation":
                for item in task_resp.get("output", []):
                    translated = item.get("target", "").strip()
                    if translated:
                        translated_parts.append(translated)
        translated_text = " ".join(translated_parts).strip()
    except Exception as exc:
        logger.error("Error parsing BHASHINI translation output: %s", exc)
        raise AIServiceError(502, "Invalid response from translation provider", "BHASHINI_PARSE_ERROR")

    return translated_text
