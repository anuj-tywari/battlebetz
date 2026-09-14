import { supabase } from '@/utils/supabaseClient';

// Types
export interface Tournament {
  id: string;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  entry_deadline?: string;
  is_public: boolean;
  entry_fee: number;
  prize_pool: number;
//   image_url?: string;
  description?: string;
  rules?: string;
  participant_count?: number;
  round_id?: string;
  round_name?: string;
}

export interface TournamentRound {
  id: string;
  tournament_id: string;
  round_name: string;
  status: string;
  start_date: string;
  end_date: string;
}

/**
 * Fetch tournament details by ID
 */
export const fetchTournamentById = async (tournamentId: string): Promise<Tournament | null> => {
  try {
    // Get tournament details
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        id,
        name,
        type,
        status,
        start_date,
        end_date,
        entry_deadline,
        is_public,
        entry_fee,
        prize_pool,
        description,
        rules
      `)
      .eq('id', tournamentId)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return data as Tournament;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return null;
  }
};

/**
 * Fetch the current active round for a tournament
 */
export const fetchCurrentRound = async (tournamentId: string): Promise<TournamentRound | null> => {
  try {
    // First try to get an active round
    const { data: activeRound, error: activeError } = await supabase
      .from('tournament_rounds')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('status', 'active')
      .order('start_date', { ascending: true })
      .limit(1)
      .single();
    
    if (!activeError && activeRound) {
      return activeRound as TournamentRound;
    }
    
    // If no active round, get the upcoming round with earliest start date
    const { data: upcomingRound, error: upcomingError } = await supabase
      .from('tournament_rounds')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('status', 'upcoming')
      .order('start_date', { ascending: true })
      .limit(1)
      .single();
    
    if (!upcomingError && upcomingRound) {
      return upcomingRound as TournamentRound;
    }
    
    // If still no round found, get the earliest round regardless of status
    const { data: anyRound, error: anyError } = await supabase
      .from('tournament_rounds')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('start_date', { ascending: true })
      .limit(1)
      .single();
    
    if (anyError) throw anyError;
    
    return anyRound as TournamentRound;
  } catch (error) {
    console.error('Error fetching tournament round:', error);
    return null;
  }
};

/**
 * Check if user is already participating in the tournament
 */
export const checkTournamentParticipation = async (userId: string, tournamentId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tournament_round_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking tournament participation:', error);
    return false;
  }
};

/**
 * Add a user as a participant to a tournament round
 */
export const addTournamentParticipant = async (
  userId: string, 
  tournamentId: string, 
  roundId: string, 
  tokens: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tournament_round_participants')
      .insert({
        user_id: userId,
        tournament_id: tournamentId,
        round_id: roundId,
        token_balance: tokens,
      })
      .select();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error adding tournament participant:', error);
    throw error;
  }
};

/**
 * Record a transaction for tournament entry
 */
export const recordTournamentTransaction = async (
  userId: string, 
  tournamentId: string, 
  amount: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'TOURNAMENT_ENTRY',
        status: 'complete',
        amount: amount,
        reference_id: tournamentId,
      })
      .select();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw error;
  }
};