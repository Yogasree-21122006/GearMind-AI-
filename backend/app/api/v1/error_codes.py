from typing import List, Optional
from fastapi import APIRouter, status, Query
from backend.app.schemas.error_code import ErrorCodeCreate, ErrorCodeResponse
from backend.app.services.error_code_service import ErrorCodeService

router = APIRouter(prefix="/error-codes", tags=["Fault Catalog & Error Codes"])

@router.get(
    "",
    response_model=List[ErrorCodeResponse],
    summary="List Error Codes",
    description="Search and filter the diagnostic trouble code catalog by equipment type, manufacturer, or severity."
)
def list_error_codes(
    equipment_type: Optional[str] = Query(None, description="Filter by equipment type"),
    manufacturer: Optional[str] = Query(None, description="Filter by manufacturer / OEM"),
    severity: Optional[str] = Query(None, description="Filter by severity: info, warning, critical, fatal"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    service = ErrorCodeService()
    return service.list_error_codes(
        equipment_type=equipment_type,
        manufacturer=manufacturer,
        severity=severity,
        skip=skip,
        limit=limit
    )

@router.post(
    "",
    response_model=ErrorCodeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register Error Code",
    description="Add a new standardized error code, possible root causes, recommended checks, and safety warnings."
)
def create_error_code(error_in: ErrorCodeCreate):
    service = ErrorCodeService()
    return service.create_error_code(error_in)

@router.get(
    "/{code}",
    response_model=ErrorCodeResponse,
    summary="Get Error Code Details",
    description="Retrieve diagnostic definitions and safety warnings for a specific error code."
)
def get_error_code_details(code: str):
    service = ErrorCodeService()
    return service.get_by_code(code)
