import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ArrowRight, Loader2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: () => void;
  onBackToLanding?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onLoginSuccess,
  onBackToLanding,
}) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error: authErr } = await signIn(email, password);
      if (authErr) {
        setError(authErr.message || 'Invalid email or password. Please try again.');
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('demo.technician@maintenance.ai');
    setPassword('DemoPass2026!');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 items-center justify-center text-white shadow-orange-glow border border-orange-300 mb-1">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-black tracking-tight text-slate-900">Technician Portal Login</h2>
        <p className="text-xs text-slate-500 font-medium">
          Sign in to access AI diagnostics, OEM manual pgvector search, and safety cockpits.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white border border-slate-200 py-7 px-6 shadow-card-hover rounded-2xl sm:px-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Technician Work Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="technician@plant.oem.com"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-[10px] text-orange-600 hover:text-orange-700 font-bold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-orange-glow transition-smooth flex items-center justify-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Authenticating Credentials...
                  </>
                ) : (
                  <>
                    Sign In to Copilot <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Fill Shortcut */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Evaluation preset:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center"
            >
              <KeyRound className="w-3 h-3 mr-1" /> Quick Demo Fill
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="font-bold text-orange-600 hover:text-orange-700 transition-colors underline"
            >
              Register Technician Profile
            </button>
          </div>

          {onBackToLanding && (
            <div className="mt-3 text-center">
              <button
                onClick={onBackToLanding}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-medium transition-colors"
              >
                ← Back to Landing Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
