// hooks/useGames.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGames, getGameById, createGame, updateGame, deleteGame } from '@/services/gameService';
import { fetchGames } from '@/services/directApiService';
import { Game } from '@/types/game';
import { useSupabase } from '@/components/providers/supabase-auth-provider';

export function useGames(searchQuery = '') {
  const { supabase, isAuthenticated } = useSupabase();

  return useQuery({
    queryKey: ['games', searchQuery, isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to view games data");
      }

      try {
        // Try direct API first
        const games = await fetchGames();
        if (games && games.length > 0) {
          console.log('Games loaded via direct API:', games.length);
          // If search query is provided, filter client-side
          if (searchQuery) {
            return games.filter(game => 
              (game.homeTeam && game.homeTeam.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (game.awayTeam && game.awayTeam.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (game.sport && game.sport.toLowerCase().includes(searchQuery.toLowerCase()))
            );
          }
          return games;
        }
      } catch (error) {
        console.warn('Direct API failed, trying SDK:', error);
      }
      
      // Fall back to SDK
      return getGames(searchQuery, supabase);
    },
    enabled: isAuthenticated,
  });
}

export function useGame(gameId: string) {
  const { supabase, isAuthenticated } = useSupabase();
  
  return useQuery({
    queryKey: ['game', gameId, isAuthenticated],
    queryFn: () => getGameById(gameId, supabase),
    enabled: !!gameId && isAuthenticated,
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  const { supabase, isAuthenticated } = useSupabase();
  
  return useMutation({
    mutationFn: (gameData: Omit<Game, 'id' | 'created_at' | 'updated_at'>) => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to create games");
      }
      return createGame(gameData, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();
  const { supabase, isAuthenticated } = useSupabase();
  
  return useMutation({
    mutationFn: ({ gameId, gameData }: { gameId: string, gameData: Partial<Game> }) => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to update games");
      }
      return updateGame(gameId, gameData, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game'] });
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();
  const { supabase, isAuthenticated } = useSupabase();
  
  return useMutation({
    mutationFn: (gameId: string) => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to delete games");
      }
      return deleteGame(gameId, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}
