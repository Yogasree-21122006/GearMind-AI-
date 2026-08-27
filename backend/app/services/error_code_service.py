import logging
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from backend.app.repositories.error_code_repo import ErrorCodeRepository
from backend.app.schemas.error_code import ErrorCodeCreate

logger = logging.getLogger(__name__)

class ErrorCodeService:
    def __init__(self):
        self.repo = ErrorCodeRepository()

    def list_error_codes(
        self,
        equipment_type: Optional[str] = None,
        manufacturer: Optional[str] = None,
        severity: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        return self.repo.get_all(
            equipment_type=equipment_type,
            manufacturer=manufacturer,
            severity=severity,
            skip=skip,
            limit=limit
        )

    def get_by_code(self, code: str) -> Dict[str, Any]:
        ec = self.repo.get_by_code(code)
        if not ec:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Error code '{code}' not found in catalog."
            )
        return ec

    def create_error_code(self, error_in: ErrorCodeCreate) -> Dict[str, Any]:
        existing = self.repo.get_by_code(error_in.code)
        if existing and existing.get("manufacturer") == error_in.manufacturer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error code '{error_in.code}' already registered for manufacturer '{error_in.manufacturer}'."
            )
        res = self.repo.create(error_in)
        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to register error code in database."
            )
        return res
