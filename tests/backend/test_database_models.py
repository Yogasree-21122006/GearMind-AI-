import uuid
from datetime import datetime, date
import pytest
from backend.app.schemas.asset import AssetCreate, AssetResponse
from backend.app.schemas.manual import ManualCreate, ManualResponse
from backend.app.schemas.error_code import ErrorCodeCreate, ErrorCodeResponse
from backend.app.schemas.diagnostic import DiagnosticSessionCreate, DiagnosticResultCreate
from backend.app.schemas.feedback import TechnicianFeedbackCreate

def test_asset_schema_validation():
    asset_in = AssetCreate(
        asset_code="HVAC-UNIT-01",
        name="Industrial Chiller System",
        equipment_type="Chiller",
        manufacturer="Trane",
        model="RTWD-150",
        serial_number="SN-1029384",
        location="Facility Plant 1, Room 102",
        operational_status="operational",
        installation_date=date(2025, 1, 15)
    )
    assert asset_in.asset_code == "HVAC-UNIT-01"
    assert asset_in.equipment_type == "Chiller"

def test_error_code_schema_validation():
    ec_in = ErrorCodeCreate(
        equipment_type="Chiller",
        manufacturer="Trane",
        code="E-241",
        title="High Discharge Pressure Warning",
        description="Condenser head pressure exceeds 385 PSIG.",
        possible_causes=["Dirty condenser coils", "Low water flow"],
        recommended_checks=["Inspect water pump", "Clean condenser fins"],
        safety_warnings=["Do not bypass high pressure switch under load"],
        severity="critical"
    )
    assert ec_in.code == "E-241"
    assert len(ec_in.safety_warnings) == 1

def test_diagnostic_and_feedback_schemas():
    session_id = uuid.uuid4()
    diag_res = DiagnosticResultCreate(
        diagnostic_session_id=session_id,
        issue_summary="High discharge pressure cutoff triggered",
        identified_error_code="E-241",
        confidence=0.92,
        probable_causes=[{"cause": "Fouled heat exchanger"}],
        recommended_steps=[{"step": 1, "action": "De-energize main panel and inspect water strainer"}],
        required_tools=["Digital Manifold", "Multi-meter"],
        safety_warnings=["Lockout/Tagout main 480V breaker"],
        citations=[{"document_title": "OEM Manual", "page_number": 84}]
    )
    assert diag_res.identified_error_code == "E-241"
    assert diag_res.confidence == 0.92

    feedback = TechnicianFeedbackCreate(
        diagnostic_session_id=session_id,
        rating=5,
        feedback_text="Troubleshooting steps verified on physical unit.",
        was_helpful=True,
        actual_root_cause="Strainer clogged with sediment."
    )
    assert feedback.rating == 5
    assert feedback.was_helpful is True
