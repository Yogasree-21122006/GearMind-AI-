import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.evaluation.metrics_engine import DiagnosticEvaluationEngine

client = TestClient(app)

def test_evaluation_dataset_loading():
    engine = DiagnosticEvaluationEngine()
    cases = engine.load_dataset()
    assert len(cases) >= 20
    assert any(c["category"] == "known_error_code" for c in cases)
    assert any(c["category"] == "safety_critical_query" for c in cases)
    assert any(c["category"] == "manual_not_covered_question" for c in cases)

def test_evaluation_metrics_computation():
    engine = DiagnosticEvaluationEngine()
    results = engine.run_full_evaluation()
    
    summary = results["summary"]
    assert summary["total_test_cases"] >= 20
    assert "retrieval" in summary
    assert "precision_at_3" in summary["retrieval"]
    assert "recall_at_3" in summary["retrieval"]
    assert summary["safety"]["safety_pass_rate_pct"] == 100.0
    assert summary["grounding"]["grounded_answer_rate_pct"] > 80.0
    assert summary["hallucination"]["hallucination_rate_pct"] <= 20.0
    assert summary["business_kpi"]["reduction_pct"] > 90.0

def test_evaluation_api_endpoints():
    # 1. Test GET /api/v1/evaluation/summary
    res_sum = client.get("/api/v1/evaluation/summary")
    assert res_sum.status_code == 200
    data_sum = res_sum.json()
    assert "total_test_cases" in data_sum
    assert "business_kpi" in data_sum

    # 2. Test GET /api/v1/evaluation/results
    res_full = client.get("/api/v1/evaluation/results")
    assert res_full.status_code == 200
    data_full = res_full.json()
    assert "summary" in data_full
    assert "case_results" in data_full
    assert len(data_full["case_results"]) >= 20

    # 3. Test POST /api/v1/evaluation/run
    res_run = client.post("/api/v1/evaluation/run")
    assert res_run.status_code == 200
    data_run = res_run.json()
    assert data_run["status"] == "completed"
