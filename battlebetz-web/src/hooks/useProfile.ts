// src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/auth-provider';
import { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

type ProfileUpdateData = {
  username?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  notifications_enabled?: boolean;
  private_profile?: boolean;
  show_winnings?: boolean;
  show_battle_history?: boolean;
  phone?: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, refreshSession } = useAuth();

  // Debug profile state changes
  useEffect(() => {
    console.log('[useProfile] State:', { 
      loading, 
      hasProfile: !!profile, 
      error: error?.message,
      authUser: user?.id
    });
  }, [profile, loading, error, user]);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[useProfile] Fetching profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('[useProfile] Supabase error fetching profile:', error);
        throw error;
      }
      
      console.log('[useProfile] Profile data received:', data ? 'data exists' : 'no data');
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('[useProfile] Error fetching profile:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch profile');
      setError(errorObj);
      return { data: null, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfileByUsername = useCallback(async (username: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[useProfile] Fetching profile by username:', username);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', username)
        .limit(1);
      
      if (error) {
        console.error('[useProfile] Supabase error fetching profile by username:', error);
        throw error;
      }
      
      // Check if any results were found
      if (!data || data.length === 0) {
        const notFoundError = new Error(`User "${username}" not found`);
        console.error('[useProfile] Username not found:', username);
        setError(notFoundError);
        setLoading(false);
        return { data: null, error: notFoundError };
      }
      
      // Get the first match
      const profileData = data[0];
      console.log('[useProfile] Profile data by username received:', profileData.username);
      setProfile(profileData);
      return { data: profileData, error: null };
    } catch (err) {
      console.error('[useProfile] Error fetching profile by username:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch profile');
      setError(errorObj);
      return { data: null, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load the profile if user is available
  useEffect(() => {
    if (user && user.id && !profile && !error) {
      console.log('[useProfile] Auto-loading profile for user:', user.id);
      fetchProfile(user.id).catch(err => {
        console.error('[useProfile] Auto-load profile error:', err);
      });
    } else if (!user) {
      // Reset state if no user is available
      console.log('[useProfile] No user available, resetting profile state');
      setProfile(null);
      setLoading(false);
    }
  }, [user, profile, error, fetchProfile]);

  const updateProfile = async (profileData: ProfileUpdateData) => {
    if (!user) {
      const error = new Error('User not logged in');
      setError(error);
      return { success: false, error };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('[useProfile] Updating profile for user ID:', user.id);
      
      const { error } = await supabase
        .from('users')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('[useProfile] Supabase error updating profile:', error);
        throw error;
      }
      
      // Refresh the profile and session
      await fetchProfile(user.id);
      await refreshSession();
      
      return { success: true, message: 'Profile updated successfully' };
    } catch (err) {
      console.error('[useProfile] Error updating profile:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to update profile');
      setError(errorObj);
      return { 
        success: false, 
        error: errorObj
      };
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      const error = new Error('User not logged in');
      setError(error);
      return { success: false, error };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      console.log('[useProfile] Uploading avatar to storage path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('[useProfile] Supabase storage upload error:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      console.log('[useProfile] Avatar uploaded, public URL:', publicUrl);
      
      // Update the user's avatar_url
      const { error: updateError } = await supabase
        .from('users')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('[useProfile] Supabase error updating avatar URL:', updateError);
        throw updateError;
      }
      
      // Refresh the profile
      await fetchProfile(user.id);
      
      return { success: true, avatar_url: publicUrl };
    } catch (err) {
      console.error('[useProfile] Error uploading avatar:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to upload avatar');
      setError(errorObj);
      return { 
        success: false, 
        error: errorObj
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    fetchProfileByUsername,
    updateProfile,
    uploadAvatar
  };
}
