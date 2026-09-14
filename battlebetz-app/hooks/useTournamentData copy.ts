import { useState, useEffect, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from './useAuth';

export interface Tournament {
    id: string;
    status:string;
    name: string;
    type: string;
    is_public: boolean;
    entry_fee: number;
    prize_pool: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

export interface TournamentRound {
    id: string;
    tournament_id: string;
    round_name: string;
    participant_count: number;
    status: string;
    duration: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

export interface TournamentRoundParticipant {
    id: string;
    tournament_id: string;
    user_id: string;
    joined_at: string;
    tokens: number;
    round_name: string;
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
                .from('tournaments_new')
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
                (await supabase.from('tournaments_new').select('*').eq('id', tournamentId).single()).data;
            
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
                    table: 'tournaments_new',
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
        
        // Actions
        refreshData,
        isParticipating,
        joinTournamentRound
    };
};

export default useTournamentData;
