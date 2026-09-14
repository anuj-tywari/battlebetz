'use client';

import { useState, useEffect } from 'react';
import { getTodaysGames, getUpcomingGames, getGamesData, Game } from '@/services/games';

export const useGamesData = ({ futureOnly = false }: { futureOnly?: boolean } = {}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = futureOnly ? await getUpcomingGames() : await getTodaysGames();
        setGames(data);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Unable to load games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [futureOnly]);

  const fetchGames = async (tournamentId?: string, options?: { status?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      let data: Game[];
      if (options?.status === 'UPCOMING') {
        data = await getUpcomingGames();
      } else {
        data = await getGamesData({ futureOnly: false });
      }
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Unable to load games. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return { games, loading, error, fetchGames };
};

export const useTodaysGames = () => {
  return useGamesData({ futureOnly: false });
};

export const useUpcomingGames = () => {
  return useGamesData({ futureOnly: true });
};

// Legacy export for backward compatibility
export const useGames = useGamesData; 