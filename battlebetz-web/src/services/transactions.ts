import { supabase } from '@/lib/supabase';

export interface UserTransaction {
  id: string;
  title: string;
  reference: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

/**
 * Fetch transactions for a user
 * @param userId - The user's ID
 * @param limit - Number of transactions to fetch (default: 10)
 * @returns Promise with array of user transactions
 */
export async function fetchUserTransactions(userId: string, limit = 10): Promise<UserTransaction[]> {
  try {
    // Get user's transactions - removed 'reference' since it doesn't exist in the schema
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, amount, type, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (transactionsError || !transactions || transactions.length === 0) {
      console.error('Error fetching transactions:', transactionsError);
      return [];
    }
    
    return transactions.map(transaction => ({
      id: transaction.id,
      title: transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal',
      reference: `Transaction #${transaction.id.substring(0, 8)}`, // Generate reference from ID
      amount: transaction.amount || 0,
      type: transaction.type as 'deposit' | 'withdraw',
      status: transaction.status as 'completed' | 'pending' | 'failed',
      created_at: transaction.created_at
    }));
  } catch (error) {
    console.error('Failed to fetch user transactions:', error);
    return [];
  }
} 