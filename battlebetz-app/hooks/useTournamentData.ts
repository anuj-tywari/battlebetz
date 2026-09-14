import { useState, useEffect, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from './useAuth';

// Tournament Interfaces 
export interface Tournament {
    id: string;
    status: string;
    name: string;
    type: string;
    description?: string;
    rules?: string;
    is_public: boolean;
    entry_fee: number;
    prize_pool: number;
    max_participants?: number;
    round_count?: number;
    entry_deadline?: string;
    round_type?: string;
    payout_type?: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

export interface TournamentRound {
    id: string;
    tournament_id: string;
    round_number?: number;
    round_name: string;
    participant_count: number;
    status: string;
    duration: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

export interface TournamentRoundRules {
    id?: string;
    round_id: string;
    max_total_bets: number;
    max_parlay_length: number;
    minimum_risk: number;
    survivor_metric: string;
    survivor_type: string;
}

export interface TournamentPrizeDistribution {
    id?: string;
    tournament_id: string;
    position: number;
    percentage: number;
    amount: number;
    recipient_id?: string | null;
}

export interface TournamentRoundParticipant {
    id: string;
    tournament_id: string;
    user_id: string;
    joined_at: string;
    token_balance: number;
    round_id: string;
    status: string;
    rank:number;
    created_at: string;
    updated_at: string;
}

export interface UserRoundStats {
    totalBets: number;
    wonBets: number;
    lostBets: number;
    netResult: number;
    rank: number | null;
    totalParticipants: number;
}

export interface CompleteRound extends TournamentRound {
    rules?: TournamentRoundRules;
}

export interface CompleteTournament extends Tournament {
    rounds?: CompleteRound[];
    prize_distribution?: TournamentPrizeDistribution[];
    participants?: TournamentRoundParticipant[];
}

/**
 * Custom hook to fetch and manage tournament data for a user
 * @param tournamentId - The tournament ID to fetch data for
 * @param roundName - Optional round name to filter by
 * @returns Object containing tournament data, loading states, and helper functions
 */
export const useTournamentData = (tournamentId: string, roundName?: string) => {
    const { user } = useAuth();
    const userId = user?.id;

    // State for tournament data
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [tournamentRound, setTournamentRound] = useState<TournamentRound | null>(null);
    const [participant, setParticipant] = useState<TournamentRoundParticipant | null>(null);
    const [userStats, setUserStats] = useState<UserRoundStats | null>(null);
    
    // Loading and error states
    const [isLoadingTournament, setIsLoadingTournament] = useState<boolean>(true);
    const [isLoadingRound, setIsLoadingRound] = useState<boolean>(true);
    const [isLoadingParticipant, setIsLoadingParticipant] = useState<boolean>(true);
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch tournament by ID
     */
    const fetchTournament = useCallback(async () => {
        if (!tournamentId) {
            setIsLoadingTournament(false);
            return;
        }

        setIsLoadingTournament(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('tournaments')
                .select('*')
                .eq('id', tournamentId)
                .single();

            if (fetchError) {
                throw new Error(fetchError.message);
            }

            setTournament(data as Tournament);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tournament');
            console.error('Error fetching tournament:', err);
        } finally {
            setIsLoadingTournament(false);
        }
    }, [tournamentId]);

    /**
     * Fetch tournament round by tournament ID and round name
     */
    const fetchTournamentRound = useCallback(async () => {
        if (!tournamentId || !roundName) {
            setIsLoadingRound(false);
            return;
        }

        setIsLoadingRound(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('tournament_rounds')
                .select('*')
                .eq('tournament_id', tournamentId)
                .eq('round_name', roundName)
                .single();

            if (fetchError) {
                throw new Error(fetchError.message);
            }

            setTournamentRound(data as TournamentRound);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tournament round');
            console.error('Error fetching tournament round:', err);
        } finally {
            setIsLoadingRound(false);
        }
    }, [tournamentId, roundName]);

    /**
     * Fetch tournament participant data for current user
     */
    const fetchParticipant = useCallback(async () => {
        if (!tournamentId || !userId || !roundName) {
            setIsLoadingParticipant(false);
            return;
        }

        setIsLoadingParticipant(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('tournament_round_participants')
                .select('*')
                .eq('tournament_id', tournamentId)
                .eq('user_id', userId)
                .eq('round_name', roundName)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // Not found is not an error for us
                throw new Error(fetchError.message);
            }

            setParticipant(data as TournamentRoundParticipant);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch participant data');
            console.error('Error fetching participant data:', err);
        } finally {
            setIsLoadingParticipant(false);
        }
    }, [tournamentId, userId, roundName]);

    /**
     * Calculate user's betting statistics and rank for the tournament round
     */
    const calculateUserStats = useCallback(async () => {
        if (!tournamentId || !userId || !roundName) {
            setIsLoadingStats(false);
            return;
        }

        setIsLoadingStats(true);
        setError(null);

        try {
            // Get user's bets for this tournament and round
            const { data: betsData, error: betsError } = await supabase
                .from('bets')
                .select('*')
                .eq('tournament_id', tournamentId)
                .eq('user_id', userId)
                .eq('tournament_round', roundName);

            if (betsError) {
                throw new Error(betsError.message);
            }

            // Calculate betting stats
            const stats: UserRoundStats = {
                totalBets: betsData?.length || 0,
                wonBets: betsData?.filter(bet => bet.status === 'won').length || 0,
                lostBets: betsData?.filter(bet => bet.status === 'lost').length || 0,
                netResult: betsData?.reduce((total, bet) => {
                    if (bet.status === 'won') return total + bet.net_amount;
                    if (bet.status === 'lost') return total - bet.risk;
                    return total;
                }, 0) || 0,
                rank: null,
                totalParticipants: 0
            };

            // Get participant rankings by tokens/results
            const { data: rankingsData, error: rankingsError } = await supabase
                .from('tournament_round_participants')
                .select('user_id, tokens')
                .eq('tournament_id', tournamentId)
                .eq('round_name', roundName)
                .order('tokens', { ascending: false });

            if (rankingsError) {
                throw new Error(rankingsError.message);
            }

            // Calculate rank and total participants
            if (rankingsData && rankingsData.length > 0) {
                stats.totalParticipants = rankingsData.length;
                const userIndex = rankingsData.findIndex(p => p.user_id === userId);
                if (userIndex !== -1) {
                    stats.rank = userIndex + 1; // +1 because array index is 0-based
                }
            }

            setUserStats(stats);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to calculate stats');
            console.error('Error calculating user stats:', err);
        } finally {
            setIsLoadingStats(false);
        }
    }, [tournamentId, userId, roundName]);

    /**
     * Refresh all tournament data
     */
    const refreshData = useCallback(async () => {
        await fetchTournament();
        await fetchTournamentRound();
        await fetchParticipant();
        await calculateUserStats();
    }, [fetchTournament, fetchTournamentRound, fetchParticipant, calculateUserStats]);

    /**
     * Check if user is participating in the current tournament round
     */
    const isParticipating = useCallback(() => {
        return !!participant;
    }, [participant]);

    /**
     * Join tournament round as current user
     */
    const joinTournamentRound = useCallback(async () => {
        if (!tournamentId || !userId || !roundName || isParticipating()) {
            return { success: false, error: 'Cannot join tournament' };
        }

        try {
            // Get tournament information for entry fee
            const tournamentInfo = tournament || 
                (await supabase.from('tournaments').select('*').eq('id', tournamentId).single()).data;
            
            if (!tournamentInfo) {
                return { success: false, error: 'Tournament not found' };
            }

            // Create participant record
            const newParticipant: Partial<TournamentRoundParticipant> = {
                tournament_id: tournamentId,
                user_id: userId,
                round_name: roundName,
                joined_at: new Date().toISOString(),
                tokens: tournamentInfo.entry_fee, // Start with tokens equal to entry fee
            };

            const { data, error: insertError } = await supabase
                .from('tournament_round_participants')
                .insert(newParticipant)
                .select()
                .single();

            if (insertError) {
                throw new Error(insertError.message);
            }

            // Update local state with new participant data
            setParticipant(data as TournamentRoundParticipant);
            
            // Refresh stats
            calculateUserStats();
            
            return { success: true, data };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to join tournament';
            setError(errorMessage);
            console.error('Error joining tournament:', err);
            return { success: false, error: errorMessage };
        }
    }, [tournamentId, userId, roundName, tournament, isParticipating, calculateUserStats]);

    // Load data on initial render and when dependencies change
    useEffect(() => {
        fetchTournament();
    }, [fetchTournament]);

    useEffect(() => {
        fetchTournamentRound();
    }, [fetchTournamentRound]);

    useEffect(() => {
        fetchParticipant();
    }, [fetchParticipant]);

    useEffect(() => {
        calculateUserStats();
    }, [calculateUserStats]);

    // Set up real-time subscriptions
    useEffect(() => {
        if (!tournamentId || !userId) return;

        // Tournament updates
        const tournamentSubscription = supabase
            .channel('tournament-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tournaments',
                    filter: `id=eq.${tournamentId}`
                },
                () => fetchTournament()
            )
            .subscribe();

        // Tournament round updates
        const roundSubscription = roundName ? supabase
            .channel('round-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tournament_rounds',
                    filter: `tournament_id=eq.${tournamentId} AND round_name=eq.${roundName}`
                },
                () => fetchTournamentRound()
            )
            .subscribe() : null;

        // Participant updates
        const participantSubscription = roundName ? supabase
            .channel('participant-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tournament_round_participants',
                    filter: `tournament_id=eq.${tournamentId} AND user_id=eq.${userId} AND round_name=eq.${roundName}`
                },
                () => {
                    fetchParticipant();
                    calculateUserStats();
                }
            )
            .subscribe() : null;

        // Bet updates - for recalculating stats
        const betSubscription = roundName ? supabase
            .channel('bet-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bets',
                    filter: `tournament_id=eq.${tournamentId} AND user_id=eq.${userId} AND round_name=eq.${roundName}`
                },
                () => calculateUserStats()
            )
            .subscribe() : null;

        // Cleanup subscriptions
        return () => {
            supabase.removeChannel(tournamentSubscription);
            if (roundSubscription) supabase.removeChannel(roundSubscription);
            if (participantSubscription) supabase.removeChannel(participantSubscription);
            if (betSubscription) supabase.removeChannel(betSubscription);
        };
    }, [tournamentId, userId, roundName, fetchTournament, fetchTournamentRound, fetchParticipant, calculateUserStats]);

    // ---- Tournament Administration Service Functions ----

    /**
     * Create a new tournament with all related data
     */
    const createTournament = async (tournamentData: any) => {
        try {
            // Start a Supabase transaction
            const { data: tournament, error: tournamentError } = await supabase
                .from('tournaments')
                .insert({
                    name: tournamentData.name,
                    description: tournamentData.description,
                    rules: tournamentData.rules,
                    type: tournamentData.type,
                    prize_pool: tournamentData.prize_pool,
                    max_participants: tournamentData.max_participants,
                    entry_fee: tournamentData.entry_fee,
                    start_date: tournamentData.start_date,
                    end_date: tournamentData.end_date,
                    round_count: tournamentData.round_count,
                    entry_deadline: tournamentData.entry_deadline,
                    round_type: tournamentData.round_type,
                    is_public: tournamentData.is_public,
                    payout_type: tournamentData.payout_type,
                    status: 'upcoming' // Default status for new tournaments
                })
                .select()
                .single();

            if (tournamentError) {
                throw new Error(`Error creating tournament: ${tournamentError.message}`);
            }

            const tournamentId = tournament.id;

            // Insert prize distribution
            if (tournamentData.prize_distribution && tournamentData.prize_distribution.length > 0) {
                const prizeDistributionData = tournamentData.prize_distribution.map(tier => ({
                    tournament_id: tournamentId,
                    position: tier.position,
                    percentage: tier.percentage,
                    amount: tier.amount,
                    recipient_id: null // This will be filled when a participant wins
                }));

                const { error: prizeDistributionError } = await supabase
                    .from('tournament_prize_distribution')
                    .insert(prizeDistributionData);

                if (prizeDistributionError) {
                    throw new Error(`Error creating prize distribution: ${prizeDistributionError.message}`);
                }
            }

            // Insert tournament rounds and their rules
            if (tournamentData.rounds && tournamentData.rounds.length > 0) {
                // First insert each round
                for (const round of tournamentData.rounds) {
                  // Use each round's specific dates instead of the tournament's dates
                  const roundStartDate = round.start_date;
                  const roundEndDate = round.end_date;
              
                  const { data: roundData, error: roundError } = await supabase
                    .from('tournament_rounds')
                    .insert({
                      tournament_id: tournamentId,
                      round_number: round.round_number,
                      round_name: round.round_name,
                      participant_count: 0,
                      status: 'upcoming', // Default status for new rounds
                      start_date: roundStartDate,
                      end_date: roundEndDate
                    })
                    .select()
                    .single();
              
                  if (roundError) {
                    throw new Error(`Error creating tournament round: ${roundError.message}`);
                  }
              
                  // Then insert rules for this round using the round_id
                  const roundId = roundData.id;
                  
                  const { error: rulesError } = await supabase
                    .from('tournament_round_rules')
                    .insert({
                      round_id: roundId,
                      max_total_bets: round.rules.max_total_bets,
                      max_parlay_length: round.rules.max_parlay_length,
                      minimum_risk: round.rules.minimum_risk,
                      survivor_metric: round.rules.survivor_metric,
                      survivor_type: round.rules.survivor_type
                    });
              
                  if (rulesError) {
                    throw new Error(`Error creating round rules: ${rulesError.message}`);
                  }
                }
              }

            return { tournament, success: true };
        } catch (error) {
            console.error('Tournament creation error:', error);
            return { error: error.message, success: false };
        }
    };

    /**
     * Get all tournaments (for admin management)
     */
    const getAllTournaments = async () => {
        try {
            const { data, error } = await supabase
                .from('tournaments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return { tournaments: data, success: true };
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            return { error: error.message, success: false };
        }
    };

    /**
     * Get a single tournament with all related data (for admin management)
     */
    const getTournamentDetails = async (targetTournamentId: string) => {
        try {
            // Get the tournament
            const { data: tournament, error: tournamentError } = await supabase
                .from('tournaments')
                .select('*')
                .eq('id', targetTournamentId)
                .single();

            if (tournamentError) {
                throw tournamentError;
            }

            // Get the prize distribution
            const { data: prizeDistribution, error: prizeError } = await supabase
                .from('tournament_prize_distribution')
                .select('*')
                .eq('tournament_id', targetTournamentId)
                .order('position', { ascending: true });

            if (prizeError) {
                throw prizeError;
            }

            // Get the rounds
            const { data: rounds, error: roundsError } = await supabase
                .from('tournament_rounds')
                .select('*')
                .eq('tournament_id', targetTournamentId)
                .order('round_number', { ascending: true });

            if (roundsError) {
                throw roundsError;
            }

            // Get rules for each round
            const roundsWithRules = await Promise.all(
                rounds.map(async (round) => {
                    const { data: rules, error: rulesError } = await supabase
                        .from('tournament_round_rules')
                        .select('*')
                        .eq('round_id', round.id)
                        .single();

                    if (rulesError) {
                        return { ...round, rules: null };
                    }

                    return { ...round, rules };
                })
            );

            // Get participants
            const { data: participants, error: participantsError } = await supabase
                .from('tournament_round_participants')
                .select(`
                    id,
                    user_id,
                    status,
                    token_balance,
                    rank,
                    users (id, username, avatar_url)
                `)
                .eq('tournament_id', targetTournamentId);

            if (participantsError) {
                throw participantsError;
            }

            return {
                tournament: {
                    ...tournament,
                    prize_distribution: prizeDistribution,
                    rounds: roundsWithRules,
                    participants: participants || []
                },
                success: true
            };
        } catch (error) {
            console.error('Error fetching tournament by ID:', error);
            return { error: error.message, success: false };
        }
    };

    /**
     * Update an existing tournament
     */
    const updateTournament = async (targetTournamentId: string, tournamentData: any) => {
        try {
            // Update the main tournament record
            const { data: tournament, error: tournamentError } = await supabase
                .from('tournaments')
                .update({
                    name: tournamentData.name,
                    description: tournamentData.description,
                    rules: tournamentData.rules,
                    type: tournamentData.type,
                    prize_pool: tournamentData.prize_pool,
                    max_participants: tournamentData.max_participants,
                    entry_fee: tournamentData.entry_fee,
                    start_date: tournamentData.start_date,
                    end_date: tournamentData.end_date,
                    round_count: tournamentData.round_count,
                    entry_deadline: tournamentData.entry_deadline,
                    round_type: tournamentData.round_type,
                    is_public: tournamentData.is_public,
                    payout_type: tournamentData.payout_type,
                    status: tournamentData.status
                })
                .eq('id', targetTournamentId)
                .select()
                .single();

            if (tournamentError) {
                throw new Error(`Error updating tournament: ${tournamentError.message}`);
            }

            // Update prize distribution
            if (tournamentData.prize_distribution && tournamentData.prize_distribution.length > 0) {
                // Delete existing prize distribution
                const { error: deletePrizeError } = await supabase
                    .from('tournament_prize_distribution')
                    .delete()
                    .eq('tournament_id', targetTournamentId);

                if (deletePrizeError) {
                    throw new Error(`Error deleting prize distribution: ${deletePrizeError.message}`);
                }

                // Insert updated prize distribution
                const prizeDistributionData = tournamentData.prize_distribution.map(tier => ({
                    tournament_id: targetTournamentId,
                    position: tier.position,
                    percentage: tier.percentage,
                    amount: tier.amount,
                    recipient_id: tier.recipient_id || null
                }));

                const { error: prizeDistributionError } = await supabase
                    .from('tournament_prize_distribution')
                    .insert(prizeDistributionData);

                if (prizeDistributionError) {
                    throw new Error(`Error updating prize distribution: ${prizeDistributionError.message}`);
                }
            }

            // Handle round updates
            if (tournamentData.rounds && tournamentData.rounds.length > 0) {
                for (const round of tournamentData.rounds) {
                    if (round.id) {
                        // Update existing round
                        const { error: roundError } = await supabase
                            .from('tournament_rounds')
                            .update({
                                round_name: round.round_name,
                                status: round.status || 'upcoming',
                                start_date: round.start_date,
                                end_date: round.end_date
                            })
                            .eq('id', round.id);

                        if (roundError) {
                            throw new Error(`Error updating tournament round: ${roundError.message}`);
                        }

                        // Update rules
                        if (round.rules) {
                            const { error: rulesError } = await supabase
                                .from('tournament_round_rules')
                                .update({
                                    max_total_bets: round.rules.max_total_bets,
                                    max_parlay_length: round.rules.max_parlay_length,
                                    minimum_risk: round.rules.minimum_risk,
                                    survivor_metric: round.rules.survivor_metric,
                                    survivor_type: round.rules.survivor_type
                                })
                                .eq('round_id', round.id);

                            if (rulesError) {
                                throw new Error(`Error updating round rules: ${rulesError.message}`);
                            }
                        }
                    } else {
                        // Create new round
                        const { data: roundData, error: roundError } = await supabase
                            .from('tournament_rounds')
                            .insert({
                                tournament_id: targetTournamentId,
                                round_number: round.round_number,
                                round_name: round.round_name,
                                status: 'upcoming',
                                start_date: round.start_date || tournament.start_date,
                                end_date: round.end_date || tournament.end_date
                            })
                            .select()
                            .single();

                        if (roundError) {
                            throw new Error(`Error creating new tournament round: ${roundError.message}`);
                        }

                        // Insert rules for this round
                        const roundId = roundData.id;
                        
                        const { error: rulesError } = await supabase
                            .from('tournament_round_rules')
                            .insert({
                                round_id: roundId,
                                max_total_bets: round.rules.max_total_bets,
                                max_parlay_length: round.rules.max_parlay_length,
                                minimum_risk: round.rules.minimum_risk,
                                survivor_metric: round.rules.survivor_metric,
                                survivor_type: round.rules.survivor_type
                            });

                        if (rulesError) {
                            throw new Error(`Error creating round rules: ${rulesError.message}`);
                        }
                    }
                }
            }

            return { tournament, success: true };
        } catch (error) {
            console.error('Tournament update error:', error);
            return { error: error.message, success: false };
        }
    };

    /**
     * Delete a tournament and all related data
     */
    const deleteTournament = async (targetTournamentId: string) => {
        try {
            // Check if tournament exists
            const { data: tournament, error: checkError } = await supabase
                .from('tournaments')
                .select('*')
                .eq('id', targetTournamentId)
                .single();

            if (checkError) {
                throw new Error(`Tournament not found: ${checkError.message}`);
            }

            // 1. First delete prize distribution
            const { error: prizeError } = await supabase
                .from('tournament_prize_distribution')
                .delete()
                .eq('tournament_id', targetTournamentId);

            if (prizeError) {
                throw new Error(`Error deleting prize distribution: ${prizeError.message}`);
            }

            // 2. Get all rounds for this tournament
            const { data: rounds, error: roundsError } = await supabase
                .from('tournament_rounds')
                .select('id')
                .eq('tournament_id', targetTournamentId);

            if (roundsError) {
                throw new Error(`Error getting tournament rounds: ${roundsError.message}`);
            }

            // 3. Delete rules for each round
            for (const round of rounds) {
                const { error: rulesError } = await supabase
                    .from('tournament_round_rules')
                    .delete()
                    .eq('round_id', round.id);

                if (rulesError) {
                    throw new Error(`Error deleting round rules: ${rulesError.message}`);
                }
            }

            // 4. Delete all rounds
            const { error: deleteRoundsError } = await supabase
                .from('tournament_rounds')
                .delete()
                .eq('tournament_id', targetTournamentId);

            if (deleteRoundsError) {
                throw new Error(`Error deleting tournament rounds: ${deleteRoundsError.message}`);
            }

            // 5. Delete participants
            const { error: participantsError } = await supabase
                .from('tournament_round_participants')
                .delete()
                .eq('tournament_id', targetTournamentId);

            if (participantsError) {
                throw new Error(`Error deleting tournament participants: ${participantsError.message}`);
            }

            // 6. Finally, delete the tournament
            const { error: deleteTournamentError } = await supabase
                .from('tournaments')
                .delete()
                .eq('id', targetTournamentId);

            if (deleteTournamentError) {
                throw new Error(`Error deleting tournament: ${deleteTournamentError.message}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Tournament deletion error:', error);
            return { error: error.message, success: false };
        }
    };

    return {
        // Data
        tournament,
        tournamentRound,
        participant,
        userStats,
        
        // Status
        isLoading: isLoadingTournament || isLoadingRound || isLoadingParticipant || isLoadingStats,
        isLoadingTournament,
        isLoadingRound,
        isLoadingParticipant,
        isLoadingStats,
        error,
        
        // User-specific actions
        refreshData,
        isParticipating,
        joinTournamentRound,
        
        // Admin actions (tournament management)
        createTournament,
        getAllTournaments,
        getTournamentDetails,
        updateTournament,
        deleteTournament
    };
};

export default useTournamentData;