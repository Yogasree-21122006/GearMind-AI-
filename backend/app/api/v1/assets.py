from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, HTTPException, status, Query, UploadFile, File, Form
from backend.app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, AssetImageResponse
from backend.app.schemas.maintenance import MaintenanceRecordCreate, MaintenanceRecordResponse
from backend.app.services.asset_service import AssetService
from backend.app.services.maintenance_service import MaintenanceService
from backend.app.services.storage_service import StorageService
from backend.app.core.config import settings

router = APIRouter(prefix="/assets", tags=["Assets & Equipment"])

@router.get(
    "",
    response_model=List[AssetResponse],
    summary="List Registered Equipment",
    description="Retrieve all registered industrial assets with optional filters for equipment type, manufacturer, operational status, or location."
)
def list_assets(
    equipment_type: Optional[str] = Query(None, description="Filter by equipment type (e.g. Chiller, Pump)"),
    manufacturer: Optional[str] = Query(None, description="Filter by manufacturer / OEM"),
    operational_status: Optional[str] = Query(None, description="Filter by status (operational, degraded, critical, under_maintenance)"),
    location: Optional[str] = Query(None, description="Filter by facility location"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    service = AssetService()
    return service.list_assets(
        equipment_type=equipment_type,
        manufacturer=manufacturer,
        operational_status=operational_status,
        location=location,
        skip=skip,
        limit=limit
    )

@router.post(
    "",
    response_model=AssetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New Asset",
    description="Registers an industrial equipment asset in Supabase PostgreSQL with strict schema validation."
)
def create_asset(asset_in: AssetCreate):
    service = AssetService()
    return service.create_asset(asset_in)

@router.get(
    "/{asset_id}",
    response_model=AssetResponse,
    summary="Get Asset by ID",
    description="Retrieve full equipment profile, technical specifications, and associated inspection images."
)
def get_asset(asset_id: UUID):
    service = AssetService()
    return service.get_asset(asset_id)

@router.put(
    "/{asset_id}",
    response_model=AssetResponse,
    summary="Update Asset Profile",
    description="Update operational status, location, or equipment specifications."
)
def update_asset(asset_id: UUID, asset_update: AssetUpdate):
    service = AssetService()
    return service.update_asset(asset_id, asset_update)

@router.delete(
    "/{asset_id}",
    summary="Delete Asset",
    description="Decommission and remove asset record and cascading metadata."
)
def delete_asset(asset_id: UUID):
    service = AssetService()
    return service.delete_asset(asset_id)

# ==============================================================================
# Asset Images & Multimodal Staging
# ==============================================================================
@router.post(
    "/{asset_id}/images",
    response_model=AssetImageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Inspection Image",
    description="Accepts multipart image upload, validates file type and size, uploads directly to Supabase Storage, and registers image metadata."
)
async def upload_asset_image(
    asset_id: UUID,
    file: UploadFile = File(..., description="Image file (JPEG, PNG, WEBP, HEIC, max 20MB)"),
    image_type: str = Form("inspection", description="Type: nameplate, overall, component, damage, thermal, inspection"),
    technician_id: Optional[UUID] = Form(None, description="ID of uploading technician")
):
    storage = StorageService()
    file_bytes, content_type = await storage.validate_and_read_image(file)

    # Generate sanitized storage path
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{asset_id}_{uuid4().hex[:8]}.{file_ext}"
    storage_path = f"inspections/{asset_id}/{unique_filename}"

    # Upload actual file to Supabase Storage bucket
    await storage.upload_file(
        bucket=settings.SUPABASE_STORAGE_BUCKET_IMAGES,
        path=storage_path,
        file_bytes=file_bytes,
        mime_type=content_type
    )

    # Save metadata in asset_images table
    asset_service = AssetService()
    return asset_service.add_image_metadata(
        asset_id=asset_id,
        storage_path=storage_path,
        file_name=file.filename or unique_filename,
        content_type=content_type,
        image_type=image_type,
        technician_id=technician_id
    )

@router.get(
    "/{asset_id}/images",
    response_model=List[AssetImageResponse],
    summary="List Asset Inspection Images",
    description="Retrieve all inspection image metadata associated with the specified asset."
)
def list_asset_images(asset_id: UUID):
    asset_service = AssetService()
    return asset_service.list_images(asset_id)

# ==============================================================================
# Asset Maintenance History Sub-routes
# ==============================================================================
@router.post(
    "/{asset_id}/maintenance",
    response_model=MaintenanceRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log Maintenance Record",
    description="Record a completed preventive, corrective, or emergency maintenance event for this asset."
)
def log_asset_maintenance(asset_id: UUID, record_in: MaintenanceRecordCreate):
    maint_service = MaintenanceService()
    return maint_service.create_record(asset_id, record_in)

@router.get(
    "/{asset_id}/maintenance",
    response_model=List[MaintenanceRecordResponse],
    summary="List Maintenance History for Asset",
    description="Retrieve historical work orders, actions taken, and downtime logs for this asset."
)
def get_asset_maintenance_history(
    asset_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    maint_service = MaintenanceService()
    return maint_service.list_records_for_asset(asset_id, skip=skip, limit=limit)
