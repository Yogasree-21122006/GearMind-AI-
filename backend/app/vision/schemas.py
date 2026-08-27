from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class VisualObservationItem(BaseModel):
    category: str = Field(..., description="Category: control_panel, damage, component, nameplate, warning_light, environment")
    observation: str = Field(..., description="Objective physical observation (what is visibly seen)")
    inference: Optional[str] = Field(None, description="Technical deduction or possible meaning (must not be stated as visual fact)")
    detected_text_or_code: Optional[str] = Field(None, description="Exact OCR or error code read from nameplate/display")

    model_config = ConfigDict(from_attributes=True)

class VisionAnalysisResult(BaseModel):
    observations: List[VisualObservationItem] = Field(default_factory=list)
    detected_error_codes: List[str] = Field(default_factory=list)
    equipment_condition_summary: str = Field(..., description="Objective summary of physical condition")
    visible_hazards_or_warnings: List[str] = Field(default_factory=list)
    image_quality_notes: Optional[str] = None
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)

    model_config = ConfigDict(from_attributes=True)
