from typing import List, Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class CauseItem(BaseModel):
    cause: str = Field(..., description="Specific mechanical or electrical fault cause")
    probability: Optional[float] = Field(default=0.8, ge=0.0, le=1.0)
    rationale: Optional[str] = Field(None, description="Reasoning connecting symptom to cause")

    model_config = ConfigDict(from_attributes=True)

class ErrorCodeDetail(BaseModel):
    code: Optional[str] = None
    meaning: Optional[str] = None
    confidence: Optional[float] = Field(default=0.0, ge=0.0, le=1.0)

    model_config = ConfigDict(from_attributes=True)

class TroubleshootingStepItem(BaseModel):
    step: int = Field(..., ge=1)
    action: str = Field(..., description="Actionable troubleshooting procedure")
    safety_note: Optional[str] = Field(None, description="Specific safety or LOTO precaution")

    model_config = ConfigDict(from_attributes=True)

class DiagnosticCitationItem(BaseModel):
    manual_id: Optional[str] = None
    document_title: str
    page_number: int
    similarity: Optional[float] = 0.0

    model_config = ConfigDict(from_attributes=True)

class DiagnosticOutputSchema(BaseModel):
    summary: str = Field(..., description="2-3 sentence overview synthesizing fault diagnosis")
    observations: List[str] = Field(default_factory=list)
    possible_causes: List[CauseItem] = Field(default_factory=list)
    error_code: Optional[ErrorCodeDetail] = None
    troubleshooting_steps: List[TroubleshootingStepItem] = Field(default_factory=list)
    required_tools: List[str] = Field(default_factory=list)
    safety_warnings: List[str] = Field(default_factory=list)
    citations: List[DiagnosticCitationItem] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0, description="Calibrated confidence score")
    limitations: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
