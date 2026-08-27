import logging
from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import HTTPException, status
from backend.app.repositories.manual_repo import ManualRepository
from backend.app.schemas.manual import ManualCreate

logger = logging.getLogger(__name__)

class ManualService:
    def __init__(self):
        self.repo = ManualRepository()

    def list_manuals(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_manual(self, manual_id: UUID) -> Dict[str, Any]:
        manual = self.repo.get_by_id(manual_id)
        if not manual:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Manual with ID '{manual_id}' not found."
            )
        return manual

    def create_manual(self, manual_in: ManualCreate) -> Dict[str, Any]:
        manual = self.repo.create(manual_in)
        if not manual:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to register manual record in database."
            )
        return manual

    def delete_manual(self, manual_id: UUID) -> Dict[str, str]:
        self.get_manual(manual_id)
        res = self.repo.delete(manual_id)
        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete manual record."
            )
        return {"message": f"Manual '{manual_id}' successfully deleted."}
