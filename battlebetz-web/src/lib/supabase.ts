import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import bcrypt from 'bcryptjs';

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

export type UserProfile = Database['public']['Tables']['users']['Row'];

export type AuthResponse = {
  data: {
    user: UserProfile | null;
    session: any;
  };
  error: Error | null;
};

// Initialize the Supabase client with better error handling and types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'x-application-name': 'battlebetz-web',
    },
  },
});

// Helper to get service role client on the server side
export const getServiceRoleClient = async () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key');
  }
  
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-application-name': 'battlebetz-web',
      },
    },
  });
};

// Helper to get current user with profile data
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    // First, get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw sessionError;
    }

    if (!session?.user) {
      return { data: { user: null, session: null }, error: null };
    }

    // Then, get the user profile using single() instead of limit(1)
    const { data: profiles, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // Handle the case where no profile exists yet
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // Try to fetch or create a profile using the auth user data
      const authUser = session.user;
      if (authUser) {
        // Try to create a basic profile from auth data
        await createOrUpdateProfile(authUser.id, {
          email: authUser.email || '',
          username: authUser.email?.split('@')[0] || 'user',
          role: 'USER'
        });
        
        // Try fetching the profile again with single()
        const { data: retryProfiles, error: retryError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!retryError && retryProfiles) {
          return {
            data: {
              user: retryProfiles,
              session,
            },
            error: null,
          };
        }
      }
      
      // If we still can't get a profile, just return session data
      return {
        data: {
          user: null,
          session,
        },
        error: null,
      };
    }

    // Check if profiles object has data
    if (!profiles) {
      console.log('No user profile found, trying to create one');
      // Try to create a profile
      const authUser = session.user;
      if (authUser) {
        await createOrUpdateProfile(authUser.id, {
          email: authUser.email || '',
          username: authUser.email?.split('@')[0] || 'user',
          role: 'USER'
        });
        
        // Try fetching the profile again
        const { data: newProfiles, error: newProfileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!newProfileError && newProfiles) {
          return {
            data: {
              user: newProfiles,
              session,
            },
            error: null,
          };
        }
      }
      
      return {
        data: {
          user: null,
          session,
        },
        error: null,
      };
    }

    return {
      data: {
        user: profiles,
        session,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return { data: { user: null, session: null }, error: error as Error };
  }
};

// Helper to create or update user profile
export const createOrUpdateProfile = async (userId: string, data: { email: string; username: string; role: 'USER' | 'ADMIN' }) => {
  try {
    const { data: profiles, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .limit(1);

    if (fetchError) {
      throw fetchError;
    }

    const timestamp = new Date().toISOString();
    const userExists = profiles && profiles.length > 0;

    if (userExists) {
      const { data: updatedProfiles, error } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: timestamp,
        })
        .eq('id', userId)
        .select()
        .limit(1);

      if (error) throw error;
      return { data: updatedProfiles?.[0] || null, error: null };
    } else {
      const { data: newProfiles, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: data.email,
          username: data.username,
          role: data.role,
          created_at: timestamp,
          updated_at: timestamp,
          bbz_balance: 100,
          notifications_enabled: true,
          private_profile: false,
          show_winnings: true,
          show_battle_history: true,
          promo_code: null,
          is_admin: false,
          referred_by: null,
          status: true,
        })
        .select()
        .limit(1);

      if (error) throw error;
      return { data: newProfiles?.[0] || null, error: null };
    }
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    return { data: null, error: error as Error };
  }
};

// Helper to sign up a user with credentials
export const signUpWithCredentials = async (email: string, password: string, username: string) => {
  try {
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
      
    if (existingUser) {
      return { data: null, error: new Error('User with this email already exists') };
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!authData || !authData.user) {
      throw new Error('Failed to create user authentication');
    }
    
    // If we have a user, create their profile
    if (authData.user) {
      const now = new Date().toISOString();
      
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          username,
          role: 'USER',
          created_at: now,
          updated_at: now,
          bbz_balance: 100,
          notifications_enabled: true,
          private_profile: false,
          show_winnings: true,
          show_battle_history: true,
          promo_code: null,
          is_admin: false,
          referred_by: null,
          status: true
        });

      if (profileError) {
        throw profileError;
      }
    }
    
    return { data: authData, error: null };
  } catch (error) {
    console.error('Error in signUpWithCredentials:', error);
    return { data: null, error: error as Error };
  }
};

// Helper to sign in with credentials
export const signInWithCredentials = async (email: string, password: string) => {
  try {
    // First try to sign in directly with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Check if user exists in the users table
    if (data?.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }
      
      // If user exists, check status
      if (userData && userData.status === false) {
        throw new Error('Account deactivated or banned. Please contact support.');
      }
      
      // If user doesn't exist in users table but exists in auth, create a profile
      if (!userData) {
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.email?.split('@')[0] || 'user',
            role: 'USER',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            bbz_balance: 0,
            notifications_enabled: true,
            private_profile: false,
            show_winnings: true,
            show_battle_history: true,
            status: true,
          });
          
        if (createError) throw createError;
      }
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in signInWithCredentials:', error);
    return { data: null, error: error as Error };
  }
};

// Add a new utility function to check for auth/profile mismatch
export const checkUserAuthProfileMismatch = async (userId: string, email?: string): Promise<{
  exists: boolean;
  hasProfile: boolean;
  authUser: any | null;
  profileUser: UserProfile | null;
}> => {
  try {
    console.log('Checking user auth/profile mismatch for ID:', userId, 'Email:', email);
    
    // Check current session instead of using the admin API
    const { data: sessionData } = await supabase.auth.getSession();
    const currentAuthUser = sessionData?.session?.user;
    
    // Determine if we have an auth user that matches our criteria
    let authUser = null;
    const isCurrentUserMatchingId = currentAuthUser?.id === userId;
    const isCurrentUserMatchingEmail = email && currentAuthUser?.email === email;
    
    if (isCurrentUserMatchingId || isCurrentUserMatchingEmail) {
      console.log('Found matching auth user:', 
        isCurrentUserMatchingId ? 'by ID' : 'by email');
      authUser = currentAuthUser;
    }
    
    // Check for profile in the database by ID
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1);
      
    const profileUser = profileData && profileData.length > 0 ? profileData[0] : null;
    
    // If no profile by ID but we have an email, try finding by email
    if (!profileUser && email) {
      const { data: emailProfileData } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .limit(1);
        
      const emailProfileUser = emailProfileData && emailProfileData.length > 0 ? emailProfileData[0] : null;
      
      if (emailProfileUser) {
        console.log('Found profile by email instead of ID. Profile ID:', emailProfileUser.id);
        return {
          exists: !!authUser,
          hasProfile: true,
          authUser,
          profileUser: emailProfileUser
        };
      }
    }
    
    return {
      exists: !!authUser,
      hasProfile: !!profileUser,
      authUser,
      profileUser
    };
  } catch (error) {
    console.error('Error checking user auth/profile mismatch:', error);
    return {
      exists: false,
      hasProfile: false,
      authUser: null,
      profileUser: null
    };
  }
}; 