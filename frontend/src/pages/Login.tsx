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
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-violet-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <div className="inline-flex w-10 h-10 rounded-md bg-gradient-to-br from-violet-600 to-indigo-700 items-center justify-center text-white shadow-ai-accent border border-violet-400/30 mb-2">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Technician Portal Login</h2>
        <p className="text-xs text-slate-400">
          Sign in to access AI diagnostics, OEM manual pgvector search, and safety cockpits.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#101726] border border-[#1E293B] py-7 px-6 shadow-2xl rounded-lg sm:px-8">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-3.5 text-xs" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Technician Work Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="technician@plant.oem.com"
                  className="w-full pl-8 pr-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-600 focus:border-violet-600 transition-smooth"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
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
                  className="w-full pl-8 pr-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-600 focus:border-violet-600 transition-smooth"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-md shadow-card-subtle transition-smooth flex items-center justify-center ${
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

          {/* Quick Demo Fill Shortcut for Reviews */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Evaluation preset:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-violet-400 hover:text-violet-300 font-semibold flex items-center"
            >
              <KeyRound className="w-3 h-3 mr-1" /> Quick Demo Fill
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="font-bold text-violet-400 hover:text-violet-300 transition-colors underline"
            >
              Register Technician Profile
            </button>
          </div>

          {onBackToLanding && (
            <div className="mt-3 text-center">
              <button
                onClick={onBackToLanding}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
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

