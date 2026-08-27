import logging
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from backend.app.evaluation.metrics_engine import DiagnosticEvaluationEngine

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/evaluation", tags=["AI Evaluation & Benchmark Quality Gate"])

@router.post(
    "/run",
    summary="Run AI Benchmark Evaluation",
    description="Executes the 20-case academic evaluation dataset across RAG, Vision, Error Codes, Grounding, Hallucination, Safety, and Latency."
)
def trigger_evaluation():
    try:
        engine = DiagnosticEvaluationEngine()
        results = engine.run_full_evaluation()
        return {
            "status": "completed",
            "message": f"Successfully evaluated {results['summary']['total_test_cases']} benchmark cases.",
            "metrics": results["summary"]
        }
    except Exception as e:
        logger.error(f"Evaluation run failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Evaluation failed: {str(e)}"
        )

@router.get(
    "/results",
    summary="Get Full Evaluation Results & Case Breakdown",
    description="Retrieve the complete metric summary along with individual test case outputs."
)
def get_evaluation_results() -> Dict[str, Any]:
    try:
        return DiagnosticEvaluationEngine.get_latest_results()
    except Exception as e:
        logger.error(f"Failed to fetch evaluation results: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get(
    "/summary",
    summary="Get Evaluation Metrics Summary",
    description="Retrieve high-level quantitative benchmarks: Precision@K, Recall@K, Grounding, Hallucination, Safety Pass Rate, and Business KPI."
)
def get_evaluation_summary() -> Dict[str, Any]:
    try:
        results = DiagnosticEvaluationEngine.get_latest_results()
        return results.get("summary", {})
    except Exception as e:
        logger.error(f"Failed to fetch evaluation summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))
