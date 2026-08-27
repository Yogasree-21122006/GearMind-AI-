from typing import Optional, Dict, Any, List
from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class AssetImageBase(BaseModel):
    storage_path: str
    file_name: str
    content_type: str = "image/jpeg"
    image_type: str = Field(default="inspection", pattern="^(nameplate|overall|component|damage|thermal|inspection)$")
    analysis_status: str = Field(default="pending", pattern="^(pending|processing|completed|failed)$")

class AssetImageCreate(AssetImageBase):
    asset_id: UUID
    technician_id: Optional[UUID] = None

class AssetImageResponse(AssetImageBase):
    id: UUID
    asset_id: UUID
    technician_id: Optional[UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AssetBase(BaseModel):
    asset_code: str = Field(..., max_length=100, examples=["HVAC-CHILLER-04"])
    name: str = Field(..., max_length=255, examples=["Centrifugal Water Chiller"])
    equipment_type: str = Field(..., max_length=100, examples=["HVAC"])
    manufacturer: str = Field(..., max_length=150, examples=["Trane"])
    model: str = Field(..., max_length=150, examples=["RTWD-150"])
    serial_number: str = Field(..., max_length=150, examples=["SN-9823412-A"])
    location: str = Field(..., max_length=255, examples=["Plant 2 - Mechanical Room 102"])
    operational_status: str = Field(default="operational", pattern="^(operational|degraded|critical|under_maintenance|decommissioned)$")
    installation_date: Optional[date] = None
    last_maintenance_date: Optional[datetime] = None

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    equipment_type: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    location: Optional[str] = None
    operational_status: Optional[str] = None
    installation_date: Optional[date] = None
    last_maintenance_date: Optional[datetime] = None

class AssetResponse(AssetBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    images: Optional[List[AssetImageResponse]] = None

    model_config = ConfigDict(from_attributes=True)
