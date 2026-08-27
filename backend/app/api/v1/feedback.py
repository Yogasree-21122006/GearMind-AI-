from typing import List
from fastapi import APIRouter, status, Query
from backend.app.schemas.feedback import TechnicianFeedbackCreate, TechnicianFeedbackResponse
from backend.app.services.feedback_service import FeedbackService

router = APIRouter(prefix="/feedback", tags=["Technician Feedback"])

@router.get(
    "",
    response_model=List[TechnicianFeedbackResponse],
    summary="List Technician Feedback",
    description="Retrieve all submitted diagnostic feedback and quality ratings."
)
def list_feedback(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    service = FeedbackService()
    return service.list_feedback(skip=skip, limit=limit)

@router.post(
    "",
    response_model=TechnicianFeedbackResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Technician Feedback",
    description="Logs technician rating (1-5), accuracy, safety validation, and actual root cause discovered."
)
def submit_feedback(feedback_in: TechnicianFeedbackCreate):
    service = FeedbackService()
    return service.record_feedback(feedback_in)
