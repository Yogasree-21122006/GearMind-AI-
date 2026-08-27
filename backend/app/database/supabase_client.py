from typing import Optional
import logging
from supabase import create_client, Client
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    """
    Returns an initialized Supabase client using service role or anon key.
    Kept server-side to protect service-role capabilities.
    """
    global _supabase_client
    if _supabase_client is None:
        if settings.SUPABASE_URL and (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY):
            key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
            _supabase_client = create_client(settings.SUPABASE_URL, key)
            logger.info("Supabase client successfully initialized.")
        else:
            logger.warning("Supabase credentials not configured in environment.")
    return _supabase_client
