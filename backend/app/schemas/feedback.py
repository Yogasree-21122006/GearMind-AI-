from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class TechnicianFeedbackCreate(BaseModel):
    diagnostic_session_id: UUID
    technician_id: Optional[UUID] = None
    rating: int = Field(..., ge=1, le=5)
    feedback_text: Optional[str] = None
    was_helpful: bool
    actual_root_cause: Optional[str] = None

class TechnicianFeedbackResponse(TechnicianFeedbackCreate):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
