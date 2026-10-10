import asyncio
from json import dumps

from google import genai
from google.genai import types
from pydantic import ValidationError

from app.core.config import Settings
from app.schemas.product_analysis import (
    GeminiMakingProcessAnalysis,
    GeminiProductAnalysis,
    MakingProcessAnalysisRequest,
    ProductAnalysisRequest,
)
from app.services.errors import AIServiceError


PRODUCT_SYSTEM_INSTRUCTION = """
You assist Indian artisans with editable marketplace listings. Use only the
artisan-provided text and visible image evidence. Never infer or claim origin,
materials, dimensions, price, handmade status, authenticity, or certification
unless the artisan explicitly confirmed it. Keep suggestions concise and in the
requested language. When an important fact is unknown, leave that suggestion
empty and ask one short, simple question. Return at most four questions.
""".strip()

PROCESS_SYSTEM_INSTRUCTION = """
Improve only the supplied making-process steps. Preserve every supplied step ID
and order. Do not add, remove, merge, or invent manufacturing stages. Use only
the supplied title, description, and corresponding image. Do not make
authenticity or verification claims. Keep wording concise and editable.
""".strip()


def _provider_error(error: Exception) -> AIServiceError:
    status = getattr(error, "status_code", None) or getattr(error, "code", None)
    if isinstance(error, (asyncio.TimeoutError, TimeoutError)):
        return AIServiceError(504, "Gemini request timed out", "GEMINI_TIMEOUT")
    if status == 429:
        return AIServiceError(429, "Gemini quota or rate limit reached", "GEMINI_RATE_LIMITED")
    if status in (401, 403):
        return AIServiceError(503, "Gemini credentials were rejected", "GEMINI_NOT_CONFIGURED")
    return AIServiceError(502, "Gemini is temporarily unavailable", "GEMINI_UNAVAILABLE")


class GeminiService:
    def __init__(self, settings: Settings):
        if not settings.gemini_api_key:
            raise AIServiceError(503, "Gemini is not configured", "GEMINI_NOT_CONFIGURED")
        self.settings = settings

    async def _generate(self, contents, response_schema):
        client = genai.Client(api_key=self.settings.gemini_api_key)
        async_client = client.aio
        try:
            return await asyncio.wait_for(
                async_client.models.generate_content(
                    model=self.settings.gemini_model,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=response_schema,
                        temperature=0.2,
                        max_output_tokens=2500,
                    ),
                ),
                timeout=self.settings.gemini_timeout_seconds,
            )
        except AIServiceError:
            raise
        except Exception as error:
            raise _provider_error(error) from error
        finally:
            await async_client.aclose()

    async def analyze_product(self, request: ProductAnalysisRequest, image_parts):
        prompt = (
            f"Output language: {request.language}.\n"
            "Create marketplace listing suggestions from the supplied product photos and facts.\n"
            f"Artisan transcript: {request.transcript or '[not provided]'}\n"
            f"Artisan description: {request.description or '[not provided]'}\n"
            f"Confirmed details: {dumps(request.known_details.model_dump(), ensure_ascii=False)}"
        )
        response = await self._generate(
            [PRODUCT_SYSTEM_INSTRUCTION, prompt, *image_parts],
            GeminiProductAnalysis,
        )
        try:
            if isinstance(response.parsed, GeminiProductAnalysis):
                return response.parsed
            if response.parsed:
                return GeminiProductAnalysis.model_validate(response.parsed)
            return GeminiProductAnalysis.model_validate_json(response.text)
        except (ValidationError, ValueError, TypeError) as error:
            raise AIServiceError(
                502,
                "Gemini returned an invalid structured response",
                "GEMINI_INVALID_RESPONSE",
            ) from error

    async def analyze_making_process(
        self,
        request: MakingProcessAnalysisRequest,
        image_parts,
    ):
        supplied_steps = [
            {
                "id": step.id,
                "title": step.title,
                "description": step.description,
                "has_image": step.image_url is not None,
            }
            for step in request.steps
        ]
        prompt = (
            f"Output language: {request.language}.\n"
            f"Supplied ordered steps: {dumps(supplied_steps, ensure_ascii=False)}"
        )
        response = await self._generate(
            [PROCESS_SYSTEM_INSTRUCTION, prompt, *image_parts],
            GeminiMakingProcessAnalysis,
        )
        try:
            parsed = (
                response.parsed
                if isinstance(response.parsed, GeminiMakingProcessAnalysis)
                else GeminiMakingProcessAnalysis.model_validate(
                    response.parsed or GeminiMakingProcessAnalysis.model_validate_json(response.text)
                )
            )
        except (ValidationError, ValueError, TypeError) as error:
            raise AIServiceError(
                502,
                "Gemini returned an invalid structured response",
                "GEMINI_INVALID_RESPONSE",
            ) from error

        expected_ids = [step.id for step in request.steps]
        if [step.id for step in parsed.steps] != expected_ids:
            raise AIServiceError(
                502,
                "Gemini changed the supplied process steps",
                "GEMINI_INVALID_RESPONSE",
            )
        return parsed
