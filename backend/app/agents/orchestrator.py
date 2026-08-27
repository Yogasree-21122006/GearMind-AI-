import time
import logging
from typing import Dict, Any, List, Optional
from uuid import UUID, uuid4
from backend.app.agents.tools import ControlledAgentTools
from backend.app.agents.schemas import AgentTrace, AgentTraceStep, AgentOrchestrationResponse
from backend.app.ai.context_builder import DiagnosticContextBuilder
from backend.app.ai.diagnostic_service import AIDiagnosticService
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class DiagnosticAgentOrchestrator:
    """
    Controlled agentic orchestrator for multimodal field-service diagnostic reasoning.
    Executes an explicit read-only decision-support tool chain, records execution trace,
    enforces safety rules, and generates grounded diagnostic recommendations.
    """

    def __init__(self):
        self.tools = ControlledAgentTools()
        self.ai_diagnostic = AIDiagnosticService()

    def orchestrate_diagnostic(
        self,
        asset_id: UUID,
        question: str,
        error_code: Optional[str] = None,
        image_bytes: Optional[bytes] = None,
        image_mime: str = "image/jpeg",
        session_id: Optional[UUID] = None,
        asset_override: Optional[Dict[str, Any]] = None
    ) -> AgentOrchestrationResponse:
        """
        Executes controlled agentic decision graph with full step latency tracking.
        """
        t_start = time.time()
        sid = str(session_id or uuid4())
        trace_steps: List[AgentTraceStep] = []
        evidence_collected: List[str] = []

        # 1. Tool: Asset Context
        asset_tool_res = self.tools.get_asset_context(asset_id, asset_override=asset_override)
        asset_data = asset_tool_res.get("data") or {}
        trace_steps.append(
            AgentTraceStep(
                tool="asset_context",
                status=asset_tool_res["status"],
                latency_ms=asset_tool_res["latency_ms"],
                summary=f"Loaded specifications for {asset_data.get('name', 'Asset')} ({asset_data.get('asset_code', 'N/A')})"
            )
        )
        if asset_data:
            evidence_collected.append("Equipment Specifications")

        # 2. Tool: Vision Analysis (Conditional on image)
        vision_data = None
        detected_code = None
        if image_bytes:
            vision_tool_res = self.tools.analyze_equipment_image(
                image_bytes=image_bytes,
                mime_type=image_mime,
                question=question,
                equipment_meta=asset_data
            )
            vision_data = vision_tool_res.get("data")
            trace_steps.append(
                AgentTraceStep(
                    tool="vision",
                    status=vision_tool_res["status"],
                    latency_ms=vision_tool_res["latency_ms"],
                    summary=f"Extracted {len(vision_data.get('observations', []))} visual observations"
                )
            )
            evidence_collected.append("Equipment Image")
            if vision_data.get("detected_error_codes"):
                detected_code = vision_data["detected_error_codes"][0]

        # 3. Tool: Error Code Lookup (Conditional on error_code input or vision detection)
        target_code = error_code or detected_code
        error_code_data = {"status": "NO_MATCH"}
        if target_code:
            ec_res = self.tools.lookup_error_code(
                error_code=target_code,
                manufacturer=asset_data.get("manufacturer"),
                equipment_type=asset_data.get("equipment_type")
            )
            error_code_data = ec_res.get("data") or {"status": "NO_MATCH"}
            trace_steps.append(
                AgentTraceStep(
                    tool="error_code_lookup",
                    status=ec_res["status"],
                    latency_ms=ec_res["latency_ms"],
                    summary=f"Code '{target_code}' status: {error_code_data.get('status')}"
                )
            )
            if error_code_data.get("status") == "MATCHED":
                evidence_collected.append("Standard Fault Code")

        # 4. Tool: Maintenance History
        maint_res = self.tools.get_maintenance_history(asset_id=asset_id, limit=5)
        maint_records = maint_res.get("data") or []
        trace_steps.append(
            AgentTraceStep(
                tool="maintenance_history",
                status=maint_res["status"],
                latency_ms=maint_res["latency_ms"],
                summary=f"Retrieved {len(maint_records)} previous work order logs"
            )
        )
        if maint_records:
            evidence_collected.append("Maintenance History")

        # 5. Tool: RAG Technical Manual Retrieval
        rag_query = f"{question} {asset_data.get('equipment_type', '')} {asset_data.get('model', '')} {target_code or ''}".strip()
        rag_res = self.tools.search_equipment_manual(
            query=rag_query,
            top_k=settings.DEFAULT_TOP_K,
            similarity_threshold=settings.SIMILARITY_THRESHOLD
        )
        rag_chunks = rag_res.get("data") or []
        trace_steps.append(
            AgentTraceStep(
                tool="rag",
                status=rag_res["status"],
                latency_ms=rag_res["latency_ms"],
                summary=f"Retrieved {len(rag_chunks)} technical manual chunks"
            )
        )
        if rag_chunks:
            evidence_collected.append("OEM Technical Manuals")

        # 6. Assemble Multi-Source Evidence Context
        context = DiagnosticContextBuilder.build_context(
            user_question=question,
            asset=asset_data,
            vision_analysis=vision_data,
            error_code_info=error_code_data,
            rag_chunks=rag_chunks,
            maintenance_history=maint_records
        )

        # 7. LLM Grounded Diagnostic Reasoning & Safety Validation
        t_llm = time.time()
        diagnostic_output = self.ai_diagnostic.run_diagnostic_reasoning(context)
        llm_latency = int((time.time() - t_llm) * 1000)
        trace_steps.append(
            AgentTraceStep(
                tool="diagnostic_llm",
                status="completed",
                latency_ms=llm_latency,
                summary=f"Generated diagnosis with {diagnostic_output.confidence * 100:.1f}% confidence and {len(diagnostic_output.citations)} citations"
            )
        )

        total_latency = int((time.time() - t_start) * 1000)
        trace = AgentTrace(
            session_id=sid,
            steps=trace_steps,
            total_latency_ms=total_latency,
            evidence_collected=evidence_collected
        )

        # Safety Check Enforcement: Ensure at least one LOTO / Safety guideline is present
        safety_validated = bool(diagnostic_output.safety_warnings and len(diagnostic_output.safety_warnings) > 0)

        logger.info(f"[Agent Orchestrator] Session {sid} finished in {total_latency}ms across {len(trace_steps)} tool steps.")

        return AgentOrchestrationResponse(
            session_id=sid,
            status="completed",
            diagnostic_result=diagnostic_output,
            trace=trace,
            safety_validated=safety_validated
        )
