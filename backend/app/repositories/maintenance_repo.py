import logging
from typing import Optional, List, Dict, Any
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client
from backend.app.schemas.maintenance import MaintenanceRecordCreate

logger = logging.getLogger(__name__)

class MaintenanceRepository:
    def __init__(self):
        self.supabase = get_supabase_client()

    def get_by_asset_id(self, asset_id: UUID, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        if not self.supabase:
            return []
        res = (
            self.supabase.table("maintenance_records")
            .select("*, technician:technicians(*)")
            .eq("asset_id", str(asset_id))
            .order("maintenance_date", desc=True)
            .range(skip, skip + limit - 1)
            .execute()
        )
        return res.data or []

    def get_all(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        if not self.supabase:
            return []
        res = (
            self.supabase.table("maintenance_records")
            .select("*, asset:assets(name, asset_code, model), technician:technicians(full_name)")
            .order("maintenance_date", desc=True)
            .range(skip, skip + limit - 1)
            .execute()
        )
        return res.data or []

    def create(self, record_in: MaintenanceRecordCreate) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        payload = record_in.model_dump(mode="json", exclude_none=True)
        res = self.supabase.table("maintenance_records").insert(payload).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None
