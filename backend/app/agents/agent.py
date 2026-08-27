from backend.app.agents.orchestrator import DiagnosticAgentOrchestrator
from backend.app.agents.tools import ControlledAgentTools
from backend.app.agents.schemas import (
    AgentTrace,
    AgentTraceStep,
    AgentOrchestrationResponse
)

class DiagnosticAgent:
    """Convenience wrapper for invoking the controlled diagnostic agent."""
    def __init__(self):
        self.orchestrator = DiagnosticAgentOrchestrator()

    def run(self, **kwargs) -> AgentOrchestrationResponse:
        return self.orchestrator.orchestrate_diagnostic(**kwargs)

__all__ = [
    "DiagnosticAgent",
    "DiagnosticAgentOrchestrator",
    "ControlledAgentTools",
    "AgentTrace",
    "AgentTraceStep",
    "AgentOrchestrationResponse"
]
