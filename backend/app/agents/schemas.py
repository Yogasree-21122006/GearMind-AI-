from typing import List, Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from backend.app.ai.schemas import DiagnosticOutputSchema

class AgentTraceStep(BaseModel):
    tool: str = Field(..., description="Tool name: vision, error_code_lookup, rag, maintenance_history, asset_context")
    status: str = Field(..., description="completed, skipped, failed")
    latency_ms: int = Field(default=0, ge=0)
    summary: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AgentTrace(BaseModel):
    session_id: str
    steps: List[AgentTraceStep] = Field(default_factory=list)
    total_latency_ms: int = 0
    evidence_collected: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class AgentOrchestrationResponse(BaseModel):
    session_id: str
    status: str = "completed"
    diagnostic_result: DiagnosticOutputSchema
    trace: AgentTrace
    safety_validated: bool = True

    model_config = ConfigDict(from_attributes=True)
