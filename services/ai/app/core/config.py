from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_ENV_FILE = Path(__file__).resolve().parents[4] / ".env"


class Settings(BaseSettings):
    app_name: str = "Craftigari AI Service"
    environment: str = "development"
    log_level: str = "INFO"
    internal_api_key: str = ""
    cloudinary_cloud_name: str = ""
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    gemini_timeout_seconds: float = 35.0
    image_download_timeout_seconds: float = 10.0
    max_image_bytes: int = 5 * 1024 * 1024
    voice_translation_provider: str = "sarvam"
    sarvam_api_key: str = ""
    sarvam_stt_url: str = "https://api.sarvam.ai/speech-to-text"
    sarvam_translate_url: str = "https://api.sarvam.ai/translate"
    sarvam_stt_model: str = "saaras:v4"
    sarvam_translate_model: str = "sarvam-translate:v1"
    sarvam_timeout_seconds: float = 30.0
    bhashini_user_id: str = ""
    bhashini_api_key: str = ""
    bhashini_pipeline_id: str = ""
    bhashini_inference_url: str = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    bhashini_config_url: str = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline"
    bhashini_timeout_seconds: float = 30.0
    max_audio_bytes: int = 10 * 1024 * 1024

    model_config = SettingsConfigDict(
        env_file=ROOT_ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
