import logging
from typing import Dict, Any
from backend.app.database.supabase_client import get_supabase_client
from backend.app.schemas.maintenance import AnalyticsOverviewResponse

logger = logging.getLogger(__name__)

class AnalyticsRepository:
    def __init__(self):
        self.supabase = get_supabase_client()

    def get_overview_metrics(self) -> Dict[str, Any]:
        """Queries real counts and aggregations from Supabase PostgreSQL tables."""
        if not self.supabase:
            return {
                "total_assets": 0,
                "active_assets": 0,
                "total_maintenance_records": 0,
                "total_diagnostic_sessions": 0,
                "completed_diagnostics": 0,
                "failed_diagnostics": 0,
                "total_manuals": 0,
                "feedback_count": 0,
                "average_feedback_rating": 0.0,
                "system_status": "Supabase client unconfigured"
            }

        try:
            # 1. Total & active assets
            assets_res = self.supabase.table("assets").select("id, operational_status", count="exact").execute()
            total_assets = assets_res.count or len(assets_res.data or [])
            active_assets = sum(1 for a in (assets_res.data or []) if a.get("operational_status") == "operational")

            # 2. Total maintenance records
            maint_res = self.supabase.table("maintenance_records").select("id", count="exact").execute()
            total_maintenance = maint_res.count or len(maint_res.data or [])

            # 3. Diagnostic sessions
            diag_res = self.supabase.table("diagnostic_sessions").select("id, status", count="exact").execute()
            total_diagnostics = diag_res.count or len(diag_res.data or [])
            completed_diag = sum(1 for d in (diag_res.data or []) if d.get("status") == "completed")
            failed_diag = sum(1 for d in (diag_res.data or []) if d.get("status") == "failed")

            # 4. Total manuals
            manuals_res = self.supabase.table("manuals").select("id", count="exact").execute()
            total_manuals = manuals_res.count or len(manuals_res.data or [])

            # 5. Feedback stats
            feedback_res = self.supabase.table("technician_feedback").select("id, rating", count="exact").execute()
            feedback_count = feedback_res.count or len(feedback_res.data or [])
            ratings = [f["rating"] for f in (feedback_res.data or []) if f.get("rating") is not None]
            avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0.0

            return {
                "total_assets": total_assets,
                "active_assets": active_assets,
                "total_maintenance_records": total_maintenance,
                "total_diagnostic_sessions": total_diagnostics,
                "completed_diagnostics": completed_diag,
                "failed_diagnostics": failed_diag,
                "total_manuals": total_manuals,
                "feedback_count": feedback_count,
                "average_feedback_rating": avg_rating,
                "system_status": "operational"
            }
        except Exception as e:
            logger.error(f"Error fetching analytics overview from Supabase: {e}")
            return {
                "total_assets": 0,
                "active_assets": 0,
                "total_maintenance_records": 0,
                "total_diagnostic_sessions": 0,
                "completed_diagnostics": 0,
                "failed_diagnostics": 0,
                "total_manuals": 0,
                "feedback_count": 0,
                "average_feedback_rating": 0.0,
                "system_status": f"Database query error: {str(e)}"
            }
