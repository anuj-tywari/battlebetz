// services/transactionService.ts
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transaction';

export async function getTransactions(filters: { userId?: string, type?: string } = {}): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      users (id, name, email)
    `);
    
  if (filters.userId) {
    query = query.eq('user_id', filters.userId);
  }
  
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getTransactionById(transactionId: string): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      users (id, name, email)
    `)
    .eq('id', transactionId)
    .single();
  
  if (error) {
    console.error('Error fetching transaction:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transactionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateTransactionStatus(transactionId: string, status: 'pending' | 'completed' | 'failed'): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating transaction status:', error);
    throw new Error(error.message);
  }
  
  return data;
}
