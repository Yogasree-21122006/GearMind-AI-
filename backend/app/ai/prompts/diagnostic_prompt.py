import json
from typing import Dict, Any

def build_diagnostic_prompt(context: Dict[str, Any]) -> str:
    """Builds the comprehensive user prompt containing all structured evidence for AI reasoning."""
    asset = context.get("asset", {})
    vision = context.get("vision_analysis", {})
    error_code = context.get("error_code_info", {})
    rag_chunks = context.get("rag_chunks", [])
    maintenance_records = context.get("maintenance_history", [])
    user_question = context.get("user_question", "")

    # Format RAG chunks with preserved page citations
    formatted_chunks = []
    for i, c in enumerate(rag_chunks, 1):
        formatted_chunks.append(
            f"[Source {i}] Document: '{c.get('manual_title', 'OEM Manual')}' | Page: {c.get('page_number', 'N/A')} | Similarity: {c.get('similarity', 0.0)}\n"
            f"Content: {c.get('content', '').strip()}\n"
        )
    rag_section = "\n".join(formatted_chunks) if formatted_chunks else "No matching OEM manual chunks found above similarity threshold."

    # Format Maintenance history
    formatted_maint = []
    for i, m in enumerate(maintenance_records, 1):
        formatted_maint.append(
            f"[{i}] Date: {m.get('maintenance_date', 'Past')} | Type: {m.get('maintenance_type')} | Issue: {m.get('issue_description')} | Diagnosis: {m.get('diagnosis')} | Action: {m.get('action_taken')}"
        )
    maint_section = "\n".join(formatted_maint) if formatted_maint else "No previous maintenance records recorded for this asset."

    return f"""==================================================
EVIDENCE DATASET FOR DIAGNOSTIC REASONING
==================================================

1. TARGET EQUIPMENT SPECIFICATIONS:
- Asset Code: {asset.get('asset_code', 'N/A')}
- Name: {asset.get('name', 'Industrial Equipment')}
- Equipment Type: {asset.get('equipment_type', 'N/A')}
- Manufacturer / OEM: {asset.get('manufacturer', 'N/A')}
- Model: {asset.get('model', 'N/A')}
- Serial Number: {asset.get('serial_number', 'N/A')}
- Location: {asset.get('location', 'Facility')}
- Status: {asset.get('operational_status', 'operational')}

2. TECHNICIAN SYMPTOM & INQUIRY:
"{user_question}"

3. MULTIMODAL VISION INSPECTION EVIDENCE:
- Visual Observations: {json.dumps(vision.get('observations', []), indent=2)}
- Detected Fault/Error Codes in Image: {vision.get('detected_error_codes', [])}
- Visible Hazards: {vision.get('visible_hazards_or_warnings', [])}
- Visual Condition Summary: {vision.get('equipment_condition_summary', 'No visual anomaly detected or no image supplied.')}

4. STANDARDIZED ERROR CODE DATABASE LOOKUP:
- Code Status: {error_code.get('status', 'NO_MATCH')}
- Code: {error_code.get('code', 'None')}
- Title: {error_code.get('title', 'N/A')}
- Description: {error_code.get('description', 'N/A')}
- Documented Causes: {error_code.get('possible_causes', [])}
- Recommended Checks: {error_code.get('recommended_checks', [])}
- Safety Warnings: {error_code.get('safety_warnings', [])}

5. RETRIEVED TECHNICAL MANUAL SOURCES (RAG):
{rag_section}

6. RECENT MAINTENANCE WORK ORDER HISTORY:
{maint_section}

==================================================
REQUIRED JSON OUTPUT STRUCTURE
==================================================
Synthesize all 6 evidence streams into a comprehensive, highly detailed diagnostic report matching the exact schema below.
Ensure troubleshooting_steps include BOTH manual-grounded testing/calibration steps AND image-specific physical inspection/remediation steps:

{{
  "summary": "Comprehensive 2-4 sentence diagnostic summary synthesizing target equipment, physical visual observations from the image, matched OEM error code, and precise root cause.",
  "observations": ["List of detailed physical/visual facts observed in the photo, gauge readings, and symptoms"],
  "possible_causes": [
    {{
      "cause": "Specific technical root cause from OEM manual and visual defect",
      "probability": 0.90,
      "rationale": "Deep reasoning citing specific RAG evidence, error codes, and image defects"
    }}
  ],
  "error_code": {{
    "code": "Error code if matched or null",
    "meaning": "Official OEM meaning or 'Unverified'",
    "confidence": 0.95
  }},
  "troubleshooting_steps": [
    {{
      "step": 1,
      "action": "Extremely detailed step-by-step mechanical/electrical action with exact pin numbers, multimeter settings, torque specs, or visual inspection criteria",
      "safety_note": "Specific safety precaution, LOTO point, or PPE required for this step"
    }}
  ],
  "required_tools": ["Digital Multimeter (CAT IV)", "Torque Wrench (5-25 Nm)", "LOTO Padlock Kit", "Insulated Gloves (1000V)", "..."],
  "safety_warnings": ["LOTO 480V 3-Phase Main Breaker", "Wait for high-pressure line discharge (min 15 psi residual check)", "..."],
  "citations": [
    {{
      "manual_id": "manual id if present",
      "document_title": "Exact manual title from retrieved sources",
      "page_number": 84,
      "similarity": 0.88
    }}
  ],
  "confidence": 0.92,
  "limitations": ["Any unverified items, missing schematics, or conditions requiring senior technician verification"]
}}
"""
