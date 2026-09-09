from fastapi.testclient import TestClient # type: ignore
from app.main import app # type: ignore
client = TestClient(app)
def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert body["data"]["service"] == "craftigari-ai"
    assert body["data"]["status"] == "healthy"
    assert body["error"] is None