import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ResetPasswordProps {
  onNavigateToLogin: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigateToLogin }) => {
  const { user, updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your confirm password.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateErr } = await updatePassword(password);
      if (updateErr) {
        setError(updateErr.message || 'Failed to reset password. The link may have expired.');
      } else {
        // Clean URL hash parameters
        if (window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToLogin = () => {
    // Clear URL hash
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    onNavigateToLogin();
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Too Short (Min 6 chars)', color: 'text-rose-500 bg-rose-50 border-rose-200' };
    if (password.length < 8) return { label: 'Medium', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (hasNumber && hasSpecial) return { label: 'Strong', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    return { label: 'Good', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <img
          src="/logo.png"
          alt="GearMind AI Logo"
          className="w-16 h-16 object-contain rounded-2xl mx-auto border border-orange-200 bg-white shadow-card-hover p-1 mb-2"
        />
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {isSuccess ? 'Password Reset Complete' : 'Set New Password'}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {isSuccess
            ? 'Your account credentials have been successfully updated.'
            : 'Enter and confirm your new secure password to restore technician access.'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-card-hover rounded-2xl sm:px-8">
          {isSuccess ? (
            /* Success Card State */
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900">Password Updated Successfully! 🎉</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Your new password is now active. Please return to the login page and sign in to access your GearMind AI copilot workspace.
                </p>
              </div>

              {email && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-bold">{email}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReturnToLogin}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-orange-glow transition-smooth flex items-center justify-center space-x-2"
                >
                  <span>Go to Login Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Reset Form */
            <div>
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                    <span className="font-medium">{error}</span>
                  </div>
                  {(error.toLowerCase().includes('expired') || error.toLowerCase().includes('session')) && (
                    <button
                      type="button"
                      onClick={handleReturnToLogin}
                      className="text-[11px] font-bold text-orange-600 hover:text-orange-700 underline block text-left"
                    >
                      ← Return to Sign In / Request New Reset Link
                    </button>
                  )}
                </div>
              )}

              <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
                {/* Email (Read-Only / Display) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Technician Work Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="technician@plant.oem.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth font-medium"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">New Password</label>
                    {strength.label && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${strength.color}`}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Confirm New Password</label>
                    {confirmPassword && password === confirmPassword && (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Passwords match
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements hint */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-[11px] text-amber-900">
                  <div className="flex items-center font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                    Security Best Practice
                  </div>
                  <p className="text-[10px] text-amber-800">
                    Use at least 6 characters with a combination of letters, numbers, and symbols.
                  </p>
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
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password & Secure Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-5 text-center text-xs text-slate-500">
                Changed your mind?{' '}
                <button
                  type="button"
                  onClick={handleReturnToLogin}
                  className="font-bold text-orange-600 hover:text-orange-700 transition-colors underline"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
