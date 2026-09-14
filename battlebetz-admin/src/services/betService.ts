// services/betService.ts
import { supabase } from '@/lib/supabase';
import { Bet } from '@/types/bet';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase-types';

export async function getBets(
  client: SupabaseClient<Database> = supabase,
  filters: { 
    userId?: string, 
    gameId?: string, 
    tournamentId?: string, 
    roundId?: string 
  } = {}
): Promise<Bet[]> {
  let query = client
    .from('bets')
    .select(`
      *,
      users (id, name, email),
      games (id, name),
      tournaments (id, name)
    `);
    
  if (filters.userId) {
    query = query.eq('user_id', filters.userId);
  }
  
  if (filters.gameId) {
    query = query.eq('game_id', filters.gameId);
  }
  
  if (filters.tournamentId) {
    query = query.eq('tournament_id', filters.tournamentId);
  }
  
  if (filters.roundId) {
    query = query.eq('round_id', filters.roundId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching bets:', error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getBetById(
  betId: string,
  client: SupabaseClient<Database> = supabase
): Promise<Bet | null> {
  const { data, error } = await client
    .from('bets')
    .select(`
      *,
      users (id, name, email),
      games (id, name),
      tournaments (id, name)
    `)
    .eq('id', betId)
    .single();
  
  if (error) {
    console.error('Error fetching bet:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateBetOutcome(
  betId: string, 
  outcome: 'win' | 'loss', 
  profitLoss: number,
  client: SupabaseClient<Database> = supabase
): Promise<Bet> {
  const { data, error } = await client
    .from('bets')
    .update({
      outcome,
      profit_loss: profitLoss,
      updated_at: new Date().toISOString(),
    })
    .eq('id', betId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating bet outcome:', error);
    throw new Error(error.message);
  }
  
  return data;
}
