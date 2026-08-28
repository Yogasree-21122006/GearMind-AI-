import React, { useState } from 'react';
import {
  Camera,
  BookOpen,
  ArrowRight,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  AlertTriangle,
  Layers,
  HelpCircle,
  BarChart3,
  FileText,
  Lock,
  History,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onExploreDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToSignUp,
}) => {
  // Workflow section active step (01 to 06)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  // "How to Use" active tab (1 to 6)
  const [activeHowToStep, setActiveHowToStep] = useState<number>(1);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Workflow data
  const workflowData = [
    {
      num: '01',
      title: 'Inspect',
      subtitle: 'Upload an equipment image or provide maintenance information.',
      desc: 'Technicians capture high-resolution imagery of machinery components, control panel error displays, or fluid leaks directly on the plant floor.',
      previewTitle: 'Visual Capture & Telemetry Ingestion',
      previewDetails: 'Component: Centrifugal Slurry Pump • Input: Suction line digital readout photograph',
      highlightTag: 'Vision Ingestion',
    },
    {
      num: '02',
      title: 'Detect',
      subtitle: 'AI analyzes visual conditions, symptoms, and error codes.',
      desc: 'The vision model performs optical character recognition (OCR) on gauge readouts and separates physical surface wear from diagnostic conclusions.',
      previewTitle: 'OCR Anomaly Detection',
      previewDetails: 'Detected Error: E-101 • Gauge Reading: 8.2 bar (> 6.5 bar max threshold) • Anomaly: Flange seal seepage',
      highlightTag: 'OCR & Anomaly Extraction',
    },
    {
      num: '03',
      title: 'Diagnose',
      subtitle: 'The diagnostic engine identifies likely causes and provides confidence information.',
      desc: 'Multimodal reasoning cross-references detected error codes, visual parameters, and operating symptoms to isolate the probable mechanical root cause.',
      previewTitle: 'Root Cause Hypothesis',
      previewDetails: 'Diagnosis: Suction strainer partial obstruction causing cavitation • Confidence Score: 96%',
      highlightTag: 'Multimodal Reasoning',
    },
    {
      num: '04',
      title: 'Verify',
      subtitle: 'Relevant technical manuals and knowledge are retrieved to support the diagnosis.',
      desc: 'Dense 768-dimensional vector embeddings search indexed OEM manuals to extract exact paragraph citations, mechanical tolerances, and wiring schematics.',
      previewTitle: 'OEM Manual Retrieval (pgvector)',
      previewDetails: 'Citation: FlowServe_Mark3_Manual.pdf • Page 42, Section 4.2 • Cosine Similarity: 0.94',
      highlightTag: '768d Dense Retrieval',
    },
    {
      num: '05',
      title: 'Repair',
      subtitle: 'Follow structured troubleshooting and safety guidance.',
      desc: 'A verified step-by-step remediation plan is provided with mandatory Lockout/Tagout (LOTO) energy isolation protocols and calibrated torque limits.',
      previewTitle: 'Guided Remediation & LOTO',
      previewDetails: 'LOTO: Isolate 480V Breaker CB-3 • Pressure: Depressurize to 0.0 bar • Torque Spec: 45 Nm',
      highlightTag: 'OSHA Safety Grounded',
    },
    {
      num: '06',
      title: 'Record',
      subtitle: 'Capture the maintenance outcome and technician feedback.',
      desc: 'The resolution is recorded to the maintenance audit trail, capturing technician feedback and validation to continuously refine system intelligence.',
      previewTitle: 'Work Order Audit & Feedback',
      previewDetails: 'Work Order #WO-8841 Closed • Resolution Time: 28 mins • Technician Validation: 5 Stars',
      highlightTag: 'RLHF Audit Trail',
    },
  ];

  // "How to Use" step data
  const howToData = [
    {
      step: 1,
      title: 'Sign In',
      desc: 'Create an account or sign in to access your secure maintenance workspace and asset watchlist.',
      visual: {
        header: 'Authentication Workspace',
        body: 'Technician logged in with role-based access to industrial plant assets.',
        tag: 'Secure Workspace',
      },
    },
    {
      step: 2,
      title: 'Select Equipment',
      desc: 'Choose the asset from your registered fleet database or enter a new machine identifier.',
      visual: {
        header: 'Equipment Registry',
        body: 'Asset: PUMP-204 (ANSI Centrifugal Slurry Pump) • Criticality: High • Facility: North Plant',
        tag: 'Asset Selected',
      },
    },
    {
      step: 3,
      title: 'Inspect or Enter Symptoms',
      desc: 'Upload an equipment photo, enter an active fault code (e.g. E-101), or describe symptoms in plain language.',
      visual: {
        header: 'Multimodal Input',
        body: 'Image: pump_suction_line.jpg • Error Code: E-101 • Symptom: High discharge vibration',
        tag: 'Inputs Processed',
      },
    },
    {
      step: 4,
      title: 'Review AI Diagnosis',
      desc: 'Review the identified root cause, confidence score, and supporting OEM manual page citations.',
      visual: {
        header: 'Diagnostic Evaluation',
        body: 'Root Cause: Cavitation from strainer obstruction • Confidence: 96% • OEM Grounded: Yes',
        tag: 'Diagnosis Formulated',
      },
    },
    {
      step: 5,
      title: 'Follow Recommended Actions',
      desc: 'Execute the safety-verified sequence including Lockout/Tagout energy isolation and torque specifications.',
      visual: {
        header: 'Execution Checklist',
        body: '1. Lockout Breaker CB-3 • 2. Bleed to 0 PSI • 3. Flush 50-mesh strainer • 4. Torque to 45 Nm',
        tag: 'Safety Verified',
      },
    },
    {
      step: 6,
      title: 'Record the Outcome',
      desc: 'Save the completed maintenance record and provide technician feedback on diagnostic accuracy.',
      visual: {
        header: 'Maintenance History',
        body: 'Record saved to asset ledger • Downtime avoided: 2.5 hrs • Feedback: Accurate diagnosis',
        tag: 'History Updated',
      },
    },
  ];

  // FAQ data
  const faqData = [
    {
      q: 'What is GearMind AI?',
      a: 'GearMind AI is an autonomous field service assistant engineered for industrial technicians, maintenance engineers, and plant operations. It integrates multimodal vision AI, 768-dimensional OEM manual vector retrieval, and safety-grounded Lockout/Tagout (LOTO) protocols to accelerate troubleshooting and reduce equipment downtime.',
    },
    {
      q: 'Who is it designed for?',
      a: 'The platform is built specifically for industrial maintenance technicians, reliability engineers, field service personnel, and plant operations managers responsible for mission-critical mechanical, electrical, and hydraulic equipment.',
    },
    {
      q: 'What can the AI analyze?',
      a: 'The system analyzes equipment photographs (control panel displays, physical wear, fluid seepage), standardized diagnostic trouble codes (DTCs), operating symptoms, and temperature/pressure/vibration telemetry readouts.',
    },
    {
      q: 'Can I upload equipment images?',
      a: 'Yes. Technicians can upload photos taken from smartphones or ruggedized field tablets. The multimodal vision engine extracts OCR readouts and inspects visible physical abnormalities while keeping raw visual observations strictly separate from diagnostic conclusions.',
    },
    {
      q: 'How does the diagnostic assistant work?',
      a: 'The diagnostic assistant combines technician-provided symptoms, visual observations, and error codes with dense vector retrieval across uploaded OEM manuals. It cross-references the evidence to determine the probable root cause and supplies a step-by-step remediation plan.',
    },
    {
      q: 'Does it use technical manuals?',
      a: 'Yes. Official manufacturer service manuals, electrical schematics, and standard operating procedures (PDF/DOCX) are parsed and indexed as 768-dimensional dense vector embeddings in Supabase PostgreSQL pgvector. Queries retrieve exact page numbers and paragraph citations.',
    },
    {
      q: 'Does the system provide safety guidance?',
      a: 'Yes. In accordance with OSHA 1910.147 standards, the platform strictly mandates Lockout/Tagout (LOTO) energy isolation steps (e.g., electrical breaker isolation, residual pressure bleedoff, arc-flash PPE) prior to presenting physical disassembly instructions.',
    },
    {
      q: 'Can maintenance history be tracked?',
      a: 'Yes. Every diagnostic session and repair action is logged to an audit-ready maintenance history ledger. Technicians can review past interventions, examine recurring fault patterns, and evaluate fleet MTTR performance.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 🧭 PREMIUM STICKY NAVBAR                                                  */}
      {/* ========================================================================= */}
      <nav className="h-18 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between shadow-xs py-3.5">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/logo.png" alt="GearMind AI Logo" className="w-10 h-10 object-contain rounded-xl shadow-xs border border-orange-200 bg-white" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-black tracking-wider text-slate-900 uppercase">GEARMIND</span>
              <span className="text-xs font-extrabold px-2 py-0.5 bg-orange-100 text-orange-800 rounded-md border border-orange-200">
                AI COPILOT
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Autonomous Field Service Assistant
            </p>
          </div>
        </div>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center space-x-3.5">
          <button
            onClick={onNavigateToLogin}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 rounded-xl transition-smooth"
          >
            Sign In
          </button>
          <button
            onClick={onNavigateToSignUp}
            className="px-5 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-orange-glow transition-smooth flex items-center"
          >
            Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 🚀 HERO SECTION & CONCEPTUAL WORKFLOW VISUALIZATION                       */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-16 px-6 sm:px-12 border-b border-slate-200/80 bg-gradient-to-b from-orange-50/50 via-amber-50/20 to-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-amber-300 shadow-xs text-xs font-bold text-amber-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Industrial Field Diagnostic Intelligence</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Diagnose Machinery Problems <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600">
              Before They Become Downtime.
            </span>
          </h1>

          {/* Supporting line */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            An AI-powered maintenance copilot that helps technicians inspect equipment, identify faults, retrieve technical knowledge, and follow guided troubleshooting workflows.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onNavigateToSignUp}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-orange-glow transition-smooth flex items-center justify-center hover:translate-y-[-1px]"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-card-subtle transition-smooth flex items-center justify-center"
            >
              Explore How It Works
            </button>
          </div>

          {/* Hero Conceptual Workflow Mockup */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card-hover text-left space-y-5">
              {/* Header bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm font-bold text-slate-900">Equipment Diagnosis • Centrifugal Slurry Pump (PUMP-204)</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-3 py-1 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg font-bold">
                    Confidence: 96%
                  </span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold">
                    Fault Code E-101
                  </span>
                </div>
              </div>

              {/* 5-Step Conceptual Pipeline visualization */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                {/* Step 1: Equipment */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">1. Industrial Asset</div>
                  <div className="font-bold text-slate-900 text-sm">ANSI Centrifugal Pump</div>
                  <p className="text-xs text-slate-500 leading-snug">Operating at 8.2 bar discharge pressure</p>
                </div>

                {/* Step 2: Inspection */}
                <div className="p-3.5 bg-orange-50/40 border border-orange-200/60 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-orange-600 uppercase">2. AI Inspection</div>
                  <div className="font-bold text-slate-900 text-sm">Visual OCR Analysis</div>
                  <p className="text-xs text-slate-500 leading-snug">Identified suction line flange seepage</p>
                </div>

                {/* Step 3: Detection */}
                <div className="p-3.5 bg-amber-50/40 border border-amber-200/60 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-600 uppercase">3. Fault Detection</div>
                  <div className="font-bold text-slate-900 text-sm">Cavitation Risk</div>
                  <p className="text-xs text-slate-500 leading-snug">Discharge pressure exceeds 6.5 bar limit</p>
                </div>

                {/* Step 4: Diagnosis */}
                <div className="p-3.5 bg-orange-50/40 border border-orange-200/60 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-orange-600 uppercase">4. Diagnosis</div>
                  <div className="font-bold text-slate-900 text-sm">Strainer Blockage</div>
                  <p className="text-xs text-slate-500 leading-snug">Verified in OEM Manual Section 4.2</p>
                </div>

                {/* Step 5: Guided Repair */}
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-emerald-700 uppercase">5. Guided Action</div>
                  <div className="font-bold text-slate-900 text-sm">LOTO & Flush</div>
                  <p className="text-xs text-emerald-700 leading-snug">Isolate CB-3, flush 50-mesh basket</p>
                </div>
              </div>

              {/* Bottom Citation */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Retrieved from: <strong className="text-slate-800 font-semibold">FlowServe_Mark3_Manual.pdf</strong> (Page 42, Similarity 0.94)</span>
                <span className="text-emerald-700 font-bold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Evidence-Grounded
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🛡️ TRUST & VALUE STRIP                                                    */}
      {/* ========================================================================= */}
      <section className="py-14 px-6 sm:px-12 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Built for smarter maintenance decisions
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Value 1 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-[#FAFAFA] space-y-2 hover:border-orange-300 transition-smooth">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">AI Vision</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Inspect equipment visually and extract digital display readouts.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-[#FAFAFA] space-y-2 hover:border-amber-300 transition-smooth">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Diagnostic Intelligence</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Turn symptoms and error codes into structured probable causes.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-[#FAFAFA] space-y-2 hover:border-orange-300 transition-smooth">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">OEM Knowledge</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Retrieve relevant technical documentation and exact torque ratings.
              </p>
            </div>

            {/* Value 4 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-[#FAFAFA] space-y-2 hover:border-emerald-300 transition-smooth">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Safety Guidance</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Support structured Lockout/Tagout energy isolation workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📖 "HOW IT WORKS" (INTERACTIVE WORKFLOW SECTION)                           */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 px-6 sm:px-12 bg-[#FAFAFA] border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              From Inspection to Resolution
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-normal">
              A simple workflow for complex machinery problems.
            </p>
          </div>

          {/* 6-Step Interactive Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {workflowData.map((step, idx) => {
              const isSelected = activeWorkflowStep === idx + 1;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveWorkflowStep(idx + 1)}
                  className={`p-3.5 rounded-xl border text-left transition-smooth relative ${
                    isSelected
                      ? 'bg-white border-orange-500 shadow-card-hover ring-2 ring-orange-500/20'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                    <span className={isSelected ? 'text-orange-600' : 'text-slate-400'}>{step.num}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                  </div>
                  <div className="text-sm font-bold text-slate-900">{step.title}</div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{step.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Dynamic Central Visual Panel for Selected Step */}
          {(() => {
            const currentStep = workflowData[activeWorkflowStep - 1];
            return (
              <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-card-subtle grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
                {/* Left 7 cols: Step explanation */}
                <div className="md:col-span-7 space-y-3.5">
                  <div className="inline-flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                      {currentStep.num}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                      {currentStep.highlightTag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {currentStep.title} — {currentStep.subtitle}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {currentStep.desc}
                  </p>
                </div>

                {/* Right 5 cols: Structured UI Visual Card */}
                <div className="md:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 text-xs space-y-3 text-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-mono text-slate-400">Diagnostic Pipeline Stage {currentStep.num}</span>
                    <span className="text-xs font-mono text-orange-400 font-semibold">{currentStep.highlightTag}</span>
                  </div>

                  <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase">Current Telemetry & Observation</div>
                    <div className="text-sm font-bold text-white">{currentStep.previewTitle}</div>
                    <p className="text-xs text-slate-300 leading-snug">{currentStep.previewDetails}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Evidence-Backed RAG</span>
                    <span className="text-emerald-400 font-semibold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 💼 PRODUCT CAPABILITIES (ASYMMETRIC GRID)                                 */}
      {/* ========================================================================= */}
      <section id="capabilities" className="py-16 px-6 sm:px-12 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-10 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Everything a Maintenance Team Needs
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-normal">
              A comprehensive toolkit to inspect, diagnose, repair, and audit complex industrial machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: AI Visual Inspection */}
            <div className="bg-[#FAFAFA] border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3 transition-smooth flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">AI Visual Inspection</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Identify visible equipment abnormalities using AI-assisted image analysis. Detects fluid seepage, thermal hotspots, and surface defects.
                </p>
              </div>
            </div>

            {/* Card 2: Diagnostic Copilot */}
            <div className="bg-[#FAFAFA] border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3 transition-smooth flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Diagnostic Copilot</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Analyze symptoms and error codes to assist troubleshooting. Generates evidence-backed hypotheses with explicit confidence scores.
                </p>
              </div>
            </div>

            {/* Card 3: OEM Knowledge Library */}
            <div className="bg-[#FAFAFA] border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3 transition-smooth flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">OEM Knowledge Library</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Search technical manuals and relevant equipment documentation using 768-dimensional pgvector semantic indexing.
                </p>
              </div>
            </div>

            {/* Card 4: Error Code Intelligence */}
            <div className="bg-[#FAFAFA] border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3 transition-smooth flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Error Code Intelligence</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Understand standardized industrial error codes (e.g., E-101, E-201) and connect them immediately with verified causes and actions.
                </p>
              </div>
            </div>

            {/* Card 5: Maintenance History */}
            <div className="bg-[#FAFAFA] border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3 transition-smooth flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Maintenance History</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Track previous maintenance activities, resolution notes, and technician reviews to preserve institutional maintenance knowledge.
                </p>
              </div>
            </div>

            {/* Card 6: Analytics & KPIs */}
            <div className="bg-[#FAFAFA] border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-2xl p-6 space-y-3 transition-smooth flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Analytics & KPIs</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Understand equipment health distributions, Mean Time to Repair (MTTR), recurring failure Pareto distributions, and operational trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🔍 FEATURE SPOTLIGHT (3 ALTERNATING SECTIONS)                             */}
      {/* ========================================================================= */}
      <section id="spotlight" className="py-16 px-6 sm:px-12 bg-[#FAFAFA] border-b border-slate-200/80 space-y-16">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Spotlight 1: Visual Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
            <div className="md:col-span-6 space-y-3.5">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">Visual Intelligence</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                See problems before they become failures.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Visual inspection allows service engineers to upload smartphone photos of physical components or digital control panels. The vision engine automatically identifies visible abnormalities such as fluid seepage, belt wear, and overheating indications.
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pt-1 font-medium">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Digital gauge and OCR error code extraction</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Separation of raw observation from diagnostic inference</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Instant cross-referencing with machine operating parameters</li>
              </ul>
            </div>

            <div className="md:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-card-subtle space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs font-bold text-slate-700">
                <span>Visual Analysis Preview</span>
                <span className="text-orange-600 font-mono">OCR Extraction</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Detected Readout: 8.2 BAR</span>
                  <span className="text-xs px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-md font-bold">Overpressure</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Visible anomaly: Minor fluid seepage detected around the lower suction flange gasket.
                </p>
              </div>
            </div>
          </div>

          {/* Spotlight 2: Diagnostic Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
            <div className="md:col-span-6 md:order-2 space-y-3.5">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">Diagnostic Intelligence</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Turn symptoms into actionable root causes.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Instead of guessing or manually flipping through hundreds of manual pages, the diagnostic copilot combines symptoms and trouble codes to deliver probability-ranked root causes with transparent confidence scores.
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pt-1 font-medium">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Precise fault code mapping (e.g. Error Code E-101)</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Evidence-backed hypothesis with confidence ratings</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Low confidence fallback to prevent ungrounded hallucinations</li>
              </ul>
            </div>

            <div className="md:col-span-6 md:order-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-card-subtle space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs font-bold text-slate-700">
                <span>Diagnostic Result</span>
                <span className="text-emerald-700 font-mono text-xs font-bold">Confidence: 96%</span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold uppercase text-orange-800">Error Code E-101</div>
                  <div className="font-bold text-slate-900 text-sm">Probable Cause: High discharge pressure & cavitation</div>
                  <p className="text-xs text-slate-600 leading-relaxed">Suction strainer partial blockage causing downstream cavitation and mechanical seal stress.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 flex items-center justify-between">
                  <span>Recommended Action:</span>
                  <strong className="text-slate-900 font-bold">Inspect suction strainer flow</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 3: Knowledge at the Right Moment */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
            <div className="md:col-span-6 space-y-3.5">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">Knowledge Intelligence</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Technical knowledge at the right moment.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Dense vector search indexes your organization's OEM service manuals, wiring schematics, and equipment handbooks. When a technician encounters a problem, relevant excerpts are delivered immediately.
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pt-1 font-medium">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Sub-second vector search across multi-page PDF documents</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Exact page and section citations with similarity scores</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0" /> Direct access to calibrated torque limits and part numbers</li>
              </ul>
            </div>

            <div className="md:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-card-subtle space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs font-bold text-slate-700">
                <span>Knowledge Retrieval Search: "E-101"</span>
                <span className="text-slate-400 font-mono text-xs">3 Matches Found</span>
              </div>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                  <div className="font-bold text-slate-900">1. Pump Maintenance Manual (Section 4.2)</div>
                  <div className="text-xs text-slate-500">Suction strainer cleaning procedures & 45 Nm torque rating</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                  <div className="font-bold text-slate-900">2. Pressure System Troubleshooting Guide</div>
                  <div className="text-xs text-slate-500">Cavitation diagnostics and pressure relief valve settings</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                  <div className="font-bold text-slate-900">3. Standard Operating Procedure (SOP-014)</div>
                  <div className="text-xs text-slate-500">Lockout/Tagout energy isolation checklist for 480V pumps</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🚀 "HOW TO USE" ONBOARDING SECTION                                        */}
      {/* ========================================================================= */}
      <section id="how-to-use" className="py-16 px-6 sm:px-12 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-10 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How to Use GearMind AI
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-normal">
              A structured 6-step workflow designed for field technicians and engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 6 cols: Clickable step list */}
            <div className="lg:col-span-6 space-y-2.5">
              {howToData.map((item) => {
                const isSelected = activeHowToStep === item.step;
                return (
                  <div
                    key={item.step}
                    onClick={() => setActiveHowToStep(item.step)}
                    className={`p-4 rounded-xl border transition-smooth cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/60 border-orange-400 shadow-xs'
                        : 'bg-[#FAFAFA] border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <span className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.step}
                      </span>
                      <div className="space-y-0.5">
                        <div className={`text-sm font-bold ${isSelected ? 'text-orange-900' : 'text-slate-900'}`}>
                          {item.title}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 6 cols: Step Visual Card */}
            <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-7 border border-slate-800 text-white space-y-4 shadow-card-hover">
              {(() => {
                const current = howToData[activeHowToStep - 1];
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono text-slate-400">Step 0{current.step} Interface Preview</span>
                      <span className="text-xs px-2.5 py-0.5 bg-orange-900/60 text-orange-300 border border-orange-700/50 rounded font-semibold">
                        {current.visual.tag}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-bold text-white">{current.visual.header}</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{current.visual.body}</p>
                    </div>

                    <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-xs sm:text-sm text-slate-300 space-y-1">
                      <div className="text-xs font-bold text-slate-400 uppercase">Workflow Action</div>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium">{current.desc}</p>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                      <span>Standard Operating Protocol</span>
                      <span className="text-emerald-400 font-bold font-mono">100% Verified</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🛡️ DEDICATED SAFETY SECTION                                               */}
      {/* ========================================================================= */}
      <section id="safety" className="py-16 px-6 sm:px-12 bg-[#FAFAFA] border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-10 text-left">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safety-First Engineering</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Designed with Maintenance Safety in Mind
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-normal">
              Zero hazardous autonomous actuation. Built around OSHA 1910.147 Lockout/Tagout energy isolation standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-card-subtle">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">LOTO Protocol Awareness</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Mandates electrical breaker lockout and hasp tagging before presenting mechanical repair instructions.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-card-subtle">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Structured Troubleshooting</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Follows standardized sequential checklists to eliminate skipped safety steps or omitted residual pressure checks.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-card-subtle">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Technician Verification</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Maintains human-in-the-loop validation, ensuring certified technicians verify zero voltage before physical contact.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-card-subtle">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Evidence-Backed Guidance</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Every torque specification and clearance limit is cited directly from OEM manufacturer service documentation.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-card-subtle">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Critical Condition Warnings</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                High-visibility alert banners flag overpressure, high-voltage arc flash risks, and thermal runaway hazards.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-card-subtle">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <History className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Audit-Ready Safety Logs</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Full documentation of all Lockout/Tagout verifications and maintenance sign-offs preserved for safety compliance audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🔄 WHY GEARMIND AI? (WORKFLOW TRANSFORMATION)                             */}
      {/* ========================================================================= */}
      <section className="py-16 px-6 sm:px-12 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-10 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              From Reactive Maintenance to AI-Assisted Decisions
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-normal">
              Compare the traditional troubleshooting path with the AI-guided workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Traditional Workflow */}
            <div className="p-6 bg-[#FAFAFA] border border-slate-200 rounded-2xl space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Traditional Workflow</div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mr-3">1</span>
                  Machinery breakdown occurs unexpectedly
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mr-3">2</span>
                  Manual search through paper manuals & binders
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mr-3">3</span>
                  Trial-and-error manual diagnosis by individual tech
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mr-3">4</span>
                  Unstructured repair with risk of forgotten LOTO
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mr-3">5</span>
                  Resolution details lost without centralized audit
                </div>
              </div>
            </div>

            {/* Column 2: AI-Assisted Workflow */}
            <div className="p-6 bg-orange-50/30 border border-orange-200 rounded-2xl space-y-4">
              <div className="text-xs font-bold text-orange-700 uppercase tracking-wider">AI-Assisted Workflow</div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-white border border-orange-200 rounded-xl text-slate-800 font-medium flex items-center shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold mr-3">1</span>
                  Upload component photo or enter active error code
                </div>
                <div className="p-3.5 bg-white border border-orange-200 rounded-xl text-slate-800 font-medium flex items-center shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold mr-3">2</span>
                  Sub-second 768d pgvector search across OEM manuals
                </div>
                <div className="p-3.5 bg-white border border-orange-200 rounded-xl text-slate-800 font-medium flex items-center shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold mr-3">3</span>
                  Evidence-backed root cause with transparent confidence
                </div>
                <div className="p-3.5 bg-white border border-orange-200 rounded-xl text-slate-800 font-medium flex items-center shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold mr-3">4</span>
                  Mandatory OSHA 1910 LOTO energy isolation verification
                </div>
                <div className="p-3.5 bg-white border border-orange-200 rounded-xl text-slate-800 font-medium flex items-center shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold mr-3">5</span>
                  Work order logged to history with technician feedback
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🏢 ABOUT US SECTION                                                       */}
      {/* ========================================================================= */}
      <section id="about" className="py-16 px-6 sm:px-12 bg-[#FAFAFA] border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-8 text-left">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 text-slate-800 text-xs font-bold">
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Project Vision & Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Built to Make Industrial Maintenance Smarter
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-normal">
              An engineering-grounded approach to industrial diagnostic assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-card-subtle">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-orange-600">The Problem</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Industrial machinery downtime costs manufacturing facilities thousands of dollars per hour. Technicians face complex documentation, unstandardized trouble codes, and hazardous energy sources.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-card-subtle">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-orange-600">The Technology</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                We combine Gemini 2.0 Multimodal Vision AI for physical anomaly inspection with Supabase PostgreSQL pgvector 768-dimensional embeddings to guarantee grounded, non-hallucinated citations.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-card-subtle">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-orange-600">The Goal</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                To equip field technicians with an intuitive, safety-grounded copilot that accelerates diagnosis, ensures full Lockout/Tagout compliance, and preserves organizational maintenance intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ❓ FREQUENTLY ASKED QUESTIONS (ACCORDION)                                 */}
      {/* ========================================================================= */}
      <section id="faq" className="py-16 px-6 sm:px-12 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              <span>Clear Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-normal">
              Everything you need to know about GearMind AI's vision engine, vector search, and safety protocols.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {faqData.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-[#FAFAFA] transition-smooth"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-900 hover:text-orange-600 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'transform rotate-180 text-orange-500' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-200/60 pt-3.5 bg-white">
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
      {/* 🚀 FINAL CALL TO ACTION (CTA)                                             */}
      {/* ========================================================================= */}
      <section className="py-16 px-6 sm:px-12 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white text-center shadow-lg relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Ready to Make Maintenance Smarter?
          </h2>
          <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto font-normal leading-relaxed">
            Inspect equipment. Understand failures. Act with confidence.
          </p>

          <div className="pt-2">
            <button
              onClick={onNavigateToSignUp}
              className="px-8 py-3.5 bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm rounded-xl shadow-card-hover transition-smooth inline-flex items-center"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🏢 CLEAN ENTERPRISE FOOTER                                                */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-white px-6 sm:px-12 py-8 text-sm text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="GearMind AI Logo" className="w-9 h-9 object-contain rounded-xl border border-orange-200 bg-white shadow-xs" />
            <span className="font-bold text-slate-900 text-base uppercase">GearMind AI</span>
            <span className="text-sm text-slate-400 font-medium">• Autonomous Field Service Assistant</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500 font-medium">
            <div>© 2026 GearMind AI. All rights reserved.</div>
            <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>OSHA 1910.147 LOTO Safety Aligned</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
