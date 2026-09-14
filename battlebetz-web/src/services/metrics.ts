import { supabase } from '@/lib/supabase';

export interface UserMetrics {
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  tournamentsJoined: number;
  tournamentsWon: number;
  totalSpent: number;
  totalEarned: number;
}

/**
 * Fetch metrics for a specific user
 * @param userId - The user's ID
 * @returns Promise with user metrics
 */
export async function fetchUserMetrics(userId: string): Promise<UserMetrics | null> {
  try {
    // Initialize with default values
    let totalBets = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let tournamentsJoined = 0;
    let tournamentsWon = 0;
    let totalSpent = 0;
    let totalEarned = 0;
    
    // Safely query each table with error handling
    try {
      // Get total bets placed by user
      const { count, error } = await supabase
        .from('bets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (!error) {
        totalBets = count || 0;
      }
    } catch (err) {
      console.error('Error fetching total bets:', err);
    }
    
    try {
      // Get total winning bets
      const { count, error } = await supabase
        .from('bets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'WON');
      
      if (!error) {
        totalWins = count || 0;
      }
    } catch (err) {
      console.error('Error fetching won bets:', err);
    }
    
    try {
      // Get total losing bets
      const { count, error } = await supabase
        .from('bets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'LOST');
      
      if (!error) {
        totalLosses = count || 0;
      }
    } catch (err) {
      console.error('Error fetching lost bets:', err);
    }
    
    try {
      // Get tournaments joined by user
      const { count, error } = await supabase
        .from('tournament_round_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (!error) {
        tournamentsJoined = count || 0;
      }
    } catch (err) {
      console.error('Error fetching tournaments joined:', err);
    }
    
    try {
      // Get tournaments won (rank = 1)
      const { count, error } = await supabase
        .from('tournament_round_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('rank', 1);
      
      if (!error) {
        tournamentsWon = count || 0;
      }
    } catch (err) {
      console.error('Error fetching tournaments won:', err);
    }
    
    try {
      // Get total spent (sum of risk from bets)
      const { data, error } = await supabase
        .from('bets')
        .select('risk')
        .eq('user_id', userId);
      
      if (!error && data) {
        totalSpent = data.reduce((sum, bet) => sum + (bet.risk || 0), 0);
      }
    } catch (err) {
      console.error('Error fetching spent amount:', err);
    }
    
    try {
      // Get total earned (sum of potential_payout from winning bets)
      const { data, error } = await supabase
        .from('bets')
        .select('potential_payout')
        .eq('user_id', userId)
        .eq('status', 'WON');
      
      if (!error && data) {
        totalEarned = data.reduce((sum, bet) => sum + (bet.potential_payout || 0), 0);
      }
    } catch (err) {
      console.error('Error fetching earned amount:', err);
    }
    
    // Calculate win rate
    const winRate = totalBets ? (totalWins / totalBets) * 100 : 0;
    
    return {
      totalBets,
      totalWins,
      totalLosses,
      winRate: Number(winRate.toFixed(2)),
      tournamentsJoined,
      tournamentsWon,
      totalSpent,
      totalEarned
    };
  } catch (error) {
    console.error('Failed to fetch user metrics:', error);
    // Return default metrics instead of null to avoid UI breaking
    return {
      totalBets: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      tournamentsJoined: 0,
      tournamentsWon: 0,
      totalSpent: 0,
      totalEarned: 0
    };
  }
} 