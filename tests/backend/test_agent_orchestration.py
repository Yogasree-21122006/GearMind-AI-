import uuid
import pytest
from unittest.mock import patch, MagicMock
from backend.app.agents.tools import ControlledAgentTools
from backend.app.agents.orchestrator import DiagnosticAgentOrchestrator
from backend.app.agents.schemas import AgentOrchestrationResponse

def test_controlled_tools_execution():
    tools = ControlledAgentTools()
    
    # Test error code tool
    ec_res = tools.lookup_error_code("DEMO-E241")
    assert ec_res["tool"] == "error_code_lookup"
    assert "latency_ms" in ec_res
    assert ec_res["status"] == "completed"

    # Test manual search tool
    rag_res = tools.search_equipment_manual("condenser flow", top_k=2)
    assert rag_res["tool"] == "rag"
    assert "latency_ms" in rag_res
    assert rag_res["status"] == "completed"

@patch("backend.app.services.asset_service.AssetService.get_asset")
@patch("backend.app.rag.retrieval_service.RetrievalService.search_similar_chunks")
@patch("backend.app.services.error_code_lookup.ErrorCodeLookupService.lookup_error_code")
def test_agent_orchestration_flow_and_trace(mock_err_lookup, mock_rag_search, mock_get_asset):
    asset_id = uuid.uuid4()
    mock_get_asset.return_value = {
        "id": str(asset_id),
        "name": "Chiller Unit A",
        "asset_code": "CH-100",
        "equipment_type": "Chiller",
        "manufacturer": "Demo HVAC"
    }
    mock_err_lookup.return_value = {
        "status": "MATCHED",
        "code": "DEMO-E241",
        "title": "High Head Pressure",
        "possible_causes": ["Fouled tubes"]
    }
    mock_rag_search.return_value = [
        {
            "manual_title": "Demo Chiller Manual",
            "page_number": 2,
            "similarity": 0.90,
            "content": "High pressure troubleshooting step."
        }
    ]

    orchestrator = DiagnosticAgentOrchestrator()
    response = orchestrator.orchestrate_diagnostic(
        asset_id=asset_id,
        question="Why did the compressor shut down with code DEMO-E241?",
        error_code="DEMO-E241",
        image_bytes=b"fake-image"
    )

    assert isinstance(response, AgentOrchestrationResponse)
    assert response.status == "completed"
    assert response.safety_validated is True
    assert response.trace.total_latency_ms >= 0
    assert len(response.trace.steps) >= 4
    
    tool_names = [s.tool for s in response.trace.steps]
    assert "asset_context" in tool_names
    assert "vision" in tool_names
    assert "error_code_lookup" in tool_names
    assert "rag" in tool_names
    assert "diagnostic_llm" in tool_names
