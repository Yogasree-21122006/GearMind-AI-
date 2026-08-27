from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseDiagnosticEvaluator(ABC):
    """Abstract interface for RAG faithfulness, groundedness, and safety evaluation."""

    @abstractmethod
    async def evaluate_groundedness(
        self,
        hypothesis: str,
        steps: List[Dict[str, Any]],
        context_chunks: List[str]
    ) -> float:
        """Compute groundedness score (0.0 to 1.0) indicating factual alignment with manual chunks."""
        pass

    @abstractmethod
    async def evaluate_safety_compliance(
        self,
        steps: List[Dict[str, Any]],
        precautions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Verify presence of PPE, power isolation, and safety warnings."""
        pass
