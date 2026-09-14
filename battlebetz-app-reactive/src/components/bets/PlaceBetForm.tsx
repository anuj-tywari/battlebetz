"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { getGame, getProfile, placeBet } from '@/lib/db';
import { Database } from '@/types/supabase';

type Prediction = 'TEAM1' | 'TEAM2' | 'DRAW'; // Using string literals instead of enum

interface PlaceBetFormProps {
  matchId?: string;
  eventId?: number;
  gameId?: number;
  tournamentId: string;
  onSuccess?: () => void;
}

export default function PlaceBetForm({ matchId, eventId, gameId, tournamentId, onSuccess }: PlaceBetFormProps) {
  const [matchData, setMatchData] = useState<any>(null);
  const [gameData, setGameData] = useState<any>(null);
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [prediction, setPrediction] = useState<Prediction>('TEAM1');
  const [amount, setAmount] = useState<string>('10');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Get the actual event ID to use
  const actualEventId = eventId || gameId || null;

  // Load match/game details and user profile
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        if (!user) {
          setError('You must be logged in to place a bet');
          return;
        }
        
        // Get user profile with balance
        const userProfile = await getProfile(user.id);
        setProfile(userProfile);
        
        // Get match/game details
        if (matchId) {
          // For backward compatibility - convert matchId to game ID if needed
          try {
            const matchIdAsNumber = parseInt(matchId);
            if (!isNaN(matchIdAsNumber)) {
              const data = await getGame(matchIdAsNumber);
              setGameData(data);
            }
          } catch (e) {
            setError('Invalid match ID');
          }
        } else if (actualEventId) {
          const data = await getGame(actualEventId);
          setGameData(data);
        } else {
          setError('No match or game specified');
        }
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load necessary data');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [matchId, actualEventId, user]);

  // Handle bet submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to place a bet');
      return;
    }

    if (!matchData && !gameData) {
      setError('Event information is missing');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // Validate against user balance
      if (!profile || profile.bbz_balance < Number(amount)) {
        setError('Insufficient balance to place this bet');
        return;
      }
      
      // Place bet in the database
      const betData: any = {
        user_id: user.id,
        tournament_id: tournamentId,
        prediction,
        amount: Number(amount),
      };

      // Add either matchId or eventId
      if (matchId) {
        // Try to convert matchId to a number first
        const matchIdAsNumber = parseInt(matchId);
        if (!isNaN(matchIdAsNumber)) {
          betData.event_id = matchIdAsNumber;
        } else {
          betData.match_id = matchId;
        }
      } else if (actualEventId) {
        betData.event_id = actualEventId;
      }
      
      await placeBet(betData);
      
      setSuccess('Bet placed successfully!');
      
      // Reload profile to show updated balance
      const updatedProfile = await getProfile(user.id);
      setProfile(updatedProfile);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err) {
      console.error('Error placing bet:', err);
      setError('Failed to place bet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-40 bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-12 bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  if (error && !matchData && !gameData) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if ((!matchData && !gameData) || !user || !profile) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center text-red-500">
          Unable to load bet form. Please try again.
        </div>
      </div>
    );
  }

  // Choose the correct data to display
  const eventToDisplay = gameData || matchData;
  const team1 = gameData ? gameData.home_team : (matchData ? matchData.team1 : 'Team 1');
  const team2 = gameData ? gameData.away_team : (matchData ? matchData.team2 : 'Team 2');
  const startTime = gameData ? gameData.start_time : (matchData ? matchData.start_time : null);
  const status = gameData ? gameData.status : (matchData ? matchData.status : 'UNKNOWN');

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-white">Place Your Bet</h2>
      
      {/* Match/Game info */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-bold mb-2 text-white">{team1} vs {team2}</h3>
        <p className="text-gray-400 text-sm">
          {startTime ? new Date(startTime).toLocaleString() : 'Time TBD'}
        </p>
        {status === 'UPCOMING' ? (
          <div className="mt-2 px-2 py-1 bg-yellow-600 text-white text-xs inline-block rounded-full">
            Upcoming
          </div>
        ) : (
          <div className="mt-2 px-2 py-1 bg-red-600 text-white text-xs inline-block rounded-full">
            {status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Unknown'}
          </div>
        )}
      </div>
      
      {/* User balance */}
      <div className="mb-6 p-4 bg-blue-900 rounded-lg">
        <p className="text-gray-300">Your Balance</p>
        <p className="text-2xl font-bold text-green-400">${(profile.bbz_balance || 0).toFixed(2)}</p>
      </div>
      
      {/* Error/Success messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-500 text-white rounded">
          {success}
        </div>
      )}
      
      {/* Bet form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Your Prediction
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className={`p-3 rounded-md text-white text-center ${
                prediction === 'TEAM1' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setPrediction('TEAM1')}
            >
              {team1} Win
            </button>
            <button
              type="button"
              className={`p-3 rounded-md text-white text-center ${
                prediction === 'DRAW' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setPrediction('DRAW')}
            >
              Draw
            </button>
            <button
              type="button"
              className={`p-3 rounded-md text-white text-center ${
                prediction === 'TEAM2' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setPrediction('TEAM2')}
            >
              {team2} Win
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Bet Amount ($)
          </label>
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            max={profile.bbz_balance || 0}
            step="0.01"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Min: $1.00, Max: ${(profile.bbz_balance || 0).toFixed(2)}
          </p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 text-sm font-bold mb-2">
            Potential Payout: <span className="text-green-400">${(parseFloat(amount || '0') * 1.9).toFixed(2)}</span>
          </p>
          <p className="text-gray-400 text-xs">
            Returns are calculated based on odds and may change
          </p>
        </div>
        
        <button
          type="submit"
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Placing Bet...' : 'Place Bet'}
        </button>
      </form>
    </div>
  );
} 