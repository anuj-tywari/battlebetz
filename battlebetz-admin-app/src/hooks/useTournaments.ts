import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tournament } from '@/types/tournament';
import { 
  fetchTournaments, 
  fetchTournamentById, 
  createTournament, 
  updateTournament, 
  deleteTournament 
} from '@/services/tournamentService';
import { useSupabase } from '@/components/providers/supabase-auth-provider';

type TournamentQueryOptions = { 
  page?: number; 
  pageSize?: number; 
  search?: string;
  sortField?: string; 
  sortOrder?: 'asc' | 'desc';
};

type TournamentResponse = {
  tournaments: Tournament[];
  totalCount: number;
};

export const useTournaments = (options: TournamentQueryOptions = {}) => {
  const { 
    page = 1, 
    pageSize = 10,
    search = '', 
    sortField = 'created_at', 
    sortOrder = 'desc' 
  } = options;
  
  const { supabase } = useSupabase();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery<TournamentResponse>({
    queryKey: ['tournaments', page, pageSize, search, sortField, sortOrder],
    queryFn: () => fetchTournaments({ page, pageSize, search, sortField, sortOrder, supabaseClient: supabase }),
  });

  return {
    tournaments: data?.tournaments || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch
  };
};

export const useTournamentDetails = (id: string) => {
  const { supabase } = useSupabase();
  
  const {
    data: tournament,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => fetchTournamentById(id, supabase),
    enabled: !!id,
  });

  return {
    tournament,
    isLoading,
    error,
    refetch
  };
};

export const useCreateTournament = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const { supabase } = useSupabase();

  const mutation = useMutation({
    mutationFn: (tournamentData: any) => {
      setIsCreating(true);
      return createTournament(tournamentData, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      setIsCreating(false);
    },
    onError: (error: any) => {
      console.error('Error creating tournament:', error);
      setIsCreating(false);
    }
  });

  return {
    createTournament: mutation.mutate,
    isCreating: isCreating,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data
  };
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const { supabase } = useSupabase();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      setIsUpdating(true);
      return updateTournament(id, data, supabase);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', variables.id] });
      setIsUpdating(false);
    },
    onError: (error: any) => {
      console.error('Error updating tournament:', error);
      setIsUpdating(false);
    }
  });

  return {
    updateTournament: mutation.mutate,
    isUpdating,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data
  };
};

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const { supabase } = useSupabase();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      setIsDeleting(true);
      return deleteTournament(id, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      setIsDeleting(false);
    },
    onError: (error: any) => {
      console.error('Error deleting tournament:', error);
      setIsDeleting(false);
    }
  });

  return {
    deleteTournament: mutation.mutate,
    isDeleting,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  };
}; 