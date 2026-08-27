from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class BaseRAGPipeline(ABC):
    """Interface for document chunking, indexing, and dense retrieval."""

    @abstractmethod
    async def process_document(self, file_path: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse document, split into semantic chunks, and generate chunk metadata."""
        pass

    @abstractmethod
    async def retrieve_relevant_chunks(
        self,
        query: str,
        asset_id: Optional[str] = None,
        top_k: int = 5,
        threshold: float = 0.65
    ) -> List[Dict[str, Any]]:
        """Retrieve most relevant document chunks via vector similarity search."""
        pass
