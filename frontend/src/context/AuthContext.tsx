import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id?: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  role: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isPasswordRecovery: boolean;
  setIsPasswordRecovery: (value: boolean) => void;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ data?: any; error: AuthError | Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      return hash.includes('type=recovery') || search.includes('type=recovery');
    }
    return false;
  });

  const fetchProfile = async (currentUser: User) => {
    try {
      // 1. Try fetching from technicians table
      const { data: techData, error: techErr } = await supabase
        .from('technicians')
        .select('*')
        .eq('email', currentUser.email)
        .maybeSingle();

      if (techData && !techErr) {
        setProfile({
          id: techData.id,
          full_name: techData.full_name || currentUser.user_metadata?.full_name || 'Technician',
          email: techData.email || currentUser.email || '',
          role: techData.role || currentUser.user_metadata?.role || 'Technician',
          specialization: techData.specialization || 'Field Operations',
        });
        return;
      }

      // 2. Fallback to user metadata
      setProfile({
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Technician',
        email: currentUser.email || '',
        role: currentUser.user_metadata?.role || 'Field Service Engineer',
        specialization: currentUser.user_metadata?.specialization || 'Mechanical & Electrical',
      });
    } catch {
      setProfile({
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Technician',
        email: currentUser.email || '',
        role: 'Field Service Engineer',
      });
    }
  };

  useEffect(() => {
    const handleAuthInit = async () => {
      if (typeof window === 'undefined') return;

      const fullUrl = window.location.href;
      const search = window.location.search || '';
      const hash = window.location.hash || '';

      // 1. Bulletproof Regex Token Extraction (handles single hash, double hash, query params)
      const accessMatch = fullUrl.match(/access_token=([^&#]+)/);
      const refreshMatch = fullUrl.match(/refresh_token=([^&#]+)/);
      const typeMatch = fullUrl.match(/type=([^&#]+)/);

      if (accessMatch && refreshMatch) {
        const accessToken = decodeURIComponent(accessMatch[1]);
        const refreshToken = decodeURIComponent(refreshMatch[1]);
        const type = typeMatch ? decodeURIComponent(typeMatch[1]) : '';

        try {
          const { data } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (data?.session) {
            setSession(data.session);
            setUser(data.session.user);
            if (type === 'recovery' || fullUrl.includes('type=recovery')) {
              setIsPasswordRecovery(true);
            }
            await fetchProfile(data.session.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Session establishment error:', e);
        }
      }

      // 2. Check if PKCE code is present (?code=...)
      if (search.includes('code=')) {
        const urlParams = new URLSearchParams(search);
        const code = urlParams.get('code');
        if (code) {
          try {
            const { data } = await supabase.auth.exchangeCodeForSession(code);
            if (data?.session) {
              setSession(data.session);
              setUser(data.session.user);
              if (search.includes('type=recovery') || hash.includes('type=recovery')) {
                setIsPasswordRecovery(true);
              }
              await fetchProfile(data.session.user);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('PKCE exchange error:', e);
          }
        }
      }

      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        setIsPasswordRecovery(true);
      }

      // 3. Fallback to active local session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user);
      }
      setLoading(false);
    };

    handleAuthInit();

    // 4. Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchProfile(newSession.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string = 'Technician') => {
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) return { error, data: null };

      // Record profile in technicians table if user created
      if (data.user) {
        try {
          const validRole = ['technician', 'senior_technician', 'supervisor', 'admin'].includes(role)
            ? role
            : 'technician';

          await supabase.from('technicians').upsert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            role: validRole,
          }, { onConflict: 'email' });
        } catch {
          // non-blocking if RLS or triggers handle it
        }
      }

      return { error: null, data };
    } catch (err: any) {
      return { error: err, data: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsPasswordRecovery(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      let { data: { session: currentSession } } = await supabase.auth.getSession();

      // If session is null, attempt to re-hydrate from hash tokens
      if (!currentSession && typeof window !== 'undefined') {
        const hash = window.location.hash || '';
        if (hash.includes('access_token')) {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          if (accessToken && refreshToken) {
            const { data } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            currentSession = data?.session ?? null;
          }
        }
      }

      if (!currentSession) {
        return {
          error: {
            message: 'Your password reset security token has expired or is invalid. Please request a fresh reset link from the Forgot Password page.',
            name: 'AuthSessionMissingError'
          } as any
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (!error) {
        // Sign out temporary recovery session so full app does not stay open in recovery mode
        await supabase.auth.signOut();
        setIsPasswordRecovery(false);
      }
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isPasswordRecovery,
        setIsPasswordRecovery,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
