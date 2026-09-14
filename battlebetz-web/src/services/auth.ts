import { supabase } from '@/lib/supabase';

export type SignUpCredentials = {
  email: string;
  password: string;
  name: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  bbz_balance?: number | null;
};

export const signUp = async ({ email, password, name }: SignUpCredentials): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'USER', // Default role for new users
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'User registration failed' };
    }

    try {
      // Insert basic user information into the users table
      // This replaces the previous attempt to create a profile record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email || '', // Ensure email is never undefined
          username: (data.user.email?.split('@')[0] || 'user') + Math.floor(Math.random() * 1000), // Add random number to make it more unique
          role: 'USER' as const,
          bbz_balance: 0,
          bbzt_balance: 0,
          avatar_url: null,
          bio: null,
          hashed_password: '', // Supabase Auth handles password hashing
          notifications_enabled: true,
          private_profile: false,
          show_winnings: true,
          show_battle_history: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (userError) {
        console.error('Failed to create user record:', userError);
        // Continue anyway - authentication succeeded
      }
    } catch (userErr) {
      // Log but don't fail if user creation has an error
      console.error('User record creation error:', userErr);
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata.name || '',
        role: data.user.user_metadata.role || 'USER',
      },
      error: null,
    };
  } catch (err) {
    console.error('Sign up error:', err);
    return { user: null, error: 'An unexpected error occurred during registration' };
  }
};

export const signIn = async ({ email, password }: SignInCredentials): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Sign in failed' };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata.name || '',
        role: data.user.user_metadata.role || 'USER',
      },
      error: null,
    };
  } catch (err) {
    console.error('Sign in error:', err);
    return { user: null, error: 'An unexpected error occurred during sign in' };
  }
};

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err) {
    console.error('Sign out error:', err);
    return { error: 'An unexpected error occurred during sign out' };
  }
};

export const getCurrentUser = async (): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    // First check if we have a session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      return { user: null, error: null }; // No error, just no user
    }
    
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      console.error('Auth error:', error);
      return { user: null, error: error ? error.message : 'No authenticated user found' };
    }

    // Get additional user data from the users table
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('bbz_balance')
      .eq('id', data.user.id)
      .single();

    if (userDataError) {
      console.error('Failed to fetch user data:', userDataError);
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata.name || '',
        role: data.user.user_metadata.role || 'USER',
        bbz_balance: userData?.bbz_balance || 0,
      },
      error: null,
    };
  } catch (err) {
    console.error('Get current user error:', err);
    return { user: null, error: 'An unexpected error occurred while fetching user data' };
  }
};

export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error ? error.message : null };
  } catch (err) {
    console.error('Reset password error:', err);
    return { error: 'An unexpected error occurred during password reset' };
  }
};

export const updatePassword = async (password: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    return { error: error ? error.message : null };
  } catch (err) {
    console.error('Update password error:', err);
    return { error: 'An unexpected error occurred while updating password' };
  }
};

export const updateUserProfile = async (userData: Partial<AuthUser>): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: userData.name,
      },
    });

    if (error || !data.user) {
      return { user: null, error: error ? error.message : 'Failed to update user profile' };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata.name || '',
        role: data.user.user_metadata.role || 'USER',
      },
      error: null,
    };
  } catch (err) {
    console.error('Update user profile error:', err);
    return { user: null, error: 'An unexpected error occurred while updating profile' };
  }
}; 