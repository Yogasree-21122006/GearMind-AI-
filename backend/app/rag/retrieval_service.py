import logging
from typing import List, Dict, Any, Optional
from backend.app.database.supabase_client import get_supabase_client
from backend.app.core.config import settings
from backend.app.rag.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class RetrievalService:
    """
    RAG semantic search and vector retrieval service.
    Queries Supabase pgvector cosine search function and preserves source citations.
    """

    def __init__(self):
        self.supabase = get_supabase_client()
        self.embedding_service = EmbeddingService()

    def search_similar_chunks(
        self,
        query: str,
        top_k: Optional[int] = None,
        similarity_threshold: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Generates query embedding, calls match_document_chunks RPC in Supabase,
        and formats returned chunks with full source citation details.
        """
        if not query or not query.strip():
            return []

        if not self.supabase:
            logger.error("Supabase client is not available for vector search.")
            return []

        k = top_k or settings.DEFAULT_TOP_K
        threshold = similarity_threshold if similarity_threshold is not None else settings.SIMILARITY_THRESHOLD

        logger.info(f"[RAG Retrieval] Searching top {k} chunks for query: '{query[:50]}...' (threshold: {threshold})")

        try:
            # 1. Generate 768-dim query vector
            query_vector = self.embedding_service.generate_embedding(query)

            # 2. Execute pgvector search RPC
            rpc_params = {
                "query_embedding": query_vector,
                "match_threshold": float(threshold),
                "match_count": int(k)
            }
            res = self.supabase.rpc("match_document_chunks", rpc_params).execute()
            rows = res.data or []

            # 3. Format citations and chunks
            results: List[Dict[str, Any]] = []
            for row in rows:
                meta = row.get("metadata") or {}
                results.append({
                    "chunk_id": row.get("id"),
                    "manual_id": row.get("manual_id"),
                    "manual_title": meta.get("document_title", "Technical Document"),
                    "equipment_type": meta.get("equipment_type", ""),
                    "manufacturer": meta.get("manufacturer", ""),
                    "model": meta.get("model", ""),
                    "page_number": row.get("page_number", meta.get("page_number", 1)),
                    "content": row.get("content", ""),
                    "similarity": round(float(row.get("similarity", 0.0)), 4),
                    "citation": {
                        "manual_id": row.get("manual_id"),
                        "document_title": meta.get("document_title", "Technical Document"),
                        "page_number": row.get("page_number", meta.get("page_number", 1)),
                        "similarity": round(float(row.get("similarity", 0.0)), 4)
                    }
                })

            logger.info(f"[RAG Retrieval] Found {len(results)} matching chunks above threshold {threshold}.")
            return results

        except Exception as e:
            logger.error(f"[RAG Retrieval] Vector search RPC failed: {e}", exc_info=True)
            return []
