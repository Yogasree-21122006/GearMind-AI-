import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  Camera,
  BookOpen,
  ArrowRight,
  FileCheck,
  Wrench,
  Activity,
  ShieldCheck
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
  const lifecycleSteps = [
    { num: '01', title: 'OBSERVE', desc: 'Capture image & telemetry', icon: <Camera className="w-3.5 h-3.5" /> },
    { num: '02', title: 'DETECT', desc: 'Vision OCR & fault codes', icon: <Activity className="w-3.5 h-3.5" /> },
    { num: '03', title: 'DIAGNOSE', desc: 'Dense 768d RAG matching', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { num: '04', title: 'VERIFY', desc: '100% LOTO safety audit', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { num: '05', title: 'REPAIR', desc: 'Guided physical sequence', icon: <Wrench className="w-3.5 h-3.5" /> },
    { num: '06', title: 'RECORD', desc: 'Work order audit logging', icon: <FileCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Enterprise Nav Bar */}
      <nav className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center text-white shadow-orange-glow border border-orange-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold tracking-wider text-slate-900">MAINTENANCE</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-orange-100 text-orange-800 rounded border border-orange-200">
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
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 rounded-lg transition-smooth"
          >
            Sign In
          </button>
          <button
            onClick={onNavigateToSignUp}
            className="px-4 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-orange-glow transition-smooth flex items-center"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-6 sm:px-12 flex-1 flex flex-col items-center justify-center text-center border-b border-slate-200 bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-white">
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          {/* Status Eyebrow */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-amber-300 shadow-xs text-[11px] font-bold text-amber-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Industrial Field Diagnostic Engine v2.4 • Gemini Multimodal Vision + pgvector</span>
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
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-orange-glow transition-smooth flex items-center justify-center"
            >
              Get Started Free <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-card-subtle transition-smooth flex items-center justify-center"
            >
              Launch Live Demo Cockpit
            </button>
          </div>
        </div>

        {/* Maintenance Lifecycle Ribbon */}
        <div className="w-full max-w-5xl mx-auto mt-14 pt-8 border-t border-slate-200">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4 text-center">
            Autonomous Field-Service Lifecycle Architecture
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-left">
            {lifecycleSteps.map((step) => (
              <div
                key={step.num}
                className="p-3 bg-white border border-slate-200 rounded-lg shadow-card-subtle hover:border-orange-400 hover:shadow-card-hover transition-smooth"
              >
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1 font-bold">
                  <span>{step.num}</span>
                  <span className="text-orange-500">{step.icon}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product UI Preview Mockup Section */}
      <section className="py-16 px-6 sm:px-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Field-Service Command Workstation
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto font-medium">
              Real-time diagnosis combining multimodal vision observations, error codes, and verified OEM citations.
            </p>
          </div>

          {/* Interactive UI Preview Card */}
          <div className="bg-[#FAFAFA] border border-slate-200 rounded-xl p-5 shadow-card-hover space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-900">Diagnostic Copilot — Asset: PUMP-204 (Centrifugal Slurry)</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="font-mono px-2 py-0.5 bg-orange-100 text-orange-800 border border-orange-200 rounded-md font-bold">
                  AI Confidence: 96%
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-md font-bold">
                  Fault E-101
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Box 1: Visual Observation */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2 shadow-xs">
                <div className="flex items-center text-orange-700 text-[11px] font-bold uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Visual Anomaly
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Flange seal seepage detected on suction line. Digital readout indicates discharge pressure of 8.2 bar (&gt; 6.5 bar max rated limit).
                </p>
              </div>

              {/* Box 2: Root Cause Analysis */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2 shadow-xs">
                <div className="flex items-center text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                  <Wrench className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Root Cause Analysis
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Suction strainer partial blockage causing downstream cavitation and mechanical seal stress (Verified in OEM Manual Section 4.2).
                </p>
              </div>

              {/* Box 3: Safety & LOTO Protocol */}
              <div className="p-3.5 bg-white border border-rose-200 rounded-lg space-y-2 shadow-xs">
                <div className="flex items-center text-rose-700 text-[11px] font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-600" /> Mandatory LOTO
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Isolate 480V Breaker CB-3. Bleed residual pressure to 0 PSI before breaking suction flange bolts. Wear 1000V rated gloves.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono font-medium">Citation: FlowServe_Mark3_Manual.pdf (Page 42, Similarity 0.89)</span>
              <button
                onClick={onExploreDemo}
                className="text-orange-600 hover:text-orange-700 font-bold flex items-center"
              >
                Inspect Live Session →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Quadrant */}
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
            <div className="bg-white border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                <Camera className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Multimodal Vision AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Upload control panel readouts, thermal images, or mechanical damage. Extracts OCR error codes while keeping physical observations strictly separated from inferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-card-hover rounded-xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">OEM Knowledge Retrieval</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                768-dimensional dense vector embeddings in Supabase PostgreSQL pgvector. Retrieves exact page-numbered troubleshooting steps and electrical schematics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200 hover:border-orange-400 hover:shadow-card-hover rounded-xl p-5 space-y-3 transition-smooth shadow-card-subtle">
              <div className="w-9 h-9 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Safety-Grounded LOTO</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Zero hazardous autonomous actuation. Mandates Lockout/Tagout energy isolation protocols and required PPE before any physical intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-14 border-t border-slate-200 bg-white px-6 sm:px-12 flex items-center justify-between text-xs text-slate-500">
        <div>© 2026 Maintenance AI Copilot • Industrial Operations Edition</div>
        <div className="flex items-center space-x-4">
          <button onClick={onNavigateToLogin} className="hover:text-slate-900 font-medium">Login</button>
          <button onClick={onNavigateToSignUp} className="hover:text-slate-900 font-medium">Sign Up</button>
          <button onClick={onExploreDemo} className="hover:text-slate-900 font-medium">Cockpit Demo</button>
        </div>
      </footer>
    </div>
  );
};

