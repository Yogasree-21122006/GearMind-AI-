import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { TabKey } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { EmailConfirmed } from './pages/EmailConfirmed';
import { Dashboard } from './pages/Dashboard';
import { Assets } from './pages/Assets';
import { ImageUpload } from './pages/ImageUpload';
import { ManualLibrary } from './pages/ManualLibrary';
import { DiagnosticAssistant } from './pages/DiagnosticAssistant';
import { MaintenanceHistory } from './pages/MaintenanceHistory';
import { Feedback } from './pages/Feedback';
import { Analytics } from './pages/Analytics';
import { EvaluationDashboard } from './pages/EvaluationDashboard';
import { Settings } from './pages/Settings';
import { Loader2 } from 'lucide-react';

type AuthView = 'landing' | 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'email-confirmed' | 'app';

const AppContent: React.FC = () => {
  const { user, profile, loading, signOut, isPasswordRecovery, setIsPasswordRecovery } = useAuth();
  const [authView, setAuthView] = useState<AuthView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        return 'reset-password';
      }
      if (hash.includes('type=signup') || search.includes('type=signup') || hash.includes('type=email_change')) {
        return 'email-confirmed';
      }
    }
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  // Sync recovery state with authView
  useEffect(() => {
    if (isPasswordRecovery) {
      setAuthView('reset-password');
    }
  }, [isPasswordRecovery]);

  // Sync authentication state with views
  useEffect(() => {
    if (!loading) {
      if (user && !isPasswordRecovery && authView !== 'reset-password' && authView !== 'email-confirmed') {
        // If logged in and on login/signup, route to application cockpit
        if (authView === 'login' || authView === 'signup' || authView === 'forgot-password') {
          setAuthView('app');
        }
      }
    }
  }, [user, loading, isPasswordRecovery, authView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07050A] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-xs font-mono text-orange-300">Synchronizing Supabase Auth & Copilot Session...</p>
      </div>
    );
  }

  // 0. Dedicated Password Reset View (Triggered via email recovery link)
  if (authView === 'reset-password' || isPasswordRecovery) {
    return (
      <ResetPassword
        onNavigateToLogin={() => {
          setIsPasswordRecovery(false);
          setAuthView('login');
        }}
      />
    );
  }

  // 0.1 Dedicated Email Confirmation Success View (Triggered via signup email link)
  if (authView === 'email-confirmed') {
    return (
      <EmailConfirmed
        onNavigateToLogin={() => {
          setAuthView('login');
        }}
      />
    );
  }

  // 1. Landing Page
  if (authView === 'landing' && !user) {
    return (
      <LandingPage
        onNavigateToLogin={() => setAuthView('login')}
        onNavigateToSignUp={() => setAuthView('signup')}
        onExploreDemo={() => setAuthView('app')}
      />
    );
  }

  // 2. Sign Up Page
  if (authView === 'signup' && !user) {
    return (
      <SignUp
        onNavigateToLogin={() => setAuthView('login')}
        onSignUpSuccess={() => setAuthView('login')}
      />
    );
  }

  // 3. Forgot Password Page
  if (authView === 'forgot-password' && !user) {
    return (
      <ForgotPassword
        onNavigateToLogin={() => setAuthView('login')}
      />
    );
  }

  // 4. Login Page
  if ((authView === 'login' || !user) && authView !== 'app') {
    return (
      <Login
        onNavigateToSignUp={() => setAuthView('signup')}
        onNavigateToForgotPassword={() => setAuthView('forgot-password')}
        onLoginSuccess={() => setAuthView('app')}
        onBackToLanding={() => setAuthView('landing')}
      />
    );
  }

  const titles: Record<TabKey, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Field Operations & AI Diagnostic Dashboard',
      subtitle: 'Real-time telemetry, asset health, and diagnostic session status',
    },
    assets: {
      title: 'Equipment & Industrial Assets',
      subtitle: 'Inventory, machine specifications, and active status tracking',
    },
    image_upload: {
      title: 'Multimodal Visual Inspection Staging',
      subtitle: 'Upload nameplates, thermal imaging, and damaged components for AI inspection',
    },
    manuals: {
      title: 'Technical Manuals & Document Library',
      subtitle: 'OEM manuals, electrical schematics, and vector chunking status',
    },
    diagnostic: {
      title: 'Diagnostic Assistant & Safety Cockpit',
      subtitle: 'Grounded RAG troubleshooting sequences with verifiable citations',
    },
    history: {
      title: 'Equipment Maintenance History',
      subtitle: 'Historical work orders, root cause analysis, and corrective actions',
    },
    feedback: {
      title: 'Technician Validation & Feedback Log',
      subtitle: 'Human-in-the-loop accuracy verification and safety auditing',
    },
    analytics: {
      title: 'Maintenance Analytics & KPIs',
      subtitle: 'MTTR, first-time fix rate, and AI source grounding metrics',
    },
    evaluation: {
      title: 'AI Evaluation & Quality Gate Dashboard',
      subtitle: 'Quantitative benchmarks across Retrieval, Vision, Grounding, Safety, and Latency',
    },
    settings: {
      title: 'System Settings & Architecture Status',
      subtitle: 'Supabase database connection, vector configurations, and environment status',
    },
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'assets':
        return <Assets />;
      case 'image_upload':
        return <ImageUpload />;
      case 'manuals':
        return <ManualLibrary />;
      case 'diagnostic':
        return <DiagnosticAssistant />;
      case 'history':
        return <MaintenanceHistory />;
      case 'feedback':
        return <Feedback />;
      case 'analytics':
        return <Analytics />;
      case 'evaluation':
        return <EvaluationDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const handleLogout = async () => {
    await signOut();
    setAuthView('landing');
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={titles[activeTab].title}
      subtitle={titles[activeTab].subtitle}
      profile={profile}
      onLogout={handleLogout}
    >
      {renderActivePage()}
    </MainLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};
export default App;
