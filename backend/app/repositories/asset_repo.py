import logging
from typing import Optional, List, Dict, Any
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client
from backend.app.schemas.asset import AssetCreate, AssetUpdate

logger = logging.getLogger(__name__)

class AssetRepository:
    def __init__(self):
        self.supabase = get_supabase_client()

    def get_all(
        self,
        equipment_type: Optional[str] = None,
        manufacturer: Optional[str] = None,
        operational_status: Optional[str] = None,
        location: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        if not self.supabase:
            return []
        query = self.supabase.table("assets").select("*, images:asset_images(*)")
        if equipment_type:
            query = query.eq("equipment_type", equipment_type)
        if manufacturer:
            query = query.ilike("manufacturer", f"%{manufacturer}%")
        if operational_status:
            query = query.eq("operational_status", operational_status)
        if location:
            query = query.ilike("location", f"%{location}%")
        
        res = query.order("created_at", desc=True).range(skip, skip + limit - 1).execute()
        return res.data or []

    def get_by_id(self, asset_id: UUID) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        res = self.supabase.table("assets").select("*, images:asset_images(*)").eq("id", str(asset_id)).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def get_by_code(self, asset_code: str) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        res = self.supabase.table("assets").select("*").eq("asset_code", asset_code).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def create(self, asset_in: AssetCreate) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        payload = asset_in.model_dump(mode="json", exclude_none=True)
        res = self.supabase.table("assets").insert(payload).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def update(self, asset_id: UUID, asset_update: AssetUpdate) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        payload = asset_update.model_dump(mode="json", exclude_unset=True)
        if not payload:
            return self.get_by_id(asset_id)
        res = self.supabase.table("assets").update(payload).eq("id", str(asset_id)).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def delete(self, asset_id: UUID) -> bool:
        if not self.supabase:
            return False
        res = self.supabase.table("assets").delete().eq("id", str(asset_id)).execute()
        return bool(res.data)

    def add_image_record(self, image_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.supabase:
            return None
        res = self.supabase.table("asset_images").insert(image_data).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    def get_images_by_asset(self, asset_id: UUID) -> List[Dict[str, Any]]:
        if not self.supabase:
            return []
        res = self.supabase.table("asset_images").select("*").eq("asset_id", str(asset_id)).order("created_at", desc=True).execute()
        return res.data or []
