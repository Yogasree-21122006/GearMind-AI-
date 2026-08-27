import re
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from backend.app.core.config import settings
from backend.app.services.document_processor import DocumentContent

logger = logging.getLogger(__name__)

@dataclass
class DocumentChunkItem:
    """Represents a generated semantic chunk ready for vectorization and insertion."""
    chunk_index: int
    content: str
    page_number: int
    metadata: Dict[str, Any]

class DocumentChunker:
    """
    Semantic-aware document chunker that splits text on paragraph/sentence boundaries
    while preserving page numbers, section metadata, and configurable token overlap.
    """

    def __init__(
        self,
        chunk_size: Optional[int] = None,
        chunk_overlap: Optional[int] = None
    ):
        self.chunk_size = chunk_size or settings.CHUNK_SIZE
        self.chunk_overlap = chunk_overlap or settings.CHUNK_OVERLAP

    @staticmethod
    def _estimate_tokens(text: str) -> int:
        """Approximates token count (approx. 1 token per 4 characters / whitespace words)."""
        if not text:
            return 0
        return max(len(text.split()), int(len(text) / 4))

    def _split_into_semantic_segments(self, text: str) -> List[str]:
        """Splits page text into paragraphs, sentences, and sub-clauses without breaking mid-word."""
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        segments: List[str] = []
        
        for p in paragraphs:
            sentences = re.split(r"(?<=[.?!])\s+", p)
            for s in sentences:
                s_trimmed = s.strip()
                if not s_trimmed:
                    continue
                words = s_trimmed.split()
                if len(words) <= self.chunk_size:
                    segments.append(s_trimmed)
                else:
                    # Break long unbroken sentences into word slices
                    step = max(1, self.chunk_size - self.chunk_overlap)
                    for i in range(0, len(words), step):
                        slice_words = words[i:i + self.chunk_size]
                        if slice_words:
                            segments.append(" ".join(slice_words))
        return segments

    def chunk_document(
        self,
        document: DocumentContent,
        manual_id: str
    ) -> List[DocumentChunkItem]:
        """
        Processes all pages in DocumentContent, producing structured chunks with preserved
        page numbering and unified metadata.
        """
        chunks: List[DocumentChunkItem] = []
        global_chunk_index = 0

        for page in document.pages:
            if not page.text or not page.text.strip():
                continue

            segments = self._split_into_semantic_segments(page.text)
            current_chunk_words: List[str] = []
            current_word_count = 0

            for segment in segments:
                segment_words = segment.split()
                segment_len = len(segment_words)

                if current_word_count + segment_len > self.chunk_size and current_chunk_words:
                    # Finalize current chunk
                    chunk_text = " ".join(current_chunk_words).strip()
                    if chunk_text:
                        chunk_metadata = {
                            "manual_id": str(manual_id),
                            "page_number": page.page_number,
                            "document_title": document.title,
                            "equipment_type": document.metadata.get("equipment_type", ""),
                            "manufacturer": document.metadata.get("manufacturer", ""),
                            "model": document.metadata.get("model", ""),
                            "document_type": document.metadata.get("document_type", "oem_manual"),
                            "chunk_index": global_chunk_index
                        }
                        chunks.append(
                            DocumentChunkItem(
                                chunk_index=global_chunk_index,
                                content=chunk_text,
                                page_number=page.page_number,
                                metadata=chunk_metadata
                            )
                        )
                        global_chunk_index += 1

                    # Build overlap window from end of current chunk
                    overlap_words = current_chunk_words[-self.chunk_overlap:] if len(current_chunk_words) > self.chunk_overlap else []
                    current_chunk_words = list(overlap_words)
                    current_word_count = len(current_chunk_words)

                current_chunk_words.extend(segment_words)
                current_word_count += segment_len

            # Flush remaining words on this page
            if current_chunk_words:
                chunk_text = " ".join(current_chunk_words).strip()
                if chunk_text:
                    chunk_metadata = {
                        "manual_id": str(manual_id),
                        "page_number": page.page_number,
                        "document_title": document.title,
                        "equipment_type": document.metadata.get("equipment_type", ""),
                        "manufacturer": document.metadata.get("manufacturer", ""),
                        "model": document.metadata.get("model", ""),
                        "document_type": document.metadata.get("document_type", "oem_manual"),
                        "chunk_index": global_chunk_index
                    }
                    chunks.append(
                        DocumentChunkItem(
                            chunk_index=global_chunk_index,
                            content=chunk_text,
                            page_number=page.page_number,
                            metadata=chunk_metadata
                        )
                    )
                    global_chunk_index += 1

        logger.info(f"Chunked document '{document.title}' ({document.total_pages} pages) into {len(chunks)} chunks.")
        return chunks
