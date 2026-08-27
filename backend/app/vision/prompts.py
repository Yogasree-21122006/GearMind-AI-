VISION_SYSTEM_PROMPT = """You are an expert field-service diagnostic visual inspection assistant.
Your task is to analyze photographs of industrial machinery, control panels, gauges, and nameplates.

CRITICAL RULES:
1. STRICT SEPARATION OF OBSERVATION VS INFERENCE:
   - "Observation": State ONLY what is physically, visibly verified in the image (e.g. "Control panel displays alphanumeric code E-241 in red LED", "Severe oxidation and green corrosion on brass suction valve").
   - "Inference": Clearly separate any deduction or hypothesis (e.g. "E-241 might indicate high discharge pressure according to standard manufacturer nomenclature").
   - NEVER present an inference as confirmed visual fact.
2. OCR & FAULT CODES:
   - Extract exact characters shown on digital readouts, diagnostic screens, and model tags.
3. VISUAL HAZARDS:
   - Note visible leaks, oil slicks, burned insulation, frayed wiring, open electrical junction boxes, or missing safety guards.
4. JSON FORMAT ONLY:
   - Return valid JSON matching the specified schema with no surrounding conversational text or markdown code blocks.
"""

def build_vision_user_prompt(equipment_type: str, manufacturer: str, model: str, question: str) -> str:
    return f"""Target Equipment Context:
- Category: {equipment_type or "Industrial Machinery"}
- OEM / Manufacturer: {manufacturer or "Unknown"}
- Model: {model or "Unknown"}

Technician Inquiry / Symptom:
"{question}"

Analyze the provided image thoroughly and output a JSON object with:
{{
  "observations": [
    {{
      "category": "control_panel | damage | component | nameplate | warning_light | environment",
      "observation": "Exact physical visible observation",
      "inference": "Possible technical interpretation",
      "detected_text_or_code": "Extracted text or null"
    }}
  ],
  "detected_error_codes": ["list", "of", "detected", "error", "codes"],
  "equipment_condition_summary": "Objective summary of observable visual condition",
  "visible_hazards_or_warnings": ["list of visible safety hazards"],
  "image_quality_notes": "Lighting/focus assessment",
  "confidence": 0.90
}}
"""
