import logging
from typing import Dict, Any, List, Optional
from uuid import UUID

logger = logging.getLogger(__name__)

class DiagnosticContextBuilder:
    """
    Assembles and filters multi-source evidence into a structured context bundle:
    Asset Meta + Question + Vision Observations + Error Database + RAG Chunks + Maintenance History.
    """

    @staticmethod
    def build_context(
        user_question: str,
        asset: Dict[str, Any],
        vision_analysis: Optional[Dict[str, Any]] = None,
        error_code_info: Optional[Dict[str, Any]] = None,
        rag_chunks: Optional[List[Dict[str, Any]]] = None,
        maintenance_history: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Sanitizes and consolidates evidence sources."""
        # Sanitize asset data
        clean_asset = {
            "id": str(asset.get("id", "")),
            "asset_code": asset.get("asset_code") or asset.get("asset_tag", "UNKNOWN"),
            "name": asset.get("name", "Industrial Machinery"),
            "equipment_type": asset.get("equipment_type") or asset.get("category", "General"),
            "manufacturer": asset.get("manufacturer", "OEM"),
            "model": asset.get("model") or asset.get("model_number", ""),
            "serial_number": asset.get("serial_number", ""),
            "location": asset.get("location") or asset.get("location_facility", ""),
            "operational_status": asset.get("operational_status") or asset.get("status", "operational")
        }

        # Format Vision info
        clean_vision = vision_analysis or {
            "observations": [],
            "detected_error_codes": [],
            "equipment_condition_summary": "No visual inspection photo supplied.",
            "visible_hazards_or_warnings": []
        }

        # Format Error code info
        clean_error = error_code_info or {"status": "NO_MATCH"}

        # Format RAG chunks
        clean_rag = rag_chunks or []

        # Format Maintenance history
        clean_maint = maintenance_history or []

        logger.info(
            f"[Context Builder] Assembled context for asset {clean_asset['asset_code']}: "
            f"RAG chunks={len(clean_rag)}, Maintenance logs={len(clean_maint)}, "
            f"Error status={clean_error.get('status')}, Vision codes={clean_vision.get('detected_error_codes')}"
        )

        return {
            "user_question": user_question,
            "asset": clean_asset,
            "vision_analysis": clean_vision,
            "error_code_info": clean_error,
            "rag_chunks": clean_rag,
            "maintenance_history": clean_maint
        }
