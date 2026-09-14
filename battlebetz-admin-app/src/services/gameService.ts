// services/gameService.ts
import { Game } from '@/types/game';

// Get supabase client from params instead of importing directly
export async function getGames(searchQuery = '', supabaseClient: any): Promise<Game[]> {
  if (!supabaseClient) {
    throw new Error("Supabase client is required");
  }

  let query = supabaseClient
    .from('games')
    .select('*');
    
  if (searchQuery) {
    query = query.or(`home_team.ilike.%${searchQuery}%,away_team.ilike.%${searchQuery}%,sport.ilike.%${searchQuery}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching games:', error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function getGameById(gameId: string, supabaseClient: any): Promise<Game | null> {
  if (!supabaseClient) {
    throw new Error("Supabase client is required");
  }

  const { data, error } = await supabaseClient
    .from('games')
    .select('*')
    .eq('event_id', gameId)
    .single();
  
  if (error) {
    console.error('Error fetching game:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createGame(
  gameData: Omit<Game, 'id' | 'created_at' | 'updated_at'>, 
  supabaseClient: any
): Promise<Game> {
  if (!supabaseClient) {
    throw new Error("Supabase client is required");
  }

  const { data, error } = await supabaseClient
    .from('games')
    .insert({
      ...gameData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating game:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateGame(
  gameId: string, 
  gameData: Partial<Game>,
  supabaseClient: any
): Promise<Game> {
  if (!supabaseClient) {
    throw new Error("Supabase client is required");
  }

  const { data, error } = await supabaseClient
    .from('games')
    .update({
      ...gameData,
      updated_at: new Date().toISOString(),
    })
    .eq('event_id', gameId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating game:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteGame(gameId: string, supabaseClient: any): Promise<void> {
  if (!supabaseClient) {
    throw new Error("Supabase client is required");
  }

  const { error } = await supabaseClient
    .from('games')
    .delete()
    .eq('event_id', gameId);
  
  if (error) {
    console.error('Error deleting game:', error);
    throw new Error(error.message);
  }
}
