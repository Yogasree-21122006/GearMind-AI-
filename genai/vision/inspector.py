from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseVisionInspector(ABC):
    """Abstract interface for multimodal equipment visual inspection."""

    @abstractmethod
    async def inspect_image(self, image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
        """Perform multimodal inspection to detect component tags, anomalies, and safety hazards."""
        pass
