from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseTechnicianAgent(ABC):
    """Abstract interface for the field-service diagnostic reasoning agent."""

    @abstractmethod
    async def diagnose(
        self,
        asset_context: Dict[str, Any],
        query: str,
        error_code: Optional[str] = None,
        image_analysis: Optional[Dict[str, Any]] = None,
        retrieved_manuals: Optional[list] = None
    ) -> Dict[str, Any]:
        """Synthesize multimodal findings and retrieved manuals into a safe troubleshooting plan."""
        pass
