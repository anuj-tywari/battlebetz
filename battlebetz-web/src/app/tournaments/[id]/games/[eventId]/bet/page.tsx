"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft,
  Trophy,
  Plus,
  Minus,
  ChevronsRight,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function TournamentGameBetPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const tournamentId = params?.id as string;
  const eventId = params?.eventId as string;
  
  const [game, setGame] = useState<any>(null);
  const [tournament, setTournament] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [odds, setOdds] = useState<Record<string, number>>({});
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Mock loading tournament and game data
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push(`/login?callbackUrl=/tournaments/${tournamentId}/games/${eventId}/bet`);
      return;
    }
    
    const fetchData = async () => {
      try {
        // In a real implementation, these would be actual API calls
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTournament({
          id: tournamentId,
          name: "March Madness 2023",
          status: "ACTIVE",
          prize_pool: 10000,
        });
        
        setGame({
          id: eventId,
          type: "GAME",
          sport: "BASKETBALL",
          name: "Duke vs North Carolina",
          description: "NCAA Basketball Championship",
          start_time: new Date(Date.now() + 3600000 * 12).toISOString(), // 12 hours from now
          options: [
            { id: "opt1", name: "Duke", odds: 1.85 },
            { id: "opt2", name: "North Carolina", odds: 1.95 }
          ],
          status: "UPCOMING"
        });
        
        // Mock user balance from tournament participation
        setUserBalance(1000);
        
        // Set default odds
        const oddsMap: Record<string, number> = {};
        oddsMap["opt1"] = 1.85;
        oddsMap["opt2"] = 1.95;
        setOdds(oddsMap);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load game data");
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchData();
    }
  }, [tournamentId, eventId, router, isAuthenticated, authLoading]);
  
  // Calculate potential winnings when bet amount or selection changes
  useEffect(() => {
    if (selectedOption && odds[selectedOption]) {
      const winnings = betAmount * odds[selectedOption];
      setPotentialWinnings(Number(winnings.toFixed(2)));
    } else {
      setPotentialWinnings(0);
    }
  }, [betAmount, selectedOption, odds]);
  
  // Handle bet amount adjustment
  const adjustBetAmount = (amount: number) => {
    const newAmount = Math.max(10, Math.min(userBalance, betAmount + amount));
    setBetAmount(newAmount);
  };
  
  // Handle bet submission
  const handlePlaceBet = async () => {
    if (!selectedOption) {
      setError("Please select a bet option");
      return;
    }
    
    if (betAmount <= 0) {
      setError("Bet amount must be greater than 0");
      return;
    }
    
    if (betAmount > userBalance) {
      setError("Bet amount exceeds your balance");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call to place bet
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user balance (in real app this would come from the API response)
      setUserBalance(prevBalance => prevBalance - betAmount);
      setSuccess(true);
      
      // In real implementation, would redirect to tournament page after success
      setTimeout(() => {
        router.push(`/tournaments/${tournamentId}`);
      }, 3000);
      
    } catch (err) {
      console.error("Error placing bet:", err);
      setError("Failed to place bet. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading game data...</p>
        </div>
      </div>
    );
  }
  
  if (error && !game) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <Link 
              href={`/tournaments/${tournamentId}`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center font-medium transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Tournament
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Success screen after placing bet
  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Bet Placed Successfully!</h1>
            <p className="text-gray-300 mb-6">
              Your bet on {game?.options.find((opt: any) => opt.id === selectedOption)?.name} has been placed.
              Good luck!
            </p>
            <div className="mb-8 p-4 bg-gray-700/50 rounded-lg inline-block">
              <div className="text-left">
                <div className="flex justify-between gap-8 mb-2">
                  <span className="text-gray-400">Bet Amount:</span>
                  <span className="font-medium">${betAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8 mb-2">
                  <span className="text-gray-400">Potential Winnings:</span>
                  <span className="font-medium text-green-400">${potentialWinnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8 pt-2 border-t border-gray-600">
                  <span className="text-gray-400">Remaining Balance:</span>
                  <span className="font-medium">${userBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href={`/tournaments/${tournamentId}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center justify-center font-medium transition-colors"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Back to Tournament
              </Link>
              <Link 
                href={`/tournaments/${tournamentId}/games`}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg inline-flex items-center justify-center font-medium transition-colors"
              >
                Place Another Bet
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link 
            href={`/tournaments/${tournamentId}`}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Tournament
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-black/30 rounded-lg mr-3">
                      <Image 
                        src="/assets/images/sports/basketball.png"
                        alt="Basketball"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{game?.name}</h2>
                      <p className="text-white/80 text-sm">{game?.description}</p>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center bg-black/30 text-sm px-3 py-1.5 rounded-full">
                    <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                    {tournament?.name}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Select your bet</h3>
                
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {game?.options.map((option: any) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOption(option.id)}
                        className={`
                          p-4 rounded-lg border text-left transition-colors
                          ${selectedOption === option.id
                            ? 'border-green-500 bg-green-900/20'
                            : 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                          }
                        `}
                      >
                        <div className="font-medium mb-1">{option.name}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Odds</span>
                          <span className="text-green-400 font-medium">{option.odds}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Bet Amount</label>
                  <div className="flex items-center">
                    <button
                      onClick={() => adjustBetAmount(-50)}
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-l-lg transition-colors"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.min(userBalance, Math.max(10, Number(e.target.value))))}
                      className="w-full text-center p-2 bg-gray-700 border-x border-gray-600 focus:outline-none"
                    />
                    
                    <button
                      onClick={() => adjustBetAmount(50)}
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-r-lg transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <button 
                      onClick={() => setBetAmount(100)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                      $100
                    </button>
                    <button 
                      onClick={() => setBetAmount(250)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                      $250
                    </button>
                    <button 
                      onClick={() => setBetAmount(500)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                      $500
                    </button>
                    <button 
                      onClick={() => setBetAmount(userBalance)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                      All In
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-6 p-3 bg-red-900/30 border border-red-600 rounded-lg text-red-400">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handlePlaceBet}
                  disabled={submitting || !selectedOption || betAmount <= 0 || betAmount > userBalance}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ChevronsRight className="h-5 w-5 mr-2" />
                      Place Bet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Bet Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 sticky top-4">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold">Bet Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Tournament</div>
                    <div className="font-medium">{tournament?.name}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Event</div>
                    <div className="font-medium">{game?.name}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Your Pick</div>
                    {selectedOption ? (
                      <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg mb-4">
                        <div className="font-medium">
                          {game?.options.find((opt: any) => opt.id === selectedOption)?.name} 
                          <span className="text-green-400 ml-2">
                            ({game?.options.find((opt: any) => opt.id === selectedOption)?.odds.toFixed(2)})
                          </span>
                        </div>
                        <button 
                          onClick={() => setSelectedOption(null)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-500">Select an option</div>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Balance</span>
                      <span className="font-medium">${userBalance.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bet Amount</span>
                      <span className="font-medium">${betAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Potential Winnings</span>
                      <span className="font-medium text-green-400">${potentialWinnings.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between pt-3 border-t border-gray-700">
                      <span className="text-gray-400">Balance After Bet</span>
                      <span className="font-medium">
                        ${(userBalance - betAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 