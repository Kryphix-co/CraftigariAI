from typing import Annotated

from fastapi import APIRouter, Header

from app.core.config import get_settings
from app.schemas.deal_saathi import DealSaathiData, DealSaathiRequest
from app.schemas.response import APIResponse
from app.services.deal_saathi import generate_deal_saathi
from app.services.product_analysis import authorize_internal_request

router = APIRouter(prefix="/api", tags=["deal-saathi"])


@router.post("/deal-saathi", response_model=APIResponse)
async def deal_saathi_endpoint(
    request: DealSaathiRequest,
    x_internal_api_key: Annotated[str | None, Header()] = None,
) -> APIResponse:
    settings = get_settings()
    authorize_internal_request(x_internal_api_key, settings)
    result: DealSaathiData = await generate_deal_saathi(request, settings)
    return APIResponse(success=True, data=result.model_dump(by_alias=True))
