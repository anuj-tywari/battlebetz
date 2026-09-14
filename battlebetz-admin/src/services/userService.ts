// services/userService.ts
import { supabase, createAuthenticatedClient } from '@/lib/supabase';
import { User } from '@/types/user';

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  accessToken?: string;
}

export async function getUsers({
  page = 1,
  pageSize = 10,
  sortField = 'created_at',
  sortOrder = 'desc',
  search = '',
  accessToken
}: GetUsersParams = {}): Promise<{ users: User[]; totalCount: number }> {
  try {
    const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
    
    let query = client
      .from('users')
      .select('*', { count: 'exact' })
      .order(sortField, { ascending: sortOrder === 'asc' });

    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
    }

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
    
    console.log(`Supabase SDK fetched ${users.length} users, total count: ${count || 0}`);
    
    return { users, totalCount: count || 0 };
  } catch (error) {
    console.error('Error fetching users via Supabase SDK:', error);
    return { users: [], totalCount: 0 };
  }
}

export async function getUserById(id: string, accessToken?: string): Promise<User | null> {
  const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as User;
}

export async function getUserMetrics(userId: string, accessToken?: string): Promise<any | null> {
  const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
  const { data, error } = await client
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
}

export async function addUser(user: Partial<User>, accessToken?: string): Promise<User> {
  const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
  const { data, error } = await client
    .from('users')
    .insert([user])
    .select();
  if (error) throw error;
  return (data as User[])?.[0];
}

export async function updateUser(id: string, updates: Partial<User>, accessToken?: string): Promise<User> {
  // Ensure we have the updated timestamp
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
  const { data, error } = await client
    .from('users')
    .update(updatedData)
    .eq('id', id)
    .select();
  if (error) throw error;
  return (data as User[])?.[0];
}

export async function deleteUser(id: string, accessToken?: string): Promise<boolean> {
  const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
  const { error } = await client
    .from('users')
    .update({ is_active: false })
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function getUserTransactions(userId: string, accessToken?: string): Promise<any[]> {
  const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
  const { data, error } = await client
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function setUserAsAdmin(email: string, accessToken?: string): Promise<User | null> {
  try {
    const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
    
    // First find the user
    const { data: users, error: findError } = await client
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
    const { data: updated, error: updateError } = await client
      .from('users')
      .update({ role: 'admin', is_admin: true })
      .eq('id', user.id)
      .select();
    
    if (updateError) throw updateError;
    
    return updated[0] as User;
  } catch (error) {
    console.error("Error setting admin role:", error);
    throw error;
  }
}
