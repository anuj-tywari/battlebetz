import { supabase } from '@/lib/supabase';

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'tournament_entry' | 'bet_win' | 'bet_loss' | 'token_award' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  tournament_id?: string;
  bet_id?: string;
  created_at: string;
}

export interface UserWallet {
  user_id: string;
  bbz_balance: number;
  bbzt_balance: number;
  updated_at: string;
}

/**
 * Get user's current wallet balances
 */
export const getUserWallet = async (userId: string): Promise<{ data: UserWallet | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, bbz_balance, bbzt_balance, updated_at')
      .eq('id', userId)
      .single();

    if (error) throw error;

    if (!data) {
      return { data: null, error: 'User wallet not found' };
    }

    return {
      data: {
        user_id: data.id,
        bbz_balance: data.bbz_balance || 0,
        bbzt_balance: data.bbzt_balance || 0,
        updated_at: data.updated_at
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching user wallet:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch wallet' };
  }
};

/**
 * Award BBZT tokens to user (used when joining tournaments)
 */
export const awardBBZTTokens = async (
  userId: string, 
  amount: number, 
  reference: string,
  tournamentId?: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current balance
    const { data: wallet, error: walletError } = await getUserWallet(userId);
    if (walletError || !wallet) {
      return { success: false, error: walletError || 'User wallet not found' };
    }

    // Update BBZT balance
    const newBbztBalance = wallet.bbzt_balance + amount;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        bbzt_balance: newBbztBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount,
        type: 'token_award',
        status: 'completed',
        reference,
        tournament_id: tournamentId,
        created_at: new Date().toISOString()
      });

    if (transactionError) throw transactionError;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error awarding BBZT tokens:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to award tokens' };
  }
};

/**
 * Deduct BBZT tokens from user (used for betting)
 */
export const deductBBZTTokens = async (
  userId: string, 
  amount: number, 
  reference: string,
  tournamentId?: string,
  betId?: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current balance
    const { data: wallet, error: walletError } = await getUserWallet(userId);
    if (walletError || !wallet) {
      return { success: false, error: walletError || 'User wallet not found' };
    }

    // Check if user has sufficient balance
    if (wallet.bbzt_balance < amount) {
      return { success: false, error: 'Insufficient BBZT tokens' };
    }

    // Update BBZT balance
    const newBbztBalance = wallet.bbzt_balance - amount;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        bbzt_balance: newBbztBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: -amount, // Negative for deduction
        type: 'bet_loss',
        status: 'completed',
        reference,
        tournament_id: tournamentId,
        bet_id: betId,
        created_at: new Date().toISOString()
      });

    if (transactionError) throw transactionError;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deducting BBZT tokens:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to deduct tokens' };
  }
};

/**
 * Get user's transaction history
 */
export const getUserTransactions = async (
  userId: string, 
  limit: number = 50
): Promise<{ data: WalletTransaction[]; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch transactions' };
  }
};

/**
 * Get tournament-specific token balance for user
 */
export const getTournamentTokenBalance = async (
  userId: string, 
  tournamentId: string
): Promise<{ balance: number; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('tournament_round_participants')
      .select('token_balance')
      .eq('user_id', userId)
      .eq('tournament_id', tournamentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No record found - user not in tournament
        return { balance: 0, error: 'User not participating in tournament' };
      }
      throw error;
    }

    return { balance: data?.token_balance || 0, error: null };
  } catch (error) {
    console.error('Error fetching tournament token balance:', error);
    return { balance: 0, error: error instanceof Error ? error.message : 'Failed to fetch balance' };
  }
};

/**
 * Update tournament-specific token balance (used for betting within tournaments)
 */
export const updateTournamentTokenBalance = async (
  userId: string, 
  tournamentId: string, 
  newBalance: number
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from('tournament_round_participants')
      .update({ token_balance: newBalance })
      .eq('user_id', userId)
      .eq('tournament_id', tournamentId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating tournament token balance:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update balance' };
  }
};

/**
 * Deduct tournament tokens for betting (tournament-specific)
 */
export const deductTournamentTokens = async (
  userId: string, 
  tournamentId: string,
  amount: number, 
  reference: string,
  betId?: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current tournament token balance
    const { balance: currentBalance, error: balanceError } = await getTournamentTokenBalance(userId, tournamentId);
    if (balanceError) {
      return { success: false, error: balanceError };
    }

    // Check if user has sufficient tournament tokens
    if (currentBalance < amount) {
      return { success: false, error: 'Insufficient tournament tokens' };
    }

    // Update tournament token balance
    const newBalance = currentBalance - amount;
    const { success: updateSuccess, error: updateError } = await updateTournamentTokenBalance(userId, tournamentId, newBalance);
    
    if (!updateSuccess) {
      return { success: false, error: updateError };
    }

    // Create transaction record for tournament token usage
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: -amount, // Negative for deduction
        type: 'tournament_bet',
        status: 'completed',
        reference,
        tournament_id: tournamentId,
        bet_id: betId,
        created_at: new Date().toISOString()
      });

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
      // Don't fail the operation if transaction logging fails
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deducting tournament tokens:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to deduct tokens' };
  }
};

/**
 * Award tournament tokens for winning bets (tournament-specific)
 */
export const awardTournamentTokens = async (
  userId: string, 
  tournamentId: string,
  amount: number, 
  reference: string,
  betId?: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current tournament token balance
    const { balance: currentBalance, error: balanceError } = await getTournamentTokenBalance(userId, tournamentId);
    if (balanceError) {
      return { success: false, error: balanceError };
    }

    // Update tournament token balance
    const newBalance = currentBalance + amount;
    const { success: updateSuccess, error: updateError } = await updateTournamentTokenBalance(userId, tournamentId, newBalance);
    
    if (!updateSuccess) {
      return { success: false, error: updateError };
    }

    // Create transaction record for tournament token award
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: amount, // Positive for award
        type: 'tournament_win',
        status: 'completed',
        reference,
        tournament_id: tournamentId,
        bet_id: betId,
        created_at: new Date().toISOString()
      });

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
      // Don't fail the operation if transaction logging fails
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error awarding tournament tokens:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to award tokens' };
  }
};

/**
 * Get all tournament token balances for a user
 */
export const getUserTournamentTokens = async (
  userId: string
): Promise<{ data: Array<{tournament_id: string, tournament_name: string, token_balance: number}>; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('tournament_round_participants')
      .select(`
        tournament_id,
        token_balance,
        tournament:tournaments(name)
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;

    const formattedData = data?.map(item => ({
      tournament_id: item.tournament_id,
      tournament_name: item.tournament?.name || 'Unknown Tournament',
      token_balance: item.token_balance || 0
    })) || [];

    return { data: formattedData, error: null };
  } catch (error) {
    console.error('Error fetching user tournament tokens:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch tournament tokens' };
  }
}; 