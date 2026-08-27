from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class TechnicianBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., max_length=255)
    role: str = Field(default="technician", pattern="^(technician|senior_technician|supervisor|admin)$")

class TechnicianCreate(TechnicianBase):
    pass

class TechnicianResponse(TechnicianBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
