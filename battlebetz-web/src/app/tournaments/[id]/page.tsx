"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trophy, 
  Users, 
  Calendar, 
  ChevronRight, 
  Shield, 
  Clock, 
  DollarSign,
  LogIn,
  X,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { getTournamentById, hasUserJoinedTournament } from '@/services/tournaments';
import { getGamesByTournament } from '@/services/games';
import { Tournament } from '@/types/tournament';
import PaymentModal from '@/components/tournaments/PaymentModal';

export default function TournamentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const tournamentId = params?.id as string;
  const justJoined = searchParams.get('joined') === 'true';
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hasJoinedTournament, setHasJoinedTournament] = useState(false);

  // Re-fetch data function
  const fetchData = async () => {
    if (!tournamentId) return;

    try {
      const [tournamentRes, gamesRes] = await Promise.all([
        getTournamentById(tournamentId),
        getGamesByTournament(tournamentId)
      ]);

      // Ensure tournament data matches Tournament type by providing default values
      setTournament({
        ...tournamentRes,
        name: tournamentRes.name || '',
        description: tournamentRes.description || '',
        status: tournamentRes.status || '',
        prize_pool: tournamentRes.prize_pool || 0,
        entry_fee: tournamentRes.entry_fee || 0,
        start_date: tournamentRes.start_date || '',
        end_date: tournamentRes.end_date || '',
        is_public: tournamentRes.is_public || false
      });
      setGames(gamesRes?.data || []);
      
      // Check if user has joined this tournament
      if (user?.id) {
        const hasJoined = await hasUserJoinedTournament(tournamentId, user.id);
        setHasJoinedTournament(hasJoined);
      }
    } catch (err) {
      console.error('Error fetching tournament data:', err);
      setError('Failed to load tournament details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  // Show success banner if user just joined
  useEffect(() => {
    if (justJoined) {
      setShowSuccessBanner(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowSuccessBanner(false), 5000);
      
      // Clear the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('joined');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [justJoined]);
  
  // Handle join tournament with payment modal
  const handleJoinTournament = () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/tournaments/${tournamentId}`);
      return;
    }
    
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh tournament data after successful payment
    fetchData();
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Tournament Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'The tournament you are looking for does not exist or has been removed.'}</p>
            <Link href="/tournaments" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block font-medium">
              Browse Tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'ESPORTS': 'from-blue-600 to-purple-600',
      'SPORTS': 'from-green-600 to-teal-600',
      'FANTASY': 'from-orange-600 to-red-600',
      'SPECIAL': 'from-pink-600 to-purple-600',
      'DEFAULT': 'from-gray-600 to-slate-600'
    };
    
    return gradients[category] || gradients['DEFAULT'];
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatCountdown = (dateString: string) => {
    const now = new Date();
    const targetDate = new Date(dateString);
    const diff = targetDate.getTime() - now.getTime();
    
    // If date is in the past
    if (diff < 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
  };
  
  // Button rendering based on auth state
  const renderActionButton = () => {
    if (!isAuthenticated) {
      return (
        <Link 
          href={`/login?callbackUrl=/tournaments/${tournamentId}`}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-bold inline-flex items-center transition-colors"
        >
          <LogIn className="h-5 w-5 mr-2" />
          Login to Join
        </Link>
      );
    }
    
    // If user has already joined, show "Already Joined" message
    if (hasJoinedTournament) {
      return (
        <div className="bg-green-600/20 border border-green-600/50 text-green-400 px-6 py-3 rounded-lg font-bold inline-flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Already Joined
        </div>
      );
    }
    
    if (tournament.status === 'UPCOMING' || tournament.status === 'upcoming') {
      return (
        <button 
          onClick={handleJoinTournament}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-bold inline-flex items-center transition-colors"
        >
          <Trophy className="h-5 w-5 mr-2" />
          Join Tournament
          <span className="text-sm ml-2">({formatCurrency(tournament.entry_fee || 10)})</span>
        </button>
      );
    } else if (tournament.status === 'ACTIVE' || tournament.status === 'active') {
      return (
        <Link 
          href={`/tournaments/${tournamentId}/place-bets`}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-bold inline-flex items-center transition-colors"
        >
          <DollarSign className="h-5 w-5 mr-2" />
          Place Bets
        </Link>
      );
    }
    
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-4 sm:p-6 mb-8 relative backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="absolute top-4 right-4 text-green-400 hover:text-green-300 transition-colors hover:bg-green-500/10 rounded-full p-1"
            >
              <X size={20} />
            </button>
            <div className="flex items-start">
              <div className="bg-green-500/20 rounded-full p-3 mr-4 backdrop-blur-sm">
                <CheckCircle size={24} className="text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-green-400 font-bold text-lg mb-2">🎉 Welcome to the Tournament!</h3>
                <p className="text-gray-200 text-sm sm:text-base mb-4 leading-relaxed">
                  You've successfully joined <span className="font-semibold text-green-300">{tournament?.name}</span>! 
                  You've been awarded <span className="font-bold text-green-400">1,000 BBZT</span> tokens to use for betting.
                </p>
                <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/60 rounded-xl p-4 border border-green-500/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Tournament Tokens:</span>
                    <span className="text-green-400 font-bold text-lg">1,000 BBZT</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 flex items-center">
                    <Trophy size={14} className="mr-1" />
                    Use these tokens to place bets and climb the leaderboard!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tournament Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl">
          {/* Background with Enhanced Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(tournament.category || 'DEFAULT')} opacity-90`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('/api/placeholder/1200/400')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-500/20 rounded-full blur-lg"></div>
          
          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8">
              {/* Left Side - Tournament Info */}
              <div className="flex-1">
                {/* Breadcrumb */}
                <div className="flex items-center mb-6">
                  <Link href="/tournaments" className="text-white/70 hover:text-white text-sm sm:text-base font-medium transition-colors backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                    ← Tournaments
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-white/50" />
                  <span className="text-sm sm:text-base text-white/90 font-medium">Tournament Details</span>
                </div>
                
                {/* Tournament Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight">
                  {tournament.name}
                </h1>
                
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
                    <Clock className="h-4 w-4 mr-2 text-purple-300" />
                    <span className="text-sm font-semibold">
                      {tournament.status === 'UPCOMING' 
                        ? `🚀 Starts in ${formatCountdown(tournament.start_date || '')}` 
                        : `🎮 ${tournament.status}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
                    <Calendar className="h-4 w-4 mr-2 text-blue-300" />
                    <span className="text-sm font-semibold">{formatDate(tournament.start_date || '')}</span>
                  </div>
                  
                  <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
                    <Users className="h-4 w-4 mr-2 text-green-300" />
                    <span className="text-sm font-semibold">{tournament.participant_count || 0}/{tournament.max_participants || 100} Players</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Prize & Action */}
              <div className="flex flex-col items-center lg:items-end space-y-4 lg:space-y-6">
                {/* Prize Pool Card */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 shadow-2xl text-center lg:text-right min-w-[200px]">
                  <div className="text-yellow-200/80 text-sm font-semibold mb-1">🏆 Prize Pool</div>
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {formatCurrency(tournament.prize_pool || 0)}
                  </div>
                  <div className="text-yellow-200/60 text-xs mt-1">Winner takes all</div>
                </div>
                
                {/* Join Button */}
                {(tournament.status === 'UPCOMING' || tournament.status === 'upcoming') && (
                  <div className="w-full lg:w-auto">
                    {isAuthenticated ? (
                      hasJoinedTournament ? (
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 text-green-300 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold inline-flex items-center text-sm sm:text-base backdrop-blur-xl shadow-xl w-full lg:w-auto justify-center">
                          <CheckCircle className="mr-3 h-5 w-5" />
                          ✅ Joined Tournament
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <button
                            onClick={handleJoinTournament}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold inline-flex items-center transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 text-sm sm:text-base w-full lg:w-auto justify-center backdrop-blur-xl border border-white/20"
                          >
                            <Trophy className="mr-3 h-5 w-5" />
                            🚀 Join Tournament
                          </button>
                          <p className="text-xs sm:text-sm text-white/70 text-center lg:text-right">
                            Entry fee: <span className="font-semibold text-white">{formatCurrency(tournament.entry_fee || 0)}</span>
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="space-y-3">
                        <Link 
                          href={`/login?callbackUrl=/tournaments/${tournamentId}`} 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold inline-flex items-center transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 text-sm sm:text-base w-full lg:w-auto justify-center backdrop-blur-xl border border-white/20"
                        >
                          <LogIn className="mr-3 h-5 w-5" />
                          🔐 Login to Join
                        </Link>
                        <p className="text-xs sm:text-sm text-white/70 text-center lg:text-right">
                          Entry fee: <span className="font-semibold text-white">{formatCurrency(tournament.entry_fee || 0)}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tournament Overview Cards */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-2 mr-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                Tournament Overview
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Prize Pool Card */}
                <div className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="h-8 w-8 text-yellow-400" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      {formatCurrency(tournament.prize_pool || 0)}
                    </span>
                    <span className="text-sm text-yellow-200/80 font-medium mt-1">Prize Pool</span>
                  </div>
                </div>
                
                {/* Participants Card */}
                <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {tournament.participant_count || 0}<span className="text-gray-400">/{tournament.max_participants || 0}</span>
                    </span>
                    <span className="text-sm text-blue-200/80 font-medium mt-1">Participants</span>
                  </div>
                </div>
                
                {/* Entry Fee Card */}
                <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-8 w-8 text-green-400" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {formatCurrency(tournament.entry_fee || 0)}
                    </span>
                    <span className="text-sm text-green-200/80 font-medium mt-1">Entry Fee</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tournament Games */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-2 mr-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  Tournament Games
                </h2>
                <Link 
                  href={`/tournaments/${tournamentId}/games`}
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold inline-flex items-center transition-colors bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-sm"
                >
                  View All Games
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {games.length > 0 ? (
                  games.slice(0, 5).map((game, index) => (
                    <div key={game.event_id} className="group bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-2xl p-4 sm:p-6 border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-[1.02] backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Teams */}
                        <div className="flex items-center justify-between sm:flex-1 gap-4">
                          <div className="text-center flex-1">
                            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-3 mb-2 backdrop-blur-sm border border-blue-500/20">
                              <div className="text-white font-bold text-sm sm:text-base">{game.home_team}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center px-4">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs sm:text-sm px-4 py-2 rounded-full font-bold shadow-lg mb-2">
                              VS
                            </div>
                            <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
                              {game.start_time ? new Date(game.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                            </div>
                          </div>
                          
                          <div className="text-center flex-1">
                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-3 mb-2 backdrop-blur-sm border border-purple-500/20">
                              <div className="text-white font-bold text-sm sm:text-base">{game.away_team}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        {(tournament.status === 'ACTIVE' || tournament.status === 'active') && (
                          <div className="text-center sm:text-right">
                            {isAuthenticated ? (
                              <Link 
                                href={`/tournaments/${tournamentId}/games/${game.event_id}/bet`}
                                className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 shadow-lg shadow-green-500/25 w-full sm:w-auto backdrop-blur-sm border border-white/20"
                              >
                                🎯 Place Bet
                              </Link>
                            ) : (
                              <Link 
                                href={`/login?callbackUrl=/tournaments/${tournamentId}/games/${game.event_id}/bet`}
                                className="inline-block bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 shadow-lg w-full sm:w-auto backdrop-blur-sm border border-white/20"
                              >
                                🔐 Login to Bet
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-700/30 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">No games are currently available for this tournament.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tournament Rules */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-2 mr-3">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                Tournament Rules
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-semibold">💰 Entry Fee:</span>
                    <span className="text-white font-bold">{formatCurrency(tournament.entry_fee || 0)}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-300 font-semibold">🏆 Prize Pool:</span>
                    <span className="text-white font-bold">{formatCurrency(tournament.prize_pool || 0)}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-300 font-semibold">📅 Start Date:</span>
                    <span className="text-white font-bold">{formatDate(tournament.start_date || '')}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-green-300 font-semibold">🎮 Games:</span>
                    <span className="text-white font-bold">{games.length} total games</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-xl p-4 border border-gray-600/30 backdrop-blur-sm">
                  <p className="text-gray-300 text-xs leading-relaxed">
                    <span className="text-purple-300 font-semibold">⏰ Betting Period:</span> Closes 15 minutes before each game starts.
                  </p>
                </div>
                
                <div className="border-t border-gray-700/50 pt-4">
                  <div className="space-y-3 text-xs">
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-3 border border-purple-500/20">
                      <span className="text-purple-300 font-semibold">🎯 Scoring:</span>
                      <p className="text-gray-300 mt-1 leading-relaxed">
                        Correct predictions earn points based on odds. Highest points wins!
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-3 border border-yellow-500/20">
                      <span className="text-yellow-300 font-semibold">💎 Payouts:</span>
                      <div className="text-gray-300 mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>🥇 1st Place:</span>
                          <span className="font-bold">70%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🥈 2nd Place:</span>
                          <span className="font-bold">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🥉 3rd Place:</span>
                          <span className="font-bold">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Leaderboard */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-2 mr-3">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  🏆 Leaderboard
                </h3>
                <Link 
                  href={`/tournaments/${tournamentId}/leaderboard`}
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold inline-flex items-center transition-colors bg-purple-500/10 hover:bg-purple-500/20 px-3 py-2 rounded-xl border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-sm"
                >
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              {(tournament.status === 'UPCOMING' || tournament.status === 'upcoming') ? (
                <div className="text-center py-8">
                  <div className="bg-gray-700/30 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
                    🚀 Leaderboard will be available once the tournament begins.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'BetMaster99', points: 2450, avatar: '/assets/images/logo.png', badge: '🥇' },
                    { rank: 2, name: 'PredictionKing', points: 2280, avatar: '/assets/images/logo.png', badge: '🥈' },
                    { rank: 3, name: 'LuckyGuesser', points: 2150, avatar: '/assets/images/logo.png', badge: '🥉' },
                  ].map(player => (
                    <div key={player.rank} className="group bg-gradient-to-r from-gray-700/40 to-gray-800/40 rounded-xl p-4 border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-[1.02] backdrop-blur-sm">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{player.badge}</div>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-purple-500/30">
                          <Image
                            src={player.avatar}
                            alt={player.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-sm truncate">{player.name}</div>
                          <div className="text-xs text-gray-400">Rank #{player.rank}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-purple-400 font-bold text-sm">{player.points}</div>
                          <div className="text-xs text-gray-400">points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {tournament && (
        <PaymentModal
          tournament={tournament}
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
} 