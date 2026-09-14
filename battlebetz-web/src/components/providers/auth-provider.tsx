"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { 
  supabase,
  getCurrentUser as getSupabaseUser,
  createOrUpdateProfile, 
  signUpWithCredentials as supabaseSignUp,
  type AuthResponse,
  checkUserAuthProfileMismatch 
} from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

type AuthContextType = {
  user: UserProfile | null;
  session: any;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, username: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const router = useRouter();
  
  // Use NextAuth session
  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Debug auth state changes
  useEffect(() => {
    console.log('[AuthProvider] Auth state changed:', { 
      status, 
      isAuthenticated, 
      isLoading: isSessionLoading || isLoadingProfile,
      hasSession: !!session,
      sessionUser: session?.user?.id ? `ID: ${session.user.id}` : 'No user ID',
      hasUserObject: !!user
    });
  }, [status, isAuthenticated, session, isSessionLoading, isLoadingProfile, user]);

  // Fetch user profile from Supabase when NextAuth session exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Only proceed if authenticated and if user profile not already loaded
      if (isAuthenticated && session?.user?.id) {
        try {
          setIsLoadingProfile(true);
          console.log('[AuthProvider] Fetching user profile for user ID:', session.user.id);
          
          // Try to get user with the session ID
          let { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .limit(1);
            
          // If no user found and there's an email in the session, try finding by email
          if ((!data || data.length === 0) && session?.user?.email) {
            console.log('[AuthProvider] No user found by ID, trying email:', session.user.email);
            const { data: emailData, error: emailError } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .limit(1);
              
            if (!emailError && emailData && emailData.length > 0) {
              console.log('[AuthProvider] User found by email');
              data = emailData;
              error = null;
            }
          }
          
          if (error) {
            console.error('[AuthProvider] Error fetching profile:', error);
            throw error;
          }
          
          // Check if any data was returned
          if (data && data.length > 0) {
            console.log('[AuthProvider] User profile found:', data[0].username);
            setUser(data[0]);
            setError(null);
          } else {
            console.log('[AuthProvider] No profile found, creating one...');
            // Try comprehensive repair function
            await checkAndRepairUserProfile();
          }
        } catch (err) {
          console.error('[AuthProvider] Profile fetch error:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
        } finally {
          setIsLoadingProfile(false);
        }
      } else if (status === 'unauthenticated') {
        // Ensure we clear user data and loading state when unauthenticated
        console.log('[AuthProvider] User is unauthenticated, clearing user data');
        setUser(null);
        setError(null);
        setIsLoadingProfile(false);
      } else if (isSessionLoading) {
        // Just log if we're still loading the session
        console.log('[AuthProvider] Session still loading...');
      }
    };

    fetchUserProfile();
  }, [session, status, isAuthenticated]);

  // Sign in with NextAuth and get user profile
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Use NextAuth for authentication
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error(result?.error || 'Failed to sign in');
      }

      // After successful sign-in, get user profile from Supabase
      const { data, error } = await getSupabaseUser();
      
      // Check for and fix any auth/profile mismatches
      await checkAndRepairUserProfile();
      
      return { data, error };
    } catch (err) {
      console.error('Error signing in:', err);
      const error = err instanceof Error ? err : new Error('Failed to sign in');
      setError(error);
      return { data: { user: null, session: null }, error };
    }
  };

  // Sign up user in Supabase then sign in with NextAuth
  const signUp = async (email: string, password: string, username: string): Promise<AuthResponse> => {
    try {
      // Create account with Supabase
      const { data: authData, error: authError } = await supabaseSignUp(email, password, username);

      if (authError) throw authError;
      
      // After successful signup, fetch the created user profile
      let userProfile = null;
      if (authData?.user?.id) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        userProfile = profileData;
      }
      
      // Sign in with NextAuth after successful signup
      // For auto-confirm flow, we can immediately sign in
      // For email confirmation flow, we'd return early and inform user to check email
      if (process.env.NEXT_PUBLIC_SUPABASE_AUTO_CONFIRM_SIGNUP === 'true') {
        await signIn(email, password);
      }
      
      // Return the proper AuthResponse structure with user profile
      return { 
        data: { 
          user: userProfile, 
          session: authData?.session || null 
        }, 
        error: null 
      };
    } catch (err) {
      console.error('Error signing up:', err);
      const error = err instanceof Error ? err : new Error('Failed to sign up');
      setError(error);
      return { data: { user: null, session: null }, error };
    }
  };

  // Sign out from both NextAuth and Supabase
  const signOut = async () => {
    try {
      // First sign out from Supabase
      await supabase.auth.signOut();
      
      // Then sign out from NextAuth
      await nextAuthSignOut({ redirect: false });
      
      setUser(null);
      setError(null);
      router.push('/login');
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
    }
  };

  // Check for and repair mismatches between auth and profile
  const checkAndRepairUserProfile = async () => {
    if (!session?.user?.id || !session?.user?.email) {
      console.log('[AuthProvider] No session or incomplete data to check for mismatches');
      return;
    }
    
    console.log('[AuthProvider] Checking for auth/profile mismatches...');
    
    try {
      const { exists, hasProfile, authUser, profileUser } = 
        await checkUserAuthProfileMismatch(session.user.id, session.user.email);
        
      console.log('[AuthProvider] Mismatch check result:', { exists, hasProfile });
      
      // Case 1: Auth user exists but no profile - create profile
      if (exists && !hasProfile && authUser) {
        console.log('[AuthProvider] Creating missing profile for auth user');
        const { data: newUser, error } = await createOrUpdateProfile(
          authUser.id,
          {
            email: authUser.email || session.user.email,
            username: authUser.user_metadata?.username || 
                   session.user.name || 
                   (authUser.email || session.user.email).split('@')[0],
            role: 'USER'
          }
        );
        
        if (error) {
          console.error('[AuthProvider] Error creating profile:', error);
        } else if (newUser) {
          console.log('[AuthProvider] Created new profile:', newUser.username);
          setUser(newUser);
          return;
        }
      }
      
      // Case 2: Profile exists but with a mismatched ID
      if (profileUser && profileUser.id !== session.user.id) {
        console.log('[AuthProvider] Found profile with ID mismatch - using it anyway');
        setUser(profileUser);
        return;
      }
      
      // Case 3: Profile exists with same ID
      if (profileUser) {
        console.log('[AuthProvider] Found matching profile');
        setUser(profileUser);
        return;
      }
      
      // Case 4: Last resort - create a new profile with session data
      if (!profileUser && session.user.email) {
        console.log('[AuthProvider] Creating profile from session as last resort');
        const { data: newUser, error } = await createOrUpdateProfile(
          session.user.id,
          {
            email: session.user.email,
            username: session.user.name || session.user.email.split('@')[0],
            role: 'USER'
          }
        );
        
        if (error) {
          console.error('[AuthProvider] Error creating profile from session:', error);
        } else if (newUser) {
          console.log('[AuthProvider] Created new profile from session:', newUser.username);
          setUser(newUser);
        }
      }
    } catch (err) {
      console.error('[AuthProvider] Error in profile repair:', err);
      setError(err instanceof Error ? err : new Error('Failed to repair profile'));
    }
  };

  // Helper to refresh the session/profile state
  const refreshSession = async () => {
    try {
      // Get current session from Supabase
      const { data: userData, error } = await getSupabaseUser();
      
      if (error) throw error;
      
      if (userData.user) {
        setUser(userData.user);
      }
    } catch (err) {
      console.error('[AuthProvider] Error refreshing session:', err);
    }
  };

  const loading = isSessionLoading || isLoadingProfile;

  const value = {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 