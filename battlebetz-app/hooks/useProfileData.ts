import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from './useAuth';
import * as minioService from '@/utils/minioService';

// Define types for user profile and metrics
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role?: string;
  promo_code?: string;
  is_admin?: boolean;
  bbz_balance?: number;
  bbzt_balance?: number;
  active_competitions?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  updated_at?: string;
  referral_earnings?: number;
}

export interface UserMetrics {
  id: number;
  user_id: string;
  battle_count: number;
  battle_won_count: number;
  battle_lost_count: number;
  following_count: number;
  friend_count: number;
  bbz_balance: number;
  usd_balance: number;
}

export interface ProfileUpdateData {
  username?: string;
  bio?: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  [key: string]: any; // Allow additional fields
}

interface UseProfileDataReturn {
  userProfile: UserProfile | null;
  userMetrics: UserMetrics | null;
  loading: boolean;
  error: Error | null;
  refreshProfileData: () => Promise<void>;
  updateUserProfile: (updateData: ProfileUpdateData) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  uploadAvatar: (file: File) => Promise<{
    url: string | null;
    error: Error | null;
  }>;
}

export function useProfileData(): UseProfileDataReturn {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfileData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setError(profileError);
      } else {
        setUserProfile(profileData);
      }
      
      // Fetch user metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('user_metric')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (metricsError) {
        if (metricsError.code === 'PGRST116') {
          console.log('No metrics found for user, using default metrics');
          // No metrics found, create default metrics object
          setUserMetrics({
            id: 0,
            user_id: user.id,
            battle_count: 0,
            battle_won_count: 0,
            battle_lost_count: 0,
            following_count: 0,
            friend_count: 0,
            bbz_balance: profileData?.bbz_balance || 0,
            usd_balance: 0
          });
        } else {
          console.error('Error fetching user metrics:', metricsError);
          setError(metricsError);
        }
      } else {
        setUserMetrics(metricsData);
      }
    } catch (err) {
      console.error('Error in data fetching:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update user profile
  const updateUserProfile = async (updateData: ProfileUpdateData) => {
    if (!user) {
      return {
        success: false,
        error: new Error('User not authenticated')
      };
    }
    
    try {
      // Ensure we have the updated timestamp
      const dataToUpdate = {
        ...updateData,
        updated_at: new Date().toISOString()
      };
      
      // Update the profile in Supabase
      const { data, error: updateError } = await supabase
        .from('users')
        .update(dataToUpdate)
        .eq('id', user.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
        return {
          success: false,
          error: updateError
        };
      }
      
      // Update local state
      setUserProfile(prevProfile => {
        if (!prevProfile) return data;
        return { ...prevProfile, ...data };
      });
      
      return {
        success: true,
        error: null
      };
    } catch (err) {
      console.error('Error in profile update:', err);
      return {
        success: false,
        error: err instanceof Error ? err : new Error('Unknown error occurred')
      };
    }
  };
  
  // Function to upload avatar
  const uploadAvatar = async (file: File) => {
    if (!user) {
      return {
        url: null,
        error: new Error('User not authenticated')
      };
    }
    
    try {
      // If we have existing avatar, delete it first
      if (userProfile?.avatar_url) {
        try {
          // Only delete if it's a Minio URL (contains our bucket name)
          const bucketName = process.env.MINIO_BUCKET || 'battlebetz-avatars';
          if (userProfile.avatar_url.includes(bucketName)) {
            await minioService.deleteAvatarFromMinio(userProfile.avatar_url);
          }
        } catch (err) {
          console.warn('Failed to delete existing avatar:', err);
          // Continue with upload even if delete fails
        }
      }
      
      // For browser, create URL from file
      let imageUri = '';
      if (typeof window !== 'undefined') {
        imageUri = URL.createObjectURL(file);
      }
      
      const { url } = await minioService.uploadAvatarToMinio(user.id, imageUri);
      
      // Update user profile with new avatar URL
      await updateUserProfile({ avatar_url: url });
      
      return {
        url,
        error: null
      };
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return {
        url: null,
        error: err instanceof Error ? err : new Error('Unknown error occurred')
      };
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchProfileData();
  }, [user]);

  // Return data, functions and a refresh function
  return {
    userProfile,
    userMetrics,
    loading,
    error,
    refreshProfileData: fetchProfileData,
    updateUserProfile,
    uploadAvatar
  };
}