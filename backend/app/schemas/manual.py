from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class DocumentChunkResponse(BaseModel):
    id: UUID
    manual_id: UUID
    chunk_index: int
    content: str
    page_number: Optional[int] = None
    metadata_: Optional[Dict[str, Any]] = Field(default_factory=dict, alias="metadata")
    similarity: Optional[float] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class ManualBase(BaseModel):
    title: str = Field(..., max_length=255)
    manufacturer: str = Field(..., max_length=150)
    equipment_type: str = Field(..., max_length=100)
    model: Optional[str] = Field(None, max_length=150)
    document_type: str = Field(
        default="oem_manual",
        pattern="^(oem_manual|service_bulletin|schematic|sop|troubleshooting_guide|parts_catalog)$"
    )

class ManualCreate(ManualBase):
    storage_path: str
    file_name: str
    processing_status: str = "pending"
    page_count: Optional[int] = 0
    uploaded_by: Optional[UUID] = None

class ManualResponse(ManualBase):
    id: UUID
    storage_path: str
    file_name: str
    processing_status: str
    page_count: int
    uploaded_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
