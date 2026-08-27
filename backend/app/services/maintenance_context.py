import logging
from typing import List, Dict, Any, Optional
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)

class MaintenanceContextService:
    """Service for retrieving concise, relevant equipment maintenance history for AI reasoning."""

    def __init__(self):
        self.supabase = get_supabase_client()

    def get_asset_maintenance_context(
        self,
        asset_id: UUID,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Fetches the most recent maintenance records for the specified asset.
        Limits fields to avoid overwhelming LLM token windows.
        """
        if not self.supabase or not asset_id:
            return []

        try:
            res = (
                self.supabase.table("maintenance_records")
                .select("id, maintenance_type, issue_description, diagnosis, action_taken, parts_replaced, downtime_minutes, maintenance_date")
                .eq("asset_id", str(asset_id))
                .order("maintenance_date", desc=True)
                .limit(limit)
                .execute()
            )
            records = res.data or []
            logger.info(f"Retrieved {len(records)} recent maintenance records for asset {asset_id}")
            return records
        except Exception as e:
            logger.error(f"Failed to fetch maintenance context for asset {asset_id}: {e}")
            return []
