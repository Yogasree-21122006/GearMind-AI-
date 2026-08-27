from fastapi import APIRouter
from backend.app.schemas.maintenance import AnalyticsOverviewResponse
from backend.app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics & Overview"])

@router.get(
    "/overview",
    response_model=AnalyticsOverviewResponse,
    summary="Get Operational Analytics Overview",
    description="Returns real database-derived counts: total assets, active assets, maintenance records, diagnostics, feedback rating."
)
def get_analytics_overview():
    service = AnalyticsService()
    return service.get_overview()
