import logging
from typing import Optional, List, Dict, Any
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client
from backend.app.schemas.diagnostic import DiagnosticSessionCreate, DiagnosticResultCreate

logger = logging.getLogger(__name__)

class DiagnosticRepository:
    def __init__(self):
        self.supabase = get_supabase_client()

    def get_sessions(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        if not self.supabase:
            return []
        res = (
            self.supabase.table("diagnostic_sessions")
            .select("*, asset:assets(name, asset_code, model), technician:technicians(full_name), results:diagnostic_results(*)")
            .order("created_at", desc=True)
            .range(skip, skip + limit - 1)
            .execute()
        )
        return res.data or []

    def get_session_by_id(self, session_id: UUID) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        res = (
            self.supabase.table("diagnostic_sessions")
            .select("*, asset:assets(*), technician:technicians(*), results:diagnostic_results(*)")
            .eq("id", str(session_id))
            .execute()
        )
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def create_session(self, session_in: DiagnosticSessionCreate) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        payload = session_in.model_dump(mode="json", exclude_none=True)
        res = self.supabase.table("diagnostic_sessions").insert(payload).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def update_session_status(self, session_id: UUID, status: str) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        res = self.supabase.table("diagnostic_sessions").update({"status": status}).eq("id", str(session_id)).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def save_diagnostic_result(self, result_in: DiagnosticResultCreate) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        payload = result_in.model_dump(mode="json", exclude_none=True)
        res = self.supabase.table("diagnostic_results").insert(payload).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None
