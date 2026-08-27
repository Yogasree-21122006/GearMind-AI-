import io
import uuid
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "degraded"]
    assert "services" in data
    assert "version" in data

@patch("backend.app.repositories.asset_repo.AssetRepository.get_by_code", return_value=None)
@patch("backend.app.repositories.asset_repo.AssetRepository.create")
def test_create_asset(mock_create, mock_get_by_code):
    mock_create.return_value = {
        "id": str(uuid.uuid4()),
        "asset_code": "CHILLER-TEST-01",
        "name": "Centrifugal Chiller",
        "equipment_type": "Chiller",
        "manufacturer": "Trane",
        "model": "RTWD-150",
        "serial_number": "SN-998811",
        "location": "Plant 1",
        "operational_status": "operational",
        "created_at": "2026-08-26T12:00:00Z",
        "updated_at": "2026-08-26T12:00:00Z"
    }

    payload = {
        "asset_code": "CHILLER-TEST-01",
        "name": "Centrifugal Chiller",
        "equipment_type": "Chiller",
        "manufacturer": "Trane",
        "model": "RTWD-150",
        "serial_number": "SN-998811",
        "location": "Plant 1",
        "operational_status": "operational"
    }
    response = client.post("/api/v1/assets", json=payload)
    assert response.status_code == 201
    assert response.json()["asset_code"] == "CHILLER-TEST-01"

@patch("backend.app.repositories.asset_repo.AssetRepository.get_all")
def test_list_assets(mock_get_all):
    mock_get_all.return_value = [
        {
            "id": str(uuid.uuid4()),
            "asset_code": "PUMP-01",
            "name": "Booster Pump",
            "equipment_type": "Pump",
            "manufacturer": "Grundfos",
            "model": "CR-64",
            "serial_number": "SN-112233",
            "location": "Plant 2",
            "operational_status": "operational",
            "created_at": "2026-08-26T12:00:00Z",
            "updated_at": "2026-08-26T12:00:00Z"
        }
    ]
    response = client.get("/api/v1/assets?equipment_type=Pump")
    assert response.status_code == 200
    assert len(response.json()) == 1

@patch("backend.app.repositories.asset_repo.AssetRepository.get_by_id")
@patch("backend.app.repositories.asset_repo.AssetRepository.update")
def test_update_asset(mock_update, mock_get_by_id):
    asset_id = uuid.uuid4()
    mock_get_by_id.return_value = {
        "id": str(asset_id),
        "asset_code": "PUMP-01",
        "name": "Booster Pump",
        "equipment_type": "Pump",
        "manufacturer": "Grundfos",
        "model": "CR-64",
        "serial_number": "SN-112233",
        "location": "Plant 2",
        "operational_status": "operational",
        "created_at": "2026-08-26T12:00:00Z",
        "updated_at": "2026-08-26T12:00:00Z"
    }
    mock_update.return_value = {
        "id": str(asset_id),
        "asset_code": "PUMP-01",
        "name": "Booster Pump Updated",
        "equipment_type": "Pump",
        "manufacturer": "Grundfos",
        "model": "CR-64",
        "serial_number": "SN-112233",
        "location": "Plant 2",
        "operational_status": "degraded",
        "created_at": "2026-08-26T12:00:00Z",
        "updated_at": "2026-08-26T12:05:00Z"
    }

    response = client.put(f"/api/v1/assets/{asset_id}", json={"operational_status": "degraded", "name": "Booster Pump Updated"})
    assert response.status_code == 200
    assert response.json()["operational_status"] == "degraded"

def test_manual_upload_invalid_mime():
    fake_file = io.BytesIO(b"executable content")
    response = client.post(
        "/api/v1/manuals/upload",
        files={"file": ("malicious.exe", fake_file, "application/x-msdownload")},
        data={"title": "Test", "manufacturer": "OEM", "equipment_type": "Pump"}
    )
    assert response.status_code == 400
    assert "Invalid document type" in response.json()["detail"]

@patch("backend.app.repositories.error_code_repo.ErrorCodeRepository.get_all")
def test_list_error_codes(mock_get_all):
    mock_get_all.return_value = [
        {
            "id": str(uuid.uuid4()),
            "equipment_type": "Chiller",
            "manufacturer": "Trane",
            "code": "E-241",
            "title": "High Discharge Pressure",
            "description": "Head pressure high",
            "possible_causes": ["Coil fouling"],
            "recommended_checks": ["Clean coils"],
            "safety_warnings": ["LOTO main breaker"],
            "severity": "critical",
            "created_at": "2026-08-26T12:00:00Z",
            "updated_at": "2026-08-26T12:00:00Z"
        }
    ]
    response = client.get("/api/v1/error-codes?code_query=E-241")
    assert response.status_code == 200
    assert len(response.json()) == 1

@patch("backend.app.repositories.asset_repo.AssetRepository.get_by_id")
@patch("backend.app.repositories.maintenance_repo.MaintenanceRepository.create")
def test_create_maintenance_record(mock_create_maint, mock_get_asset):
    asset_id = uuid.uuid4()
    mock_get_asset.return_value = {"id": str(asset_id), "name": "Test Asset"}
    mock_create_maint.return_value = {
        "id": str(uuid.uuid4()),
        "asset_id": str(asset_id),
        "maintenance_type": "preventive",
        "issue_description": "Routine quarterly inspection",
        "diagnosis": "All nominal",
        "action_taken": "Replaced filter and greased bearings",
        "parts_replaced": [],
        "downtime_minutes": 25,
        "created_at": "2026-08-26T12:00:00Z"
    }

    payload = {
        "maintenance_type": "preventive",
        "issue_description": "Routine quarterly inspection",
        "diagnosis": "All nominal",
        "action_taken": "Replaced filter and greased bearings",
        "downtime_minutes": 25
    }
    response = client.post(f"/api/v1/assets/{asset_id}/maintenance", json=payload)
    assert response.status_code == 201
    assert response.json()["downtime_minutes"] == 25

@patch("backend.app.repositories.diagnostic_repo.DiagnosticRepository.create_session")
def test_create_diagnostic_session(mock_create_session):
    session_id = uuid.uuid4()
    mock_create_session.return_value = {
        "id": str(session_id),
        "user_question": "Why is the chiller vibrating abnormally?",
        "status": "pending",
        "created_at": "2026-08-26T12:00:00Z"
    }

    payload = {
        "user_question": "Why is the chiller vibrating abnormally?",
        "status": "pending"
    }
    response = client.post("/api/v1/diagnostics/sessions", json=payload)
    assert response.status_code == 201
    assert response.json()["status"] == "pending"

@patch("backend.app.repositories.feedback_repo.FeedbackRepository.create")
def test_create_feedback(mock_create_feedback):
    session_id = uuid.uuid4()
    mock_create_feedback.return_value = {
        "id": str(uuid.uuid4()),
        "diagnostic_session_id": str(session_id),
        "rating": 5,
        "feedback_text": "Troubleshooting sequence was 100% accurate.",
        "was_helpful": True,
        "actual_root_cause": "Fouled condenser fins",
        "created_at": "2026-08-26T12:00:00Z"
    }

    payload = {
        "diagnostic_session_id": str(session_id),
        "rating": 5,
        "feedback_text": "Troubleshooting sequence was 100% accurate.",
        "was_helpful": True,
        "actual_root_cause": "Fouled condenser fins"
    }
    response = client.post("/api/v1/feedback", json=payload)
    assert response.status_code == 201
    assert response.json()["rating"] == 5

@patch("backend.app.repositories.analytics_repo.AnalyticsRepository.get_overview_metrics")
def test_analytics_overview(mock_overview):
    mock_overview.return_value = {
        "total_assets": 12,
        "active_assets": 10,
        "total_maintenance_records": 45,
        "total_diagnostic_sessions": 18,
        "completed_diagnostics": 15,
        "failed_diagnostics": 0,
        "total_manuals": 8,
        "feedback_count": 14,
        "average_feedback_rating": 4.8,
        "system_status": "operational"
    }
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_assets"] == 12
    assert data["average_feedback_rating"] == 4.8
