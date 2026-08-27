import logging
from typing import Optional, List, Dict, Any
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client
from backend.app.schemas.feedback import TechnicianFeedbackCreate

logger = logging.getLogger(__name__)

class FeedbackRepository:
    def __init__(self):
        self.supabase = get_supabase_client()

    def get_all(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        if not self.supabase:
            return []
        res = (
            self.supabase.table("technician_feedback")
            .select("*, technician:technicians(full_name)")
            .order("created_at", desc=True)
            .range(skip, skip + limit - 1)
            .execute()
        )
        return res.data or []

    def create(self, feedback_in: TechnicianFeedbackCreate) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        payload = feedback_in.model_dump(mode="json", exclude_none=True)
        res = self.supabase.table("technician_feedback").insert(payload).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None
