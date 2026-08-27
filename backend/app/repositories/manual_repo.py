import logging
from typing import Optional, List, Dict, Any
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client
from backend.app.schemas.manual import ManualCreate

logger = logging.getLogger(__name__)

class ManualRepository:
    def __init__(self):
        self.supabase = get_supabase_client()

    def get_all(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        if not self.supabase:
            return []
        res = self.supabase.table("manuals").select("*").order("created_at", desc=True).range(skip, skip + limit - 1).execute()
        return res.data or []

    def get_by_id(self, manual_id: UUID) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        res = self.supabase.table("manuals").select("*").eq("id", str(manual_id)).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def create(self, manual_in: ManualCreate) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        payload = manual_in.model_dump(mode="json", exclude_none=True)
        res = self.supabase.table("manuals").insert(payload).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def delete(self, manual_id: UUID) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        res = self.supabase.table("manuals").delete().eq("id", str(manual_id)).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None
