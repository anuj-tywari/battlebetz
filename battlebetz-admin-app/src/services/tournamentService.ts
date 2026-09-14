import { supabase } from '@/lib/supabase';
import { Tournament } from '@/types/tournament';
import crypto from 'crypto';

export interface TournamentQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch tournaments with pagination using Supabase queries
 */
export async function fetchTournaments({
  page = 1,
  pageSize = 10,
  search = '',
  sortField = 'created_at',
  sortOrder = 'desc',
  supabaseClient
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  supabaseClient?: any;
} = {}): Promise<{ tournaments: Tournament[]; totalCount: number }> {
  try {
    // Get the appropriate client
    const client = getSupabaseClient(supabaseClient);
    
    // Calculate pagination range
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the query
    let query = client
      .from('tournaments')
      .select('*', { count: 'exact' });

    // Add search if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Add sorting
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // Add pagination
    query = query.range(from, to);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Map database columns to our interface format
    const tournaments = data.map((tournament: any) => ({
      id: tournament.id,
      name: tournament.name,
      description: tournament.description,
      rules: tournament.rules,
      status: tournament.status,
      prizePool: tournament.prize_pool,
      entryFee: tournament.entry_fee,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      maxParticipants: tournament.max_participants,
      isPublic: tournament.is_public,
      type: tournament.type,
      createdAt: tournament.created_at,
      updatedAt: tournament.updated_at,
      createdBy: tournament.created_by,
      participantCount: tournament.participant_count || 0,
      roundCount: tournament.round_count,
      entryDeadline: tournament.entry_deadline,
      roundType: tournament.round_type,
      payoutType: tournament.payout_type
    }));

    return { tournaments, totalCount: count || 0 };
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return { tournaments: [], totalCount: 0 };
  }
}

/**
 * Get all tournaments (for admin management)
 */
export async function getAllTournaments(): Promise<{ 
  tournaments: any[]; 
  success: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { tournaments: data, success: true };
  } catch (error: any) {
    console.error('Error fetching all tournaments:', error);
    return { tournaments: [], success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Fetch a single tournament by ID with prize distribution and rounds
 */
export async function fetchTournamentById(id: string, supabaseClient?: any): Promise<any> {
  try {
    // Get the appropriate client
    const client = getSupabaseClient(supabaseClient);
    
    // Fetch tournament details
    const { data: tournament, error: tournamentError } = await client
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (tournamentError) {
      throw tournamentError;
    }

    // Fetch prize distribution
    const { data: prizeDistribution, error: prizeError } = await client
      .from('tournament_prize_distribution')
      .select('*')
      .eq('tournament_id', id)
      .order('position', { ascending: true });

    if (prizeError) {
      console.error('Error fetching prize distribution:', prizeError);
    }

    // Fetch rounds
    const { data: rounds, error: roundsError } = await client
      .from('tournament_rounds')
      .select(`
        *,
        tournament_round_rules(*)
      `)
      .eq('tournament_id', id)
      .order('round_number', { ascending: true });

    if (roundsError) {
      console.error('Error fetching tournament rounds:', roundsError);
    }

    // Format rounds data
    const formattedRounds = rounds?.map((round: any) => ({
      id: round.id,
      tournamentId: round.tournament_id,
      roundNumber: round.round_number,
      roundName: round.round_name,
      startDate: round.start_date,
      endDate: round.end_date,
      status: round.status,
      rules: round.tournament_round_rules?.[0] ? {
        maxTotalBets: round.tournament_round_rules[0].max_total_bets,
        maxParlayLength: round.tournament_round_rules[0].max_parlay_length,
        minimumRisk: round.tournament_round_rules[0].minimum_risk,
        survivorMetric: round.tournament_round_rules[0].survivor_metric,
        survivorType: round.tournament_round_rules[0].survivor_type
      } : null
    }));

    // Map tournament data to our interface format
    return {
      id: tournament.id,
      name: tournament.name,
      description: tournament.description,
      rules: tournament.rules,
      status: tournament.status,
      prizePool: tournament.prize_pool,
      entryFee: tournament.entry_fee,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      maxParticipants: tournament.max_participants,
      isPublic: tournament.is_public,
      type: tournament.type,
      createdAt: tournament.created_at,
      updatedAt: tournament.updated_at,
      createdBy: tournament.created_by,
      participantCount: tournament.participant_count || 0,
      roundCount: tournament.round_count,
      entryDeadline: tournament.entry_deadline,
      roundType: tournament.round_type,
      payoutType: tournament.payout_type,
      prizeDistribution: prizeDistribution || [],
      rounds: formattedRounds || []
    };
  } catch (error) {
    console.error(`Error fetching tournament ${id}:`, error);
    return null;
  }
}

/**
 * Get a single tournament with all related data (for admin management)
 */
export async function getTournamentDetails(tournamentId: string): Promise<{
  tournament?: any;
  success: boolean;
  error?: string;
}> {
  try {
    // Get the tournament
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (tournamentError) {
      throw tournamentError;
    }

    // Get the prize distribution
    const { data: prizeDistribution, error: prizeError } = await supabase
      .from('tournament_prize_distribution')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('position', { ascending: true });

    if (prizeError && !prizeError.message.includes('does not exist')) {
      throw prizeError;
    }

    // Get the rounds
    const { data: rounds, error: roundsError } = await supabase
      .from('tournament_rounds')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('round_number', { ascending: true });

    if (roundsError && !roundsError.message.includes('does not exist')) {
      throw roundsError;
    }

    // Get rules for each round
    const roundsWithRules = await Promise.all(
      (rounds || []).map(async (round) => {
        const { data: rules, error: rulesError } = await supabase
          .from('tournament_round_rules')
          .select('*')
          .eq('round_id', round.id)
          .single();

        if (rulesError && !rulesError.message.includes('does not exist')) {
          return { ...round, rules: null };
        }

        return { ...round, rules };
      })
    );

    // Get participants using bets table instead of tournament_round_participants
    const { data: betsData, error: betsError } = await supabase
      .from('bets')
      .select(`
        id,
        user_id,
        tournament_id,
        risk,
        net_amount,
        status,
        created_at,
        users (id, username, avatar_url)
      `)
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: false });

    if (betsError && !betsError.message.includes('does not exist')) {
      throw betsError;
    }

    // Process bets to create participant list
    // Group bets by user to get total balance per user
    const participantsMap = new Map();
    
    if (betsData && betsData.length > 0) {
      betsData.forEach(bet => {
        if (!participantsMap.has(bet.user_id)) {
          // Initialize new participant
          participantsMap.set(bet.user_id, {
            id: crypto.randomUUID(), // Generate unique ID for this participant entry
            user_id: bet.user_id,
            token_balance: 0,
            status: 'active',
            rank: null,
            users: bet.users
          });
        }
        
        // Add to token balance based on bet status
        const participant = participantsMap.get(bet.user_id);
        if (bet.status === 'won') {
          participant.token_balance += bet.net_amount;
        } else if (bet.status === 'lost') {
          participant.token_balance -= bet.risk;
        }
      });
    }
    
    // Convert map to array
    const participants = Array.from(participantsMap.values());

    return {
      tournament: {
        ...tournament,
        prize_distribution: prizeDistribution || [],
        rounds: roundsWithRules || [],
        participants: participants || []
      },
      success: true
    };
  } catch (error: any) {
    console.error('Error fetching tournament details by ID:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Create a tournament
 */
export async function createTournament(tournamentData: any, supabaseClient?: any): Promise<Tournament | null> {
  try {
    // Get appropriate client
    const client = getSupabaseClient(supabaseClient);
    
    // Generate a unique ID for the tournament
    const id = crypto.randomUUID();

    // Prepare data for database
    const dbTournament = {
      ...mapTournamentToDb(tournamentData),
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Create the tournament
    const { data, error } = await client
      .from('tournaments')
      .insert([dbTournament])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Create prize distribution if provided
    if (tournamentData.prizeDistribution && tournamentData.prizeDistribution.length > 0) {
      const prizeDistData = tournamentData.prizeDistribution.map((item: any) => ({
        tournament_id: id,
        position: item.position,
        percentage: item.percentage,
        amount: item.amount
      }));

      const { error: prizeDistError } = await client
        .from('tournament_prize_distribution')
        .insert(prizeDistData);

      if (prizeDistError) {
        console.error('Error creating prize distribution:', prizeDistError);
      }
    }

    // Create rounds if provided
    if (tournamentData.rounds && tournamentData.rounds.length > 0) {
      // Process one round at a time to handle rules
      for (const round of tournamentData.rounds) {
        // Create the round
        const { data: roundData, error: roundError } = await client
          .from('tournament_rounds')
          .insert([{
            tournament_id: id,
            round_number: round.roundNumber,
            round_name: round.roundName || `Round ${round.roundNumber}`,
            start_date: round.startDate || tournamentData.startDate,
            end_date: round.endDate || tournamentData.endDate,
            status: 'upcoming'
          }])
          .select()
          .single();

        if (roundError) {
          console.error('Error creating tournament round:', roundError);
          continue;
        }

        // Create rules for this round if provided
        if (round.rules) {
          const { error: rulesError } = await client
            .from('tournament_round_rules')
            .insert([{
              round_id: roundData.id,
              max_total_bets: round.rules.maxTotalBets,
              max_parlay_length: round.rules.maxParlayLength,
              minimum_risk: round.rules.minimumRisk,
              survivor_metric: round.rules.survivorMetric,
              survivor_type: round.rules.survivorType
            }]);

          if (rulesError) {
            console.error('Error creating round rules:', rulesError);
          }
        }
      }
    }

    // Map the result to our interface
    return mapDbTournamentToTournament(data);
  } catch (error) {
    console.error('Error creating tournament:', error);
    return null;
  }
}

/**
 * Update a tournament
 */
export async function updateTournament(id: string, updates: any, supabaseClient?: any): Promise<Tournament | null> {
  try {
    // Get appropriate client
    const client = getSupabaseClient(supabaseClient);
    
    // Prepare data for database
    const dbUpdates = {
      ...mapTournamentToDb(updates),
      updated_at: new Date().toISOString()
    };

    // Update the tournament
    const { data, error } = await client
      .from('tournaments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update prize distribution if provided
    if (updates.prizeDistribution && updates.prizeDistribution.length > 0) {
      // First delete existing prize distribution
      const { error: deleteError } = await client
        .from('tournament_prize_distribution')
        .delete()
        .eq('tournament_id', id);

      if (deleteError) {
        console.error('Error deleting prize distribution:', deleteError);
      }

      // Then insert the updated prize distribution
      const prizeDistData = updates.prizeDistribution.map((item: any) => ({
        tournament_id: id,
        position: item.position,
        percentage: item.percentage,
        amount: item.amount
      }));

      const { error: insertError } = await client
        .from('tournament_prize_distribution')
        .insert(prizeDistData);

      if (insertError) {
        console.error('Error updating prize distribution:', insertError);
      }
    }

    // Update rounds if provided
    if (updates.rounds && updates.rounds.length > 0) {
      for (const round of updates.rounds) {
        if (round.id) {
          // Update existing round
          const { error: roundError } = await client
            .from('tournament_rounds')
            .update({
              round_name: round.roundName,
              round_number: round.roundNumber,
              start_date: round.startDate,
              end_date: round.endDate,
              status: round.status || 'upcoming'
            })
            .eq('id', round.id);

          if (roundError) {
            console.error('Error updating tournament round:', roundError);
            continue;
          }

          // Update rules if provided
          if (round.rules) {
            // First check if rules exist
            const { data: existingRules, error: checkError } = await client
              .from('tournament_round_rules')
              .select('id')
              .eq('round_id', round.id);

            if (checkError) {
              console.error('Error checking round rules:', checkError);
              continue;
            }

            if (existingRules && existingRules.length > 0) {
              // Update existing rules
              const { error: updateError } = await client
                .from('tournament_round_rules')
                .update({
                  max_total_bets: round.rules.maxTotalBets,
                  max_parlay_length: round.rules.maxParlayLength,
                  minimum_risk: round.rules.minimumRisk,
                  survivor_metric: round.rules.survivorMetric,
                  survivor_type: round.rules.survivorType
                })
                .eq('round_id', round.id);

              if (updateError) {
                console.error('Error updating round rules:', updateError);
              }
            } else {
              // Insert new rules
              const { error: insertError } = await client
                .from('tournament_round_rules')
                .insert([{
                  round_id: round.id,
                  max_total_bets: round.rules.maxTotalBets,
                  max_parlay_length: round.rules.maxParlayLength,
                  minimum_risk: round.rules.minimumRisk,
                  survivor_metric: round.rules.survivorMetric,
                  survivor_type: round.rules.survivorType
                }]);

              if (insertError) {
                console.error('Error creating round rules:', insertError);
              }
            }
          }
        } else {
          // Create new round
          const { data: roundData, error: roundError } = await client
            .from('tournament_rounds')
            .insert([{
              tournament_id: id,
              round_number: round.roundNumber,
              round_name: round.roundName || `Round ${round.roundNumber}`,
              start_date: round.startDate || updates.startDate,
              end_date: round.endDate || updates.endDate,
              status: 'upcoming'
            }])
            .select()
            .single();

          if (roundError) {
            console.error('Error creating tournament round:', roundError);
            continue;
          }

          // Create rules for this round if provided
          if (round.rules) {
            const { error: rulesError } = await client
              .from('tournament_round_rules')
              .insert([{
                round_id: roundData.id,
                max_total_bets: round.rules.maxTotalBets,
                max_parlay_length: round.rules.maxParlayLength,
                minimum_risk: round.rules.minimumRisk,
                survivor_metric: round.rules.survivorMetric,
                survivor_type: round.rules.survivorType
              }]);

            if (rulesError) {
              console.error('Error creating round rules:', rulesError);
            }
          }
        }
      }
    }

    // Fetch the updated tournament with all related data
    return await fetchTournamentById(id, client);
  } catch (error) {
    console.error('Error updating tournament:', error);
    return null;
  }
}

/**
 * Delete a tournament
 */
export async function deleteTournament(id: string, supabaseClient?: any): Promise<boolean> {
  try {
    // Get appropriate client
    const client = getSupabaseClient(supabaseClient);
    
    // Delete prize distribution
    const { error: prizeError } = await client
      .from('tournament_prize_distribution')
      .delete()
      .eq('tournament_id', id);

    if (prizeError && !prizeError.message.includes('does not exist')) {
      console.error('Error deleting prize distribution:', prizeError);
    }

    // Get rounds for this tournament
    const { data: rounds, error: roundsQueryError } = await client
      .from('tournament_rounds')
      .select('id')
      .eq('tournament_id', id);

    if (roundsQueryError && !roundsQueryError.message.includes('does not exist')) {
      console.error('Error getting tournament rounds:', roundsQueryError);
    }

    // Delete round rules for all rounds
    if (rounds && rounds.length > 0) {
      for (const round of rounds) {
        const { error: rulesError } = await client
          .from('tournament_round_rules')
          .delete()
          .eq('round_id', round.id);

        if (rulesError && !rulesError.message.includes('does not exist')) {
          console.error('Error deleting round rules:', rulesError);
        }
      }
    }

    // Delete rounds
    const { error: roundsError } = await client
      .from('tournament_rounds')
      .delete()
      .eq('tournament_id', id);

    if (roundsError && !roundsError.message.includes('does not exist')) {
      console.error('Error deleting tournament rounds:', roundsError);
    }

    // Delete the tournament
    const { error } = await client
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return false;
  }
}

/**
 * Completely deletes a tournament and all related data
 */
export async function deleteTournamentWithRelated(tournamentId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Check if tournament exists
    const { data: tournament, error: checkError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (checkError) {
      throw new Error(`Tournament not found: ${checkError.message}`);
    }

    // Try to delete prize distribution
    try {
      const { error: prizeError } = await supabase
        .from('tournament_prize_distribution')
        .delete()
        .eq('tournament_id', tournamentId);

      if (prizeError && !prizeError.message.includes('does not exist')) {
        console.warn(`Non-fatal error deleting prize distribution: ${prizeError.message}`);
      }
    } catch (error) {
      console.warn('Prize distribution deletion error (non-fatal):', error);
    }

    // Try to get and delete rounds data
    try {
      // Get all rounds for this tournament
      const { data: rounds, error: roundsError } = await supabase
        .from('tournament_rounds')
        .select('id')
        .eq('tournament_id', tournamentId);

      if (roundsError && !roundsError.message.includes('does not exist')) {
        throw new Error(`Error getting tournament rounds: ${roundsError.message}`);
      }

      // Delete rules for each round
      if (rounds && rounds.length > 0) {
        for (const round of rounds) {
          const { error: rulesError } = await supabase
            .from('tournament_round_rules')
            .delete()
            .eq('round_id', round.id);

          if (rulesError && !rulesError.message.includes('does not exist')) {
            console.warn(`Non-fatal error deleting round rules: ${rulesError.message}`);
          }
        }
      }

      // Delete all rounds
      const { error: deleteRoundsError } = await supabase
        .from('tournament_rounds')
        .delete()
        .eq('tournament_id', tournamentId);

      if (deleteRoundsError && !deleteRoundsError.message.includes('does not exist')) {
        console.warn(`Non-fatal error deleting tournament rounds: ${deleteRoundsError.message}`);
      }
    } catch (error) {
      console.warn('Round deletion error (non-fatal):', error);
    }

    // Try to delete participants
    try {
      const { error: participantsError } = await supabase
        .from('tournament_round_participants')
        .delete()
        .eq('tournament_id', tournamentId);

      if (participantsError && !participantsError.message.includes('does not exist')) {
        console.warn(`Non-fatal error deleting tournament participants: ${participantsError.message}`);
      }
    } catch (error) {
      console.warn('Participant deletion error (non-fatal):', error);
    }

    // Finally, delete the tournament
    const { error: deleteTournamentError } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', tournamentId);

    if (deleteTournamentError) {
      throw new Error(`Error deleting tournament: ${deleteTournamentError.message}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Tournament deletion error:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Maps a database tournament to our Tournament interface
 */
function mapDbTournamentToTournament(dbTournament: any): Tournament {
  return {
    id: dbTournament.id,
    name: dbTournament.name,
    description: dbTournament.description,
    rules: dbTournament.rules,
    status: dbTournament.status,
    prizePool: dbTournament.prize_pool || dbTournament.prizePool,
    entryFee: dbTournament.entry_fee || dbTournament.entryFee,
    startDate: dbTournament.start_date || dbTournament.startDate,
    endDate: dbTournament.end_date || dbTournament.endDate,
    maxParticipants: dbTournament.max_participants || dbTournament.maxParticipants,
    isPublic: typeof dbTournament.is_public !== 'undefined' ? dbTournament.is_public : 
              typeof dbTournament.isPublic !== 'undefined' ? dbTournament.isPublic : true,
    type: dbTournament.type,
    createdAt: dbTournament.created_at || dbTournament.createdAt,
    updatedAt: dbTournament.updated_at || dbTournament.updatedAt,
    createdBy: dbTournament.created_by || dbTournament.createdBy,
    participantCount: dbTournament.participant_count || dbTournament.participantCount || 0
  };
}

/**
 * Maps our Tournament interface to the database schema format
 */
function mapTournamentToDb(tournament: Partial<Tournament>): Record<string, any> {
  const dbTournament: Record<string, any> = {};

  // Map fields to database format
  if (tournament.name !== undefined) dbTournament.name = tournament.name;
  if (tournament.description !== undefined) dbTournament.description = tournament.description;
  if (tournament.rules !== undefined) dbTournament.rules = tournament.rules;
  if (tournament.status !== undefined) dbTournament.status = tournament.status;
  if (tournament.prizePool !== undefined) dbTournament.prize_pool = tournament.prizePool;
  if (tournament.entryFee !== undefined) dbTournament.entry_fee = tournament.entryFee;
  
  // Handle dates - ensure they are in ISO string format
  if (tournament.startDate !== undefined) {
    // Ensure it's a valid date
    try {
      if (tournament.startDate === null) {
        dbTournament.start_date = null;
      } else if (typeof tournament.startDate === 'string') {
        // Check if it's already an ISO string
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(tournament.startDate)) {
          dbTournament.start_date = tournament.startDate;
        } else {
          // Try to parse and convert
          const date = new Date(tournament.startDate);
          dbTournament.start_date = isNaN(date.getTime()) ? null : date.toISOString();
        }
      } else if (tournament.startDate && typeof tournament.startDate === 'object') {
        // Type assertion for Date object
        const dateObj = tournament.startDate as unknown as Date;
        if (dateObj.toISOString) {
          dbTournament.start_date = dateObj.toISOString();
        }
      }
    } catch (e) {
      console.error('Error converting startDate:', e);
      dbTournament.start_date = null;
    }
  }
  
  if (tournament.endDate !== undefined) {
    // Ensure it's a valid date
    try {
      if (tournament.endDate === null) {
        dbTournament.end_date = null;
      } else if (typeof tournament.endDate === 'string') {
        // Check if it's already an ISO string
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(tournament.endDate)) {
          dbTournament.end_date = tournament.endDate;
        } else {
          // Try to parse and convert
          const date = new Date(tournament.endDate);
          dbTournament.end_date = isNaN(date.getTime()) ? null : date.toISOString();
        }
      } else if (tournament.endDate && typeof tournament.endDate === 'object') {
        // Type assertion for Date object
        const dateObj = tournament.endDate as unknown as Date;
        if (dateObj.toISOString) {
          dbTournament.end_date = dateObj.toISOString();
        }
      }
    } catch (e) {
      console.error('Error converting endDate:', e);
      dbTournament.end_date = null;
    }
  }
  
  if (tournament.maxParticipants !== undefined) dbTournament.max_participants = tournament.maxParticipants;
  if (tournament.isPublic !== undefined) dbTournament.is_public = tournament.isPublic;
  if (tournament.type !== undefined) dbTournament.type = tournament.type;
  if (tournament.createdBy !== undefined) dbTournament.created_by = tournament.createdBy;

  return dbTournament;
}

// Helper function to get either the provided client or the default supabase client
export const getSupabaseClient = (client?: any) => {
  return client || supabase;
}; 