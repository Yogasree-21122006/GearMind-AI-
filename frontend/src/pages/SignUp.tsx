import React, { useState } from 'react';
import { Sparkles, Mail, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const { error: authErr } = await signUp(email, password, fullName, role);
      if (authErr) {
        setError(authErr.message || 'Registration failed. Please check credentials.');
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
        <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 items-center justify-center text-white shadow-orange-glow border border-orange-300 mb-1">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-black tracking-tight text-slate-900">Create Technician Account</h2>
        <p className="text-xs text-slate-500 font-medium">
          Register with Supabase Authentication to access multimodal field diagnostics.
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

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Wright"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Email</label>
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

            {/* Role selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role / Authorization Level</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
              >
                <option value="technician">Field Service Technician</option>
                <option value="senior_technician">Senior Diagnostic Engineer</option>
                <option value="supervisor">Maintenance Supervisor</option>
                <option value="admin">Plant Reliability Admin</option>
              </select>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-smooth"
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
                    Creating Profile...
                  </>
                ) : (
                  <>
                    Complete Registration <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="font-bold text-orange-600 hover:text-orange-700 transition-colors underline"
            >
              Sign In Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
