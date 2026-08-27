import logging
from typing import Dict, Any, Optional
from uuid import UUID
from backend.app.database.supabase_client import get_supabase_client
from backend.app.core.config import settings
from backend.app.services.document_processor import DocumentProcessor
from backend.app.rag.chunker import DocumentChunker
from backend.app.rag.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class IngestionService:
    """
    Orchestrates the technical document ingestion pipeline:
    Storage download -> Extraction -> Cleaning -> Chunking -> Vectorization -> Supabase pgvector insertion.
    """

    def __init__(self):
        self.supabase = get_supabase_client()
        self.processor = DocumentProcessor()
        self.chunker = DocumentChunker()
        self.embedding_service = EmbeddingService()

    def process_manual(self, manual_id: UUID) -> Dict[str, Any]:
        """
        Executes end-to-end processing for an uploaded technical manual.
        Updates processing status and maintains complete observability.
        """
        if not self.supabase:
            logger.error("Cannot process manual: Supabase client is not available.")
            return {"status": "failed", "error": "Supabase client unconfigured"}

        manual_id_str = str(manual_id)
        logger.info(f"[Ingestion Pipeline] Starting document ingestion for manual: {manual_id_str}")

        # 1. Fetch manual record
        try:
            res = self.supabase.table("manuals").select("*").eq("id", manual_id_str).execute()
            if not res.data or len(res.data) == 0:
                logger.error(f"[Ingestion Pipeline] Manual {manual_id_str} not found in database.")
                return {"status": "failed", "error": "Manual record not found"}
            manual = res.data[0]
        except Exception as e:
            logger.error(f"[Ingestion Pipeline] Error fetching manual record: {e}", exc_info=True)
            return {"status": "failed", "error": str(e)}

        storage_path = manual.get("storage_path")
        file_name = manual.get("file_name", "document.pdf")
        title = manual.get("title", file_name)

        # 2. Set status to 'processing'
        try:
            self.supabase.table("manuals").update({"processing_status": "processing"}).eq("id", manual_id_str).execute()
            logger.info(f"[Ingestion Pipeline] Manual {manual_id_str} status updated to 'processing'.")
        except Exception as e:
            logger.warning(f"Could not update status to processing: {e}")

        try:
            # 3. Download binary file from Supabase Storage
            logger.info(f"[Ingestion Pipeline] Downloading '{storage_path}' from bucket '{settings.SUPABASE_STORAGE_BUCKET_DOCS}'")
            file_bytes = self.supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_DOCS).download(storage_path)
            if not file_bytes:
                raise ValueError(f"Downloaded file bytes are empty for '{storage_path}'.")

            # 4. Extract structured pages and clean text
            doc_metadata = {
                "manual_id": manual_id_str,
                "equipment_type": manual.get("equipment_type", ""),
                "manufacturer": manual.get("manufacturer", ""),
                "model": manual.get("model", ""),
                "document_type": manual.get("document_type", "oem_manual")
            }
            extracted_doc = self.processor.extract_document(
                file_bytes=file_bytes,
                file_name=file_name,
                title=title,
                metadata=doc_metadata
            )
            logger.info(f"[Ingestion Pipeline] Extracted {extracted_doc.total_pages} pages from '{title}'.")

            # 5. Semantic-aware document chunking
            chunks = self.chunker.chunk_document(extracted_doc, manual_id=manual_id_str)
            logger.info(f"[Ingestion Pipeline] Generated {len(chunks)} semantic chunks for manual: {manual_id_str}")

            # 6. Generate 768-dimensional embeddings
            chunk_texts = [c.content for c in chunks]
            embeddings = self.embedding_service.generate_embeddings(chunk_texts)
            logger.info(f"[Ingestion Pipeline] Generated {len(embeddings)} 768-dim embeddings.")

            # 7. Safe idempotent deletion of previous chunks for this manual
            self.supabase.table("document_chunks").delete().eq("manual_id", manual_id_str).execute()

            # 8. Batch insert document chunks with pgvector embeddings
            records_to_insert = []
            for i, chunk in enumerate(chunks):
                records_to_insert.append({
                    "manual_id": manual_id_str,
                    "chunk_index": chunk.chunk_index,
                    "content": chunk.content,
                    "page_number": chunk.page_number,
                    "metadata": chunk.metadata,
                    "embedding": embeddings[i]
                })

            # Insert in chunks of 50 to prevent payload limits
            batch_size = 50
            for start_idx in range(0, len(records_to_insert), batch_size):
                batch = records_to_insert[start_idx:start_idx + batch_size]
                self.supabase.table("document_chunks").insert(batch).execute()

            # 9. Update manual status to 'completed' and record page count
            self.supabase.table("manuals").update({
                "processing_status": "completed",
                "page_count": extracted_doc.total_pages
            }).eq("id", manual_id_str).execute()

            logger.info(f"[Ingestion Pipeline] Successfully ingested manual '{title}' ({extracted_doc.total_pages} pages, {len(chunks)} chunks).")

            return {
                "status": "completed",
                "manual_id": manual_id_str,
                "total_pages": extracted_doc.total_pages,
                "chunks_count": len(chunks)
            }

        except Exception as e:
            logger.error(f"[Ingestion Pipeline] Failed to ingest manual {manual_id_str}: {e}", exc_info=True)
            try:
                self.supabase.table("manuals").update({
                    "processing_status": "failed"
                }).eq("id", manual_id_str).execute()
            except Exception as update_err:
                logger.error(f"Failed to update failed status in database: {update_err}")
            return {
                "status": "failed",
                "manual_id": manual_id_str,
                "error": str(e)
            }
