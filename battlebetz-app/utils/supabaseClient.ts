import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || '';

// Custom storage implementation for web
const customStorageAdapter = {
  getItem: (key:any) => {
    try {
      const item = localStorage.getItem(key);
      return Promise.resolve(item);
    } catch (error) {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve();
    }
  },
  removeItem: (key:any) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve();
    }
  },
};

// Initialize Supabase with appropriate storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Function to check if the user is authenticated
export const checkAuth = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Function to get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Update user metadata (e.g., to store role information)
export const updateUserMetadata = async (metadata: any) => {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  });
  
  return { user: data.user, error };
};

// Fetch user profile from a profiles table
export const fetchUserProfile = async (userId: any) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return { profile: data, error };
};

// Create or update user profile
export const upsertProfile = async (profile:any) => {
  const { data, error } = await supabase
    .from('users')
    .upsert(profile)
    .select()
    .single();

  return { profile: data, error };
};