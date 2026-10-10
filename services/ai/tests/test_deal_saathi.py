from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.main import app

INTERNAL_KEY = "test-internal-key"
client = TestClient(app)


def test_deal_saathi_endpoint_returns_structured_data(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", INTERNAL_KEY)
    monkeypatch.setenv("GEMINI_API_KEY", "")
    get_settings.cache_clear()

    try:
        response = client.post(
            "/api/deal-saathi",
            headers={"X-Internal-API-Key": INTERNAL_KEY},
            json={
                "buyer_message": "I need 20 handmade pottery pieces for an event. Can you provide a bulk discount?",
                "product_title": "Terracotta Vase",
                "quantity": 20,
                "language": "hi",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "summary" in data["data"]
        assert "explanation" in data["data"]
        assert "key_takeaways" in data["data"]
        assert "suggested_reply" in data["data"]
        assert len(data["data"]["key_takeaways"]) > 0
    finally:
        get_settings.cache_clear()


def test_deal_saathi_requires_internal_api_key(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", INTERNAL_KEY)
    get_settings.cache_clear()

    try:
        response = client.post(
            "/api/deal-saathi",
            json={"buyer_message": "Hello"},
        )
        assert response.status_code == 401
    finally:
        get_settings.cache_clear()
