from fastapi import FastAPI, Request # type: ignore
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.api.router import api_router # type: ignore
from app.core.config import get_settings # type: ignore
from app.core.logging import setup_logging # type: ignore
from app.services.errors import AIServiceError

settings = get_settings()

setup_logging()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)

app.include_router(api_router)


@app.exception_handler(AIServiceError)
async def ai_service_error_handler(_request: Request, error: AIServiceError):
    return JSONResponse(
        status_code=error.status_code,
        content={
            "success": False,
            "data": None,
            "error": {"code": error.code, "message": error.message},
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_request: Request, _error: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "data": None,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request data is invalid",
            },
        },
    )
