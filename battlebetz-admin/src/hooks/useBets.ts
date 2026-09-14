// hooks/useBets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBets, getBetById, updateBetOutcome } from '@/services/betService';
import { useSupabase } from '@/components/providers/supabase-auth-provider';

// Define types
export interface Bet {
  id: string;
  userId: string;
  amount: number;
  outcome: 'win' | 'loss' | 'pending';
  created_at: string;
  users?: {
    name: string;
  };
  games?: {
    name: string;
  };
}

// Mock data for bets
const mockBets: Bet[] = [
  {
    id: '1',
    userId: 'user1',
    amount: 100,
    outcome: 'win',
    created_at: new Date().toISOString(),
    users: { name: 'John Doe' },
    games: { name: 'NBA Finals Game 1' }
  },
  {
    id: '2',
    userId: 'user2',
    amount: 50,
    outcome: 'loss',
    created_at: new Date().toISOString(),
    users: { name: 'Jane Smith' },
    games: { name: 'NFL Week 3' }
  },
  {
    id: '3',
    userId: 'user1',
    amount: 75,
    outcome: 'pending',
    created_at: new Date().toISOString(),
    users: { name: 'John Doe' },
    games: { name: 'MLB Playoffs' }
  }
];

// Hook to fetch bets
export function useBets(filters = {}) {
  const { supabase, isAuthenticated, authError } = useSupabase();
  
  return useQuery({
    queryKey: ['bets', filters],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error(authError || 'Authentication required');
      }
      return getBets(supabase, filters);
    },
    enabled: isAuthenticated
  });
}

export function useBet(betId: string) {
  const { supabase, isAuthenticated, authError } = useSupabase();
  
  return useQuery({
    queryKey: ['bet', betId],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error(authError || 'Authentication required');
      }
      return getBetById(betId, supabase);
    },
    enabled: !!betId && isAuthenticated,
  });
}

// Hook to update bet outcome
interface UpdateBetParams {
  betId: string;
  outcome: 'win' | 'loss';
  profitLoss: number;
}

export function useUpdateBetOutcome() {
  const queryClient = useQueryClient();
  const { supabase, isAuthenticated, authError } = useSupabase();
  
  return useMutation({
    mutationFn: async (params: UpdateBetParams) => {
      if (!isAuthenticated) {
        throw new Error(authError || 'Authentication required');
      }
      return updateBetOutcome(params.betId, params.outcome, params.profitLoss, supabase);
    },
    onSuccess: () => {
      // Invalidate and refetch the bets query
      queryClient.invalidateQueries({ queryKey: ['bets'] });
    }
  });
}
