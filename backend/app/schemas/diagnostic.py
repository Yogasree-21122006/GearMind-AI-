from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class DiagnosticSessionCreate(BaseModel):
    asset_id: Optional[UUID] = None
    technician_id: Optional[UUID] = None
    user_question: str = Field(..., min_length=3)
    image_id: Optional[UUID] = None
    status: str = Field(default="pending", pattern="^(pending|processing|completed|failed)$")

class DiagnosticSessionResponse(BaseModel):
    id: UUID
    asset_id: Optional[UUID] = None
    technician_id: Optional[UUID] = None
    user_question: str
    image_id: Optional[UUID] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class DiagnosticResultCreate(BaseModel):
    diagnostic_session_id: UUID
    issue_summary: str
    identified_error_code: Optional[str] = None
    confidence: Optional[float] = None
    probable_causes: List[Dict[str, Any]] = Field(default_factory=list)
    recommended_steps: List[Dict[str, Any]] = Field(default_factory=list)
    required_tools: List[str] = Field(default_factory=list)
    safety_warnings: List[str] = Field(default_factory=list)
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    model_name: Optional[str] = "gemini-1.5-pro"
    response_time_ms: Optional[int] = None

class DiagnosticResultResponse(DiagnosticResultCreate):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
