from typing import Annotated

from fastapi import APIRouter, Header

from app.core.config import get_settings
from app.schemas.product_analysis import (
    MakingProcessAnalysisData,
    MakingProcessAnalysisRequest,
    ProductAnalysisData,
    ProductAnalysisRequest,
)
from app.schemas.response import APIResponse
from app.services.product_analysis import (
    analyze_making_process,
    analyze_product,
    authorize_internal_request,
)

router = APIRouter(prefix="/api", tags=["product-analysis"])


@router.post("/product-analysis", response_model=APIResponse)
async def product_analysis(
    request: ProductAnalysisRequest,
    x_internal_api_key: Annotated[str | None, Header()] = None,
) -> APIResponse:
    settings = get_settings()
    authorize_internal_request(x_internal_api_key, settings)
    result: ProductAnalysisData = await analyze_product(request, settings)
    return APIResponse(success=True, data=result.model_dump(by_alias=True))


@router.post("/making-process-analysis", response_model=APIResponse)
async def making_process_analysis(
    request: MakingProcessAnalysisRequest,
    x_internal_api_key: Annotated[str | None, Header()] = None,
) -> APIResponse:
    settings = get_settings()
    authorize_internal_request(x_internal_api_key, settings)
    result: MakingProcessAnalysisData = await analyze_making_process(request, settings)
    return APIResponse(success=True, data=result.model_dump(by_alias=True))
