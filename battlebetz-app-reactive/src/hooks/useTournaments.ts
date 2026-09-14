'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  getAllTournaments, 
  getAvailableTournaments, 
  getUserTournaments, 
  getTournamentById, 
  joinTournament as joinTournamentService,
  type Tournament,
  type TournamentParticipation
} from '@/services/tournaments';

export const useAvailableTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAvailableTournaments();
        setTournaments(data);
      } catch (err) {
        console.error('useAvailableTournaments error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return { tournaments, loading, error };
};

export const useUserTournaments = (userId?: string) => {
  const [tournaments, setTournaments] = useState<TournamentParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      if (!userId) {
        setTournaments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getUserTournaments(userId);
        setTournaments(data);
      } catch (err) {
        console.error('useUserTournaments error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [userId]);

  return { tournaments, loading, error };
};

export const useAllTournaments = (statusFilter?: string[]) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the statusFilter to prevent unnecessary re-renders
  const memoizedStatusFilter = useMemo(() => {
    if (!statusFilter) return undefined;
    return [...statusFilter].sort(); // Create a stable reference
  }, [statusFilter?.join(',')]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        console.log('useAllTournaments: Starting fetch with statusFilter:', memoizedStatusFilter);
        setLoading(true);
        setError(null);
        const data = await getAllTournaments(memoizedStatusFilter);
        console.log('useAllTournaments: Received data:', data?.length, 'tournaments');
        setTournaments(data || []);
      } catch (err) {
        console.error('useAllTournaments: Error fetching tournaments:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
        setTournaments([]); // Set empty array on error
      } finally {
        setLoading(false);
        console.log('useAllTournaments: Fetch completed');
      }
    };

    fetchTournaments();
  }, [memoizedStatusFilter]);

  return { tournaments, loading, error };
};

// Legacy hook for backward compatibility with dashboard and other components
export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [featuredTournament, setFeaturedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the status filter to prevent re-renders
  const statusFilter = useMemo(() => ['upcoming', 'active'], []);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllTournaments(statusFilter);
        setTournaments(data || []);
        
        // Set the first tournament as featured
        if (data && data.length > 0) {
          setFeaturedTournament(data[0]);
        } else {
          setFeaturedTournament(null);
        }
      } catch (err) {
        console.error('useTournaments error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
        setTournaments([]);
        setFeaturedTournament(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [statusFilter]);

  const fetchTournamentById = async (id: string) => {
    try {
      const data = await getTournamentById(id);
      return { data, error: null };
    } catch (error) {
      console.error('fetchTournamentById error:', error);
      return { data: null, error };
    }
  };

  const joinTournament = async (tournamentId: string, userId?: string) => {
    if (!userId) {
      return { 
        success: false, 
        error: new Error('User ID required for joining tournament')
      };
    }
    
    try {
      const result = await joinTournamentService(tournamentId, userId);
      return result;
    } catch (error) {
      console.error('joinTournament error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Failed to join tournament')
      };
    }
  };

  return {
    tournaments,
    featuredTournament,
    loading,
    error,
    fetchTournamentById,
    joinTournament
  };
}; 