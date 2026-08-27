import time
import logging
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Query, UploadFile, File, Form
from backend.app.schemas.diagnostic import (
    DiagnosticSessionCreate,
    DiagnosticSessionResponse
)
from backend.app.services.asset_service import AssetService
from backend.app.services.storage_service import StorageService
from backend.app.services.diagnostic_service import DiagnosticService
from backend.app.services.error_code_lookup import ErrorCodeLookupService
from backend.app.services.maintenance_context import MaintenanceContextService
from backend.app.rag.retrieval_service import RetrievalService
from backend.app.vision.vision_service import VisionService
from backend.app.ai.context_builder import DiagnosticContextBuilder
from backend.app.ai.diagnostic_service import AIDiagnosticService
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/diagnostics", tags=["Diagnostics & AI Engine"])

@router.get(
    "/sessions",
    response_model=List[DiagnosticSessionResponse],
    summary="List Diagnostic Sessions",
    description="Retrieve all diagnostic troubleshooting inquiry sessions."
)
def list_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    service = DiagnosticService()
    return service.list_sessions(skip=skip, limit=limit)

@router.post(
    "/sessions",
    response_model=DiagnosticSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Diagnostic Session",
    description="Open a new diagnostic session for an equipment inquiry."
)
def create_session(session_in: DiagnosticSessionCreate):
    service = DiagnosticService()
    return service.create_session(session_in)

@router.get(
    "/sessions/{session_id}",
    response_model=DiagnosticSessionResponse,
    summary="Get Diagnostic Session Details",
    description="Retrieve active session status, query, and any stored results."
)
def get_session(session_id: UUID):
    service = DiagnosticService()
    return service.get_session(session_id)

@router.post(
    "/analyze",
    summary="Execute Multimodal AI Diagnostic Analysis",
    description="Full multimodal diagnostic pipeline combining Vision AI, pgvector RAG, Error Code catalog, and Maintenance History."
)
async def run_diagnostic_analysis(
    asset_id: UUID = Form(..., description="Target industrial asset ID"),
    question: str = Form(..., description="Observed symptom or technician question"),
    error_code: Optional[str] = Form(None, description="Optional diagnostic error code (e.g. E-241)"),
    image_id: Optional[UUID] = Form(None, description="Optional existing asset image ID"),
    technician_id: Optional[UUID] = Form(None, description="Optional technician ID"),
    image_file: Optional[UploadFile] = File(None, description="Optional newly uploaded inspection photo")
):
    start_time = time.time()
    diag_service = DiagnosticService()
    asset_service = AssetService()
    storage_service = StorageService()

    # 1. Fetch asset specifications safely
    try:
        asset = asset_service.get_asset(asset_id)
    except Exception:
        asset = {
            "id": str(asset_id),
            "name": "Industrial Equipment",
            "asset_code": "EQUIP-01",
            "equipment_type": "Chiller",
            "manufacturer": "OEM"
        }

    # 2. Open diagnostic session in database
    session_id = uuid4()
    try:
        session_data = DiagnosticSessionCreate(
            asset_id=asset_id,
            technician_id=technician_id,
            user_question=question or "General troubleshooting inquiry",
            image_id=image_id,
            status="processing"
        )
        created_session = diag_service.create_session(session_data)
        if created_session and "id" in created_session:
            session_id = UUID(str(created_session["id"]))
    except Exception as sess_err:
        logger.warning(f"Session creation notice: {sess_err}")

    logger.info(f"[Diagnostic Engine] Opened session {session_id} for asset {asset.get('asset_code')}")

    try:
        # 3. Vision Analysis (if image provided or uploaded)
        vision_result = None
        target_image_bytes = None
        target_mime = "image/jpeg"

        if image_file:
            try:
                target_image_bytes, target_mime = await storage_service.validate_and_read_image(image_file)
                file_ext = image_file.filename.split(".")[-1] if "." in image_file.filename else "jpg"
                storage_path = f"inspections/{asset_id}/{uuid4().hex[:8]}.{file_ext}"
                await storage_service.upload_file(
                    bucket=settings.SUPABASE_STORAGE_BUCKET_IMAGES,
                    path=storage_path,
                    file_bytes=target_image_bytes,
                    mime_type=target_mime
                )
                img_rec = asset_service.add_image_metadata(
                    asset_id=asset_id,
                    storage_path=storage_path,
                    file_name=image_file.filename,
                    content_type=target_mime,
                    technician_id=technician_id
                )
                if img_rec and "id" in img_rec:
                    image_id = UUID(str(img_rec["id"]))
            except Exception as img_upload_err:
                logger.warning(f"Image upload handling notice: {img_upload_err}")

        elif image_id:
            try:
                images = asset_service.list_images(asset_id)
                matching_img = next((img for img in images if str(img.get("id")) == str(image_id)), None)
                if matching_img and storage_service.supabase:
                    target_image_bytes = storage_service.supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_IMAGES).download(matching_img["storage_path"])
                    target_mime = matching_img.get("content_type", "image/jpeg")
            except Exception as img_err:
                logger.warning(f"Could not download stored image bytes: {img_err}")

        if target_image_bytes:
            vision_service = VisionService()
            vision_analysis_obj = vision_service.analyze_equipment_image(
                image_bytes=target_image_bytes,
                mime_type=target_mime,
                question=question,
                equipment_meta=asset
            )
            vision_result = vision_analysis_obj.model_dump()
            logger.info(f"[Diagnostic Engine] Vision AI identified {len(vision_analysis_obj.observations)} observations.")

        # 4. Error Code Lookup (from explicit input or Vision detection)
        target_error_code = error_code
        if not target_error_code and vision_result and vision_result.get("detected_error_codes"):
            target_error_code = vision_result["detected_error_codes"][0]

        error_lookup_service = ErrorCodeLookupService()
        error_info = error_lookup_service.lookup_error_code(
            code=target_error_code or "",
            equipment_type=asset.get("equipment_type"),
            manufacturer=asset.get("manufacturer")
        )

        # 5. Maintenance History Context
        maint_context_service = MaintenanceContextService()
        maintenance_records = maint_context_service.get_asset_maintenance_context(asset_id, limit=5)

        # 6. RAG Retrieval from Technical Manuals
        rag_service = RetrievalService()
        rag_query = f"{question} {asset.get('equipment_type', '')} {asset.get('model', '')} {target_error_code or ''}".strip()
        rag_chunks = rag_service.search_similar_chunks(
            query=rag_query,
            top_k=settings.DEFAULT_TOP_K,
            similarity_threshold=settings.SIMILARITY_THRESHOLD
        )

        # 7. Assemble Structured Multi-Source Context
        context = DiagnosticContextBuilder.build_context(
            user_question=question,
            asset=asset,
            vision_analysis=vision_result,
            error_code_info=error_info,
            rag_chunks=rag_chunks,
            maintenance_history=maintenance_records
        )

        # 8. LLM Grounded Diagnostic Reasoning
        ai_service = AIDiagnosticService()
        diagnostic_output = ai_service.run_diagnostic_reasoning(context)

        # 9. Save Diagnostic Result to Database
        response_time_ms = int((time.time() - start_time) * 1000)
        identified_code = diagnostic_output.error_code.code if (diagnostic_output.error_code and diagnostic_output.error_code.code) else target_error_code

        db_result_payload = {
            "diagnostic_session_id": str(session_id),
            "issue_summary": diagnostic_output.summary,
            "identified_error_code": identified_code,
            "confidence": float(diagnostic_output.confidence),
            "probable_causes": [c.model_dump() for c in diagnostic_output.possible_causes],
            "recommended_steps": [s.model_dump() for s in diagnostic_output.troubleshooting_steps],
            "required_tools": diagnostic_output.required_tools,
            "safety_warnings": diagnostic_output.safety_warnings,
            "citations": [c.model_dump() for c in diagnostic_output.citations],
            "model_name": settings.LLM_MODEL,
            "response_time_ms": response_time_ms
        }

        if diag_service.repo.supabase:
            try:
                diag_service.repo.supabase.table("diagnostic_results").insert(db_result_payload).execute()
                diag_service.repo.supabase.table("diagnostic_sessions").update({
                    "status": "completed",
                    "completed_at": datetime.now(timezone.utc).isoformat()
                }).eq("id", str(session_id)).execute()
            except Exception as db_err:
                logger.error(f"Error persisting diagnostic result to database: {db_err}")

        logger.info(f"[Diagnostic Engine] Completed session {session_id} in {response_time_ms}ms with confidence {diagnostic_output.confidence}")

        return {
            "session_id": session_id,
            "status": "completed",
            "response_time_ms": response_time_ms,
            "diagnostic_result": diagnostic_output.model_dump(),
            "context_summary": {
                "rag_chunks_found": len(rag_chunks),
                "error_code_matched": error_info.get("status") == "MATCHED",
                "maintenance_records_used": len(maintenance_records),
                "vision_analyzed": bool(vision_result)
            }
        }

    except Exception as e:
        logger.error(f"[Diagnostic Engine] Pipeline failed for session {session_id}: {e}", exc_info=True)
        if diag_service.repo.supabase:
            try:
                diag_service.repo.supabase.table("diagnostic_sessions").update({"status": "failed"}).eq("id", str(session_id)).execute()
            except Exception:
                pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Diagnostic pipeline encountered an error: {str(e)}"
        )
