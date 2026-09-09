from fastapi import FastAPI # type: ignore
from app.api.router import api_router # type: ignore
from app.core.config import get_settings # type: ignore
from app.core.logging import setup_logging # type: ignore

settings = get_settings()

setup_logging()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)

app.include_router(api_router)