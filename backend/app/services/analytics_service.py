import logging
from typing import Dict, Any
from backend.app.repositories.analytics_repo import AnalyticsRepository

logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self):
        self.repo = AnalyticsRepository()

    def get_overview(self) -> Dict[str, Any]:
        return self.repo.get_overview_metrics()
