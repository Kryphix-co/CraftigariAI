from typing import Annotated

from fastapi import APIRouter, Header

from app.core.config import get_settings
from app.schemas.bhashini import (
    TranslationData,
    TranslationRequest,
    VoiceTranscriptionData,
    VoiceTranscriptionRequest,
)
from app.schemas.response import APIResponse
from app.services.bhashini import transcribe_speech, translate_text
from app.services.product_analysis import authorize_internal_request

router = APIRouter(prefix="/api", tags=["bhashini"])


@router.post("/voice-transcription", response_model=APIResponse)
async def voice_transcription(
    request: VoiceTranscriptionRequest,
    x_internal_api_key: Annotated[str | None, Header()] = None,
) -> APIResponse:
    settings = get_settings()
    authorize_internal_request(x_internal_api_key, settings)

    if settings.voice_translation_provider.lower() == "sarvam":
        from app.services.sarvam import transcribe_speech as sarvam_transcribe

        transcript, detected_lang = await sarvam_transcribe(
            audio_base64=request.audio_base64,
            mime_type=request.mime_type,
            language=request.language,
            settings=settings,
        )
        result = VoiceTranscriptionData(
            transcript=transcript,
            language=detected_lang or request.language,
            source_format=request.mime_type,
        )
        return APIResponse(success=True, data=result.model_dump())

    transcript = await transcribe_speech(
        audio_base64=request.audio_base64,
        mime_type=request.mime_type,
        language=request.language,
        settings=settings,
    )
    result = VoiceTranscriptionData(
        transcript=transcript,
        language=request.language,
        source_format=request.mime_type,
    )
    return APIResponse(success=True, data=result.model_dump())


@router.post("/translation", response_model=APIResponse)
async def translation(
    request: TranslationRequest,
    x_internal_api_key: Annotated[str | None, Header()] = None,
) -> APIResponse:
    settings = get_settings()
    authorize_internal_request(x_internal_api_key, settings)

    if settings.voice_translation_provider.lower() == "sarvam":
        from app.services.sarvam import translate_text as sarvam_translate

        translated = await sarvam_translate(
            text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
            settings=settings,
        )
        result = TranslationData(
            translated_text=translated,
            source_language=request.source_language,
            target_language=request.target_language,
        )
        return APIResponse(success=True, data=result.model_dump())

    translated = await translate_text(
        text=request.text,
        source_language=request.source_language,
        target_language=request.target_language,
        settings=settings,
    )
    result = TranslationData(
        translated_text=translated,
        source_language=request.source_language,
        target_language=request.target_language,
    )
    return APIResponse(success=True, data=result.model_dump())
