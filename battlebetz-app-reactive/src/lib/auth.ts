import { supabase } from './supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type User, type Session } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  username?: string;
  name?: string;
};

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export const signIn = async (credentials: SignInCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

export const signUp = async (credentials: SignUpCredentials) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email, 
      password: credentials.password,
      options: {
        data: {
          name: credentials.name || credentials.username || credentials.email.split('@')[0],
        }
      }
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { data: null, error };
  }
};

export const getUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    return { user, error: null };
  } catch (error) {
    console.error('Error getting user:', error);
    return { user: null, error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { data: null, error };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { data: null, error };
  }
};

// Client component specific auth client
export const createSupabaseClient = () => {
  return createClientComponentClient<Database>();
}; 