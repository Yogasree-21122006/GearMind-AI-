from fastapi import APIRouter
from backend.app.api.v1 import health, assets, manuals, diagnostics, error_codes, feedback, analytics, maintenance, rag, evaluation

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(assets.router)
api_router.include_router(manuals.router)
api_router.include_router(rag.router)
api_router.include_router(diagnostics.router)
api_router.include_router(error_codes.router)
api_router.include_router(maintenance.router)
api_router.include_router(feedback.router)
api_router.include_router(analytics.router)
api_router.include_router(evaluation.router)
