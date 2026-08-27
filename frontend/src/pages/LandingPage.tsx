import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Camera,
  BookOpen,
  ArrowRight,
  FileCheck,
  Wrench,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  Thermometer,
  ChevronRight,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onExploreDemo: () => void;
}

type ScenarioKey = 'cavitation' | 'thermal' | 'nominal';
type StepKey = '01' | '02' | '03' | '04' | '05' | '06';

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToSignUp,
  onExploreDemo,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('cavitation');
  const [activeStep, setActiveStep] = useState<StepKey>('03');
  const [selectedHotspot, setSelectedHotspot] = useState<string>('Suction Flange Seepage');
  const [checkedSteps, setCheckedSteps] = useState<number[]>([1]);

  const toggleCheckStep = (stepNum: number) => {
    if (checkedSteps.includes(stepNum)) {
      setCheckedSteps(checkedSteps.filter((s) => s !== stepNum));
    } else {
      setCheckedSteps([...checkedSteps, stepNum]);
    }
  };

  const scenarios = {
    cavitation: {
      asset: 'PUMP-204 (Centrifugal Slurry)',
      errorCode: 'E-101',
      errorTitle: 'Discharge Overpressure & Cavitation Risk',
      confidence: 96,
      pressure: '8.2 bar',
      pressureStatus: 'Critical (> 6.5 max)',
      temp: '74.2 °C',
      vibration: '5.4 mm/s',
      anomaly: 'Flange seal seepage detected on suction line. Digital readout indicates discharge pressure of 8.2 bar (> 6.5 bar max rated limit).',
      rootCause: 'Suction strainer partial blockage causing downstream cavitation and mechanical seal stress (Verified in OEM Manual Section 4.2).',
      loto: 'Isolate 480V Breaker CB-3. Bleed residual pressure to 0 PSI before breaking suction flange bolts. Wear 1000V rated gloves.',
      citation: 'FlowServe_Mark3_Manual.pdf (Page 42, Similarity 0.94)',
      hotspotName: 'Suction Flange Seepage',
      hotspotLoc: { x: '35%', y: '48%' },
      steps: [
        { num: 1, text: 'Lockout & Tagout Breaker CB-3; confirm zero voltage with multimeter.', safety: 'OSHA 1910.147 Compliant' },
        { num: 2, text: 'Open drain valve DV-02 to depressurize casing to 0.0 bar.', safety: 'High Pressure Hazard' },
        { num: 3, text: 'Remove suction strainer basket; flush debris with solvent.', safety: 'Wear Face Shield' },
        { num: 4, text: 'Inspect mechanical seal face for scoring; replace O-ring #8841.', safety: 'Torque to 45 Nm' },
      ],
    },
    thermal: {
      asset: 'MOT-312 (480V 3-Phase Induction)',
      errorCode: 'E-201',
      errorTitle: 'High Motor Winding Temperature',
      confidence: 93,
      pressure: 'Nominal',
      pressureStatus: 'Normal',
      temp: '88.6 °C',
      tempStatus: 'Overheat Warning (> 80°C)',
      vibration: '4.8 mm/s',
      anomaly: 'Thermal hotspot detected on drive-end bearing housing. Air intake louvers blocked by particulate accumulation.',
      rootCause: 'Restricted airflow coupled with degraded drive-end lithium grease causing thermal runaway (OEM Section 7.1).',
      loto: 'De-energize Motor Control Center MCC-2 Cubicle 4. Lock padlock HASP-10. Wait 15 mins for housing to cool < 40°C.',
      citation: 'Siemens_1LA_Motor_Manual.pdf (Page 18, Similarity 0.91)',
      hotspotName: 'Drive-End Bearing Hotspot',
      hotspotLoc: { x: '68%', y: '42%' },
      steps: [
        { num: 1, text: 'Lockout MCC-2 Cubicle 4 and attach technician tag.', safety: '480V Arc Flash Risk' },
        { num: 2, text: 'Vacuum cooling fins and clean intake fan shroud.', safety: 'Do Not Use Compressed Air' },
        { num: 3, text: 'Inject 15g Mobil Polyrex EM grease into purge port.', safety: 'Wipe excess clean' },
        { num: 4, text: 'Restart and monitor baseline temperature for 20 mins.', safety: 'Target < 65°C' },
      ],
    },
    nominal: {
      asset: 'COMP-018 (Rotary Screw Air Compressor)',
      errorCode: 'NOMINAL',
      errorTitle: 'Fleet Telemetry Operational',
      confidence: 99,
      pressure: '6.4 bar',
      pressureStatus: 'Nominal',
      temp: '62.0 °C',
      vibration: '1.8 mm/s',
      anomaly: 'Zero visual defects or leaks detected across casing, oil separator, and digital display.',
      rootCause: 'Equipment operating within baseline OEM tolerances. Preventive filter replacement due in 340 operating hours.',
      loto: 'No immediate LOTO required. Standard operating PPE (Steel-toe boots, Safety glasses).',
      citation: 'AtlasCopco_GA_Manual.pdf (Page 88, Similarity 0.98)',
      hotspotName: 'All Critical Points Nominal',
      hotspotLoc: { x: '50%', y: '50%' },
      steps: [
        { num: 1, text: 'Log differential pressure delta (0.2 bar).', safety: 'Logbook entry' },
        { num: 2, text: 'Verify oil level in sight glass center mark.', safety: 'Visual inspection' },
        { num: 3, text: 'Inspect belt tension frequency (42 Hz).', safety: 'Optical strobe test' },
      ],
    },
  };

  const current = scenarios[selectedScenario];

  const lifecycleSteps = [
    { num: '01', title: 'OBSERVE', desc: 'Capture image & telemetry', icon: <Camera className="w-3.5 h-3.5" />, badge: 'Multimodal' },
    { num: '02', title: 'DETECT', desc: 'Vision OCR & fault codes', icon: <Activity className="w-3.5 h-3.5" />, badge: 'Gemini 2.0' },
    { num: '03', title: 'DIAGNOSE', desc: 'Dense 768d RAG matching', icon: <BookOpen className="w-3.5 h-3.5" />, badge: 'pgvector' },
    { num: '04', title: 'VERIFY', desc: '100% LOTO safety audit', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: 'OSHA 1910' },
    { num: '05', title: 'REPAIR', desc: 'Guided physical sequence', icon: <Wrench className="w-3.5 h-3.5" />, badge: 'Step-by-Step' },
    { num: '06', title: 'RECORD', desc: 'Work order audit logging', icon: <FileCheck className="w-3.5 h-3.5" />, badge: 'Feedback RLHF' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Enterprise Nav Bar */}
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

        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onNavigateToLogin}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 rounded-lg transition-smooth shadow-xs"
          >
            Sign In
          </button>
          <button
            onClick={onNavigateToSignUp}
            className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-orange-glow transition-smooth flex items-center transform hover:scale-[1.02]"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-6 sm:px-12 flex-1 flex flex-col items-center justify-center text-center border-b border-slate-200 bg-gradient-to-b from-orange-50/50 via-amber-50/20 to-white overflow-hidden">
        {/* Animated Background Ambient Glows */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-24 right-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-5">
          {/* Status Eyebrow */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-amber-300 shadow-card-subtle text-[11px] font-bold text-amber-900 animate-float">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Industrial Diagnostic Engine v2.4 • Gemini Multimodal Vision + pgvector RAG</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Diagnose Machinery Breakdowns in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600">
              Seconds, Not Hours.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Empower service engineers with instant Vision AI fault inspection, 768-dimensional OEM manual retrieval, standardized error code intelligence, and 100% safety-grounded LOTO troubleshooting sequences.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToSignUp}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-orange-glow transition-smooth flex items-center justify-center transform hover:scale-105"
            >
              Get Started Free <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-card-subtle transition-smooth flex items-center justify-center transform hover:scale-105"
            >
              Launch Live Demo Cockpit
            </button>
          </div>
        </div>

        {/* Interactive Lifecycle Stages Bar */}
        <div className="w-full max-w-5xl mx-auto mt-12 pt-6 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Autonomous Field-Service Lifecycle Architecture
            </div>
            <span className="text-[10px] text-orange-600 font-bold font-mono">
              Click any stage to simulate →
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-left">
            {lifecycleSteps.map((step) => {
              const isSelected = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num as StepKey)}
                  className={`p-3 rounded-xl border text-left transition-smooth relative overflow-hidden group ${
                    isSelected
                      ? 'bg-white border-orange-400 shadow-card-hover ring-2 ring-orange-400/20'
                      : 'bg-white/80 border-slate-200 shadow-card-subtle hover:border-orange-300 hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                  )}
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1 font-bold">
                    <span className={isSelected ? 'text-orange-600' : 'text-slate-500'}>{step.num}</span>
                    <span className={isSelected ? 'text-orange-500 scale-110' : 'text-slate-400'}>
                      {step.icon}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🚀 LIVE INTERACTIVE WORKSTATION CANVAS WITH REAL-TIME FAULT SIMULATOR     */}
      {/* ========================================================================= */}
      <section className="py-14 px-6 sm:px-12 bg-white border-b border-slate-200 relative">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 text-[10px] font-bold">
                <Activity className="w-3 h-3 text-orange-500 animate-pulse" />
                <span>Live Interactive Telemetry & Vision Simulator</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Enterprise Field-Service Command Workstation
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Test real-time multimodal reasoning, sensor anomalies, and verified OEM citations.
              </p>
            </div>

            {/* Scenario Switcher Buttons */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 space-x-1 flex-shrink-0">
              <button
                onClick={() => setSelectedScenario('cavitation')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth flex items-center space-x-1.5 ${
                  selectedScenario === 'cavitation'
                    ? 'bg-white text-orange-600 shadow-card-subtle border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                <span>Fault E-101 (Cavitation)</span>
              </button>

              <button
                onClick={() => setSelectedScenario('thermal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth flex items-center space-x-1.5 ${
                  selectedScenario === 'thermal'
                    ? 'bg-white text-orange-600 shadow-card-subtle border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Thermometer className="w-3 h-3 text-amber-500" />
                <span>Fault E-201 (Thermal)</span>
              </button>

              <button
                onClick={() => setSelectedScenario('nominal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth flex items-center space-x-1.5 ${
                  selectedScenario === 'nominal'
                    ? 'bg-white text-emerald-700 shadow-card-subtle border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Nominal Fleet</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulation Dashboard Grid */}
          <div className="bg-[#FAFAFA] border border-slate-200 rounded-2xl p-5 shadow-card-hover space-y-5 text-left relative overflow-hidden">
            {/* Top Diagnostic HUD Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 gap-2">
              <div className="flex items-center space-x-2.5">
                <span className={`w-3 h-3 rounded-full ${selectedScenario === 'nominal' ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Diagnostic Copilot — Asset: {current.asset}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Model: ANSI Mark-3 • Status: {selectedScenario === 'nominal' ? 'Optimal' : 'Immediate Intervention Required'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px]">
                <span className="font-mono px-2.5 py-1 bg-orange-100 text-orange-800 border border-orange-200 rounded-lg font-bold flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-orange-600" />
                  Confidence: {current.confidence}%
                </span>
                <span className={`px-2.5 py-1 rounded-lg font-bold font-mono border ${
                  selectedScenario === 'nominal'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {current.errorCode}
                </span>
              </div>
            </div>

            {/* Split Screen: Live Machinery Visualizer (Left) & Multimodal Reasoning Cards (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 5 Cols: Visual Machinery Scanner Canvas */}
              <div className="lg:col-span-5 flex flex-col space-y-3">
                <div className="relative bg-slate-900 rounded-xl border border-slate-800 h-64 sm:h-72 overflow-hidden flex items-center justify-center p-3 shadow-inner group">
                  {/* Background Machinery Grid Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                  {/* Animated Laser Scanning Line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_12px_#f97316] animate-scanline z-20 pointer-events-none" />

                  {/* High-Tech Industrial Machinery Visual SVG Graphic */}
                  <svg className="w-full h-full max-h-52 z-10 text-slate-400" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Pump Housing / Volute */}
                    <circle cx="180" cy="120" r="65" stroke="#475569" strokeWidth="4" fill="#1e293b" />
                    <circle cx="180" cy="120" r="45" stroke="#f97316" strokeWidth="2" strokeDasharray="6 4" fill="#0f172a" />
                    <circle cx="180" cy="120" r="18" fill="#eab308" className="animate-spin" style={{ transformOrigin: '180px 120px', animationDuration: '6s' }} />

                    {/* Flange & Pipe Connectors */}
                    <rect x="30" y="105" width="85" height="30" rx="3" stroke="#475569" strokeWidth="3" fill="#1e293b" />
                    <rect x="15" y="98" width="18" height="44" rx="2" stroke="#f97316" strokeWidth="2" fill="#334155" />
                    <line x1="33" y1="120" x2="115" y2="120" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" />

                    {/* Motor Drive Shaft */}
                    <rect x="245" y="108" width="50" height="24" stroke="#64748b" strokeWidth="2" fill="#334155" />
                    <rect x="295" y="80" width="85" height="80" rx="6" stroke="#475569" strokeWidth="4" fill="#1e293b" />
                    {/* Cooling Fins */}
                    <line x1="310" y1="80" x2="310" y2="160" stroke="#64748b" strokeWidth="2" />
                    <line x1="330" y1="80" x2="330" y2="160" stroke="#64748b" strokeWidth="2" />
                    <line x1="350" y1="80" x2="350" y2="160" stroke="#64748b" strokeWidth="2" />
                    <line x1="370" y1="80" x2="370" y2="160" stroke="#64748b" strokeWidth="2" />

                    {/* Pressure Gauge Unit */}
                    <circle cx="85" cy="55" r="22" stroke="#f59e0b" strokeWidth="3" fill="#0f172a" />
                    <line x1="85" y1="55" x2="98" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="85" y1="77" x2="85" y2="105" stroke="#64748b" strokeWidth="3" />
                  </svg>

                  {/* Dynamic Clickable Pulsing Hotspot Marker */}
                  <div
                    style={{ left: current.hotspotLoc.x, top: current.hotspotLoc.y }}
                    onClick={() => setSelectedHotspot(current.hotspotName)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                  >
                    <span className="w-5 h-5 rounded-full bg-orange-500 animate-ping absolute -top-1 -left-1 opacity-75" />
                    <span className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-lg block" />

                    {/* Hotspot Floating Tooltip */}
                    <div className="absolute left-6 -top-3 w-48 p-2.5 bg-slate-900/95 backdrop-blur-md text-white text-[10px] rounded-xl border border-orange-500/50 shadow-2xl z-40 transition-smooth pointer-events-none">
                      <div className="flex items-center space-x-1 text-orange-400 font-bold mb-0.5">
                        <Eye className="w-3 h-3" />
                        <span>OCR Anomaly Pin</span>
                      </div>
                      <p className="font-bold text-slate-100">{current.hotspotName}</p>
                      <p className="text-slate-400 text-[9px] mt-0.5 font-mono">Conf: {current.confidence}% • Live Sensor</p>
                    </div>
                  </div>

                  {/* Telemetry HUD Badges overlay */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-slate-900/80 backdrop-blur-md rounded-md border border-slate-700 text-[10px] font-mono text-slate-300">
                    <span className="text-emerald-400">● LIVE</span> • {selectedHotspot}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-slate-900/80 backdrop-blur-md rounded-md border border-slate-700 text-[10px] font-mono text-orange-400 font-bold">
                    Discharge: {current.pressure}
                  </div>
                </div>

                {/* Sensor Gauges Pill Row */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      <Gauge className="w-3 h-3 mr-1 text-orange-500" /> Press
                    </div>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{current.pressure}</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      <Thermometer className="w-3 h-3 mr-1 text-amber-500" /> Temp
                    </div>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{current.temp}</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      <Activity className="w-3 h-3 mr-1 text-emerald-500" /> Vib
                    </div>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{current.vibration}</p>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Multimodal Diagnostic Reasoning Blocks */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Card 1: Visual Anomaly */}
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-card-subtle">
                    <div className="flex items-center text-orange-700 text-[11px] font-bold uppercase tracking-wider">
                      <Camera className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Visual Anomaly
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                      {current.anomaly}
                    </p>
                  </div>

                  {/* Card 2: Root Cause Analysis */}
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-card-subtle">
                    <div className="flex items-center text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                      <Wrench className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Root Cause Rationale
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                      {current.rootCause}
                    </p>
                  </div>
                </div>

                {/* Card 3: Mandatory LOTO Protocol */}
                <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl space-y-1.5 shadow-xs">
                  <div className="flex items-center text-rose-800 text-[11px] font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-600" /> Mandatory LOTO Energy Isolation Protocol
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px] font-semibold">
                    {current.loto}
                  </p>
                </div>

                {/* Interactive Troubleshooting Step Checklist */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-card-subtle">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span className="flex items-center">
                      <Wrench className="w-3 h-3 mr-1 text-emerald-600" />
                      Guided Remediation Sequence
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {checkedSteps.length} of {current.steps.length} Steps Validated
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {current.steps.map((step) => {
                      const isChecked = checkedSteps.includes(step.num);
                      return (
                        <div
                          key={step.num}
                          onClick={() => toggleCheckStep(step.num)}
                          className={`p-2 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-smooth ${
                            isChecked
                              ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                              isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-400 text-transparent'
                            }`}>
                              ✓
                            </div>
                            <span className={`text-[11px] ${isChecked ? 'line-through text-slate-500 font-medium' : 'font-medium'}`}>
                              {step.text}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                            {step.safety}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Citation & Action Footer */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="font-mono font-medium truncate max-w-sm">
                    📚 Citation: {current.citation}
                  </span>
                  <button
                    onClick={onExploreDemo}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center"
                  >
                    Open Live Diagnostic Workspace →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 3 CORE CAPABILITY ARCHITECTURE CARDS                                  */}
      {/* ========================================================================= */}
      <section className="py-16 px-6 sm:px-12 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Industrial AI Operating Platform
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto font-medium">
              Everything required to diagnose, repair, and audit complex mission-critical machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3.5 transition-smooth shadow-card-subtle group">
              <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-smooth">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Multimodal Vision AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Upload control panel readouts, thermal images, or mechanical damage. Extracts OCR error codes while keeping physical observations strictly separated from inferences.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] font-bold text-orange-600">
                <span>Gemini 2.0 Vision Engine</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3.5 transition-smooth shadow-card-subtle group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-smooth">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">OEM Knowledge Retrieval</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                768-dimensional dense vector embeddings in Supabase PostgreSQL pgvector. Retrieves exact page-numbered troubleshooting steps and electrical schematics.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] font-bold text-amber-700">
                <span>pgvector 768d Embeddings</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3.5 transition-smooth shadow-card-subtle group">
              <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-smooth">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Safety-Grounded LOTO</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Zero hazardous autonomous actuation. Mandates Lockout/Tagout energy isolation protocols and required PPE before any physical intervention.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] font-bold text-orange-600">
                <span>OSHA 1910.147 Compliant</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-14 border-t border-slate-200 bg-white px-6 sm:px-12 flex items-center justify-between text-xs text-slate-500">
        <div>© 2026 GearMind AI • Industrial Operations Edition</div>
        <div className="flex items-center space-x-4">
          <button onClick={onNavigateToLogin} className="hover:text-slate-900 font-medium">Login</button>
          <button onClick={onNavigateToSignUp} className="hover:text-slate-900 font-medium">Sign Up</button>
          <button onClick={onExploreDemo} className="hover:text-slate-900 font-medium">Cockpit Demo</button>
        </div>
      </footer>
    </div>
  );
};

