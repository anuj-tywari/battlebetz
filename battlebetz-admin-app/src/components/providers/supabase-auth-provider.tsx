'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase, createAuthenticatedClient } from '@/lib/supabase';
import { type SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase-types';

// Define the context shape
type SupabaseContextType = {
  supabase: SupabaseClient<Database>;
  isAuthenticated: boolean;
  hasCredentials: boolean;
  authError: string | null;
};

// Create the context with default values
const SupabaseContext = createContext<SupabaseContextType>({
  supabase,
  isAuthenticated: false,
  hasCredentials: false,
  authError: null,
});

// Provider component that wraps your app and provides the Supabase client
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Check if Supabase credentials are available
  const hasCredentials = useMemo(() => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);
  
  // Extract accessToken from session
  const accessToken = (session as any)?.accessToken;
  const isAuthenticated = status === 'authenticated' && !!accessToken;
  
  // Create a memoized Supabase client with the accessToken
  const supabaseClient = useMemo(() => {
    if (!hasCredentials) {
      console.warn('Missing Supabase credentials');
      return supabase; // Default client, but might not work properly
    }
    
    if (accessToken) {
      return createAuthenticatedClient(accessToken);
    }
    return supabase;
  }, [accessToken, hasCredentials]);

  // Set auth error if credentials are missing
  useEffect(() => {
    if (!hasCredentials && status !== 'loading') {
      setAuthError('Supabase credentials are missing. Please check your .env.local file.');
    } else if (status === 'unauthenticated') {
      setAuthError('You are not authenticated. Please log in.');
    } else {
      setAuthError(null);
    }
  }, [hasCredentials, status]);

  // Add logging to help debug
  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase Auth Provider State:', { 
      isAuthenticated, 
      hasCredentials,
      accessToken: accessToken ? 'present' : 'missing',
      authError
    });
  }

  return (
    <SupabaseContext.Provider value={{ supabase: supabaseClient, isAuthenticated, hasCredentials, authError }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Hook to use the Supabase client
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
} 