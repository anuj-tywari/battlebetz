// battlebetz-web/src/app/tournaments/[id]/place-bets/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Trophy, 
  User, 
  Clock, 
  DollarSign, 
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { getTournamentById } from '@/services/tournaments';
import { getGamesByTournament } from '@/services/games';
import { getTournamentTokenBalance } from '@/services/wallet';
import { placeBetOnGame } from '@/services/bets';
import { useProfile } from '@/hooks/useProfile';

export default function PlaceTournamentBetsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tournamentId = params?.id as string;
  const initialGameId = searchParams?.get('game') || '';

  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { profile, loading: profileLoading, fetchProfile } = useProfile();

  const [tournament, setTournament] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [tournamentTokens, setTournamentTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedGameId, setSelectedGameId] = useState<string>(initialGameId || '');
  const [prediction, setPrediction] = useState<'TEAM1' | 'TEAM2' | 'DRAW' | ''>('');
  const [betAmount, setBetAmount] = useState<number>(10);
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<{
    team: string;
    type: string;
    odds: string;
    spread?: string;
  } | null>(null);
  const [pendingBets, setPendingBets] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?callbackUrl=/tournaments/${tournamentId}/place-bets`);
      return;
    }
  }, [authLoading, isAuthenticated, router, tournamentId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId) return;

      try {
        setLoading(true);
        
        const [tournamentRes, gamesRes] = await Promise.all([
          getTournamentById(tournamentId),
          getGamesByTournament(tournamentId)
        ]);

        setTournament(tournamentRes);
        setGames(gamesRes?.data || []);
        
        // Get tournament-specific token balance
        if (user?.id) {
          const { balance } = await getTournamentTokenBalance(user.id, tournamentId);
          setTournamentTokens(balance);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load tournament data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tournamentId, user?.id]);

  const selectedGame = games.find(game => game.id === selectedGameId);

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setPrediction('');
    setShowBetSlip(false);
  };

  const handleSelectPrediction = (pred: 'TEAM1' | 'TEAM2' | 'DRAW') => {
    setPrediction(pred);
    setShowBetSlip(true);
  };

  const handleQuickAmountSelect = (amount: number) => {
    setBetAmount(amount);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBetAmount(isNaN(value) ? 0 : Math.max(0, value));
  };

  const calculatePotentialWinnings = (): number => {
    // Simple calculation - in real app this would use odds
    return betAmount * 1.8; // 1.8x payout
  };

  const handlePlaceBet = async () => {
    if (!user?.id || !selectedGameId || !prediction || betAmount <= 0) {
      setError('Please select a game, prediction, and valid bet amount');
      return;
    }

    if (tournamentTokens < betAmount) {
      setError('Insufficient tournament tokens to place this bet');
      return;
    }

    setIsPlacingBet(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert gameId to appropriate type expected by the API
      const gameId = selectedGameId ? parseInt(selectedGameId) : 0;
      
      const success = await placeBetOnGame({
        userId: user.id,
        tournamentId,
        gameId,
        prediction,
        amount: betAmount
      });

      if (success) {
        setSuccess('Your bet has been placed successfully!');
        setPrediction('');
        setBetAmount(10);
        setShowBetSlip(false);
        
        // Refresh tournament token balance
        if (user?.id) {
          const { balance } = await getTournamentTokenBalance(user.id, tournamentId);
          setTournamentTokens(balance);
        }
      } else {
        setError('Failed to place bet. Please try again.');
      }
    } catch (err) {
      console.error('Error placing bet:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsPlacingBet(false);
    }
  };

  const alreadyBetOnGame = (gameId: string): boolean => {
    // Convert gameId to number since bet_type_id is a number
    const gameIdNumber = parseInt(gameId);
    return pendingBets.some(bet => bet.tournament_id === tournamentId && bet.bet_type_id === gameIdNumber);
  };

  const handleBetSelection = (team: string, type: string, odds: string, spread?: string) => {
    setSelectedBet({ team, type, odds, spread });
    setShowBetModal(true);
  };

  const handleConfirmBet = (amount: number) => {
    if (selectedBet && amount > 0 && amount <= tournamentTokens) {
      const newBet = {
        ...selectedBet,
        amount,
        id: Date.now() // Simple ID for demo
      };
      setPendingBets([...pendingBets, newBet]);
      setTournamentTokens(tournamentTokens - amount);
      setShowBetModal(false);
      setSelectedBet(null);
    }
  };

  const removeBet = (betId: number) => {
    const bet = pendingBets.find(b => b.id === betId);
    if (bet) {
      setPendingBets(pendingBets.filter(b => b.id !== betId));
      setTournamentTokens(tournamentTokens + bet.amount);
    }
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Tournament Not Found</h2>
            <p className="text-gray-400 mb-6">The tournament you're looking for doesn't exist or has been removed.</p>
            <Link href="/tournaments" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center">
            <Link href={`/tournaments/${tournamentId}`} className="mr-4">
              <ArrowLeft className="h-6 w-6 text-purple-400 hover:text-purple-300 transition-colors" />
            </Link>
            <h1 className="text-2xl font-bold">Tournament Bets</h1>
          </div>
        </div>
        
        {/* Available Balance Banner */}
        <div className="bg-purple-600 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-white mr-2" />
              <span className="text-lg font-semibold">Available: {tournamentTokens} BBZ.T</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/30 border border-green-500 text-white p-4 rounded-lg mb-6">
            {success}
          </div>
        )}
        
        {/* Game Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-400">8:30 PM EST</span>
            </div>
            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center mb-6">
            {/* Minnesota Timberwolves */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-lg">MT</span>
              </div>
              <h3 className="font-semibold text-lg">Minnesota Timberwolves</h3>
            </div>
            
            {/* VS */}
            <div className="text-center">
              <span className="text-gray-400 text-lg">vs</span>
            </div>
            
            {/* Oklahoma City Thunder */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-lg">OT</span>
              </div>
              <h3 className="font-semibold text-lg">Oklahoma City Thunder</h3>
            </div>
          </div>
          
          {/* Betting Options */}
          <div className="grid grid-cols-3 gap-4 text-center">
                         <div>
               <div className="text-sm text-purple-400 mb-1">Spread</div>
               <div className="space-y-2">
                 <button 
                   onClick={() => handleBetSelection('Minnesota Timberwolves', 'Spread', '+240', '+7.5')}
                   className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                 >
                   <div className="font-semibold">+7.5</div>
                   <div className="text-green-400">+240</div>
                 </button>
                 <button 
                   onClick={() => handleBetSelection('Oklahoma City Thunder', 'Spread', '-304', '-7.5')}
                   className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                 >
                   <div className="font-semibold">-7.5</div>
                   <div className="text-red-400">-304</div>
                 </button>
               </div>
             </div>
             
             <div>
               <div className="text-sm text-purple-400 mb-1">ML</div>
               <div className="space-y-2">
                 <button 
                   onClick={() => handleBetSelection('Minnesota Timberwolves', 'Moneyline', '+240')}
                   className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                 >
                   <div className="text-green-400">+240</div>
                 </button>
                 <button 
                   onClick={() => handleBetSelection('Oklahoma City Thunder', 'Moneyline', '-304')}
                   className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                 >
                   <div className="text-red-400">-304</div>
                 </button>
               </div>
             </div>
             
             <div>
               <div className="text-sm text-purple-400 mb-1">Total</div>
               <div className="space-y-2">
                 <button 
                   onClick={() => handleBetSelection('Over', 'Total', 'O 214.5', '214.5')}
                   className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                 >
                   <div className="font-semibold">O 214.5</div>
                 </button>
                 <button 
                   onClick={() => handleBetSelection('Under', 'Total', 'U 214.5', '214.5')}
                   className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                 >
                   <div className="font-semibold">U 214.5</div>
                 </button>
               </div>
             </div>
                     </div>
         </div>
         
         {/* Pending Bets */}
         {pendingBets.length > 0 && (
           <div className="bg-gray-800 rounded-lg p-6 mb-6">
             <h3 className="text-xl font-bold mb-4">Your Pending Bets</h3>
             <div className="space-y-3">
               {pendingBets.map((bet) => (
                 <div key={bet.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                   <div>
                     <div className="font-semibold">{bet.type}</div>
                     <div className="text-sm text-gray-300">
                       Total: {bet.type} {bet.spread || bet.odds}
                     </div>
                     <div className="text-sm text-purple-400">{bet.amount} BBZ.T</div>
                   </div>
                   <button
                     onClick={() => removeBet(bet.id)}
                     className="text-red-400 hover:text-red-300"
                   >
                     <X className="h-5 w-5" />
                   </button>
                 </div>
               ))}
             </div>
             <div className="mt-4 pt-4 border-t border-gray-600">
               <div className="flex justify-between text-lg font-semibold">
                 <span>Total: {pendingBets.reduce((sum, bet) => sum + bet.amount, 0)} BBZ.T</span>
               </div>
             </div>
           </div>
         )}
         
         {/* Submit Tournament Bets */}
         <div className="bg-purple-600 rounded-lg p-6 text-center">
           <h3 className="text-xl font-bold mb-2">Submit Tournament Bets ({pendingBets.length})</h3>
         </div>
         
         {/* Bet Amount Modal */}
         {showBetModal && selectedBet && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">Select BBZ.T Amount</h3>
                 <button
                   onClick={() => setShowBetModal(false)}
                   className="text-gray-400 hover:text-white"
                 >
                   <X className="h-6 w-6" />
                 </button>
               </div>
               
               <div className="bg-gray-700 rounded-lg p-4 mb-6">
                 <div className="text-sm text-gray-300 mb-1">
                   Minnesota Timberwolves vs Oklahoma City Thunder
                 </div>
                 <div className="font-semibold">
                   {selectedBet.team} {selectedBet.type}: {selectedBet.spread || selectedBet.odds}
                 </div>
               </div>
               
               <div className="text-center mb-6">
                 <div className="text-4xl font-bold mb-2">500</div>
                 <div className="text-purple-400 text-lg">BBZ.T</div>
               </div>
               
               <div className="grid grid-cols-4 gap-3 mb-6">
                 {[100, 250, 500, 1000].map((amount) => (
                   <button
                     key={amount}
                     onClick={() => handleConfirmBet(amount)}
                     disabled={amount > tournamentTokens}
                     className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                       amount === 500 
                         ? 'bg-purple-600 text-white' 
                         : amount > tournamentTokens
                         ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                         : 'bg-gray-700 text-white hover:bg-gray-600'
                     }`}
                   >
                     {amount}
                   </button>
                 ))}
               </div>
               
               <button
                 onClick={() => handleConfirmBet(500)}
                 className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
               >
                 Confirm Amount
               </button>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}