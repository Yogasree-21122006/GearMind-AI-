import logging
from typing import List, Dict, Any
from fastapi import HTTPException, status
from backend.app.repositories.feedback_repo import FeedbackRepository
from backend.app.schemas.feedback import TechnicianFeedbackCreate

logger = logging.getLogger(__name__)

class FeedbackService:
    def __init__(self):
        self.repo = FeedbackRepository()

    def list_feedback(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        return self.repo.get_all(skip=skip, limit=limit)

    def record_feedback(self, feedback_in: TechnicianFeedbackCreate) -> Dict[str, Any]:
        feedback = self.repo.create(feedback_in)
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to record technician feedback in database."
            )
        return feedback
