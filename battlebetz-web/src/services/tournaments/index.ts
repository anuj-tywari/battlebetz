import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  prize_pool: number;
  entry_fee: number;
  start_date: string;
  end_date?: string;
  max_participants: number;
  participant_count?: number;
  category?: string;
  image_url?: string;
}

export type TournamentInsert = Database['public']['Tables']['tournaments']['Insert'];

/**
 * Transform raw tournament data to match our interface
 * Handles the participant_count which comes as an array with count objects from Supabase
 */
function transformTournamentData(rawData: any): Tournament {
  // Extract the tournament data
  const tournament = { ...rawData };
  
  // Handle participant_count which comes as array with count from Supabase
  if (tournament.participant_count && Array.isArray(tournament.participant_count)) {
    // Supabase returns an array of objects with count property
    // For count aggregates, take the first item's count or default to 0
    tournament.participant_count = tournament.participant_count[0]?.count || 0;
  }
  
  return tournament as Tournament;
}

/**
 * Transform an array of raw tournament data
 */
function transformTournamentsData(rawData: any[]): Tournament[] {
  if (!rawData) return [];
  return rawData.map(item => transformTournamentData(item));
}

/**
 * Get all tournaments with optional filters
 */
export async function getTournaments(filters?: {
  status?: string;
  sportCategory?: string;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('tournaments')
      .select(`
        *,
        participant_count:tournament_round_participants(count)
      `);
    
    // Add filters based on params
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.sportCategory) {
      query = query.eq('category', filters.sportCategory);
    }
    
    // Add limit if provided
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    // Order by start date (upcoming first)
    query = query.order('start_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to handle participant_count type mismatch
    const transformedData = transformTournamentsData(data || []);
    
    return { 
      data: transformedData, 
      error: null 
    };
  } catch (err) {
    console.error('Error fetching tournaments:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Failed to fetch tournaments') 
    };
  }
}

/**
 * Get tournament by ID with related data
 */
export async function getTournamentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        rounds:tournament_rounds(*),
        participant_count:tournament_round_participants(count)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const transformedData = transformTournamentData(data);
    
    return { 
      data: {
        ...transformedData,
        rounds: data.rounds || []
      } as Tournament & { rounds: any[] }, 
      error: null 
    };
  } catch (err) {
    console.error('Error fetching tournament:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Failed to fetch tournament') 
    };
  }
}

/**
 * Join a tournament
 */
export async function joinTournament(tournamentId: string, userId: string) {
  try {
    // First, check if the tournament exists and is open for joining
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();
    
    if (tournamentError) throw tournamentError;
    
    if (tournament.status !== 'UPCOMING' && tournament.status !== 'ACTIVE') {
      throw new Error('Tournament is not open for joining');
    }
    
    // Check if user has already joined
    const { data: existingParticipant, error: participantError } = await supabase
      .from('tournament_round_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (participantError) throw participantError;
    
    if (existingParticipant) {
      return { success: true, message: 'Already joined this tournament' };
    }
    
    // Get the first round of the tournament
    const { data: firstRound, error: roundError } = await supabase
      .from('tournament_rounds')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('round_number', 1)
      .single();
    
    if (roundError) throw roundError;
    
    // Join the tournament
    const { error: joinError } = await supabase
      .from('tournament_round_participants')
      .insert({
        tournament_id: tournamentId,
        user_id: userId,
        joined_at: new Date().toISOString(),
        token_balance: 1000, // Default starting balance
        round_id: firstRound.id,
        status: 'ACTIVE'
      });
    
    if (joinError) throw joinError;
    
    return { success: true, message: 'Successfully joined tournament' };
  } catch (err) {
    console.error('Error joining tournament:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err : new Error('Failed to join tournament') 
    };
  }
}

/**
 * Get featured tournaments
 */
export async function getFeaturedTournaments(limit = 3) {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        participant_count:tournament_round_participants(count)
      `)
      .eq('is_featured', true)
      .order('start_date', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    
    // Transform the data to handle participant_count type mismatch
    const transformedData = transformTournamentsData(data || []);
    
    return { 
      data: transformedData, 
      error: null 
    };
  } catch (err) {
    console.error('Error fetching featured tournaments:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Failed to fetch featured tournaments') 
    };
  }
}

/**
 * Get user tournament participation
 */
export async function getUserTournaments(userId: string) {
  try {
    const { data, error } = await supabase
      .from('tournament_round_participants')
      .select(`
        *,
        tournament:tournaments(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return { 
      data, 
      error: null 
    };
  } catch (err) {
    console.error('Error fetching user tournaments:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Failed to fetch user tournaments') 
    };
  }
} 