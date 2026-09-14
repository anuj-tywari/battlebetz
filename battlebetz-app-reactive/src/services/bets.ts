import { supabase } from '@/lib/supabase';

// Types based on React Native app structure
export type BetStatus = 'pending' | 'won' | 'lost' | 'cancelled';
export type BetType = 'spread' | 'total' | 'moneyline';
export type TeamType = 'team1' | 'team2';

export interface Bet {
  id: string;
  user_id: string;
  tournament_id: string | null;
  net_amount: number;
  odds: number;
  potential_payout: number;
  prediction: string | null;
  status: BetStatus;
  created_at: string;
  updated_at: string;
  risk: number;
  bet_type_id: number;
  tournament_round: string | null;
}

export interface SubBet {
  id: string;
  user_id: string;
  bet_id: string;
  event_id: string;
  odds_id: string;
  type: BetType;
  name: string;
  description: string;
  odds: number;
  points: number;
  status: BetStatus;
  sport: string;
  created_at: string;
  updated_at: string;
}

export interface UserBet {
  id: string;
  match_title: string;
  bet_type: string;
  amount: number;
  status: BetStatus;
  created_at: string;
}

export interface BetSelection {
  id: string;
  team: TeamType;
  teamName: string;
  matchup: string;
  odds: number;
  betType: BetType;
  oddsDisplay: string;
  subName?: string;
  sport?: string;
  matchId?: string;
}

export interface PendingBet extends BetSelection {
  amount: number;
}

interface CreateBetData {
  user_id: string;
  tournament_id?: string;
  tournament_round?: string;
  risk: number;
  odds: number;
  potential_payout: number;
  prediction?: string;
  bet_type_id: number;
  selections?: Array<{
    event_id: string;
    type: string;
    name: string;
    description: string;
    odds: number;
    points?: number;
    sport?: string;
  }>;
}

/**
 * Get bets for a user with optional filters
 */
export async function getUserBets(userId: string, filters?: { 
  tournamentId?: string; 
  tournamentRound?: string;
  gameId?: number; 
  status?: string 
}) {
  try {
    let query = supabase
      .from('bets')
      .select('*')
      .eq('user_id', userId);
    
    if (filters?.tournamentId) {
      query = query.eq('tournament_id', filters.tournamentId);
    }
    
    if (filters?.tournamentRound) {
      query = query.eq('tournament_round', filters.tournamentRound);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user bets:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch bets'
    };
  }
}

/**
 * Get sub-bets for specific bet IDs (placeholder - subbets table may not exist)
 */
export async function getSubBets(userId: string, betIds: string[]) {
  try {
    // Note: This function is a placeholder as subbets table may not exist in current schema
    console.warn('getSubBets: subbets table may not exist in current schema');
    return { data: [], error: null };
  } catch (error) {
    console.error('Error fetching sub-bets:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch sub-bets'
    };
  }
}

/**
 * Get a bet by ID
 */
export async function getBetById(id: string) {
  try {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching bet:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch bet'
    };
  }
}

/**
 * Place a bet with sub-bets (following React Native app pattern)
 */
export async function placeBet(betData: CreateBetData) {
  try {
    // Create the main bet
    const { data: mainBet, error: mainBetError } = await supabase
      .from('bets')
      .insert({
        user_id: betData.user_id,
        tournament_id: betData.tournament_id,
        tournament_round: betData.tournament_round,
        risk: betData.risk,
        odds: betData.odds,
        potential_payout: betData.potential_payout,
        prediction: betData.prediction,
        status: 'pending',
        net_amount: 0,
        bet_type_id: betData.bet_type_id
      })
      .select()
      .single();
    
    if (mainBetError) throw mainBetError;
    
         // Note: Sub-bets functionality disabled as subbets table may not exist in current schema
     if (betData.selections && betData.selections.length > 0) {
       console.warn('Sub-bets functionality disabled - subbets table may not exist in current schema');
     }
    
    return { data: mainBet, error: null };
  } catch (error) {
    console.error('Error placing bet:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to place bet'
    };
  }
}

/**
 * Place multiple bets (tournament betting pattern)
 */
export async function placeTournamentBets(
  userId: string,
  tournamentId: string,
  tournamentRound: string,
  pendingBets: PendingBet[]
) {
  try {
    const results = [];
    
    for (const bet of pendingBets) {
      // Calculate potential payout
      let potentialPayout = bet.amount;
      if (bet.odds < 0) {
        potentialPayout += (bet.amount / Math.abs(bet.odds)) * 100;
      } else {
        potentialPayout += (bet.amount * bet.odds) / 100;
      }
      
      // Create main bet
      const { data: mainBet, error: mainBetError } = await supabase
        .from('bets')
        .insert({
          user_id: userId,
          tournament_id: tournamentId,
          tournament_round: tournamentRound,
          risk: bet.amount,
          odds: bet.odds,
          potential_payout: potentialPayout,
          status: 'pending',
          net_amount: 0,
          bet_type_id: getBetTypeId(bet.betType)
        })
        .select()
        .single();
        
      if (mainBetError) throw mainBetError;
      
             // Note: Sub-bet creation disabled as subbets table may not exist in current schema
       console.warn('Sub-bet creation disabled - subbets table may not exist in current schema');
      
      results.push(mainBet);
    }
    
    return { data: results, error: null };
  } catch (error) {
    console.error('Error placing tournament bets:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to place tournament bets'
    };
  }
}

/**
 * Cancel a bet
 */
export async function cancelBet(id: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('bets')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error cancelling bet:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to cancel bet'
    };
  }
}

/**
 * Fetch bets placed by a user (for profile/history)
 */
export async function fetchUserBets(userId: string, limit = 10): Promise<UserBet[]> {
  try {
    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select('id, risk, status, created_at, tournament_id, prediction')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (betsError || !bets || bets.length === 0) {
      console.error('Error fetching bets:', betsError);
      return [];
    }
    
    const enhancedBets: UserBet[] = bets.map(bet => ({
      id: bet.id,
      match_title: bet.prediction || 'Tournament Bet',
      bet_type: 'Tournament Bet',
      amount: bet.risk || 0,
      status: (bet.status?.toLowerCase() || 'pending') as BetStatus,
      created_at: bet.created_at
    }));
    
    return enhancedBets;
  } catch (error) {
    console.error('Failed to fetch user bets:', error);
    return [];
  }
}

/**
 * Calculate bet payouts (utility function)
 */
export function calculateBetPayouts(selections: { odds: number }[], risk: number, betType: string) {
  // For single bets
  if (betType === 'SINGLE' && selections.length === 1) {
    const odds = parseFloat(selections[0].odds.toString());
    return {
      odds,
      potentialPayout: Math.round((risk * odds) * 100) / 100
    };
  }
  
  // For parlay bets
  if (betType === 'PARLAY' && selections.length > 1) {
    let totalOdds = 1;
    for (const selection of selections) {
      totalOdds *= parseFloat(selection.odds.toString());
    }
    return {
      odds: totalOdds,
      potentialPayout: Math.round((risk * totalOdds) * 100) / 100
    };
  }
  
  throw new Error('Invalid bet type or selections');
}

/**
 * Helper function to get bet type ID
 */
export function getBetTypeId(betType: BetType): number {
  switch (betType) {
    case 'spread':
      return 1;
    case 'total':
      return 2;
    case 'moneyline':
      return 3;
    default:
      return 0;
  }
}

/**
 * Get recent bets with pagination
 */
export async function getRecentBets(page = 1, limit = 10, userId?: string) {
  try {
    let query = supabase
      .from('bets')
      .select('*', { count: 'exact' });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    const totalPages = Math.ceil((count || 0) / limit);
    
    return {
      data: data || [],
      meta: {
        total: count || 0,
        page,
        limit,
        pageCount: totalPages
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching recent bets:', error);
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        pageCount: 0
      },
      error: error instanceof Error ? error.message : 'Failed to fetch recent bets'
    };
  }
} 