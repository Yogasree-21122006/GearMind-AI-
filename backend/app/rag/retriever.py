import logging
from typing import List, Dict, Any, Optional
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)

class VectorRetriever:
    """Retrieves grounded document chunks using Supabase pgvector cosine search."""

    def __init__(self):
        self.supabase = get_supabase_client()

    async def search_similar_chunks(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        threshold: float = 0.65
    ) -> List[Dict[str, Any]]:
        if not self.supabase:
            logger.warning("Supabase client unavailable for vector search.")
            return []
        
        try:
            # Calls the PostgreSQL stored procedure `match_document_chunks`
            response = self.supabase.rpc(
                "match_document_chunks",
                {
                    "query_embedding": query_embedding,
                    "match_threshold": threshold,
                    "match_count": top_k
                }
            ).execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Vector search failed: {e}")
            return []
