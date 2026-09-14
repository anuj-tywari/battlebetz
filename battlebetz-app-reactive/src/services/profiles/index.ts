import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

// Use the users table instead of the profiles table
export type Profile = Database['public']['Tables']['users']['Row'];
export type ProfileUpdate = Database['public']['Tables']['users']['Update'];

export async function getProfile(
  userId: string
): Promise<{ data: Profile | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')  // Changed from 'profiles' to 'users'
      .select('*')
      .eq('id', userId)  // Using 'id' instead of 'user_id'
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Get profile error:', err);
    return { data: null, error: 'An unexpected error occurred while fetching profile' };
  }
}

export async function updateProfile(
  userId: string,
  profileData: Partial<ProfileUpdate>
): Promise<{ data: Profile | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')  // Changed from 'profiles' to 'users'
      .update(profileData)
      .eq('id', userId)  // Using 'id' instead of 'user_id'
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Update profile error:', err);
    return { data: null, error: 'An unexpected error occurred while updating profile' };
  }
}

export async function updateBalance(
  userId: string,
  amount: number,
  isDeposit: boolean = true
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Get current balance
    const { data: profile, error: profileError } = await getProfile(userId);
    
    if (profileError || !profile) {
      return { success: false, error: profileError || 'Profile not found' };
    }
    
    // Calculate new balance
    const newBalance = isDeposit 
      ? (profile.bbz_balance || 0) + amount 
      : (profile.bbz_balance || 0) - amount;
    
    // Prevent negative balance on withdrawals
    if (!isDeposit && newBalance < 0) {
      return { success: false, error: 'Insufficient balance' };
    }
    
    // Update balance
    const { error: updateError } = await supabase
      .from('users')  // Changed from 'profiles' to 'users'
      .update({ bbz_balance: newBalance })  // Changed 'balance' to 'bbz_balance'
      .eq('id', userId);  // Using 'id' instead of 'user_id'
    
    if (updateError) {
      return { success: false, error: updateError.message };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error('Update balance error:', err);
    return { success: false, error: 'An unexpected error occurred while updating balance' };
  }
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase
      .storage
      .from('users')  // Changed from 'profiles' to 'users' to match table name 
      .upload(filePath, file);
    
    if (uploadError) {
      return { url: null, error: uploadError.message };
    }
    
    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from('users')  // Changed from 'profiles' to 'users'
      .getPublicUrl(filePath);
    
    // Update the profile with the new avatar URL
    const { error: updateError } = await supabase
      .from('users')  // Changed from 'profiles' to 'users'
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', userId);  // Using 'id' instead of 'user_id'
    
    if (updateError) {
      return { url: null, error: updateError.message };
    }
    
    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error('Upload avatar error:', err);
    return { url: null, error: 'An unexpected error occurred while uploading avatar' };
  }
} 