import logging
from typing import Optional, List, Dict, Any
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client
from backend.app.schemas.error_code import ErrorCodeCreate

logger = logging.getLogger(__name__)

class ErrorCodeRepository:
    def __init__(self):
        self.supabase = get_supabase_client()

    def get_all(
        self,
        equipment_type: Optional[str] = None,
        manufacturer: Optional[str] = None,
        severity: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        if not self.supabase:
            return []
        query = self.supabase.table("error_codes").select("*")
        if equipment_type:
            query = query.eq("equipment_type", equipment_type)
        if manufacturer:
            query = query.ilike("manufacturer", f"%{manufacturer}%")
        if severity:
            query = query.eq("severity", severity)
        
        res = query.order("code").range(skip, skip + limit - 1).execute()
        return res.data or []

    def get_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        res = self.supabase.table("error_codes").select("*").eq("code", code).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def create(self, error_in: ErrorCodeCreate) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        payload = error_in.model_dump(mode="json", exclude_none=True)
        res = self.supabase.table("error_codes").insert(payload).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None
