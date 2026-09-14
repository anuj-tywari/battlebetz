import { supabase } from '@/lib/supabase';

export interface Tournament {
  id: string;
  name: string | null;
  description?: string | null;
  status: string | null;
  prize_pool: number | null;
  entry_fee: number | null;
  start_date: string | null;
  end_date: string | null;
  entry_deadline?: string | null;
  max_participants?: number | null;
  type: string | null;
  is_public: boolean | null;
  participant_count?: number;
  is_user_participating?: boolean;
}

export interface TournamentParticipation {
  id: string;
  tournament_id: string;
  user_id: string;
  round_id: string | null;
  joined_at: string;
  token_balance: number;
  rank?: number | null;
  status?: string | null;
  tournament?: Tournament;
  round?: {
    id: string;
    tournament_id: string;
    round_name: string;
    start_date: string;
    end_date: string;
    status: string;
    participant_count: number;
  } | null;
}

/**
 * Fetch all available tournaments that the user hasn't joined
 */
export const getAvailableTournaments = async (userId?: string) => {
  try {
    // 1. Get all tournaments with 'open' or 'upcoming' status
    const { data: allTournaments, error: tournamentsError } = await supabase
      .from('tournaments')
      .select(`
        id, 
        name, 
        description,
        type,
        status, 
        start_date, 
        end_date, 
        entry_deadline,
        is_public, 
        entry_fee, 
        prize_pool,
        max_participants
      `)
      .in('status', ['open', 'upcoming'])
      .gt('entry_deadline', new Date().toISOString());
    
    if (tournamentsError) throw tournamentsError;

    let participatedIds: string[] = [];
    
    // 2. Get tournaments the user is already participating in (if user is provided)
    if (userId) {
      const { data: participatingTournaments, error: participatingError } = await supabase
        .from('tournament_round_participants')
        .select('tournament_id')
        .eq('user_id', userId);
        
      if (participatingError) throw participatingError;
      
      participatedIds = participatingTournaments?.map(p => p.tournament_id) || [];
    }
    
    // 3. Filter out tournaments the user is already in (if user is provided)
    const filteredTournaments = userId 
      ? allTournaments?.filter(tournament => !participatedIds.includes(tournament.id)) || []
      : allTournaments || [];
    
    // 4. Add participant count for each tournament
    const tournamentsWithCounts = await Promise.all(
      filteredTournaments.map(async (tournament) => {
        const { count } = await supabase
          .from('tournament_round_participants')
          .select('*', { count: 'exact', head: true })
          .eq('tournament_id', tournament.id);

        return {
          ...tournament,
          participant_count: count || 0,
          is_user_participating: participatedIds.includes(tournament.id)
        };
      })
    );
    
    // 5. Sort by entry deadline (ascending) and then by prize pool (descending)
    const sortedTournaments = tournamentsWithCounts.sort((a, b) => {
      // First sort by entry deadline (closest first)
      const deadlineA = new Date(a.entry_deadline || a.start_date || '').getTime();
      const deadlineB = new Date(b.entry_deadline || b.start_date || '').getTime();
      
      if (deadlineA !== deadlineB) {
        return deadlineA - deadlineB;
      }
      
      // If deadlines are the same, sort by prize pool (highest first)
      return (b.prize_pool || 0) - (a.prize_pool || 0);
    });
    
    return sortedTournaments;
  } catch (error) {
    console.error('Error fetching available tournaments:', error);
    throw error;
  }
};

/**
 * Fetch all tournaments the user is participating in
 */
export const getUserTournaments = async (userId: string) => {
  try {
    // Get all tournament participations for the user with tournament and round details
    const { data, error: fetchError } = await supabase
      .from('tournament_round_participants')
      .select(`
        id, 
        tournament_id,
        user_id,
        round_id,
        joined_at,
        token_balance,
        rank,
        status,
        tournament:tournaments (
          id,
          name,
          type,
          status,
          start_date,
          end_date,
          entry_deadline,
          is_public,
          entry_fee,
          prize_pool
        ),
        round:tournament_rounds (
          id,
          tournament_id,
          round_name,
          start_date,
          end_date,
          status,
          participant_count
        )
      `)
      .eq('user_id', userId)
      .in('status', ['upcoming', 'active'])
      .order('joined_at', { ascending: false });

    if (fetchError) throw fetchError;
    
    // Sort by tournament status and start date
    const sortedTournaments = data?.sort((a, b) => {
      // Active tournaments first
      const statusA = a.tournament?.status || '';
      const statusB = b.tournament?.status || '';
      
      if (statusA === 'active' && statusB !== 'active') return -1;
      if (statusA !== 'active' && statusB === 'active') return 1;
      
      // Then by round start date (closest first)
      const startDateA = new Date(a.round?.start_date || a.tournament?.start_date || '').getTime();
      const startDateB = new Date(b.round?.start_date || b.tournament?.start_date || '').getTime();
      return startDateA - startDateB;
    });
    
    return sortedTournaments || [];
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    throw error;
  }
};

/**
 * Get all tournaments (for admin/overview purposes)
 */
export const getAllTournaments = async (statusFilter?: string[]) => {
  try {
    console.log('getAllTournaments called with statusFilter:', statusFilter);
    
    let query = supabase
      .from('tournaments')
      .select(`
        id,
        name,
        description,
        status,
        prize_pool,
        entry_fee,
        start_date,
        end_date,
        entry_deadline,
        max_participants,
        type,
        is_public
      `);

    // Apply status filter if provided - simplified approach
    if (statusFilter && statusFilter.length > 0) {
      console.log('Applying status filter:', statusFilter);
      
      // Use a simple in() filter instead of complex OR
      query = query.in('status', statusFilter);
    }

    // Order by start date
    query = query.order('start_date', { ascending: true });

    const { data: tournaments, error } = await query;
    
    console.log('getAllTournaments query result:', { 
      tournaments: tournaments?.length || 0, 
      error: error?.message || null 
    });

    if (error) {
      console.error('Database error in getAllTournaments:', error);
      throw error;
    }

    // If no tournaments found with filter, try without filter to debug
    if (!tournaments || tournaments.length === 0) {
      console.log('No tournaments found with filter, checking all tournaments...');
      
      const { data: allTournaments, error: allError } = await supabase
        .from('tournaments')
        .select('id, name, status')
        .order('created_at', { ascending: false })
        .limit(5);
        
      console.log('Sample tournaments in database:', { 
        count: allTournaments?.length || 0, 
        tournaments: allTournaments?.map(t => ({ id: t.id, name: t.name, status: t.status })) || [],
        error: allError?.message || null
      });
    }

    // Add participant count for each tournament
    const tournamentsWithCounts = await Promise.all(
      (tournaments || []).map(async (tournament) => {
        try {
          const { count } = await supabase
            .from('tournament_round_participants')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_id', tournament.id);

          return {
            ...tournament,
            participant_count: count || 0
          };
        } catch (countError) {
          console.error(`Error getting participant count for tournament ${tournament.id}:`, countError);
          return {
            ...tournament,
            participant_count: 0
          };
        }
      })
    );

    console.log('Final tournaments with counts:', tournamentsWithCounts.length);
    return tournamentsWithCounts;
  } catch (error) {
    console.error('Error fetching all tournaments:', error);
    throw error;
  }
};

/**
 * Get tournament by ID
 */
export const getTournamentById = async (id: string) => {
  try {
    const { data: tournament, error } = await supabase
      .from('tournaments')
      .select(`
        id,
        name,
        description,
        status,
        prize_pool,
        entry_fee,
        start_date,
        end_date,
        entry_deadline,
        max_participants,
        type,
        is_public
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get participant count
    const { count } = await supabase
      .from('tournament_round_participants')
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', id);

    return {
      ...tournament,
      participant_count: count || 0
    };
  } catch (error) {
    console.error('Error fetching tournament by ID:', error);
    throw error;
  }
};

/**
 * Get tournaments with filters (for backward compatibility)
 */
export const getTournaments = async (filters?: { status?: string; sportCategory?: string }) => {
  try {
    const statusFilter = filters?.status ? [filters.status.toLowerCase()] : ['upcoming', 'active'];
    const tournaments = await getAllTournaments(statusFilter);
    return { data: tournaments, error: null };
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return { data: null, error };
  }
};

/**
 * Fetch user tournaments (for backward compatibility)
 */
export const fetchUserTournaments = async (userId: string) => {
  try {
    const tournaments = await getUserTournaments(userId);
    return tournaments;
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    return [];
  }
};

/**
 * User tournament type for backward compatibility
 */
export type UserTournament = TournamentParticipation;

/**
 * Check if user has already joined a tournament
 */
export const hasUserJoinedTournament = async (tournamentId: string, userId?: string): Promise<boolean> => {
  if (!userId || !tournamentId) return false;
  
  try {
    const { data, error } = await supabase
      .from('tournament_round_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking user tournament participation:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking user tournament participation:', error);
    return false;
  }
};

/**
 * Join tournament (updated to work with current user context)
 */
export const joinTournament = async (tournamentId: string, userId?: string) => {
  try {
    if (!userId) {
      return { 
        success: false, 
        error: new Error('User ID is required to join tournament')
      };
    }

    // Check if user is already participating
    const { data: existing } = await supabase
      .from('tournament_round_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return { success: true, message: 'Already joined this tournament' };
    }

    // Join the tournament
    const { error } = await supabase
      .from('tournament_round_participants')
      .insert({
        tournament_id: tournamentId,
        user_id: userId,
        token_balance: 1000,
        status: 'active'
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error joining tournament:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to join tournament')
    };
  }
}; 