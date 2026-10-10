import asyncio

import pytest
from fastapi.testclient import TestClient

from app.api.routes import product_analysis as product_analysis_routes
from app.core.config import Settings, get_settings
from app.main import app
from app.schemas.product_analysis import (
    GeminiMakingProcessAnalysis,
    GeminiProductAnalysis,
    KnownProductDetails,
    ListingSuggestions,
    MakingProcessAnalysisRequest,
    MakingProcessStepInput,
    MakingProcessStepSuggestion,
    MissingInformationQuestion,
    ProductAnalysisData,
    ProductAnalysisRequest,
)
from app.services.errors import AIServiceError
from app.services.gemini import GeminiService
from app.services.product_analysis import validate_cloudinary_url

client = TestClient(app)


def test_product_analysis_requires_internal_authorization(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    get_settings.cache_clear()
    response = client.post(
        "/api/product-analysis",
        json={
            "imageUrls": [
                "https://res.cloudinary.com/test-cloud/image/upload/product.jpg"
            ]
        },
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"
    get_settings.cache_clear()


def test_product_analysis_route_returns_structured_mock(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "test-internal-key")
    monkeypatch.setenv("CLOUDINARY_CLOUD_NAME", "test-cloud")
    get_settings.cache_clear()

    async def fake_analysis(request, settings):
        assert request.language == "hi"
        return ProductAnalysisData(
            suggestions=ListingSuggestions(
                title="हस्तनिर्मित पात्र",
                description="कारीगर द्वारा दी गई जानकारी पर आधारित विवरण",
                category="Home decor",
                craft_type="Pottery",
                materials=[],
                colours=["लाल"],
                tags=["pottery"],
            ),
            confirmed_details=request.known_details,
            missing_information_questions=[
                MissingInformationQuestion(
                    id="material",
                    field="materials",
                    question="कौन सी सामग्री इस्तेमाल हुई?",
                )
            ],
            model=settings.gemini_model,
        )

    monkeypatch.setattr(product_analysis_routes, "analyze_product", fake_analysis)
    response = client.post(
        "/api/product-analysis",
        headers={"X-Internal-API-Key": "test-internal-key"},
        json={
            "imageUrls": [
                "https://res.cloudinary.com/test-cloud/image/upload/product.jpg"
            ],
            "language": "hi",
            "knownDetails": {"description": "मेरी बनाई वस्तु"},
        },
    )
    assert response.status_code == 200
    body = response.json()["data"]
    assert body["suggestions"]["title"] == "हस्तनिर्मित पात्र"
    assert body["confirmedDetails"]["description"] == "मेरी बनाई वस्तु"
    assert body["missingInformationQuestions"][0]["field"] == "materials"
    get_settings.cache_clear()


def test_gemini_missing_key_and_structured_response(monkeypatch):
    with pytest.raises(AIServiceError) as missing:
        GeminiService(Settings(gemini_api_key=""))
    assert missing.value.code == "GEMINI_NOT_CONFIGURED"

    service = GeminiService(Settings(gemini_api_key="test-key"))
    generated = GeminiProductAnalysis(
        suggestions=ListingSuggestions(title="Suggested title"),
        missing_information_questions=[],
    )

    class Response:
        parsed = generated
        text = ""

    async def fake_generate(_contents, _schema):
        return Response()

    monkeypatch.setattr(service, "_generate", fake_generate)
    request = ProductAnalysisRequest(
        image_urls=["https://res.cloudinary.com/test/image/upload/a.jpg"],
        known_details=KnownProductDetails(description="Confirmed text"),
    )
    result = asyncio.run(service.analyze_product(request, []))
    assert result.suggestions.title == "Suggested title"


def test_making_process_rejects_changed_step_ids(monkeypatch):
    service = GeminiService(Settings(gemini_api_key="test-key"))

    class Response:
        parsed = GeminiMakingProcessAnalysis(
            steps=[
                MakingProcessStepSuggestion(
                    id="invented-step",
                    title="Invented",
                    description="Not allowed",
                )
            ]
        )
        text = ""

    async def fake_generate(_contents, _schema):
        return Response()

    monkeypatch.setattr(service, "_generate", fake_generate)
    request = MakingProcessAnalysisRequest(
        steps=[MakingProcessStepInput(id="real-step", description="Shape clay")]
    )
    with pytest.raises(AIServiceError) as invalid:
        asyncio.run(service.analyze_making_process(request, []))
    assert invalid.value.code == "GEMINI_INVALID_RESPONSE"


def test_cloudinary_url_validation_blocks_other_hosts():
    settings = Settings(cloudinary_cloud_name="craftigari-cloud")
    validate_cloudinary_url(
        "https://res.cloudinary.com/craftigari-cloud/image/upload/product.jpg",
        settings,
    )
    with pytest.raises(AIServiceError) as untrusted:
        validate_cloudinary_url("https://example.com/product.jpg", settings)
    assert untrusted.value.code == "UNTRUSTED_IMAGE_URL"
