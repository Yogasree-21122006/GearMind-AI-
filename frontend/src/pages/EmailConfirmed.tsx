import React from 'react';
import { CheckCircle2, ArrowRight, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EmailConfirmedProps {
  onNavigateToLogin: () => void;
}

export const EmailConfirmed: React.FC<EmailConfirmedProps> = ({ onNavigateToLogin }) => {
  const { user, signOut } = useAuth();

  const handleContinue = async () => {
    // Clear URL hash / query parameters
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    await signOut();
    onNavigateToLogin();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <img
          src="/logo.png"
          alt="GearMind AI Logo"
          className="w-16 h-16 object-contain rounded-2xl mx-auto border border-orange-200 bg-white shadow-card-hover p-1 mb-2"
        />
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-bold shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Identity Confirmed</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Email Verified Successfully ✓
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Your GearMind AI workspace is ready.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-card-hover rounded-2xl sm:px-8 text-center space-y-6">
          {/* Pulsing check animation */}
          <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-black text-slate-900">
              Welcome to GearMind AI Copilot! 👋
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your email address has been verified. You now have full access to autonomous equipment diagnostics, OEM manual pgvector search, and safety compliance cockpits.
            </p>
          </div>

          {user?.email && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-bold">{user.email}</span>
            </div>
          )}

          {/* Capabilities highlight */}
          <div className="p-3.5 bg-orange-50/60 border border-orange-200/80 rounded-xl text-left space-y-2 text-xs">
            <p className="font-bold text-orange-950 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
              What's unlocked for your profile:
            </p>
            <ul className="text-[11px] text-slate-700 space-y-1">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 flex-shrink-0" />
                Autonomous Multimodal Vision Inspection
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 flex-shrink-0" />
                Grounded 768d pgvector OEM Manual Citations
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 flex-shrink-0" />
                LOTO Safety Verification & Work Order History
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-orange-glow transition-smooth flex items-center justify-center space-x-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            Autonomous Field Service Assistant • Enterprise Diagnostic Engine
          </p>
        </div>
      </div>
    </div>
  );
};
