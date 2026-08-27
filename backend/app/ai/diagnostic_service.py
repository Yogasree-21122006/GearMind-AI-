import os
import json
import logging
from typing import Dict, Any, Optional
import google.generativeai as genai
from backend.app.core.config import settings
from backend.app.ai.schemas import DiagnosticOutputSchema, TroubleshootingStepItem, CauseItem, ErrorCodeDetail, DiagnosticCitationItem
from backend.app.ai.prompts.system_prompt import DIAGNOSTIC_SYSTEM_PROMPT
from backend.app.ai.prompts.diagnostic_prompt import build_diagnostic_prompt

logger = logging.getLogger(__name__)

class AIDiagnosticService:
    """
    Multimodal AI Diagnostic Reasoning Service.
    Synthesizes vision observations, RAG technical manual chunks, error codes, and maintenance history.
    Strictly validates JSON outputs against DiagnosticOutputSchema.
    """

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.LLM_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.model_name = model_name or settings.LLM_MODEL or "gemini-1.5-pro"
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            logger.info(f"AIDiagnosticService initialized with model: {self.model_name}")
        else:
            logger.warning("No Gemini API key found for AIDiagnosticService. Deterministic reasoning fallback enabled.")

    def run_diagnostic_reasoning(self, context: Dict[str, Any]) -> DiagnosticOutputSchema:
        """
        Executes multi-source AI reasoning with Pydantic schema validation and retry resilience.
        """
        prompt = build_diagnostic_prompt(context)
        rag_chunks = context.get("rag_chunks", [])
        error_info = context.get("error_code_info", {})
        has_evidence = bool(rag_chunks or (error_info and error_info.get("status") == "MATCHED"))

        if self.api_key:
            try:
                model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=DIAGNOSTIC_SYSTEM_PROMPT,
                    generation_config={"response_mime_type": "application/json"}
                )

                # Attempt 1
                response = model.generate_content(prompt)
                raw_json = response.text.strip()
                parsed = json.loads(raw_json)
                result = DiagnosticOutputSchema.model_validate(parsed)
                return self._post_process_result(result, has_evidence)

            except Exception as e:
                logger.warning(f"First LLM reasoning attempt failed: {e}. Retrying with correction prompt...")
                try:
                    # Attempt 2 (Correction retry)
                    correction_prompt = (
                        f"Previous output failed validation. Please output strictly valid JSON matching DiagnosticOutputSchema.\n\n"
                        f"{prompt}"
                    )
                    retry_resp = model.generate_content(correction_prompt)
                    parsed_retry = json.loads(retry_resp.text.strip())
                    result_retry = DiagnosticOutputSchema.model_validate(parsed_retry)
                    return self._post_process_result(result_retry, has_evidence)
                except Exception as retry_err:
                    logger.error(f"Correction retry failed: {retry_err}", exc_info=True)
                    return self._generate_grounded_fallback(context, has_evidence)

        # Offline / Mock Fallback
        return self._generate_grounded_fallback(context, has_evidence)

    def _post_process_result(self, result: DiagnosticOutputSchema, has_evidence: bool) -> DiagnosticOutputSchema:
        """Enforces low-confidence caveats and no-evidence grounding rules."""
        if not has_evidence:
            if result.confidence > 0.40:
                result.confidence = 0.35
            no_ev_note = "Insufficient verified OEM manual evidence. Physical verification by senior field technician required."
            if no_ev_note not in result.limitations:
                result.limitations.append(no_ev_note)

        if result.confidence < settings.DIAGNOSTIC_CONFIDENCE_THRESHOLD:
            low_conf_warning = "Low confidence diagnosis — additional electrical/physical inspection by a qualified technician is recommended."
            if low_conf_warning not in result.limitations:
                result.limitations.append(low_conf_warning)

        return result

    def _generate_grounded_fallback(self, context: Dict[str, Any], has_evidence: bool) -> DiagnosticOutputSchema:
        """
        Deterministic, source-grounded fallback reasoning engine.
        Synthesizes actual database records and RAG citations without calling external APIs.
        """
        asset = context.get("asset", {})
        user_q = context.get("user_question", "")
        error_info = context.get("error_code_info", {})
        rag_chunks = context.get("rag_chunks", [])
        vision = context.get("vision_analysis", {})

        # Extract observations
        observations = []
        for obs in vision.get("observations", []):
            observations.append(obs.get("observation", ""))
        if not observations:
            observations.append(f"Field inquiry for {asset.get('name', 'equipment')} ({asset.get('asset_code', '')}) regarding: {user_q}")

        # Extract citations directly from RAG chunks
        citations = []
        for chunk in rag_chunks:
            meta = chunk.get("metadata", {})
            citations.append(
                DiagnosticCitationItem(
                    manual_id=chunk.get("manual_id"),
                    document_title=chunk.get("manual_title") or meta.get("document_title", "Technical Document"),
                    page_number=chunk.get("page_number", 1),
                    similarity=chunk.get("similarity", 0.0)
                )
            )

        # Determine error code
        matched_code = error_info.get("code") if error_info.get("status") == "MATCHED" else None
        error_detail = None
        if matched_code:
            error_detail = ErrorCodeDetail(
                code=matched_code,
                meaning=error_info.get("title", "Standard Diagnostic Trouble Code"),
                confidence=0.92
            )

        # Build grounded possible causes
        possible_causes = []
        if error_info.get("possible_causes"):
            for c in error_info["possible_causes"]:
                possible_causes.append(CauseItem(cause=c, probability=0.85, rationale=f"Cataloged in fault database for error {matched_code}."))
        elif rag_chunks:
            possible_causes.append(
                CauseItem(
                    cause=f"Symptom correlated with {asset.get('equipment_type', 'machinery')} operational deviation.",
                    probability=0.75,
                    rationale=f"Documented in '{citations[0].document_title}' page {citations[0].page_number}."
                )
            )
        else:
            possible_causes.append(
                CauseItem(
                    cause="Potential mechanical wear, sensor drift, or flow restriction.",
                    probability=0.45,
                    rationale="General symptom correlation without verified OEM manual chunk match."
                )
            )

        # Build grounded troubleshooting steps
        troubleshooting_steps = []
        step_num = 1

        # Step 1: LOTO & Isolation
        troubleshooting_steps.append(
            TroubleshootingStepItem(
                step=step_num,
                action=f"De-energize {asset.get('name', 'equipment')} 480V 3-Phase power supply and execute Lockout/Tagout (LOTO). Verify zero voltage with calibrated multimeter.",
                safety_note="Mandatory PPE: 1000V Insulated Gloves and Arc Flash Face Shield."
            )
        )
        step_num += 1

        # Step 2: Image-based visual damage remediation if visual observations exist
        if vision.get("observations"):
            for obs in vision["observations"][:2]:
                obs_text = obs.get("observation", "")
                troubleshooting_steps.append(
                    TroubleshootingStepItem(
                        step=step_num,
                        action=f"Inspect visual anomaly identified in inspection image: {obs_text}. Clean contacts, check for mechanical wear, and verify seal integrity.",
                        safety_note="Wear protective safety glasses and cut-resistant gloves."
                    )
                )
                step_num += 1

        # Step 3: Error code / Manual checks
        if error_info.get("recommended_checks"):
            for check in error_info["recommended_checks"]:
                troubleshooting_steps.append(
                    TroubleshootingStepItem(
                        step=step_num,
                        action=check,
                        safety_note="Verify component is depressurized and grounded before testing."
                    )
                )
                step_num += 1
        elif rag_chunks:
            troubleshooting_steps.append(
                TroubleshootingStepItem(
                    step=step_num,
                    action=f"Follow OEM test and alignment specifications documented in {citations[0].document_title} (Page {citations[0].page_number}). Measure operating tolerances against baseline values.",
                    safety_note="Adhere strictly to OEM safety interlocks and calibration ranges."
                )
            )
            step_num += 1
            troubleshooting_steps.append(
                TroubleshootingStepItem(
                    step=step_num,
                    action="Re-torque mounting fasteners and terminal connectors to OEM specified torque. Reconnect telemetry sensors and conduct post-repair verification test run.",
                    safety_note="Clear all personnel from machine perimeter before removing LOTO and energizing."
                )
            )

        # Safety warnings
        safety_warnings = [
            "Execute standard Lockout/Tagout (LOTO) procedures prior to accessing electrical or high-pressure enclosures.",
            "Verify all pressurized lines and hydraulic circuits are discharged to zero PSIG before disassembling fittings."
        ]
        if error_info.get("safety_warnings"):
            safety_warnings.extend(error_info["safety_warnings"])

        # Confidence calculation
        confidence = 0.88 if (has_evidence and matched_code) else (0.72 if has_evidence else 0.40)
        
        limitations = []
        if not has_evidence:
            summary = f"Insufficient OEM manual evidence found for {asset.get('name', 'asset')}. Preliminary symptom evaluation provided."
            limitations.append("No exact OEM document matches found in pgvector catalog. Additional technical manuals should be uploaded.")
            limitations.append("Low confidence — additional inspection or qualified technician verification is recommended.")
        else:
            summary = f"Diagnosis for {asset.get('name', 'equipment')} ({asset.get('asset_code', '')}): Evaluated symptoms with {len(citations)} technical citations and error database."

        return DiagnosticOutputSchema(
            summary=summary,
            observations=observations,
            possible_causes=possible_causes,
            error_code=error_detail,
            troubleshooting_steps=troubleshooting_steps,
            required_tools=["Digital Multimeter", "Calibrated Pressure Manifold", "Insulated Hand Tools", "PPE (Safety Glasses, Cut-Resistant Gloves)"],
            safety_warnings=safety_warnings,
            citations=citations,
            confidence=confidence,
            limitations=limitations
        )
