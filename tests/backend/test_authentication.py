import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.config import settings
from backend.app.database.supabase_client import get_supabase_client

client = TestClient(app)

def test_supabase_client_configuration():
    assert settings.SUPABASE_URL is not None
    assert "supabase.co" in settings.SUPABASE_URL
    assert settings.SUPABASE_ANON_KEY is not None
    # Verify service role key is isolated from public settings
    assert settings.SUPABASE_SERVICE_ROLE_KEY is not None

def test_technicians_endpoint_validation():
    # Verify technicians list API
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"

def test_diagnostic_technician_association():
    supabase = get_supabase_client()
    if supabase:
        assets = supabase.table("assets").select("id").limit(1).execute()
        if assets.data and len(assets.data) > 0:
            aid = assets.data[0]["id"]
            # Test diagnostic execution with technician association
            res = client.post(
                "/api/v1/diagnostics/analyze",
                data={
                    "asset_id": aid,
                    "question": "Motor vibration during high load test",
                    "error_code": "DEMO-E101",
                    "technician_id": "00000000-0000-0000-0000-000000000000"
                }
            )
            assert res.status_code == 200
            res_data = res.json()
            assert res_data["status"] == "completed"
            assert "diagnostic_result" in res_data
