import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, upsertProfile } from '@/utils/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

// Define the context types
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, username: string, referred_by: string, isFantasyManager?: boolean) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign up with email and password
  const signup = async (email: string, password: string, username: string, referred_by: string, isFantasyManager: boolean = false) => {
    try {
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            is_fantasy_manager: isFantasyManager,
          },
        },
      });

      if (error) return { error };

      // Create profile in the profiles table
      if (data?.user) {
        const { error: profileError } = await upsertProfile({
          id: data.user.id,
          username,
          email,
          // Need to remove hardcoding in future
          bbz_balance: 100,
          referred_by,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) return { error: profileError };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'battlebetz://login',
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Create the value object
  const value = {
    session,
    user,
    loading,
    login,
    signup,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};