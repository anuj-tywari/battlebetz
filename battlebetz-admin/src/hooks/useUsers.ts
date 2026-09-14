// hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import { getUsers, addUser, updateUser, deleteUser, getUserById, getUserMetrics, getUserTransactions, setUserAsAdmin, GetUsersParams } from '@/services/userService';
import { fetchUsers, fetchUserById } from '@/services/directApiService';
import { User } from '@/types/user';
import { useSupabase } from '@/components/providers/supabase-auth-provider';

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

export function useUsers(params: GetUsersParams = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { supabase, isAuthenticated } = useSupabase();

  // First try the direct API, fall back to Supabase client
  const loadUsers = useCallback(async (overrideParams: GetUsersParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try using Supabase client directly
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order(overrideParams.sortField || params.sortField || 'created_at', { 
          ascending: (overrideParams.sortOrder || params.sortOrder || 'desc') === 'asc' 
        });

      // Apply search if provided
      const searchParam = overrideParams.search || params.search;
      if (searchParam) {
        query = query.or(`username.ilike.%${searchParam}%,email.ilike.%${searchParam}%`);
      }

      // Apply pagination
      const page = overrideParams.page || params.page || 1;
      const pageSize = overrideParams.pageSize || params.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      
      if (error) throw error;
      
      // Map the database fields to match our User interface
      const users = data ? data.map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.name || '',
        username: user.username || (user.email ? user.email.split('@')[0] : 'user'),
        avatar_url: user.avatar_url,
        avatarUrl: user.avatar_url,
        is_admin: user.is_admin || false,
        isAdmin: user.is_admin || user.role === 'admin',
        phone: user.phone,
        status: user.status || 'active',
        balance: user.bbz_balance || user.balance || 0,
        role: user.role || 'consumer',
        created_at: user.created_at,
        createdAt: user.created_at,
        updated_at: user.updated_at,
        updatedAt: user.updated_at
      })) : [];
      
      setUsers(users);
      setTotalCount(count || 0);
      console.log(`Supabase client fetched ${users.length} users, total count: ${count || 0}`);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [params, supabase]);

  // Get a single user
  const getSingleUser = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (err) {
      console.error(`Error fetching user ${id}:`, err);
      throw err;
    }
  }, [supabase]);

  // Get user metrics
  const getUserMetricsData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_metric')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No metrics found for user');
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error(`Error fetching metrics for user ${userId}:`, err);
      throw err;
    }
  }, [supabase]);

  // Get user transactions
  const getUserTransactionsData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Error fetching transactions for user ${userId}:`, err);
      throw err;
    }
  }, [supabase]);

  // Update user profile
  const updateUserProfile = useCallback(async (userId: string, updateData: ProfileUpdateData) => {
    try {
      // Ensure we have the updated timestamp
      const updatedData = {
        ...updateData,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('users')
        .update(updatedData)
        .eq('id', userId)
        .select();
        
      if (error) throw error;
      
      return {
        success: true,
        user: (data as User[])?.[0],
        error: null
      };
    } catch (err) {
      console.error(`Error updating user ${userId}:`, err);
      return {
        success: false,
        user: null,
        error: err instanceof Error ? err : new Error('Unknown error occurred')
      };
    }
  }, [supabase]);

  // Set user as admin
  const setAdmin = useCallback(async (email: string) => {
    try {
      // First find the user
      const { data: users, error: findError } = await supabase
        .from('users')
        .select('id, email, username, role')
        .eq('email', email)
        .limit(1);
      
      if (findError) throw findError;
      if (!users || users.length === 0) {
        throw new Error(`No user found with email: ${email}`);
      }
      
      const user = users[0];
      
      // Update the user's role to admin
      const { data: updated, error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin', is_admin: true })
        .eq('id', user.id)
        .select();
      
      if (updateError) throw updateError;
      
      return {
        success: true,
        user: updated[0] as User,
        error: null
      };
    } catch (err) {
      console.error(`Error setting user as admin:`, err);
      return {
        success: false,
        user: null,
        error: err instanceof Error ? err : new Error('Unknown error occurred')
      };
    }
  }, [supabase]);

  // Add user
  const addNewUser = useCallback(async (userData: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();
        
      if (error) throw error;
      return (data as User[])?.[0];
    } catch (err) {
      console.error('Error adding user:', err);
      throw err;
    }
  }, [supabase]);
  
  // Delete user
  const removeUser = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error deleting user ${id}:`, err);
      throw err;
    }
  }, [supabase]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    totalCount,
    loading,
    error,
    fetchUsers: loadUsers,
    getUserById: getSingleUser,
    getUserMetrics: getUserMetricsData,
    getUserTransactions: getUserTransactionsData,
    updateUserProfile,
    setAdmin,
    addUser: addNewUser,
    updateUser: updateUserProfile,
    deleteUser: removeUser,
  };
}

