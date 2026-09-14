/**
 * @dev Anuj Tiwari
 * @Created_at 15/04/2025
 * @description Matrix page service to fetch the data from DB
 */
import { supabase } from '@/utils/supabaseClient';

import { TransactionType } from '@/types/transactions';

export interface PlatformMetrics {
  totalUsers: number;
  totalTournaments: number;
  totalPayouts: number;
  totalBetsPlaced: number;
  avgBetsPerRound: number;
  avgBetsPerTournament: number;
  avgLegsPerBet: number;
}

/**
 * Fetch platform-wide metrics.
 */
export const fetchPlatformMetrics = async (): Promise<PlatformMetrics | null> => {
  try {
    // Total Users (using head query for count)
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Total Tournaments
    const { count: totalTournaments } = await supabase
      .from('tournaments')
      .select('*', { count: 'exact', head: true });

    // Total Payouts (from transactions with type 'PAYOUT')
    const { data: payoutsData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', TransactionType.PAYOUT);
    const totalPayouts =
      payoutsData?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

    // Total Bets Placed
    const { count: totalBetsPlaced } = await supabase
      .from('bets')
      .select('*', { count: 'exact', head: true });

    // Average Bets Per Round
    const { data: roundBets } = await supabase
      .from('bets')
      .select('tournament_round');

    const roundBetMap = new Map<string, number>();
    roundBets?.forEach(bet => {
      const roundId = bet.tournament_round;
      if (roundId) {
        roundBetMap.set(roundId, (roundBetMap.get(roundId) || 0) + 1);
      }
    });
    const avgBetsPerRound = roundBetMap.size
      ? Array.from(roundBetMap.values()).reduce((a, b) => a + b, 0) / roundBetMap.size
      : 0;

    // Average Bets Per Tournament
    const { data: tournamentBets } = await supabase
      .from('bets')
      .select('tournament_id');
    const tournamentBetMap = new Map<string, number>();
    tournamentBets?.forEach(bet => {
      const tId = bet.tournament_id;
      if (tId) {
        tournamentBetMap.set(tId, (tournamentBetMap.get(tId) || 0) + 1);
      }
    });
    const avgBetsPerTournament = tournamentBetMap.size
      ? Array.from(tournamentBetMap.values()).reduce((a, b) => a + b, 0) / tournamentBetMap.size
      : 0;

    // Average Legs Per Bet
    const { data: subbets } = await supabase
      .from('subbets')
      .select('bet_id');
    const legsMap = new Map<string, number>();
    subbets?.forEach(sb => {
      const betId = sb.bet_id;
      if (betId) {
        legsMap.set(betId, (legsMap.get(betId) || 0) + 1);
      }
    });
    const avgLegsPerBet = legsMap.size
      ? Array.from(legsMap.values()).reduce((a, b) => a + b, 0) / legsMap.size
      : 0;

    return {
      totalUsers: totalUsers || 0,
      totalTournaments: totalTournaments || 0,
      totalPayouts,
      totalBetsPlaced: totalBetsPlaced || 0,
      avgBetsPerRound: Number(avgBetsPerRound.toFixed(2)),
      avgBetsPerTournament: Number(avgBetsPerTournament.toFixed(2)),
      avgLegsPerBet: Number(avgLegsPerBet.toFixed(2)),
    };
  } catch (error) {
    console.error('Failed to fetch platform metrics:', error);
    return null;
  }
};
