import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from './useAuth';

export interface Bet {
    id: string;
    user_id: string;
    tournament_id: string;
    net_amount: number;
    odds: number;
    potential_payout: number;
    prediction: string;
    status: string;
    risk: number;
    bet_type_id: number;
    tournament_round: string;
    created_at: string;
    updated_at: string;
}

export interface SubBet {
    id: string;
    user_id: string;
    bet_id: string;
    event_id: string;
    odds_id: string;
    type: string;
    name: string;
    description: string;
    odds: number;
    points: number;
    status: string;
    created_at: string;
    updated_at: string;
}


//  * Custom hook to fetch and manage user bet data for a specific tournament
//  * @param userId - The user ID to fetch bets for
//  * @param tournamentId - The tournament ID to fetch bets for
//  * @returns Object containing bets, subBets, loading states, and refresh functions

export const useBetData = (userId: string, tournamentId: string, tournament_round: string) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [subBets, setSubBets] = useState<SubBet[]>([]);
  const [isLoadingBets, setIsLoadingBets] = useState<boolean>(true);
  const [isLoadingSubBets, setIsLoadingSubBets] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch bets for the specified user and tournament
   */
  const fetchBets = useCallback(async () => {
    if (!userId || !tournamentId || !tournament_round) {
      setIsLoadingBets(false);
      return;
    }

    setIsLoadingBets(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', userId)
        .eq('tournament_id', tournamentId)
        .eq('tournament_round', tournament_round)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setBets(data as Bet[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bets');
      console.error('Error fetching bets:', err);
    } finally {
      setIsLoadingBets(false);
    }
  }, [userId, tournamentId, tournament_round]);

  /**
   * Fetch sub-bets for all bets of the current user in the tournament
   */
  const fetchSubBets = useCallback(async () => {
    if (!userId || bets.length === 0) {
      setIsLoadingSubBets(false);
      return;
    }

    setIsLoadingSubBets(true);
    setError(null);

    try {
      // Get all bet IDs
      const betIds = bets.map(bet => bet.id);

      const { data, error: fetchError } = await supabase
        .from('subbets')
        .select('*')
        .eq('user_id', userId)
        .in('bet_id', betIds)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setSubBets(data as SubBet[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sub-bets');
      console.error('Error fetching sub-bets:', err);
    } finally {
      setIsLoadingSubBets(false);
    }
  }, [userId, bets]);

  /**
   * Get sub-bets for a specific bet
   * @param betId - The bet ID to get sub-bets for
   * @returns Array of sub-bets for the specified bet
   */
  const getSubBetsForBet = useCallback(
    (betId: string): SubBet[] => {
      return subBets.filter(subBet => subBet.bet_id === betId);
    },
    [subBets]
  );

  /**
   * Calculate total stats for the tournament
   */
  const calculateStats = useCallback(() => {
    if (bets.length === 0) {
      return {
        totalBets: 0,
        pendingBets: 0,
        wonBets: 0,
        lostBets: 0,
        netProfit: 0,
        totalRisked: 0
      };
    }

    return bets.reduce(
      (acc, bet) => {
        acc.totalBets++;
        
        if (bet.status === 'pending') {
          acc.pendingBets++;
        } else if (bet.status === 'won') {
          acc.wonBets++;
          acc.netProfit += bet.net_amount;
        } else if (bet.status === 'lost') {
          acc.lostBets++;
          acc.netProfit -= bet.risk;
        }
        
        acc.totalRisked += bet.risk;
        
        return acc;
      },
      {
        totalBets: 0,
        pendingBets: 0,
        wonBets: 0,
        lostBets: 0,
        netProfit: 0,
        totalRisked: 0
      }
    );
  }, [bets]);

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async () => {
    await fetchBets();
    // Sub-bets will be fetched automatically after bets are updated via useEffect
  }, [fetchBets]);

  // Initial data fetch
  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  // Fetch sub-bets whenever bets change
  useEffect(() => {
    if (bets.length > 0) {
      fetchSubBets();
    } else {
      setSubBets([]);
      setIsLoadingSubBets(false);
    }
  }, [bets, fetchSubBets]);

  // Setup real-time subscriptions for live updates
  useEffect(() => {
    if (!userId || !tournamentId) return;

    // Subscribe to bets table changes for this user and tournament
    const betsSubscription = supabase
      .channel('bets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bets',
          filter: `user_id=eq.${userId} AND tournament_id=eq.${tournamentId}`
        },
        () => {
          fetchBets();
        }
      )
      .subscribe();

    // Subscribe to sub_bets table changes for this user
    const subBetsSubscription = supabase
      .channel('sub-bets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subbets',
          filter: `user_id=eq.${userId}`
        },
        () => {
          if (bets.length > 0) {
            fetchSubBets();
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(betsSubscription);
      supabase.removeChannel(subBetsSubscription);
    };
  }, [userId, tournamentId, fetchBets, fetchSubBets, bets.length]);

  return {
    bets,
    subBets,
    isLoading: isLoadingBets || isLoadingSubBets,
    isLoadingBets,
    isLoadingSubBets,
    error,
    refreshData,
    getSubBetsForBet,
    stats: calculateStats()
  };
};

export const fetchUserBets = async(user_id: string) => {
  const {data, error} = await supabase
    .from('bets')
    .select('*')
    .eq('user_id', user_id)

    return { bets: data, fetUserBetsError: error }
}

export default useBetData;