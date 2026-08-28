import React, { useState } from 'react';
import { Mail, User, ArrowRight, Loader2, AlertCircle, CheckCircle2, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface SignUpProps {
  onNavigateToLogin: () => void;
  onSignUpSuccess?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigateToLogin, onSignUpSuccess }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('technician');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResendConfirmation = async () => {
    if (!email) return;
    setResending(true);
    setResendSuccess(null);
    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (resendErr) {
        setError(resendErr.message);
      } else {
        setResendSuccess('Activation link resent! Please check your email inbox and spam folder.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid work email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authErr } = await signUp(email, password, fullName, role);
      if (authErr) {
        setError(authErr.message || 'Registration failed. Please check credentials.');
      } else {
        // If Supabase requires email verification (session is null)
        if (data?.user && !data?.session) {
          setNeedsEmailConfirmation(true);
        } else {
          setSuccess('Account created successfully! Redirecting to technician portal...');
          setTimeout(() => {
            if (onSignUpSuccess) {
              onSignUpSuccess();
            } else {
              onNavigateToLogin();
            }
          }, 1200);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <img src="/logo.png" alt="GearMind AI Logo" className="w-16 h-16 object-contain rounded-2xl mx-auto border border-orange-200 bg-white shadow-card-hover p-1 mb-2" />
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {needsEmailConfirmation ? 'Account Activation Required' : 'Create GearMind AI Account'}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {needsEmailConfirmation
            ? 'A confirmation link has been sent to activate your account.'
            : 'Register with Supabase Authentication to access multimodal field diagnostics.'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-card-hover rounded-2xl sm:px-8">
          {needsEmailConfirmation ? (
            /* Email Confirmation Required State */
            <div className="space-y-5 text-center py-1">
              <div className="w-16 h-16 bg-orange-50 border-2 border-orange-200 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900">Check Your Email Inbox! 📬</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  We've sent a secure activation link to:
                </p>
                <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl text-xs font-mono text-orange-950 font-bold">
                  {email}
                </div>
              </div>

              {resendSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{resendSuccess}</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs text-slate-700">
                <p className="font-bold text-slate-900 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-orange-500" />
                  Activation Instructions:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
                  <li>Open the email sent by <strong>Supabase / GearMind</strong>.</li>
                  <li>Click on <strong>Confirm your email</strong> link.</li>
                  <li>Return and sign in with your password.</li>
                </ol>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-orange-glow transition-smooth flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-xl transition-smooth"
                >
                  {resending ? 'Resending Link...' : 'Resend Activation Email'}
                </button>
              </div>
            </div>
          ) : (
            /* Standard Registration Form */
            <div>
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span className="font-medium">{success}</span>
                </div>
              )}

              <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Yoga S."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth font-medium"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="technician@plant.oem.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth font-medium"
                    />
                  </div>
                </div>

                {/* Role selection */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Role / Authorization Level</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs font-semibold"
                  >
                    <option value="technician">Field Service Technician</option>
                    <option value="senior_technician">Senior Diagnostic Engineer</option>
                    <option value="supervisor">Maintenance Supervisor</option>
                    <option value="admin">Plant Reliability Admin</option>
                  </select>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Confirm</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-orange-glow transition-smooth flex items-center justify-center space-x-2 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-5 text-center text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  onClick={onNavigateToLogin}
                  className="font-bold text-orange-600 hover:text-orange-700 transition-colors underline"
                >
                  Sign In Here
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
