from fastapi import APIRouter # type: ignore
from app.api.routes.health import router as health_router # type: ignore
from app.api.routes.product_analysis import router as product_analysis_router
from app.api.routes.bhashini import router as bhashini_router
from app.api.routes.deal_saathi import router as deal_saathi_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(product_analysis_router)
api_router.include_router(bhashini_router)
api_router.include_router(deal_saathi_router)
