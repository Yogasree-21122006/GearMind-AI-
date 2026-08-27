from backend.app.schemas.common import APIResponse, PaginationParams, PaginatedResponse
from backend.app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, AssetImageCreate, AssetImageResponse
from backend.app.schemas.manual import ManualCreate, ManualResponse, DocumentChunkResponse
from backend.app.schemas.diagnostic import (
    DiagnosticSessionCreate,
    DiagnosticSessionResponse,
    DiagnosticResultCreate,
    DiagnosticResultResponse
)
from backend.app.schemas.error_code import ErrorCodeCreate, ErrorCodeResponse
from backend.app.schemas.feedback import TechnicianFeedbackCreate, TechnicianFeedbackResponse
from backend.app.schemas.user import TechnicianCreate, TechnicianResponse
from backend.app.schemas.maintenance import MaintenanceRecordCreate, MaintenanceRecordResponse, AnalyticsOverviewResponse

__all__ = [
    "APIResponse",
    "PaginationParams",
    "PaginatedResponse",
    "AssetCreate",
    "AssetUpdate",
    "AssetResponse",
    "AssetImageCreate",
    "AssetImageResponse",
    "ManualCreate",
    "ManualResponse",
    "DocumentChunkResponse",
    "DiagnosticSessionCreate",
    "DiagnosticSessionResponse",
    "DiagnosticResultCreate",
    "DiagnosticResultResponse",
    "ErrorCodeCreate",
    "ErrorCodeResponse",
    "TechnicianFeedbackCreate",
    "TechnicianFeedbackResponse",
    "TechnicianCreate",
    "TechnicianResponse",
    "MaintenanceRecordCreate",
    "MaintenanceRecordResponse",
    "AnalyticsOverviewResponse",
]
