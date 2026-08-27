import logging
from typing import Dict, Any, Optional
from backend.app.database.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)

class ErrorCodeLookupService:
    """Service for searching standardized error code catalogs in Supabase PostgreSQL."""

    def __init__(self):
        self.supabase = get_supabase_client()

    def lookup_error_code(
        self,
        code: str,
        equipment_type: Optional[str] = None,
        manufacturer: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Searches the error_codes table for matching fault definitions.
        Returns full error code dictionary, or {"status": "NO_MATCH"}. Never invents codes.
        """
        if not code or not code.strip():
            return {"status": "NO_MATCH", "message": "No error code provided."}

        sanitized_code = code.strip().upper()
        if not self.supabase:
            logger.warning("Supabase client unconfigured during error code lookup.")
            return {"status": "NO_MATCH", "code": sanitized_code}

        try:
            query = self.supabase.table("error_codes").select("*").ilike("code", sanitized_code)
            if manufacturer:
                query = query.ilike("manufacturer", f"%{manufacturer}%")
            
            res = query.execute()
            rows = res.data or []

            if not rows and manufacturer:
                # Retry without manufacturer restriction
                fallback_res = self.supabase.table("error_codes").select("*").ilike("code", sanitized_code).execute()
                rows = fallback_res.data or []

            if rows and len(rows) > 0:
                ec = rows[0]
                logger.info(f"Matched error code '{sanitized_code}': {ec.get('title')}")
                return {
                    "status": "MATCHED",
                    "code": ec.get("code"),
                    "title": ec.get("title"),
                    "description": ec.get("description"),
                    "possible_causes": ec.get("possible_causes") or [],
                    "recommended_checks": ec.get("recommended_checks") or [],
                    "safety_warnings": ec.get("safety_warnings") or [],
                    "severity": ec.get("severity", "warning"),
                    "equipment_type": ec.get("equipment_type"),
                    "manufacturer": ec.get("manufacturer")
                }

            logger.info(f"No error code match found for '{sanitized_code}'.")
            return {
                "status": "NO_MATCH",
                "code": sanitized_code,
                "message": f"Error code '{sanitized_code}' is not documented in the official fault catalog."
            }

        except Exception as e:
            logger.error(f"Error querying error codes table: {e}", exc_info=True)
            return {"status": "NO_MATCH", "code": sanitized_code, "error": str(e)}
