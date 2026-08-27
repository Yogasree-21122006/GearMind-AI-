import React, { useState } from 'react';
import { Sparkles, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordProps {
  onNavigateToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigateToLogin }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid technician email.');
      return;
    }

    setLoading(true);
    try {
      const { error: authErr } = await resetPassword(email);
      if (authErr) {
        setError(authErr.message || 'Failed to send password reset request.');
      } else {
        setSuccess('Password reset link sent to your email! Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-violet-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <div className="inline-flex w-10 h-10 rounded-md bg-gradient-to-br from-violet-600 to-indigo-700 items-center justify-center text-white shadow-ai-accent border border-violet-400/30 mb-2">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Reset Account Password</h2>
        <p className="text-xs text-slate-400">
          Enter your registered email address to receive a secure recovery link.
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

          {success && (
            <div className="mb-4 p-3 rounded-md bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-3.5 text-xs" onSubmit={handleSubmit}>
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
                  className="w-full pl-8 pr-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-600 transition-smooth"
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
                    Sending Recovery Link...
                  </>
                ) : (
                  <>
                    Send Recovery Link <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-xs text-slate-400">
            Remembered your credentials?{' '}
            <button
              onClick={onNavigateToLogin}
              className="font-bold text-violet-400 hover:text-violet-300 transition-colors underline"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
