import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Camera,
  BookOpen,
  ArrowRight,
  Wrench,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  Thermometer,
  ChevronDown,
  AlertTriangle,
  Database,
  Layers,
  HelpCircle,
  ThumbsUp,
  BarChart3,
  Server,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToSignUp,
  onExploreDemo,
}) => {
  // Scenario selector for the live interactive hero showcase
  const [activeTab, setActiveTab] = useState<'cavitation' | 'thermal' | 'nominal'>('cavitation');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [checkedRepairs, setCheckedRepairs] = useState<number[]>([1]);

  const toggleRepairCheck = (stepId: number) => {
    if (checkedRepairs.includes(stepId)) {
      setCheckedRepairs(checkedRepairs.filter((id) => id !== stepId));
    } else {
      setCheckedRepairs([...checkedRepairs, stepId]);
    }
  };

  const scenarios = {
    cavitation: {
      tag: 'CRITICAL ALARM',
      code: 'FAULT E-101',
      title: 'Centrifugal Pump Cavitation & Overpressure',
      asset: 'PUMP-204 (ANSI Centrifugal Slurry Unit)',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      pressure: '8.2 bar',
      pressureStatus: 'High (Limit 6.5)',
      temp: '74.2 °C',
      vibration: '5.4 mm/s',
      confidence: 96,
      visionOCR: 'Readout: 8.2 BAR • Lower Flange Fluid Seepage',
      rootCause: 'Suction strainer partial blockage causing downstream cavitation and mechanical seal stress.',
      lotoRequirement: 'Isolate 480V Breaker CB-3. Bleed residual pressure to 0 PSI before breaking flange bolts.',
      manualMatch: 'FlowServe_Mark3_Manual.pdf (Page 42, Sec 4.2)',
      similarity: '94.2%',
      repairSteps: [
        { id: 1, text: 'Lockout Breaker CB-3; verify zero voltage with calibrated multimeter.', tag: 'OSHA 1910.147' },
        { id: 2, text: 'Open drain valve DV-02 to bleed casing pressure to 0.0 bar.', tag: 'Depressurize' },
        { id: 3, text: 'Disassemble suction spool; clean debris from 50-mesh strainer basket.', tag: 'Solvent Flush' },
        { id: 4, text: 'Reinstall with new Viton O-Ring #8841. Torque flange bolts to 45 Nm.', tag: 'Torque Spec' },
      ],
    },
    thermal: {
      tag: 'WARNING',
      code: 'FAULT E-201',
      title: 'Induction Motor Drive-End Thermal Runaway',
      asset: 'MOT-312 (480V 3-Phase 75kW Induction Motor)',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      pressure: 'Nominal',
      pressureStatus: 'Normal',
      temp: '88.6 °C',
      tempStatus: 'Overheat (> 80°C)',
      vibration: '4.8 mm/s',
      confidence: 93,
      visionOCR: 'Thermal Scan: 88.6°C • Fan Shroud Particulate Clog',
      rootCause: 'Restricted airflow coupled with degraded drive-end lithium grease causing thermal runaway.',
      lotoRequirement: 'Lockout MCC-2 Cubicle 4. Attach lockout hasp. Allow housing to cool below 40°C.',
      manualMatch: 'Siemens_1LA_Motor_Manual.pdf (Page 18, Sec 7.1)',
      similarity: '91.8%',
      repairSteps: [
        { id: 1, text: 'De-energize Motor Control Center MCC-2 Cubicle 4 and attach tag.', tag: 'Arc Flash PPE' },
        { id: 2, text: 'Vacuum cooling fins and clean debris from intake fan shroud.', tag: 'Airflow Restoration' },
        { id: 3, text: 'Purge old grease; inject 15g Mobil Polyrex EM synthetic grease.', tag: 'Bearing Lube' },
        { id: 4, text: 'Run 20-min test cycle and verify baseline temp stabilizes below 65°C.', tag: 'Thermal Verification' },
      ],
    },
    nominal: {
      tag: 'OPERATIONAL',
      code: 'NOMINAL',
      title: 'Rotary Screw Compressor Operating Optimally',
      asset: 'COMP-018 (Continuous Rotary Screw Compressor)',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      pressure: '6.4 bar',
      pressureStatus: 'Optimal',
      temp: '62.0 °C',
      vibration: '1.8 mm/s',
      confidence: 99,
      visionOCR: 'Digital Display: 6.4 BAR • Casing Clear • Oil Level Center',
      rootCause: 'All telemetry metrics and visual parameters within factory OEM baseline tolerances.',
      lotoRequirement: 'No immediate LOTO isolation needed. Standard personal protective equipment.',
      manualMatch: 'AtlasCopco_GA_Manual.pdf (Page 88, Sec 2.1)',
      similarity: '98.5%',
      repairSteps: [
        { id: 1, text: 'Record delta differential pressure across air/oil separator (0.2 bar).', tag: 'Telemetry Log' },
        { id: 2, text: 'Verify oil level in sight glass is centered between min/max marks.', tag: 'Visual Check' },
        { id: 3, text: 'Scheduled preventive element replacement in 340 operating hours.', tag: 'PM Schedule' },
      ],
    },
  };

  const current = scenarios[activeTab];

  const workflowSteps = [
    {
      step: 1,
      title: 'Multimodal Vision Inspection',
      subtitle: 'Snap a photo of damaged parts or control panels',
      desc: 'Technicians photograph machinery, analog gauges, digital displays, or fluid leaks. Gemini 2.0 Multimodal Vision extracts OCR error codes (e.g. E-101) while separating physical observations from inferences.',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      tag: 'Gemini 2.0 Vision AI',
      kpi: 'Sub-second Optical OCR',
    },
    {
      step: 2,
      title: 'OEM Manual Retrieval (pgvector)',
      subtitle: 'Dense 768-dimensional semantic search',
      desc: 'Uploaded OEM service manuals and electrical schematics are indexed as 768d vector embeddings in Supabase PostgreSQL. High-dimensional cosine search retrieves exact paragraph numbers, page citations, and torque limits.',
      image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
      tag: 'Supabase pgvector 768d',
      kpi: 'Exact Page & Section Citations',
    },
    {
      step: 3,
      title: 'Safety-First LOTO Protocols',
      subtitle: 'OSHA 1910.147 Zero-Hazard Guardrails',
      desc: 'Before generating physical repair sequences, GearMind AI strictly enforces Lockout/Tagout energy isolation protocols (breaker tags, residual pressure bleeding, arc-flash PPE) to guarantee technician safety.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      tag: 'OSHA 1910.147 Compliant',
      kpi: '100% Safety Compliance',
    },
    {
      step: 4,
      title: 'Guided Repair & RLHF Audit',
      subtitle: 'Step-by-step remediation with technician validation',
      desc: 'Engineers follow verified repair checklists with calibrated torque specifications. Once resolved, the technician reviews the AI accuracy, feeding human-in-the-loop telemetry back into the system ledger.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      tag: 'RLHF Feedback Ledger',
      kpi: 'Continuous Model Learning',
    },
  ];

  const faqs = [
    {
      q: 'How does Gemini Multimodal Vision AI detect machine damage?',
      a: 'Technicians upload photos of mechanical components, gauges, or control panels. The Gemini Multimodal Vision engine performs optical character recognition (OCR) on digital readouts and error codes while identifying physical wear patterns (fluid leaks, thermal oxidation, belt fraying) strictly separated from diagnostic inferences.',
    },
    {
      q: 'How does pgvector manual retrieval find exact page numbers and torque specs?',
      a: 'Uploaded OEM manuals (PDF/DOCX) are parsed and converted into 768-dimensional dense vector embeddings stored in Supabase PostgreSQL pgvector. When a query or fault code is received, high-dimensional cosine similarity matching retrieves the exact paragraph, page number, and mechanical tolerance limits.',
    },
    {
      q: 'Why is Lockout/Tagout (LOTO) safety enforced before repair steps?',
      a: 'Industrial safety is paramount. In strict accordance with OSHA 1910.147, GearMind AI autonomously mandates electrical breaker lockouts, mechanical pressure bleeding, and required PPE before any physical intervention sequence is presented to prevent hazardous accidents.',
    },
    {
      q: 'Can I upload custom PDF manuals and equipment schematics?',
      a: 'Yes! Navigate to the "OEM Manuals" tab in the command center to upload any manufacturer manual, electrical diagram, or plant SOP. The system automatically processes, embeds, and indexes the document for instant diagnostic retrieval.',
    },
    {
      q: 'What happens if a manual or fault code is not in the database?',
      a: 'GearMind AI never hallucinates. If no corresponding OEM documentation chunk is found in the pgvector database, the system safely outputs a Low Confidence score (< 40%) and prompts the technician to consult manufacturer engineering support.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 🧭 ENTERPRISE TOP NAVIGATION BAR                                          */}
      {/* ========================================================================= */}
      <nav className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onExploreDemo}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center text-white shadow-orange-glow border border-orange-300 transform hover:scale-105 transition-smooth">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black tracking-wider text-slate-900">GEARMIND</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded border border-orange-200">
                AI COPILOT
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
              Autonomous Field Service Platform
            </p>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="hidden lg:flex items-center space-x-8 text-xs font-bold text-slate-600">
          <a href="#how-it-works" className="hover:text-orange-600 transition-colors">How It Works</a>
          <a href="#simulator" className="hover:text-orange-600 transition-colors">Live Simulator</a>
          <a href="#architecture" className="hover:text-orange-600 transition-colors">Architecture</a>
          <a href="#capabilities" className="hover:text-orange-600 transition-colors">Capabilities</a>
          <a href="#faq" className="hover:text-orange-600 transition-colors">FAQ</a>
        </div>

        {/* Authentication CTA buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToLogin}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 rounded-lg transition-smooth shadow-xs"
          >
            Sign In
          </button>
          <button
            onClick={onExploreDemo}
            className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-orange-glow transition-smooth flex items-center transform hover:scale-[1.02]"
          >
            <Play className="w-3 h-3 mr-1.5 fill-current" /> Live Cockpit
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 🚀 HERO SECTION (CLEAN, BOLD, HIGH-IMPACT)                                */}
      {/* ========================================================================= */}
      <section className="relative pt-14 pb-14 px-6 sm:px-12 border-b border-slate-200 bg-gradient-to-b from-orange-50/60 via-amber-50/20 to-white text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-amber-300 shadow-card-subtle text-[11px] font-bold text-amber-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Industrial Field AI Engine v2.4 • Gemini Multimodal Vision + pgvector RAG</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Diagnose Machinery Breakdowns in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600">
              Seconds, Not Hours.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Empower service engineers with instant Vision AI fault inspection, 768-dimensional OEM manual retrieval, standardized error code intelligence, and 100% safety-grounded LOTO troubleshooting sequences.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToSignUp}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-orange-glow transition-smooth flex items-center justify-center transform hover:scale-105"
            >
              Get Started Free <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-card-subtle transition-smooth flex items-center justify-center transform hover:scale-105"
            >
              Launch Live Demo Cockpit
            </button>
          </div>

          {/* Live Trust Metrics Ribbon */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fleet Uptime</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">97.8%</div>
              <div className="text-[9px] text-emerald-600 font-bold">↑ +2.4% MTTR Boost</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dense Embeddings</div>
              <div className="text-lg font-black text-orange-600 mt-0.5">768-dim</div>
              <div className="text-[9px] text-slate-500 font-medium">pgvector Cosine Match</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Safety Clearance</div>
              <div className="text-lg font-black text-emerald-600 mt-0.5">100%</div>
              <div className="text-[9px] text-emerald-700 font-bold">OSHA 1910.147 LOTO</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hallucination Risk</div>
              <div className="text-lg font-black text-amber-600 mt-0.5">&lt; 1.2%</div>
              <div className="text-[9px] text-slate-500 font-medium">Strict OEM Grounding</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📖 SECTION 1: HOW IT WORKS (STEP-BY-STEP VISUAL SHOWCASE)                  */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 px-6 sm:px-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 text-[11px] font-bold">
              <Activity className="w-3 h-3 text-orange-500" />
              <span>Step-by-Step Guided Field Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How Field Technicians Use GearMind AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
              From physical machine photo capture to sub-second OEM manual matching, LOTO safety verification, and guided repair.
            </p>
          </div>

          {/* 4-Step Interactive Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflowSteps.map((step) => {
              const isSelected = activeWorkflowStep === step.step;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveWorkflowStep(step.step)}
                  className={`rounded-2xl border p-5 transition-smooth cursor-pointer text-left space-y-4 relative overflow-hidden ${
                    isSelected
                      ? 'bg-orange-50/30 border-orange-400 shadow-card-hover ring-2 ring-orange-400/20'
                      : 'bg-white border-slate-200 shadow-card-subtle hover:border-slate-300'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 group">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-slate-800 border border-slate-200 flex items-center space-x-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <span>{step.tag}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                      <span className="bg-orange-600/90 px-2 py-0.5 rounded text-[10px] font-mono">Step 0{step.step}</span>
                      <span className="text-[10px] font-medium text-slate-200">{step.kpi}</span>
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-xs font-bold text-orange-600">
                      {step.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🔴 SECTION 2: LIVE INTERACTIVE WORKSTATION SIMULATOR                      */}
      {/* ========================================================================= */}
      <section id="simulator" className="py-16 px-6 sm:px-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-6 text-left">
          {/* Header & Scenario Switchers */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                <Gauge className="w-3 h-3 text-amber-600" />
                <span>Live Multimodal Diagnostic Cockpit Simulator</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Real-Time Equipment Diagnostic Cockpit
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Click a fault scenario to see live vision OCR, pgvector manual citations, and LOTO checklists.
              </p>
            </div>

            {/* Scenario Switcher Buttons */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200 space-x-1 flex-shrink-0 shadow-xs">
              <button
                onClick={() => setActiveTab('cavitation')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth flex items-center space-x-1.5 ${
                  activeTab === 'cavitation'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Fault E-101 (Cavitation)</span>
              </button>

              <button
                onClick={() => setActiveTab('thermal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth flex items-center space-x-1.5 ${
                  activeTab === 'thermal'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Thermometer className="w-3 h-3" />
                <span>Fault E-201 (Thermal)</span>
              </button>

              <button
                onClick={() => setActiveTab('nominal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth flex items-center space-x-1.5 ${
                  activeTab === 'nominal'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Nominal State</span>
              </button>
            </div>
          </div>

          {/* Simulator Cockpit Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card-hover space-y-5">
            {/* Top Asset HUD */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-3">
                <span className={`w-3 h-3 rounded-full ${activeTab === 'nominal' ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{current.asset}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{current.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px]">
                <span className="font-mono px-2.5 py-1 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg font-bold flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-orange-600" />
                  AI Confidence: {current.confidence}%
                </span>
                <span className={`px-2.5 py-1 rounded-lg font-bold font-mono border ${
                  activeTab === 'nominal'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {current.code}
                </span>
              </div>
            </div>

            {/* Split Content: High-Res Real Machinery Photo (Left) & AI Reasoning (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 5 Cols: Real Machine Inspection Photograph */}
              <div className="lg:col-span-5 flex flex-col space-y-3">
                <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img
                    src={current.image}
                    alt={current.asset}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />

                  {/* Laser Scan Beam Overlay */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_12px_#f97316] animate-scanline z-20 pointer-events-none" />

                  {/* Vision OCR Live Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700 text-white text-[10px] font-mono flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Gemini Vision OCR Active</span>
                  </div>

                  {/* Anomaly Callout Box */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-orange-500/50 text-white text-xs space-y-1">
                    <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider flex items-center">
                      <Camera className="w-3 h-3 mr-1" /> Vision Observation
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium">{current.visionOCR}</p>
                  </div>
                </div>

                {/* Telemetry Gauge Strip */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-[#FAFAFA] rounded-xl border border-slate-200">
                    <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      <Gauge className="w-3 h-3 mr-1 text-orange-500" /> Pressure
                    </div>
                    <p className="text-xs font-black text-slate-900 mt-0.5">{current.pressure}</p>
                  </div>
                  <div className="p-2 bg-[#FAFAFA] rounded-xl border border-slate-200">
                    <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      <Thermometer className="w-3 h-3 mr-1 text-amber-500" /> Temp
                    </div>
                    <p className="text-xs font-black text-slate-900 mt-0.5">{current.temp}</p>
                  </div>
                  <div className="p-2 bg-[#FAFAFA] rounded-xl border border-slate-200">
                    <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      <Activity className="w-3 h-3 mr-1 text-emerald-500" /> Vibration
                    </div>
                    <p className="text-xs font-black text-slate-900 mt-0.5">{current.vibration}</p>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Grounded AI Reasoning & LOTO Checklist */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                {/* Root Cause Card */}
                <div className="p-3.5 bg-[#FAFAFA] border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center text-orange-700 text-[11px] font-bold uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Root Cause Diagnosis
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed font-medium">
                    {current.rootCause}
                  </p>
                </div>

                {/* Mandatory LOTO Card */}
                <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl space-y-1">
                  <div className="flex items-center text-rose-800 text-[11px] font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-600" /> Mandatory LOTO Energy Isolation (OSHA 1910.147)
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed font-semibold">
                    {current.lotoRequirement}
                  </p>
                </div>

                {/* Interactive Guided Repair Checklist */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span className="flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Guided Physical Remediation Checklist
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {checkedRepairs.length} of {current.repairSteps.length} Steps Completed
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {current.repairSteps.map((step) => {
                      const isChecked = checkedRepairs.includes(step.id);
                      return (
                        <div
                          key={step.id}
                          onClick={() => toggleRepairCheck(step.id)}
                          className={`p-2 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-smooth ${
                            isChecked
                              ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                              : 'bg-[#FAFAFA] border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                              isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-400 text-transparent'
                            }`}>
                              ✓
                            </div>
                            <span className={`text-[11px] ${isChecked ? 'line-through text-slate-500' : 'font-medium'}`}>
                              {step.text}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 flex-shrink-0">
                            {step.tag}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* OEM Citation Footer */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="font-mono font-medium truncate max-w-sm">
                    📚 OEM Match: {current.manualMatch} ({current.similarity})
                  </span>
                  <button
                    onClick={onExploreDemo}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center"
                  >
                    Open Live Cockpit Demo →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ⚙️ SECTION 3: SYSTEM ARCHITECTURE HUD                                     */}
      {/* ========================================================================= */}
      <section id="architecture" className="py-16 px-6 sm:px-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10 text-left">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 text-[11px] font-bold">
              <Layers className="w-3 h-3 text-orange-500" />
              <span>Modern Engineering Stack</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Industrial AI System Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
              High-concurrency async Python FastAPI backend paired with Supabase PostgreSQL pgvector and Gemini 2.0 Vision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#FAFAFA] border border-slate-200 rounded-2xl space-y-2 shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Gemini 2.0 Flash Vision</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Extracts OCR readouts and inspects physical wear patterns without mixing observations with diagnostic inferences.
              </p>
            </div>

            <div className="p-5 bg-[#FAFAFA] border border-slate-200 rounded-2xl space-y-2 shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">PostgreSQL pgvector</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Dense 768-dimensional vector embeddings with HNSW cosine search for sub-second retrieval of OEM manual text.
              </p>
            </div>

            <div className="p-5 bg-[#FAFAFA] border border-slate-200 rounded-2xl space-y-2 shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">OSHA 1910.147 LOTO</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Deterministic rule gates validating 480V electrical breaker isolation and residual pressure bleedoff before repair.
              </p>
            </div>

            <div className="p-5 bg-[#FAFAFA] border border-slate-200 rounded-2xl space-y-2 shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Server className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">FastAPI & Vite React</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Ultra-fast asynchronous microservices paired with a light orange, yellow, and crisp white dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 💡 SECTION 4: ENTERPRISE CAPABILITIES MATRIX                              */}
      {/* ========================================================================= */}
      <section id="capabilities" className="py-16 px-6 sm:px-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Field Service Capabilities
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto font-medium">
              Everything required to diagnose, repair, and audit complex mission-critical machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                <Camera className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Multimodal Vision AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Upload control panel readouts, thermal scans, or mechanical damage. Extracts OCR error codes and identifies physical anomalies.
              </p>
            </div>

            <div className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-card-hover rounded-2xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">OEM Manual Retrieval</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                768-dimensional dense vector embeddings in pgvector. Retrieves exact page-numbered troubleshooting steps and schematics.
              </p>
            </div>

            <div className="bg-white border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Safety-Grounded LOTO</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Zero hazardous autonomous actuation. Mandates Lockout/Tagout energy isolation protocols and required PPE before physical repair.
              </p>
            </div>

            <div className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-card-hover rounded-2xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Guided Troubleshooting</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Numbered repair sequences with specific torque ratings (e.g. 45 Nm) and required tool lists to accelerate MTTR.
              </p>
            </div>

            <div className="bg-white border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Fleet Uptime Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Real-time dashboard tracking operational asset distributions, recurring failure Pareto charts, and resolution velocity.
              </p>
            </div>

            <div className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-card-hover rounded-2xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Human-in-the-Loop RLHF</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Technicians review and validate diagnostic accuracy, feeding real-world resolution notes back into the continuous learning system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ❓ SECTION 5: FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)                  */}
      {/* ========================================================================= */}
      <section id="faq" className="py-16 px-6 sm:px-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 text-[11px] font-bold">
              <HelpCircle className="w-3 h-3 text-orange-500" />
              <span>Clear Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto font-medium">
              Everything you need to know about GearMind AI's vision engine, vector retrieval, and safety protocols.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-[#FAFAFA] transition-smooth"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-orange-600 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'transform rotate-180 text-orange-500' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-200/60 pt-3 bg-white">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🔥 CALL-TO-ACTION (CTA) BANNER                                            */}
      {/* ========================================================================= */}
      <section className="py-14 px-6 sm:px-12 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white text-center shadow-lg relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Ready to Eliminate Machinery Downtime?
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl mx-auto font-medium leading-relaxed">
            Equip your maintenance engineers with instant Multimodal Vision AI, OSHA-compliant LOTO safety sequences, and 768d vector retrieval.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToSignUp}
              className="w-full sm:w-auto px-6 py-3 bg-white text-orange-600 font-bold text-xs rounded-xl shadow-card-hover hover:bg-orange-50 transition-smooth transform hover:scale-105"
            >
              Get Started Free <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3 bg-orange-700/60 text-white border border-orange-300 font-bold text-xs rounded-xl hover:bg-orange-700 transition-smooth"
            >
              Launch Live Demo Cockpit
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🏢 ENTERPRISE FOOTER                                                      */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-white px-6 sm:px-12 py-8 text-xs text-slate-500 space-y-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              G
            </div>
            <span className="font-bold text-slate-800">GearMind AI Copilot</span>
            <span className="text-[10px] text-slate-400">• Industrial Operations Edition</span>
          </div>

          <div className="flex items-center space-x-6 font-medium">
            <button onClick={onNavigateToLogin} className="hover:text-slate-900">Sign In</button>
            <button onClick={onNavigateToSignUp} className="hover:text-slate-900">Create Account</button>
            <button onClick={onExploreDemo} className="hover:text-slate-900">Live Cockpit</button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>© 2026 GearMind AI. Built with Gemini Multimodal Vision + Supabase pgvector.</div>
          <div className="flex items-center space-x-3 text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>OSHA 1910.147 Compliant Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
