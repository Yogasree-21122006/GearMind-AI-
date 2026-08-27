import time
import logging
from typing import Dict, Any, List, Optional
from uuid import UUID
from backend.app.rag.retrieval_service import RetrievalService
from backend.app.services.error_code_lookup import ErrorCodeLookupService
from backend.app.services.maintenance_context import MaintenanceContextService
from backend.app.services.asset_service import AssetService
from backend.app.vision.vision_service import VisionService

logger = logging.getLogger(__name__)

class ControlledAgentTools:
    """
    Controlled read-only decision-support tool registry.
    Strictly prohibits machine control, PLC commands, or physical actuation.
    """

    def __init__(self):
        self.retrieval_service = RetrievalService()
        self.error_lookup_service = ErrorCodeLookupService()
        self.maintenance_service = MaintenanceContextService()
        self.asset_service = AssetService()
        self.vision_service = VisionService()

    def get_asset_context(self, asset_id: UUID, asset_override: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Tool 1: Retrieves equipment metadata, OEM specs, and baseline parameters."""
        t0 = time.time()
        asset = asset_override
        if not asset:
            try:
                asset = self.asset_service.get_asset(asset_id)
            except Exception as e:
                logger.debug(f"Asset lookup notice for {asset_id}: {e}")
                asset = {
                    "id": str(asset_id),
                    "name": "Industrial Asset",
                    "asset_code": "ASSET-GEN",
                    "equipment_type": "Machinery",
                    "manufacturer": "OEM"
                }

        latency = int((time.time() - t0) * 1000)
        return {
            "tool": "asset_context",
            "latency_ms": latency,
            "data": asset,
            "status": "completed"
        }

    def analyze_equipment_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        question: str,
        equipment_meta: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Tool 2: Multimodal image analysis extracting visual observations and fault codes."""
        t0 = time.time()
        res = self.vision_service.analyze_equipment_image(
            image_bytes=image_bytes,
            mime_type=mime_type,
            question=question,
            equipment_meta=equipment_meta
        )
        latency = int((time.time() - t0) * 1000)
        return {
            "tool": "vision",
            "latency_ms": latency,
            "data": res.model_dump(),
            "status": "completed"
        }

    def lookup_error_code(
        self,
        error_code: str,
        manufacturer: Optional[str] = None,
        equipment_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Tool 3: Standardized error code database verification."""
        t0 = time.time()
        res = self.error_lookup_service.lookup_error_code(
            code=error_code,
            equipment_type=equipment_type,
            manufacturer=manufacturer
        )
        latency = int((time.time() - t0) * 1000)
        return {
            "tool": "error_code_lookup",
            "latency_ms": latency,
            "data": res,
            "status": "completed"
        }

    def get_maintenance_history(self, asset_id: UUID, limit: int = 5) -> Dict[str, Any]:
        """Tool 4: Fetches recent work orders and recurring maintenance history."""
        t0 = time.time()
        try:
            records = self.maintenance_service.get_asset_maintenance_context(asset_id=asset_id, limit=limit)
        except Exception:
            records = []
        latency = int((time.time() - t0) * 1000)
        return {
            "tool": "maintenance_history",
            "latency_ms": latency,
            "data": records,
            "status": "completed"
        }

    def search_equipment_manual(
        self,
        query: str,
        top_k: int = 5,
        similarity_threshold: float = 0.50
    ) -> Dict[str, Any]:
        """Tool 5: RAG vector search across OEM technical manuals and schematics."""
        t0 = time.time()
        chunks = self.retrieval_service.search_similar_chunks(
            query=query,
            top_k=top_k,
            similarity_threshold=similarity_threshold
        )
        latency = int((time.time() - t0) * 1000)
        return {
            "tool": "rag",
            "latency_ms": latency,
            "data": chunks,
            "status": "completed"
        }
