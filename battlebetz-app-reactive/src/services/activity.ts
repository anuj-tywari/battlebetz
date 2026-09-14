import { supabase } from '@/lib/supabase';

export interface UserActivity {
  id: string;
  type: 'bet' | 'tournament' | 'transaction' | 'win' | 'loss';
  title: string;
  description: string;
  amount?: number;
  status?: 'win' | 'loss' | 'pending';
  created_at: string;
  entity_id?: string;
  entity_type?: string;
}

/**
 * Fetch recent activity for a user
 * @param userId - The user's ID
 * @param limit - Number of activities to fetch (default: 5)
 * @returns Promise with array of user activities
 */
export async function fetchUserActivity(userId: string, limit = 5): Promise<UserActivity[]> {
  try {
    const activities: UserActivity[] = [];
    
    // 1. Get recent bets
    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select('id, risk, status, created_at, tournament_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (!betsError && bets) {
      for (const bet of bets) {
        // Since we don't have match details, use a generic title
        const matchTitle = 'Sports Event';
        
        activities.push({
          id: `bet_${bet.id}`,
          type: 'bet',
          title: `Placed a bet on ${matchTitle}`,
          description: `Bet ${bet.risk} BBZT on an event in tournament #${bet.tournament_id}`,
          amount: bet.risk,
          status: bet.status?.toLowerCase() as any,
          created_at: bet.created_at,
          entity_id: bet.id,
          entity_type: 'bet'
        });
      }
    }
    
    // 2. Get recent tournament entries
    const { data: tournaments, error: tournamentsError } = await supabase
      .from('tournament_round_participants')
      .select('id, tournament_id, created_at, rank')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (!tournamentsError && tournaments) {
      for (const entry of tournaments) {
        // Get tournament name
        const { data: tournamentData } = await supabase
          .from('tournaments')
          .select('name')
          .eq('id', entry.tournament_id)
          .single();
        
        const tournamentName = tournamentData?.name || `Tournament #${entry.tournament_id}`;
        
        activities.push({
          id: `tournament_${entry.id}`,
          type: 'tournament',
          title: `Joined ${tournamentName}`,
          description: entry.rank ? `Finished with rank #${entry.rank}` : 'Currently participating',
          created_at: entry.created_at,
          entity_id: entry.tournament_id,
          entity_type: 'tournament'
        });
      }
    }
    
    // 3. Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, amount, type, created_at, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (!transactionsError && transactions) {
      for (const transaction of transactions) {
        activities.push({
          id: `transaction_${transaction.id}`,
          type: 'transaction',
          title: `${transaction.type === 'deposit' ? 'Deposited' : 'Withdrew'} BBZT`,
          description: `${transaction.type === 'deposit' ? 'Added' : 'Removed'} ${transaction.amount} BBZT ${transaction.status === 'completed' ? 'successfully' : 'pending'}`,
          amount: transaction.amount || undefined,
          status: transaction.status === 'completed' ? (transaction.type === 'deposit' ? 'win' : 'loss') : 'pending',
          created_at: transaction.created_at,
          entity_id: transaction.id,
          entity_type: 'transaction'
        });
      }
    }
    
    // Sort all activities by date (newest first)
    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
      
  } catch (error) {
    console.error('Failed to fetch user activity:', error);
    return [];
  }
}

/**
 * Formats a datetime string to a relative time (e.g., "2 days ago")
 * @param dateString - ISO date string
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
} 