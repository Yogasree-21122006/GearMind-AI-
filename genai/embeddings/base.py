from abc import ABC, abstractmethod
from typing import List

class BaseEmbeddingProvider(ABC):
    """Abstract interface for text embedding generation."""

    @abstractmethod
    async def embed_text(self, text: str) -> List[float]:
        """Generate vector embedding for a single text chunk."""
        pass

    @abstractmethod
    async def embed_documents(self, documents: List[str]) -> List[List[float]]:
        """Generate embeddings for a batch of documents."""
        pass
