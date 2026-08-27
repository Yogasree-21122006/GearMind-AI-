from datetime import datetime, timezone
from fastapi import APIRouter, status
from backend.app.core.config import settings
from backend.app.database.supabase_client import get_supabase_client

router = APIRouter(tags=["System Health"])

@router.get(
    "/health",
    summary="System Health & Connectivity Status",
    description="Returns API status and verifies Supabase client and storage configurations without exposing credentials.",
    status_code=status.HTTP_200_OK
)
def health_check():
    """System health check endpoint."""
    client = get_supabase_client()
    supabase_configured = client is not None
    
    db_connected = False
    if client:
        try:
            # Quick lightweight check on Supabase REST API
            client.table("assets").select("id").limit(1).execute()
            db_connected = True
        except Exception:
            db_connected = False

    return {
        "status": "ok" if (supabase_configured and db_connected) else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
        "services": {
            "api": "online",
            "supabase_config": "configured" if supabase_configured else "unconfigured",
            "database_connection": "connected" if db_connected else "pending_table_initialization",
            "storage_images_bucket": settings.SUPABASE_STORAGE_BUCKET_IMAGES,
            "storage_docs_bucket": settings.SUPABASE_STORAGE_BUCKET_DOCS,
        }
    }
