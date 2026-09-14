"use client";

import { useState, useEffect } from 'react';
import { Trophy, DollarSign } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { getUserTournamentTokens } from '@/services/wallet';

interface TournamentToken {
  tournament_id: string;
  tournament_name: string;
  token_balance: number;
}

export default function TournamentTokens() {
  const { user } = useAuth();
  const [tournamentTokens, setTournamentTokens] = useState<TournamentToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournamentTokens = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await getUserTournamentTokens(user.id);
        
        if (fetchError) {
          setError(fetchError);
        } else {
          setTournamentTokens(data);
        }
      } catch (err) {
        console.error('Error fetching tournament tokens:', err);
        setError('Failed to load tournament tokens');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentTokens();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-purple-400" />
          Tournament Tokens
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-purple-400" />
          Tournament Tokens
        </h3>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Trophy size={18} className="text-purple-400" />
        Tournament Tokens
      </h3>
      
      {tournamentTokens.length > 0 ? (
        <div className="space-y-3">
          {tournamentTokens.map((token) => (
            <div key={token.tournament_id} className="bg-gray-700/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center mr-3">
                    <DollarSign size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{token.tournament_name}</div>
                    <div className="text-xs text-gray-400">Tournament Tokens</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-400">{token.token_balance}</div>
                  <div className="text-xs text-gray-400">BBZT</div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Total Tournaments:</span>
              <span className="font-medium">{tournamentTokens.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-400">Total Tokens:</span>
              <span className="font-medium text-purple-400">
                {tournamentTokens.reduce((sum, token) => sum + token.token_balance, 0)} BBZT
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <Trophy size={32} className="text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No tournament tokens yet</p>
          <p className="text-gray-500 text-xs mt-1">Join tournaments to earn BBZT tokens</p>
        </div>
      )}
    </div>
  );
} 