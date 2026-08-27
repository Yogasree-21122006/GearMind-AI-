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
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: AuthError | Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    // 1. Get initial active session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user);
      }
      setLoading(false);
    });

    // 2. Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) return { error };

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

      return { error: null };
    } catch (err: any) {
      return { error: err };
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
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
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
        signUp,
        signIn,
        signOut,
        resetPassword,
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
