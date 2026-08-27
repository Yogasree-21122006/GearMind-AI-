"""
Vision inspection prompts for multimodal equipment analysis.
"""

VISION_INSPECTION_PROMPT = """Analyze this field-service equipment image in high detail.
Identify and report:
1. Component identification (tags, nameplates, model numbers, valves, gauges).
2. Visible anomalies or signs of failure (corrosion, oil/coolant leakage, scorched terminals, bent conduits, broken seals, wear patterns).
3. Status readings (pressure gauges, LED status indicators, digital readouts).
4. Immediate visual safety hazards.

Format your analysis as a structured inspection summary with identified anomalies.
"""
