"use client";

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Wallet, Trophy, Calendar, User, Clock, Users, ChevronRight, DollarSign, Settings, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/components/providers/auth-provider';
import { useTournaments } from '@/hooks/useTournaments';
import { hasUserJoinedTournament } from '@/services/tournaments';
import { formatCurrency } from '@/utils/format';
import PaymentModal from '@/components/tournaments/PaymentModal';
import TournamentTokens from '@/components/tournaments/TournamentTokens';
import { Tournament } from '@/types/tournament';

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { user } = useAuth();
  const { tournaments, featuredTournament, loading: tournamentsLoading, refetch: refetchTournaments } = useTournaments();
  const [mounted, setMounted] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [joinedTournaments, setJoinedTournaments] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check which tournaments user has joined
  useEffect(() => {
    const checkJoinedTournaments = async () => {
      if (user?.id && tournaments) {
        const joinedIds = new Set<string>();
        
        for (const tournament of tournaments) {
          const hasJoined = await hasUserJoinedTournament(tournament.id, user.id);
          if (hasJoined) {
            joinedIds.add(tournament.id);
          }
        }
        
        setJoinedTournaments(joinedIds);
      }
    };

    checkJoinedTournaments();
  }, [user?.id, tournaments]);

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && sessionStatus === 'unauthenticated') {
      redirect('/login?callbackUrl=/dashboard');
    }
  }, [mounted, sessionStatus]);

  if (!mounted || sessionStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  // Double-check authentication
  if (sessionStatus !== 'authenticated') {
    return null;
  }

  // Use user data from context if available, otherwise use session data
  const userData = user || {
    username: session?.user?.name,
    email: session?.user?.email,
    bbz_balance: 0,
  };

  const formattedBalance = formatCurrency(userData?.bbz_balance || 0);

  const handleJoinTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh tournaments list after successful payment
    if (refetchTournaments) {
      refetchTournaments();
    }
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedTournament(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {userData?.username || session?.user?.name || 'Player'}!</h1>
            <p className="text-gray-300">Track your bets, join tournaments, and check your stats.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Upcoming Tournaments */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Upcoming Tournaments
              </h2>
              <Link href="/tournaments" className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {tournamentsLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
              </div>
            ) : tournaments && tournaments.length > 0 ? (
              <div className="space-y-4">
                {tournaments.slice(0, 3).map((tournament) => (
                  <div key={tournament.id} className="bg-gray-750 hover:bg-gray-700 p-4 rounded-lg transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <h3 className="font-semibold mb-2">{tournament.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center text-gray-300">
                            <Calendar className="h-4 w-4 mr-1 text-purple-400" />
                            {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBD'}
                          </span>
                          <span className="flex items-center text-gray-300">
                            <Users className="h-4 w-4 mr-1 text-blue-400" />
                            {tournament.participant_count || 0} Participants
                          </span>
                          <span className="flex items-center text-gray-300">
                            <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                            {formatCurrency(tournament.prize_pool || 0)} Prize Pool
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className="flex gap-2">
                          <Link 
                            href={`/tournaments/${tournament.id}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors inline-block"
                          >
                            View Details
                          </Link>
                          {tournament.status === 'upcoming' && user && !joinedTournaments.has(tournament.id) && (
                            <button
                              onClick={() => handleJoinTournament(tournament)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                            >
                              Join Tournament
                            </button>
                          )}
                          {joinedTournaments.has(tournament.id) && (
                            <div className="bg-green-600/20 border border-green-600/50 text-green-400 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Joined
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No upcoming tournaments found.</p>
                <Link 
                  href="/tournaments"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors inline-block"
                >
                  Explore Tournaments
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Recent Activity
              </h2>
              <Link href="/activity" className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No recent activity to display.</p>
              <Link 
                href="/tournaments"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors inline-block"
              >
                Join a Tournament
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">
                  {(userData?.username || session?.user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-bold">{userData?.username || session?.user?.name || 'User'}</h3>
                <p className="text-sm text-gray-400">{userData?.email || session?.user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Link 
                href={`/profile/${userData?.username || session?.user?.name}`}
                className="flex items-center justify-between w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm"
              >
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              
              <Link 
                href="/settings"
                className="flex items-center justify-between w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm"
              >
                <span className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Tournament Tokens */}
          <TournamentTokens />

          {/* Featured Tournament */}
          {featuredTournament && (
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-purple-900 to-indigo-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="h-16 w-16 text-yellow-400 opacity-50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-bold text-lg">{featuredTournament.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Start Date:</span>
                    <span>{featuredTournament.start_date ? new Date(featuredTournament.start_date).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Prize Pool:</span>
                    <span className="text-green-400">{formatCurrency(featuredTournament.prize_pool || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Entry Fee:</span>
                    <span>{formatCurrency(featuredTournament.entry_fee || 0)}</span>
                  </div>
                </div>
                <Link 
                  href={`/tournaments/${featuredTournament.id}`}
                  className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  View Tournament
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedTournament && (
        <PaymentModal
          tournament={selectedTournament}
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}