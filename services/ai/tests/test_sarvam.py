import base64
import io
import wave
import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.main import app

client = TestClient(app)

# Generate a valid short (1 second) WAV PCM audio file in base64
def make_wav_bytes(duration_seconds: float = 1.0) -> bytes:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(16000)
        num_frames = int(16000 * duration_seconds)
        wf.writeframes(b"\x00\x00" * num_frames)
    return buf.getvalue()

SHORT_WAV_BYTES = make_wav_bytes(1.0)
SHORT_WAV_B64 = base64.b64encode(SHORT_WAV_BYTES).decode("ascii")

LONG_WAV_BYTES = make_wav_bytes(32.0)
LONG_WAV_B64 = base64.b64encode(LONG_WAV_BYTES).decode("ascii")


def test_sarvam_requires_internal_authorization(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    get_settings.cache_clear()

    response = client.post(
        "/api/voice-transcription",
        json={"audio_base64": SHORT_WAV_B64, "language": "hi"},
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"
    get_settings.cache_clear()


def test_sarvam_transcription_fails_when_unconfigured(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "")
    get_settings.cache_clear()

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": SHORT_WAV_B64, "language": "hi"},
    )
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "SARVAM_NOT_CONFIGURED"
    get_settings.cache_clear()


def test_sarvam_translation_fails_when_unconfigured(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "")
    get_settings.cache_clear()

    response = client.post(
        "/api/translation",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"text": "हस्तशिल्प", "source_language": "hi", "target_language": "en"},
    )
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "SARVAM_NOT_CONFIGURED"
    get_settings.cache_clear()


def test_sarvam_active_does_not_require_bhashini_credentials(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    monkeypatch.setenv("BHASHINI_USER_ID", "")
    monkeypatch.setenv("BHASHINI_API_KEY", "")
    get_settings.cache_clear()

    from app.services import sarvam as sarvam_module

    async def fake_transcribe(audio_base64, mime_type, language, settings, http_client=None):
        return "हाथ से बनी सुंदर मूर्ति", "hi"

    monkeypatch.setattr(sarvam_module, "transcribe_speech", fake_transcribe)

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": SHORT_WAV_B64, "language": "hi"},
    )
    assert response.status_code == 200
    assert response.json()["data"]["transcript"] == "हाथ से बनी सुंदर मूर्ति"
    get_settings.cache_clear()


def test_sarvam_transcription_validates_language(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": SHORT_WAV_B64, "language": "invalid-lang"},
    )
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "UNSUPPORTED_LANGUAGE"
    get_settings.cache_clear()


def test_sarvam_transcription_enforces_30_second_limit(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": LONG_WAV_B64, "language": "hi"},
    )
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "AUDIO_TOO_LONG"
    get_settings.cache_clear()


def test_sarvam_transcription_hindi_success_mocked(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    from app.services import sarvam as sarvam_module

    captured_call = {}

    import httpx

    class FakeResponse:
        status_code = 200

        def json(self):
            return {
                "request_id": "test_req_123",
                "transcript": "यह शुद्ध टेराकोटा मिट्टी का फूलदान है",
                "language_code": "hi-IN",
            }

    class FakeClient:
        async def post(self, url, headers=None, files=None, data=None):
            captured_call["url"] = url
            captured_call["headers"] = headers
            captured_call["data"] = data
            captured_call["filename"] = files["file"][0]
            return FakeResponse()

        async def aclose(self):
            pass

    monkeypatch.setattr(httpx, "AsyncClient", lambda *args, **kwargs: FakeClient())

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": SHORT_WAV_B64, "language": "hi", "mime_type": "audio/webm"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["transcript"] == "यह शुद्ध टेराकोटा मिट्टी का फूलदान है"
    assert data["data"]["language"] == "hi"
    assert captured_call["data"]["language_code"] == "hi-IN"
    assert captured_call["data"]["model"] == "saaras:v4"
    assert captured_call["data"]["mode"] == "transcribe"
    assert captured_call["filename"] == "audio.webm"  # Direct WebM without ffmpeg
    get_settings.cache_clear()


def test_sarvam_transcription_english_success_mocked(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    import httpx

    captured_lang = {}

    class FakeResponse:
        status_code = 200

        def json(self):
            return {
                "request_id": "test_req_456",
                "transcript": "This is a handmade brass lamp from Moradabad",
                "language_code": "en-IN",
            }

    class FakeClient:
        async def post(self, url, headers=None, files=None, data=None):
            captured_lang["code"] = data.get("language_code")
            return FakeResponse()

        async def aclose(self):
            pass

    monkeypatch.setattr(httpx, "AsyncClient", lambda *args, **kwargs: FakeClient())

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": SHORT_WAV_B64, "language": "en", "mime_type": "audio/wav"},
    )
    assert response.status_code == 200
    assert response.json()["data"]["transcript"] == "This is a handmade brass lamp from Moradabad"
    assert response.json()["data"]["language"] == "en"
    assert captured_lang["code"] == "en-IN"
    get_settings.cache_clear()


def test_sarvam_retries_empty_transcript_with_language_detection(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    import httpx

    requested_languages = []

    class FakeResponse:
        status_code = 200

        def __init__(self, transcript, language_code):
            self._transcript = transcript
            self._language_code = language_code

        def json(self):
            return {
                "transcript": self._transcript,
                "language_code": self._language_code,
            }

    class FakeClient:
        async def post(self, _url, headers=None, files=None, data=None):
            requested_languages.append(data["language_code"])
            if data["language_code"] == "hi-IN":
                return FakeResponse("", "hi-IN")
            return FakeResponse("Handmade brass lamp", "en-IN")

        async def aclose(self):
            pass

    monkeypatch.setattr(httpx, "AsyncClient", lambda *args, **kwargs: FakeClient())

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": SHORT_WAV_B64, "language": "hi", "mime_type": "audio/wav"},
    )

    assert response.status_code == 200
    assert response.json()["data"]["transcript"] == "Handmade brass lamp"
    assert response.json()["data"]["language"] == "en"
    assert requested_languages == ["hi-IN", "unknown"]
    get_settings.cache_clear()


def test_sarvam_translation_hindi_to_english_success_mocked(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    import httpx

    captured_body = {}

    class FakeResponse:
        status_code = 200

        def json(self):
            return {
                "request_id": "trans_123",
                "translated_text": "Handcrafted blue pottery floral plate",
                "source_language_code": "hi-IN",
            }

    class FakeClient:
        async def post(self, url, headers=None, json=None):
            captured_body.update(json)
            return FakeResponse()

        async def aclose(self):
            pass

    monkeypatch.setattr(httpx, "AsyncClient", lambda *args, **kwargs: FakeClient())

    response = client.post(
        "/api/translation",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"text": "नीली मिट्टी की हस्तनिर्मित थाली", "source_language": "hi", "target_language": "en"},
    )
    assert response.status_code == 200
    assert response.json()["data"]["translated_text"] == "Handcrafted blue pottery floral plate"
    assert captured_body["source_language_code"] == "hi-IN"
    assert captured_body["target_language_code"] == "en-IN"
    assert captured_body["model"] == "sarvam-translate:v1"
    get_settings.cache_clear()


def test_sarvam_translation_english_to_hindi_success_mocked(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    import httpx

    class FakeResponse:
        status_code = 200

        def json(self):
            return {
                "request_id": "trans_456",
                "translated_text": "हस्तनिर्मित लकड़ी का आभूषण बॉक्स",
                "source_language_code": "en-IN",
            }

    class FakeClient:
        async def post(self, url, headers=None, json=None):
            return FakeResponse()

        async def aclose(self):
            pass

    monkeypatch.setattr(httpx, "AsyncClient", lambda *args, **kwargs: FakeClient())

    response = client.post(
        "/api/translation",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"text": "Handmade wooden jewelry box", "source_language": "en", "target_language": "hi"},
    )
    assert response.status_code == 200
    assert response.json()["data"]["translated_text"] == "हस्तनिर्मित लकड़ी का आभूषण बॉक्स"
    get_settings.cache_clear()


def test_sarvam_translation_character_limit_exceeded(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    long_text = "क" * 2005

    response = client.post(
        "/api/translation",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"text": long_text, "source_language": "hi", "target_language": "en"},
    )
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "TEXT_TOO_LONG"
    get_settings.cache_clear()


def test_sarvam_translation_identical_languages_no_call(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "sarvam")
    monkeypatch.setenv("SARVAM_API_KEY", "mock-sarvam-key")
    get_settings.cache_clear()

    response = client.post(
        "/api/translation",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"text": "समान भाषा", "source_language": "hi", "target_language": "hi"},
    )
    assert response.status_code == 200
    assert response.json()["data"]["translated_text"] == "समान भाषा"
    get_settings.cache_clear()
