import { supabase } from './supabase';
import { Database } from '@/types/supabase';

// User operations
export const getUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*, profiles(*)')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*, profiles(*)');

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateUser = async (userId: string, userData: Partial<Database['public']['Tables']['users']['Update']>) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Profile operations
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProfile = async (userId: string, profileData: Partial<Database['public']['Tables']['users']['Update']>) => {
  const { data, error } = await supabase
    .from('users')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Tournament operations
export const getTournaments = async () => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getTournament = async (tournamentId: string) => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, games(*), users!tournaments_created_by_id_fkey(*)')
    .eq('id', tournamentId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createTournament = async (tournamentData: Database['public']['Tables']['tournaments']['Insert']) => {
  const { data, error } = await supabase
    .from('tournaments')
    .insert(tournamentData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateTournament = async (tournamentId: string, tournamentData: Partial<Database['public']['Tables']['tournaments']['Update']>) => {
  const { data, error } = await supabase
    .from('tournaments')
    .update(tournamentData)
    .eq('id', tournamentId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Game operations (formerly Match operations)
export const getGames = async (tournamentId: string) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('tournament_id', tournamentId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getGame = async (eventId: number) => {
  const { data, error } = await supabase
    .from('games')
    .select('*, tournaments(*)')
    .eq('event_id', eventId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createGame = async (gameData: Database['public']['Tables']['games']['Insert']) => {
  const { data, error } = await supabase
    .from('games')
    .insert(gameData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateGame = async (eventId: number, gameData: Partial<Database['public']['Tables']['games']['Update']>) => {
  const { data, error } = await supabase
    .from('games')
    .update(gameData)
    .eq('event_id', eventId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Bet operations
export const getUserBets = async (userId: string) => {
  const { data, error } = await supabase
    .from('bets')
    .select('*, games(*), tournaments(*)')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const placeBet = async (betData: Database['public']['Tables']['bets']['Insert']) => {
  const { data, error } = await supabase
    .from('bets')
    .insert(betData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// News operations
export const getNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('publish_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getNewsItem = async (newsId: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*, comments(*)')
    .eq('id', newsId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Comment operations
export const getComments = async (entityType: 'tournament' | 'news', entityId: string) => {
  const field = entityType === 'tournament' ? 'tournament_id' : 'news_id';
  
  const { data, error } = await supabase
    .from('comments' as any)
    .select('*, users(*)')
    .eq(field, entityId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addComment = async (commentData: {
  user_id: string;
  news_id?: string;
  tournament_id?: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from('comments' as any)
    .insert(commentData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}; 