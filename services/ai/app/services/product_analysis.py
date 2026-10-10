from hmac import compare_digest
from urllib.parse import urlparse

import httpx
from google.genai import types

from app.core.config import Settings
from app.schemas.product_analysis import (
    MakingProcessAnalysisData,
    MakingProcessAnalysisRequest,
    ProductAnalysisData,
    ProductAnalysisRequest,
)
from app.services.errors import AIServiceError
from app.services.gemini import GeminiService

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


def authorize_internal_request(candidate: str | None, settings: Settings) -> None:
    if not settings.internal_api_key:
        raise AIServiceError(503, "Internal authorization is not configured", "INTERNAL_AUTH_NOT_CONFIGURED")
    if not candidate or not compare_digest(candidate, settings.internal_api_key):
        raise AIServiceError(401, "Valid internal credentials are required", "UNAUTHORIZED")


def validate_cloudinary_url(url: str, settings: Settings) -> None:
    parsed = urlparse(url)
    expected_prefix = f"/{settings.cloudinary_cloud_name}/image/upload/"
    if (
        parsed.scheme != "https"
        or parsed.hostname != "res.cloudinary.com"
        or not settings.cloudinary_cloud_name
        or not parsed.path.startswith(expected_prefix)
        or parsed.username
        or parsed.password
        or parsed.port
    ):
        raise AIServiceError(400, "Only Craftigari Cloudinary images are allowed", "UNTRUSTED_IMAGE_URL")


async def download_image(url: str, settings: Settings, client: httpx.AsyncClient):
    validate_cloudinary_url(url, settings)
    try:
        async with client.stream("GET", url, follow_redirects=False) as response:
            response.raise_for_status()
            content_type = response.headers.get("content-type", "").split(";", 1)[0].lower()
            if content_type not in ALLOWED_IMAGE_TYPES:
                raise AIServiceError(415, "Cloudinary image format is unsupported", "INVALID_IMAGE")
            content_length = int(response.headers.get("content-length", "0") or 0)
            if content_length > settings.max_image_bytes:
                raise AIServiceError(413, "Image is too large for AI analysis", "IMAGE_TOO_LARGE")
            chunks = []
            total = 0
            async for chunk in response.aiter_bytes():
                total += len(chunk)
                if total > settings.max_image_bytes:
                    raise AIServiceError(413, "Image is too large for AI analysis", "IMAGE_TOO_LARGE")
                chunks.append(chunk)
            if not chunks:
                raise AIServiceError(400, "Cloudinary image is empty", "INVALID_IMAGE")
            return types.Part.from_bytes(data=b"".join(chunks), mime_type=content_type)
    except AIServiceError:
        raise
    except httpx.TimeoutException as error:
        raise AIServiceError(504, "Image download timed out", "IMAGE_DOWNLOAD_TIMEOUT") from error
    except httpx.HTTPError as error:
        raise AIServiceError(502, "Unable to read the uploaded image", "IMAGE_DOWNLOAD_FAILED") from error


async def analyze_product(
    request: ProductAnalysisRequest,
    settings: Settings,
    gemini: GeminiService | None = None,
):
    timeout = httpx.Timeout(settings.image_download_timeout_seconds)
    async with httpx.AsyncClient(timeout=timeout) as client:
        image_parts = [
            await download_image(str(url), settings, client)
            for url in request.image_urls
        ]
    provider = gemini or GeminiService(settings)
    generated = await provider.analyze_product(request, image_parts)
    return ProductAnalysisData(
        suggestions=generated.suggestions,
        confirmed_details=request.known_details,
        missing_information_questions=generated.missing_information_questions,
        model=settings.gemini_model,
    )


async def analyze_making_process(
    request: MakingProcessAnalysisRequest,
    settings: Settings,
    gemini: GeminiService | None = None,
):
    timeout = httpx.Timeout(settings.image_download_timeout_seconds)
    image_parts = []
    async with httpx.AsyncClient(timeout=timeout) as client:
        for step in request.steps:
            if step.image_url:
                image_parts.append(types.Part.from_text(text=f"Image for supplied step ID: {step.id}"))
                image_parts.append(await download_image(str(step.image_url), settings, client))
    provider = gemini or GeminiService(settings)
    generated = await provider.analyze_making_process(request, image_parts)
    return MakingProcessAnalysisData(steps=generated.steps, model=settings.gemini_model)
