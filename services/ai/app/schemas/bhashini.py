from pydantic import BaseModel, Field


class VoiceTranscriptionRequest(BaseModel):
    audio_base64: str = Field(..., description="Base64 encoded audio content")
    mime_type: str = Field("audio/webm", description="MIME type of recorded audio")
    language: str = Field("hi", description="Source audio language code (e.g. 'hi', 'en')")


class VoiceTranscriptionData(BaseModel):
    transcript: str
    language: str
    source_format: str


class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to translate")
    source_language: str = Field(..., description="Source language code (e.g. 'hi')")
    target_language: str = Field(..., description="Target language code (e.g. 'en')")


class TranslationData(BaseModel):
    translated_text: str
    source_language: str
    target_language: str
