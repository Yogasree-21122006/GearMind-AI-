import os
import pymupdf

def generate_demo_pdf(output_path: str = "scripts/demo_academic_manual.pdf") -> str:
    """Generates a 3-page academic demonstration manual for integration testing."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = pymupdf.open()

    # Page 1: Equipment Overview & Safety Protocols
    page1 = doc.new_page(width=595, height=842)
    p1_content = """[ACADEMIC DEMO MANUAL]
DEMO HVAC CHILLER SYSTEM - MODEL DEMO-CH100
SECTION 1: TECHNICAL SPECIFICATIONS & SAFETY PROTOCOLS

1.1 EQUIPMENT OVERVIEW
The Demo-CH100 is an industrial centrifugal water-cooled chiller designed for commercial facility HVAC installations.
Nominal cooling capacity: 150 Tons (527 kW).
Refrigerant: R-134a (Charge weight: 285 lbs).
Standard power requirement: 480V / 3-Phase / 60Hz.

1.2 NOMINAL OPERATIONAL PARAMETERS
- Suction Pressure: 115 to 130 PSIG (normal operating envelope).
- Discharge Head Pressure: 320 to 360 PSIG.
- Evaporator Water Entering/Leaving Temp: 54°F / 44°F (10°F Delta-T).
- Condenser Water Flow Rate: Minimum 3.0 GPM per ton of refrigeration (450 GPM total).

1.3 MANDATORY SAFETY WARNINGS & LOTO COMPLIANCE
WARNING: Electrical shock hazard. Lockout/Tagout (LOTO) all 480V 3-phase incoming disconnects prior to accessing the starter cabinet or motor terminal box.
WARNING: Pressurized refrigerant system. Verify pressure gauges read 0 PSIG on auxiliary service ports before unbolting filter-drier flanges or relief valves.
"""
    page1.insert_text((40, 50), p1_content, fontsize=10, fontname="helv")

    # Page 2: Fault Codes & Troubleshooting Steps
    page2 = doc.new_page(width=595, height=842)
    p2_content = """[ACADEMIC DEMO MANUAL]
DEMO HVAC CHILLER SYSTEM - MODEL DEMO-CH100
SECTION 2: DIAGNOSTIC FAULT CODES & TROUBLESHOOTING

2.1 ERROR CODE DEMO-E101: LOW CONDENSER WATER FLOW CUTOFF
Trigger Condition: Flow sensor detects condenser water flow below 2.4 GPM/ton for more than 15 consecutive seconds.
Possible Causes:
1. Debris or bio-fouling clogging the cooling tower suction strainer basket.
2. Inoperative condenser water pump or air locked in hydraulic piping.
3. Partially closed manual butterfly isolation valve on supply header.
Recommended Troubleshooting Procedure:
Step 1: Check water differential pressure across the shell-and-tube condenser barrel.
Step 2: De-energize pump and inspect suction strainer for particulate blockage.
Step 3: Verify condenser pump motor amperage and check rotation direction.

2.2 ERROR CODE DEMO-E241: HIGH DISCHARGE PRESSURE CUTOFF
Trigger Condition: High-pressure transducer reads discharge refrigerant pressure exceeding 385 PSIG.
Possible Causes:
1. Fouled heat exchanger copper tube bundle (scale, slime, or mineral deposits).
2. Insufficient cooling water flow through condenser tubes.
3. Air or non-condensable gases trapped inside the refrigerant circuit.
Recommended Troubleshooting Procedure:
Step 1: Inspect condenser inlet/outlet water temperatures to calculate approach temperature.
Step 2: Clean condenser tube bundle with rotary mechanical brush or chemical descaling solution.
Step 3: Measure subcooling (nominal value: 8°F to 12°F); if subcooling is high and head pressure is elevated, purge non-condensables.
"""
    page2.insert_text((40, 50), p2_content, fontsize=10, fontname="helv")

    # Page 3: Maintenance Procedures
    page3 = doc.new_page(width=595, height=842)
    p3_content = """[ACADEMIC DEMO MANUAL]
DEMO HVAC CHILLER SYSTEM - MODEL DEMO-CH100
SECTION 3: PREVENTIVE MAINTENANCE & INSPECTION PROCEDURES

3.1 QUARTERLY PREVENTIVE MAINTENANCE CHECKLIST
1. Compressor Lubrication Inspection: Check oil level in compressor sight glass. Oil level must remain between 1/2 and 3/4 of the sight glass during steady-state operation.
2. Electrical Connection Torque: Inspect and retorque high-voltage motor terminals to 45 ft-lbs using a calibrated torque wrench.
3. Refrigerant Leak Check: Perform electronic halogen leak detector sweep around compressor shaft seal and service manifold flanges.
4. Strainer Servicing: Isolate and flush the condenser water strainer basket every 90 operating days.

3.2 REQUIRED FIELD TOOLS & SAFETY EQUIPMENT
- Digital Manifold Gauge Set (R-134a compatible)
- Fluke True-RMS Digital Clamp Multimeter
- Non-contact Optical Tachometer
- Insulated Hand Tool Set (1000V rated)
- Personal Protective Equipment: Safety Glasses (ANSI Z87.1), Heavy Duty Cut-Resistant Gloves, Voltage-Rated Gloves.
"""
    page3.insert_text((40, 50), p3_content, fontsize=10, fontname="helv")

    doc.save(output_path)
    doc.close()
    print(f"Generated academic demo manual at: {output_path}")
    return output_path

if __name__ == "__main__":
    generate_demo_pdf()
