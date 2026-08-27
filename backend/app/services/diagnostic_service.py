import logging
from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import HTTPException, status
from backend.app.repositories.diagnostic_repo import DiagnosticRepository
from backend.app.schemas.diagnostic import DiagnosticSessionCreate, DiagnosticResultCreate

logger = logging.getLogger(__name__)

class DiagnosticService:
    def __init__(self):
        self.repo = DiagnosticRepository()

    def list_sessions(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        return self.repo.get_sessions(skip=skip, limit=limit)

    def get_session(self, session_id: UUID) -> Dict[str, Any]:
        session = self.repo.get_session_by_id(session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Diagnostic session '{session_id}' not found."
            )
        return session

    def create_session(self, session_in: DiagnosticSessionCreate) -> Dict[str, Any]:
        session = self.repo.create_session(session_in)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to open diagnostic session in database."
            )
        return session

    def update_session_status(self, session_id: UUID, status_str: str) -> Dict[str, Any]:
        self.get_session(session_id)
        updated = self.repo.update_session_status(session_id, status_str)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update diagnostic session status."
            )
        return updated
