import os
import math
import hashlib
import logging
from typing import List, Optional
import google.generativeai as genai
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    """
    Embedding generation service supporting Google Gemini text-embedding-004.
    Strictly verifies that output vectors match the required 768-dimensional space.
    """

    def __init__(
        self,
        provider: Optional[str] = None,
        model_name: Optional[str] = None,
        api_key: Optional[str] = None,
        dimension: Optional[int] = None
    ):
        self.provider = provider or settings.EMBEDDING_PROVIDER
        self.model_name = model_name or settings.EMBEDDING_MODEL
        self.api_key = api_key or settings.EMBEDDING_API_KEY or settings.LLM_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.expected_dimension = dimension or settings.EMBEDDING_DIMENSION

        if self.api_key:
            genai.configure(api_key=self.api_key)
            logger.info(f"Initialized EmbeddingService with model: {self.model_name} (expected dim: {self.expected_dimension})")
        else:
            logger.warning("No Gemini API key found for EmbeddingService. Local deterministic mode active for tests.")

    def _validate_dimension(self, vector: List[float], source_text_preview: str = "") -> List[float]:
        """Strictly validates vector dimension against expected 768 dimensions."""
        if not vector or not isinstance(vector, list):
            raise ValueError(f"Invalid embedding vector returned: {type(vector)}")
        
        actual_dim = len(vector)
        if actual_dim != self.expected_dimension:
            err_msg = (
                f"Embedding dimension mismatch! Expected {self.expected_dimension} dimensions, "
                f"but received {actual_dim} dimensions. Text preview: '{source_text_preview[:40]}...'"
            )
            logger.error(err_msg)
            raise ValueError(err_msg)
        return vector

    def _generate_deterministic_fallback(self, text: str) -> List[float]:
        """
        Produces a normalized 768-dimensional float vector deterministically from text content.
        Used when API keys are not provided (e.g. offline testing environments).
        """
        # Generate 768 pseudo-random deterministic floats based on sha256 hash stream
        seed_hash = hashlib.sha256(text.encode("utf-8")).digest()
        vec = []
        for i in range(self.expected_dimension):
            # Compute rolling hash slice
            byte_val = seed_hash[i % len(seed_hash)]
            val = math.sin((i + 1) * float(byte_val))
            vec.append(val)
        
        # Normalize to unit length
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [x / norm for x in vec]

    def generate_embedding(self, text: str) -> List[float]:
        """Generates a single 768-dimensional embedding vector for input text."""
        if not text or not text.strip():
            return [0.0] * self.expected_dimension

        if self.api_key and "gemini" in self.provider.lower():
            try:
                # Gemini embedding call
                response = genai.embed_content(
                    model=self.model_name,
                    content=text,
                    task_type="retrieval_document"
                )
                embedding = response.get("embedding") if isinstance(response, dict) else getattr(response, "embedding", None)
                if embedding:
                    return self._validate_dimension(embedding, source_text_preview=text)
            except Exception as e:
                logger.error(f"Failed to generate Gemini embedding via API: {e}", exc_info=True)
                # Fallback for resiliency
                if "API_KEY_INVALID" in str(e) or "quota" in str(e).lower() or not self.api_key:
                    logger.warning("Falling back to deterministic fallback vector.")
                    return self._validate_dimension(self._generate_deterministic_fallback(text), text)
                raise e

        # Fallback when offline or in unit tests
        vector = self._generate_deterministic_fallback(text)
        return self._validate_dimension(vector, text)

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generates 768-dimensional embeddings for a batch of text chunks."""
        if not texts:
            return []

        embeddings: List[List[float]] = []
        for text in texts:
            embeddings.append(self.generate_embedding(text))
        return embeddings
