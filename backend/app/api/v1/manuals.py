from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, HTTPException, status, Query, UploadFile, File, Form, BackgroundTasks
from backend.app.schemas.manual import ManualCreate, ManualResponse
from backend.app.services.manual_service import ManualService
from backend.app.services.storage_service import StorageService
from backend.app.rag.ingestion_service import IngestionService
from backend.app.core.config import settings

router = APIRouter(prefix="/manuals", tags=["Technical Manuals & Documentation"])

def _run_ingestion(manual_id: UUID):
    ingestor = IngestionService()
    ingestor.process_manual(manual_id)

@router.get(
    "",
    response_model=List[ManualResponse],
    summary="List Technical Manuals",
    description="Retrieve all indexed OEM manuals, SOPs, electrical schematics, and service bulletins."
)
def list_manuals(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    service = ManualService()
    return service.list_manuals(skip=skip, limit=limit)

@router.post(
    "/upload",
    response_model=ManualResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Technical Manual",
    description="Validates and uploads technical documentation (PDF/DOCX max 100MB) to Supabase Storage, and queues background RAG ingestion (text extraction, semantic chunking, and 768-dim vectorization)."
)
async def upload_manual(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="PDF or DOCX document file"),
    title: str = Form(..., description="Document title"),
    manufacturer: str = Form(..., description="Equipment manufacturer / OEM"),
    equipment_type: str = Form(..., description="Equipment category (e.g. Chiller, Generator)"),
    model: Optional[str] = Form(None, description="Applicable model number"),
    document_type: str = Form("oem_manual", description="Type: oem_manual, service_bulletin, schematic, sop, troubleshooting_guide, parts_catalog"),
    uploaded_by: Optional[UUID] = Form(None, description="Technician ID who uploaded")
):
    storage = StorageService()
    file_bytes, content_type = await storage.validate_and_read_doc(file)

    # Sanitize storage path
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "pdf"
    safe_filename = f"{manufacturer.lower().replace(' ', '_')}_{uuid4().hex[:8]}.{file_ext}"
    storage_path = f"manuals/{safe_filename}"

    # Upload binary file to Supabase Storage
    await storage.upload_file(
        bucket=settings.SUPABASE_STORAGE_BUCKET_DOCS,
        path=storage_path,
        file_bytes=file_bytes,
        mime_type=content_type
    )

    # Create metadata record
    manual_in = ManualCreate(
        title=title,
        manufacturer=manufacturer,
        equipment_type=equipment_type,
        model=model,
        document_type=document_type,
        storage_path=storage_path,
        file_name=file.filename or safe_filename,
        processing_status="pending",
        page_count=0,
        uploaded_by=uploaded_by
    )
    service = ManualService()
    created = service.create_manual(manual_in)

    # Queue background RAG ingestion
    if created and "id" in created:
        background_tasks.add_task(_run_ingestion, UUID(str(created["id"])))

    return created

@router.post(
    "/{manual_id}/reindex",
    summary="Reindex Manual Chunks",
    description="Manually triggers re-extraction, re-chunking, and re-embedding of an existing manual."
)
def reindex_manual(manual_id: UUID, background_tasks: BackgroundTasks):
    service = ManualService()
    manual = service.get_manual(manual_id)
    background_tasks.add_task(_run_ingestion, manual_id)
    return {"message": f"Reindexing queued for manual '{manual.get('title')}'."}

@router.get(
    "/{manual_id}",
    response_model=ManualResponse,
    summary="Get Manual by ID",
    description="Retrieve document metadata and indexing status."
)
def get_manual(manual_id: UUID):
    service = ManualService()
    return service.get_manual(manual_id)

@router.delete(
    "/{manual_id}",
    summary="Delete Manual",
    description="Remove manual record and associated vector chunks."
)
def delete_manual(manual_id: UUID):
    service = ManualService()
    return service.delete_manual(manual_id)
