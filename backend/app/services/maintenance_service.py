import logging
from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import HTTPException, status
from backend.app.repositories.maintenance_repo import MaintenanceRepository
from backend.app.repositories.asset_repo import AssetRepository
from backend.app.schemas.maintenance import MaintenanceRecordCreate

logger = logging.getLogger(__name__)

class MaintenanceService:
    def __init__(self):
        self.repo = MaintenanceRepository()
        self.asset_repo = AssetRepository()

    def list_records_for_asset(self, asset_id: UUID, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        # Verify asset exists
        asset = self.asset_repo.get_by_id(asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Asset with ID '{asset_id}' not found."
            )
        return self.repo.get_by_asset_id(asset_id, skip=skip, limit=limit)

    def list_all_records(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        return self.repo.get_all(skip=skip, limit=limit)

    def create_record(self, asset_id: UUID, record_in: MaintenanceRecordCreate) -> Dict[str, Any]:
        asset = self.asset_repo.get_by_id(asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Asset with ID '{asset_id}' not found."
            )
        
        record_in.asset_id = asset_id
        res = self.repo.create(record_in)
        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to record maintenance event in database."
            )
        return res
