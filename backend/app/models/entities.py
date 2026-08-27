import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Text, Date, ForeignKey, Numeric, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from backend.app.models.base import Base, TimestampMixin

class Technician(Base, TimestampMixin):
    __tablename__ = "technicians"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="technician", nullable=False, index=True)

class Asset(Base, TimestampMixin):
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_code = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    equipment_type = Column(String(100), nullable=False, index=True)
    manufacturer = Column(String(150), nullable=False, index=True)
    model = Column(String(150), nullable=False)
    serial_number = Column(String(150), nullable=False)
    location = Column(String(255), nullable=False, index=True)
    operational_status = Column(String(50), default="operational", nullable=False, index=True)
    installation_date = Column(Date, nullable=True)
    last_maintenance_date = Column(DateTime(timezone=True), nullable=True)

    images = relationship("AssetImage", back_populates="asset", cascade="all, delete-orphan")
    sessions = relationship("DiagnosticSession", back_populates="asset")
    maintenance_records = relationship("MaintenanceRecord", back_populates="asset", cascade="all, delete-orphan")

class AssetImage(Base):
    __tablename__ = "asset_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="CASCADE"), nullable=False, index=True)
    technician_id = Column(UUID(as_uuid=True), ForeignKey("technicians.id", ondelete="SET NULL"), nullable=True, index=True)
    storage_path = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    content_type = Column(String(100), default="image/jpeg", nullable=False)
    image_type = Column(String(50), default="inspection", nullable=False, index=True)
    analysis_status = Column(String(50), default="pending", nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)

    asset = relationship("Asset", back_populates="images")

class ErrorCode(Base, TimestampMixin):
    __tablename__ = "error_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    equipment_type = Column(String(100), nullable=False, index=True)
    manufacturer = Column(String(150), nullable=False, index=True)
    code = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    possible_causes = Column(JSONB, default=list)
    recommended_checks = Column(JSONB, default=list)
    safety_warnings = Column(JSONB, default=list)
    severity = Column(String(50), default="warning", nullable=False, index=True)

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="CASCADE"), nullable=False, index=True)
    technician_id = Column(UUID(as_uuid=True), ForeignKey("technicians.id", ondelete="SET NULL"), nullable=True, index=True)
    maintenance_type = Column(String(100), nullable=False, index=True)
    issue_description = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    action_taken = Column(Text, nullable=False)
    parts_replaced = Column(JSONB, default=list)
    downtime_minutes = Column(Integer, default=0)
    maintenance_date = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)

    asset = relationship("Asset", back_populates="maintenance_records")

class Manual(Base, TimestampMixin):
    __tablename__ = "manuals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    manufacturer = Column(String(150), nullable=False, index=True)
    equipment_type = Column(String(100), nullable=False, index=True)
    model = Column(String(150), nullable=True, index=True)
    document_type = Column(String(100), default="oem_manual", nullable=False)
    storage_path = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    processing_status = Column(String(50), default="pending", nullable=False, index=True)
    page_count = Column(Integer, default=0)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("technicians.id", ondelete="SET NULL"), nullable=True, index=True)

    chunks = relationship("DocumentChunk", back_populates="manual", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    manual_id = Column(UUID(as_uuid=True), ForeignKey("manuals.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True, index=True)
    metadata_ = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)

    manual = relationship("Manual", back_populates="chunks")

class DiagnosticSession(Base):
    __tablename__ = "diagnostic_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="SET NULL"), nullable=True, index=True)
    technician_id = Column(UUID(as_uuid=True), ForeignKey("technicians.id", ondelete="SET NULL"), nullable=True, index=True)
    user_question = Column(Text, nullable=False)
    image_id = Column(UUID(as_uuid=True), ForeignKey("asset_images.id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(String(50), default="pending", nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    asset = relationship("Asset", back_populates="sessions")
    results = relationship("DiagnosticResult", back_populates="session", cascade="all, delete-orphan")

class DiagnosticResult(Base):
    __tablename__ = "diagnostic_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    diagnostic_session_id = Column(UUID(as_uuid=True), ForeignKey("diagnostic_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    issue_summary = Column(Text, nullable=False)
    identified_error_code = Column(String(100), nullable=True, index=True)
    confidence = Column(Numeric(5, 4), nullable=True)
    probable_causes = Column(JSONB, default=list)
    recommended_steps = Column(JSONB, default=list)
    required_tools = Column(JSONB, default=list)
    safety_warnings = Column(JSONB, default=list)
    citations = Column(JSONB, default=list)
    model_name = Column(String(100), nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)

    session = relationship("DiagnosticSession", back_populates="results")
    feedback = relationship("TechnicianFeedback", back_populates="result", cascade="all, delete-orphan")

class TechnicianFeedback(Base):
    __tablename__ = "technician_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    diagnostic_session_id = Column(UUID(as_uuid=True), ForeignKey("diagnostic_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    technician_id = Column(UUID(as_uuid=True), ForeignKey("technicians.id", ondelete="SET NULL"), nullable=True, index=True)
    rating = Column(Integer, nullable=False, index=True)
    feedback_text = Column(Text, nullable=True)
    was_helpful = Column(Boolean, nullable=False)
    actual_root_cause = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)

    result = relationship("DiagnosticResult", back_populates="feedback")
