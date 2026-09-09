from fastapi import APIRouter # type: ignore
from app.schemas.response import APIResponse # type: ignore

router = APIRouter()


@router.get("/health", response_model=APIResponse)
async def health_check() -> APIResponse:
    return APIResponse(
        success=True,
        data={
            "service": "craftigari-ai",
            "status": "healthy",
        },
    )