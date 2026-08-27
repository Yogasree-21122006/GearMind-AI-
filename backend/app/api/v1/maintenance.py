from typing import List
from fastapi import APIRouter, Query
from backend.app.schemas.maintenance import MaintenanceRecordResponse
from backend.app.services.maintenance_service import MaintenanceService

router = APIRouter(prefix="/maintenance-records", tags=["Maintenance Records"])

@router.get(
    "",
    response_model=List[MaintenanceRecordResponse],
    summary="List All Maintenance Records",
    description="Retrieve all historical maintenance events across assets."
)
def list_all_maintenance(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    service = MaintenanceService()
    return service.list_all_records(skip=skip, limit=limit)
