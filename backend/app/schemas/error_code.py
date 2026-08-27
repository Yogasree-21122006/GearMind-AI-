from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class ErrorCodeBase(BaseModel):
    equipment_type: str = Field(..., max_length=100)
    manufacturer: str = Field(..., max_length=150)
    code: str = Field(..., max_length=100)
    title: str = Field(..., max_length=255)
    description: str
    possible_causes: List[str] = Field(default_factory=list)
    recommended_checks: List[str] = Field(default_factory=list)
    safety_warnings: List[str] = Field(default_factory=list)
    severity: str = Field(default="warning", pattern="^(info|warning|critical|fatal)$")

class ErrorCodeCreate(ErrorCodeBase):
    pass

class ErrorCodeResponse(ErrorCodeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
