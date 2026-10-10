import base64
import io
import logging
import re
import subprocess
import wave
from typing import Any

import httpx

from app.core.config import Settings
from app.services.bhashini import convert_audio_to_wav
from app.services.errors import AIServiceError

logger = logging.getLogger("craftigari.sarvam")

SARVAM_LANGUAGE_MAP: dict[str, str] = {
    "hi": "hi-IN",
    "en": "en-IN",
    "bn": "bn-IN",
    "gu": "gu-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "mr": "mr-IN",
    "od": "od-IN",
    "or": "od-IN",
    "pa": "pa-IN",
    "ta": "ta-IN",
    "te": "te-IN",
    "ur": "ur-IN",
}

REVERSE_LANGUAGE_MAP: dict[str, str] = {
    "hi-IN": "hi",
    "en-IN": "en",
    "bn-IN": "bn",
    "gu-IN": "gu",
    "kn-IN": "kn",
    "ml-IN": "ml",
    "mr-IN": "mr",
    "od-IN": "od",
    "pa-IN": "pa",
    "ta-IN": "ta",
    "te-IN": "te",
    "ur-IN": "ur",
}

SUPPORTED_MIME_TYPES: dict[str, tuple[str, str]] = {
    "audio/webm": ("audio.webm", "audio/webm"),
    "audio/wav": ("audio.wav", "audio/wav"),
    "audio/x-wav": ("audio.wav", "audio/wav"),
    "audio/wave": ("audio.wav", "audio/wav"),
    "audio/mpeg": ("audio.mp3", "audio/mpeg"),
    "audio/mp3": ("audio.mp3", "audio/mpeg"),
    "audio/ogg": ("audio.ogg", "audio/ogg"),
    "audio/opus": ("audio.ogg", "audio/ogg"),
    "audio/mp4": ("audio.mp4", "audio/mp4"),
    "audio/m4a": ("audio.m4a", "audio/mp4"),
    "audio/x-m4a": ("audio.m4a", "audio/mp4"),
    "audio/aac": ("audio.aac", "audio/aac"),
    "audio/flac": ("audio.flac", "audio/flac"),
}


def to_sarvam_language(lang_code: str) -> str:
    cleaned = (lang_code or "").strip().lower()
    if cleaned in SARVAM_LANGUAGE_MAP:
        return SARVAM_LANGUAGE_MAP[cleaned]
    # Check if already a BCP-47 code (e.g. 'hi-in')
    upper_suffix = cleaned.split("-")
    if len(upper_suffix) == 2 and upper_suffix[0] in SARVAM_LANGUAGE_MAP:
        return f"{upper_suffix[0]}-IN"
    supported = ", ".join(sorted(SARVAM_LANGUAGE_MAP.keys()))
    raise AIServiceError(
        422,
        f"Language '{lang_code}' is not supported by Sarvam. Supported: {supported}",
        "UNSUPPORTED_LANGUAGE",
    )


def from_sarvam_language(sarvam_code: str | None, default_lang: str) -> str:
    if not sarvam_code:
        return default_lang
    return REVERSE_LANGUAGE_MAP.get(sarvam_code, default_lang)


def check_audio_duration(audio_bytes: bytes, max_seconds: float = 30.5) -> None:
    """Enforces Sarvam REST transcription's 30-second duration limit."""
    # 1. Direct WAV header check
    if audio_bytes.startswith(b"RIFF"):
        try:
            with wave.open(io.BytesIO(audio_bytes), "rb") as wf:
                framerate = wf.getframerate()
                if framerate > 0:
                    duration = wf.getnframes() / float(framerate)
                    if duration > max_seconds:
                        raise AIServiceError(
                            400,
                            f"Audio recording exceeds 30-second duration limit ({duration:.1f}s)",
                            "AUDIO_TOO_LONG",
                        )
                    return
        except Exception as exc:
            if isinstance(exc, AIServiceError):
                raise

    # 2. Check duration via imageio_ffmpeg if available
    try:
        import imageio_ffmpeg

        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        proc = subprocess.Popen(
            [ffmpeg_exe, "-nostdin", "-hide_banner", "-i", "pipe:0", "-f", "null", "-"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        _, stderr = proc.communicate(input=audio_bytes, timeout=8)
        err_text = stderr.decode("utf-8", errors="ignore")
        match = re.search(r"(?:Duration:\s*|time=)(\d+):(\d+):(\d+(?:\.\d+)?)", err_text)
        if match:
            h, m, s = match.groups()
            duration = int(h) * 3600 + int(m) * 60 + float(s)
            if duration > max_seconds:
                raise AIServiceError(
                    400,
                    f"Audio recording exceeds 30-second duration limit ({duration:.1f}s)",
                    "AUDIO_TOO_LONG",
                )
    except Exception as exc:
        if isinstance(exc, AIServiceError):
            raise
        logger.debug("Could not determine audio duration via ffmpeg: %s", exc)


async def transcribe_speech(
    audio_base64: str,
    mime_type: str,
    language: str,
    settings: Settings,
    http_client: httpx.AsyncClient | None = None,
) -> tuple[str, str]:
    """
    Transcribes audio using Sarvam AI Speech-to-Text (saaras:v4).
    Returns (transcript, detected_or_requested_language).
    """
    if not settings.sarvam_api_key:
        raise AIServiceError(
            503,
            "Sarvam speech service is not configured. Missing SARVAM_API_KEY.",
            "SARVAM_NOT_CONFIGURED",
        )

    sarvam_lang = to_sarvam_language(language)

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

    # Enforce Sarvam's 30-second duration limit
    check_audio_duration(raw_bytes, max_seconds=30.5)

    # Normalize MIME type to check native support
    base_mime = (mime_type or "audio/webm").split(";")[0].strip().lower()

    if base_mime in SUPPORTED_MIME_TYPES:
        filename, content_type = SUPPORTED_MIME_TYPES[base_mime]
        upload_bytes = raw_bytes
    else:
        # Unsupported / unrecognised container: convert to WAV
        logger.info("Converting audio MIME '%s' to standard WAV PCM for Sarvam", base_mime)
        upload_bytes = convert_audio_to_wav(raw_bytes)
        filename, content_type = "audio.wav", "audio/wav"

    headers = {
        "api-subscription-key": settings.sarvam_api_key,
    }

    files = {
        "file": (filename, upload_bytes, content_type),
    }
    client = http_client or httpx.AsyncClient(timeout=settings.sarvam_timeout_seconds)

    async def request_transcription(language_code: str) -> tuple[str, str]:
        data = {
            "model": settings.sarvam_stt_model,
            "language_code": language_code,
            "mode": "transcribe",
        }
        try:
            res = await client.post(
                settings.sarvam_stt_url,
                headers=headers,
                files=files,
                data=data,
            )
        except httpx.TimeoutException:
            raise AIServiceError(504, "Sarvam speech transcription timed out", "SARVAM_TIMEOUT")
        except httpx.RequestError as exc:
            logger.error("Sarvam STT connection error: %s", exc)
            raise AIServiceError(502, "Speech transcription network failure", "SARVAM_NETWORK_ERROR")

        if res.status_code in (401, 403):
            raise AIServiceError(503, "Sarvam authorization failed. Invalid API key.", "SARVAM_AUTH_FAILED")
        if res.status_code == 429:
            raise AIServiceError(429, "Sarvam speech rate limit reached", "SARVAM_RATE_LIMITED")
        if res.status_code == 400:
            err_body = res.text.lower()
            if "duration" in err_body or "30" in err_body:
                raise AIServiceError(400, "Audio recording exceeds Sarvam's 30-second duration limit", "AUDIO_TOO_LONG")
            logger.error("Sarvam STT 400 error: %s", res.text)
            raise AIServiceError(400, "Audio format or parameters rejected by Sarvam", "AUDIO_INVALID")
        if res.status_code >= 400:
            logger.error("Sarvam STT error [%d]: %s", res.status_code, res.text)
            raise AIServiceError(502, "Speech transcription failed on Sarvam", "SARVAM_INFERENCE_ERROR")

        try:
            res_json = res.json()
            transcript = (res_json.get("transcript") or "").strip()
            detected_lang_code = res_json.get("language_code")
            internal_lang = from_sarvam_language(detected_lang_code, default_lang=language)
        except Exception as exc:
            logger.error("Failed to parse Sarvam STT response: %s", exc)
            raise AIServiceError(502, "Invalid response from speech transcription provider", "SARVAM_PARSE_ERROR")
        return transcript, internal_lang

    try:
        transcript, internal_lang = await request_transcription(sarvam_lang)
        if not transcript and sarvam_lang != "unknown":
            logger.info(
                "Sarvam returned an empty transcript for %s; retrying with automatic language detection",
                sarvam_lang,
            )
            transcript, internal_lang = await request_transcription("unknown")
    finally:
        if not http_client:
            await client.aclose()

    return transcript, internal_lang


async def translate_text(
    text: str,
    source_language: str,
    target_language: str,
    settings: Settings,
    http_client: httpx.AsyncClient | None = None,
) -> str:
    """
    Translates text between supported Indian languages / English using Sarvam AI (sarvam-translate:v1).
    Enforces 2,000 character limit.
    """
    if not settings.sarvam_api_key:
        raise AIServiceError(
            503,
            "Sarvam translation service is not configured. Missing SARVAM_API_KEY.",
            "SARVAM_NOT_CONFIGURED",
        )

    clean_text = (text or "").strip()
    if not clean_text:
        return ""

    if len(clean_text) > 2000:
        raise AIServiceError(
            422,
            f"Input text length ({len(clean_text)}) exceeds the 2,000-character limit for Sarvam translation",
            "TEXT_TOO_LONG",
        )

    src_sarvam = to_sarvam_language(source_language)
    tgt_sarvam = to_sarvam_language(target_language)

    if src_sarvam == tgt_sarvam:
        return clean_text

    headers = {
        "api-subscription-key": settings.sarvam_api_key,
        "Content-Type": "application/json",
    }
    payload = {
        "input": clean_text,
        "source_language_code": src_sarvam,
        "target_language_code": tgt_sarvam,
        "model": settings.sarvam_translate_model,
        "mode": "formal",
    }

    client = http_client or httpx.AsyncClient(timeout=settings.sarvam_timeout_seconds)
    try:
        res = await client.post(
            settings.sarvam_translate_url,
            headers=headers,
            json=payload,
        )
    except httpx.TimeoutException:
        raise AIServiceError(504, "Sarvam translation timed out", "SARVAM_TIMEOUT")
    except httpx.RequestError as exc:
        logger.error("Sarvam translation connection error: %s", exc)
        raise AIServiceError(502, "Translation network failure", "SARVAM_NETWORK_ERROR")
    finally:
        if not http_client:
            await client.aclose()

    if res.status_code in (401, 403):
        raise AIServiceError(503, "Sarvam authorization failed. Invalid API key.", "SARVAM_AUTH_FAILED")
    if res.status_code == 429:
        raise AIServiceError(429, "Sarvam translation rate limit reached", "SARVAM_RATE_LIMITED")
    if res.status_code in (400, 422):
        logger.error("Sarvam translation invalid request [%d]: %s", res.status_code, res.text)
        raise AIServiceError(422, "Invalid translation request parameters for Sarvam", "SARVAM_INVALID_REQUEST")
    if res.status_code >= 400:
        logger.error("Sarvam translation error [%d]: %s", res.status_code, res.text)
        raise AIServiceError(502, "Translation failed on Sarvam", "SARVAM_INFERENCE_ERROR")

    try:
        res_json = res.json()
        translated_text = (res_json.get("translated_text") or "").strip()
    except Exception as exc:
        logger.error("Failed to parse Sarvam translation response: %s", exc)
        raise AIServiceError(502, "Invalid response from translation provider", "SARVAM_PARSE_ERROR")

    return translated_text
