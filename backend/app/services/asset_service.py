import logging
from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import HTTPException, status
from backend.app.repositories.asset_repo import AssetRepository
from backend.app.schemas.asset import AssetCreate, AssetUpdate

logger = logging.getLogger(__name__)

class AssetService:
    def __init__(self):
        self.repo = AssetRepository()

    def list_assets(
        self,
        equipment_type: Optional[str] = None,
        manufacturer: Optional[str] = None,
        operational_status: Optional[str] = None,
        location: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        return self.repo.get_all(
            equipment_type=equipment_type,
            manufacturer=manufacturer,
            operational_status=operational_status,
            location=location,
            skip=skip,
            limit=limit
        )

    def get_asset(self, asset_id: UUID) -> Dict[str, Any]:
        asset = self.repo.get_by_id(asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Asset with ID '{asset_id}' not found."
            )
        return asset

    def create_asset(self, asset_in: AssetCreate) -> Dict[str, Any]:
        # Check uniqueness of asset_code
        existing = self.repo.get_by_code(asset_in.asset_code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Asset with code '{asset_in.asset_code}' already exists."
            )
        
        asset = self.repo.create(asset_in)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database operation failed while creating asset."
            )
        return asset

    def update_asset(self, asset_id: UUID, asset_update: AssetUpdate) -> Dict[str, Any]:
        # Verify exists
        self.get_asset(asset_id)
        updated = self.repo.update(asset_id, asset_update)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database operation failed while updating asset."
            )
        return updated

    def delete_asset(self, asset_id: UUID) -> Dict[str, str]:
        self.get_asset(asset_id)
        success = self.repo.delete(asset_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete asset record."
            )
        return {"message": f"Asset '{asset_id}' successfully deleted."}

    def add_image_metadata(
        self,
        asset_id: UUID,
        storage_path: str,
        file_name: str,
        content_type: str,
        image_type: str = "inspection",
        technician_id: Optional[UUID] = None
    ) -> Dict[str, Any]:
        self.get_asset(asset_id)
        image_data = {
            "asset_id": str(asset_id),
            "technician_id": str(technician_id) if technician_id else None,
            "storage_path": storage_path,
            "file_name": file_name,
            "content_type": content_type,
            "image_type": image_type,
            "analysis_status": "pending"
        }
        res = self.repo.add_image_record(image_data)
        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to store asset image metadata in database."
            )
        return res

    def list_images(self, asset_id: UUID) -> List[Dict[str, Any]]:
        self.get_asset(asset_id)
        return self.repo.get_images_by_asset(asset_id)
