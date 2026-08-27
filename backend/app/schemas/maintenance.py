from typing import Optional, Dict, Any, List
from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

# ==============================================================================
# Maintenance Record Schemas
# ==============================================================================
class MaintenanceRecordBase(BaseModel):
    maintenance_type: str = Field(..., pattern="^(preventive|corrective|emergency|inspection|calibration)$")
    issue_description: Optional[str] = None
    diagnosis: Optional[str] = None
    action_taken: str = Field(..., min_length=3)
    parts_replaced: List[Dict[str, Any]] = Field(default_factory=list)
    downtime_minutes: int = Field(default=0, ge=0)
    maintenance_date: Optional[datetime] = None
    notes: Optional[str] = None

class MaintenanceRecordCreate(MaintenanceRecordBase):
    asset_id: Optional[UUID] = None
    technician_id: Optional[UUID] = None

class MaintenanceRecordResponse(MaintenanceRecordBase):
    id: UUID
    asset_id: UUID
    technician_id: Optional[UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ==============================================================================
# Analytics Overview Schemas
# ==============================================================================
class AnalyticsOverviewResponse(BaseModel):
    total_assets: int = 0
    active_assets: int = 0
    total_maintenance_records: int = 0
    total_diagnostic_sessions: int = 0
    completed_diagnostics: int = 0
    failed_diagnostics: int = 0
    total_manuals: int = 0
    feedback_count: int = 0
    average_feedback_rating: float = 0.0
    system_status: str = "operational"

    model_config = ConfigDict(from_attributes=True)
