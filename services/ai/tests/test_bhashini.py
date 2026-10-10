import base64
import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.main import app
from app.services.bhashini import _PIPELINE_CACHE

client = TestClient(app)

DUMMY_AUDIO_B64 = base64.b64encode(b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x40\x1f\x00\x00\x80\x3e\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00").decode("ascii")


def test_voice_transcription_requires_internal_authorization(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    get_settings.cache_clear()
    response = client.post(
        "/api/voice-transcription",
        json={"audio_base64": DUMMY_AUDIO_B64, "language": "hi"},
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"
    get_settings.cache_clear()


def test_translation_requires_internal_authorization(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    get_settings.cache_clear()
    response = client.post(
        "/api/translation",
        json={"text": "नमस्ते", "source_language": "hi", "target_language": "en"},
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"
    get_settings.cache_clear()


def test_voice_transcription_fails_when_unconfigured(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "bhashini")
    monkeypatch.setenv("BHASHINI_USER_ID", "")
    monkeypatch.setenv("BHASHINI_API_KEY", "")
    get_settings.cache_clear()

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": DUMMY_AUDIO_B64, "language": "hi"},
    )
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "BHASHINI_NOT_CONFIGURED"
    get_settings.cache_clear()


def test_translation_fails_when_unconfigured(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "bhashini")
    monkeypatch.setenv("BHASHINI_USER_ID", "")
    monkeypatch.setenv("BHASHINI_API_KEY", "")
    get_settings.cache_clear()

    response = client.post(
        "/api/translation",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"text": "हस्तशिल्प", "source_language": "hi", "target_language": "en"},
    )
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "BHASHINI_NOT_CONFIGURED"
    get_settings.cache_clear()


def test_voice_transcription_validates_language(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "bhashini")
    monkeypatch.setenv("BHASHINI_USER_ID", "test-user")
    monkeypatch.setenv("BHASHINI_API_KEY", "test-key")
    get_settings.cache_clear()

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": DUMMY_AUDIO_B64, "language": "unsupported-lang"},
    )
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "UNSUPPORTED_LANGUAGE"
    get_settings.cache_clear()


def test_voice_transcription_success_mocked(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "bhashini")
    monkeypatch.setenv("BHASHINI_USER_ID", "test-user")
    monkeypatch.setenv("BHASHINI_API_KEY", "test-key")
    get_settings.cache_clear()
    _PIPELINE_CACHE.clear()

    from app.api.routes import bhashini as bhashini_routes

    async def fake_transcribe(audio_base64, mime_type, language, settings):
        assert language == "hi"
        return "यह एक सुंदर हाथ से बना मिट्टी का घड़ा है"

    monkeypatch.setattr(bhashini_routes, "transcribe_speech", fake_transcribe)

    response = client.post(
        "/api/voice-transcription",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"audio_base64": DUMMY_AUDIO_B64, "language": "hi"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["transcript"] == "यह एक सुंदर हाथ से बना मिट्टी का घड़ा है"
    assert data["data"]["language"] == "hi"
    get_settings.cache_clear()


def test_translation_success_mocked(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("VOICE_TRANSLATION_PROVIDER", "bhashini")
    monkeypatch.setenv("BHASHINI_USER_ID", "test-user")
    monkeypatch.setenv("BHASHINI_API_KEY", "test-key")
    get_settings.cache_clear()
    _PIPELINE_CACHE.clear()

    from app.api.routes import bhashini as bhashini_routes

    async def fake_translate(text, source_language, target_language, settings):
        assert source_language == "hi"
        assert target_language == "en"
        return "Handmade terracotta clay pot"

    monkeypatch.setattr(bhashini_routes, "translate_text", fake_translate)

    response = client.post(
        "/api/translation",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={"text": "मिट्टी का घड़ा", "source_language": "hi", "target_language": "en"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["translated_text"] == "Handmade terracotta clay pot"
    get_settings.cache_clear()
