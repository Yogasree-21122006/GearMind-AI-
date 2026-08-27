import io
import uuid
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.vision.vision_service import VisionService
from backend.app.services.error_code_lookup import ErrorCodeLookupService
from backend.app.services.maintenance_context import MaintenanceContextService
from backend.app.ai.context_builder import DiagnosticContextBuilder
from backend.app.ai.diagnostic_service import AIDiagnosticService
from backend.app.ai.schemas import DiagnosticOutputSchema

client = TestClient(app)

def test_vision_analysis_fallback_and_schema():
    vision = VisionService()
    result = vision.analyze_equipment_image(
        image_bytes=b"fake-image-bytes",
        mime_type="image/jpeg",
        question="Why is fault code E-241 appearing?",
        equipment_meta={"equipment_type": "Chiller", "manufacturer": "Trane", "model": "RTWD-150"}
    )
    assert result.confidence > 0.0
    assert len(result.observations) > 0
    assert "E-241" in result.detected_error_codes

@patch("backend.app.services.error_code_lookup.get_supabase_client")
def test_error_code_lookup_match(mock_get_supabase):
    mock_supabase = MagicMock()
    mock_get_supabase.return_value = mock_supabase

    mock_query = MagicMock()
    mock_supabase.table.return_value.select.return_value = mock_query
    mock_query.ilike.return_value = mock_query
    mock_query.execute.return_value.data = [{
        "id": str(uuid.uuid4()),
        "code": "E-241",
        "title": "High Discharge Pressure Cutoff",
        "description": "Condenser pressure exceeded 385 PSIG.",
        "possible_causes": ["Dirty condenser tubes", "Water flow failure"],
        "recommended_checks": ["Inspect condenser water pump", "Clean tube bundle"],
        "safety_warnings": ["Do not bypass high pressure safety switch"],
        "severity": "critical",
        "equipment_type": "Chiller",
        "manufacturer": "Trane"
    }]

    service = ErrorCodeLookupService()
    match = service.lookup_error_code("E-241", equipment_type="Chiller", manufacturer="Trane")
    assert match["status"] == "MATCHED"
    assert match["code"] == "E-241"
    assert len(match["possible_causes"]) == 2

@patch("backend.app.services.error_code_lookup.get_supabase_client")
def test_error_code_lookup_no_match(mock_get_supabase):
    mock_supabase = MagicMock()
    mock_get_supabase.return_value = mock_supabase

    mock_query = MagicMock()
    mock_supabase.table.return_value.select.return_value = mock_query
    mock_query.ilike.return_value = mock_query
    mock_query.execute.return_value.data = []

    service = ErrorCodeLookupService()
    no_match = service.lookup_error_code("UNKNOWN-999")
    assert no_match["status"] == "NO_MATCH"
    assert "not documented" in no_match["message"]

def test_diagnostic_context_builder():
    context = DiagnosticContextBuilder.build_context(
        user_question="Compressor trips on high pressure",
        asset={"id": str(uuid.uuid4()), "asset_code": "CH-01", "name": "Chiller 1", "equipment_type": "Chiller"},
        vision_analysis={"observations": [{"observation": "Amber light active"}], "detected_error_codes": ["E-241"]},
        error_code_info={"status": "MATCHED", "code": "E-241", "title": "High Pressure"},
        rag_chunks=[{"manual_title": "OEM Manual", "page_number": 12, "content": "Clean strainer."}],
        maintenance_history=[{"action_taken": "Replaced filter"}]
    )
    assert context["user_question"] == "Compressor trips on high pressure"
    assert context["asset"]["asset_code"] == "CH-01"
    assert len(context["rag_chunks"]) == 1
    assert len(context["maintenance_history"]) == 1

def test_llm_grounded_fallback_and_citations():
    ai_service = AIDiagnosticService()
    context = {
        "user_question": "Why is the discharge pressure high?",
        "asset": {"name": "Centrifugal Chiller", "asset_code": "HVAC-CHILLER-01", "equipment_type": "Chiller"},
        "error_code_info": {
            "status": "MATCHED",
            "code": "E-241",
            "title": "High Discharge Pressure Cutoff",
            "possible_causes": ["Clogged heat exchanger fins"],
            "recommended_checks": ["Inspect water strainer"],
            "safety_warnings": ["LOTO 480V Main Breaker"]
        },
        "rag_chunks": [
            {"manual_title": "Trane RTWD Manual", "page_number": 84, "similarity": 0.89, "content": "Strainer must be cleaned quarterly."}
        ],
        "vision_analysis": {"observations": [{"observation": "Pressure gauge at 390 PSIG"}]}
    }

    result = ai_service.run_diagnostic_reasoning(context)
    assert isinstance(result, DiagnosticOutputSchema)
    assert result.confidence >= 0.65
    assert len(result.citations) == 1
    assert result.citations[0].document_title == "Trane RTWD Manual"
    assert result.citations[0].page_number == 84
    assert len(result.troubleshooting_steps) > 0
    assert any("LOTO" in w for w in result.safety_warnings)

def test_low_confidence_and_no_evidence_handling():
    ai_service = AIDiagnosticService()
    context = {
        "user_question": "Strange intermittent clicking sound inside unbranded panel",
        "asset": {"name": "Unbranded Motor", "asset_code": "M-99"},
        "error_code_info": {"status": "NO_MATCH"},
        "rag_chunks": [],
        "vision_analysis": {}
    }

    result = ai_service.run_diagnostic_reasoning(context)
    assert result.confidence < 0.65
    assert len(result.limitations) > 0
    assert any("Insufficient" in lim or "Low confidence" in lim for lim in result.limitations)

@patch("backend.app.services.asset_service.AssetService.get_asset")
@patch("backend.app.services.diagnostic_service.DiagnosticService.create_session")
@patch("backend.app.rag.retrieval_service.RetrievalService.search_similar_chunks")
@patch("backend.app.services.error_code_lookup.ErrorCodeLookupService.lookup_error_code")
def test_diagnostic_analyze_api_pipeline(mock_err_lookup, mock_rag_search, mock_create_sess, mock_get_asset):
    asset_id = uuid.uuid4()
    session_id = uuid.uuid4()

    mock_get_asset.return_value = {
        "id": str(asset_id),
        "name": "Water Chiller",
        "asset_code": "CH-102",
        "equipment_type": "Chiller",
        "manufacturer": "Trane",
        "model": "RTWD-150"
    }

    mock_create_sess.return_value = {
        "id": str(session_id),
        "status": "processing"
    }

    mock_err_lookup.return_value = {
        "status": "MATCHED",
        "code": "E-241",
        "title": "High Head Pressure",
        "possible_causes": ["Fouled condenser tubes"],
        "recommended_checks": ["Flush condenser tubes"],
        "safety_warnings": ["LOTO Breaker"]
    }

    mock_rag_search.return_value = [
        {
            "manual_id": str(uuid.uuid4()),
            "manual_title": "OEM Chiller SOP",
            "page_number": 55,
            "similarity": 0.87,
            "content": "Flush condenser with sulfamic acid solution."
        }
    ]

    response = client.post(
        "/api/v1/diagnostics/analyze",
        data={
            "asset_id": str(asset_id),
            "question": "Compressor tripped on high discharge pressure",
            "error_code": "E-241"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["diagnostic_result"]["confidence"] >= 0.65
    assert len(data["diagnostic_result"]["citations"]) == 1
    assert data["diagnostic_result"]["citations"][0]["page_number"] == 55
