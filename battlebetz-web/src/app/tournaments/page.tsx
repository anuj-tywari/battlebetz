'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Calendar, Users, ArrowRight, Clock, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { formatCurrency } from '@/utils/format';
import { useAllTournaments, useUserTournaments } from '@/hooks/useTournaments';
import { useTodaysGames } from '@/hooks/useGames';
import TournamentCard from '@/components/tournaments/TournamentCard';

export default function TournamentsPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const userId = session?.user?.id;

  // Memoize status filters to prevent continuous API calls
  const statusFilter = useMemo(() => ['upcoming', 'active'], []);

  // Fetch tournaments data using hooks
  const { tournaments: allTournaments, loading: tournamentsLoading, error: tournamentsError, refetch: refetchTournaments } = useAllTournaments(statusFilter);
  const { tournaments: userTournaments, loading: userTournamentsLoading, error: userTournamentsError } = useUserTournaments(userId);
  const { games: todaysGames, loading: gamesLoading, error: gamesError } = useTodaysGames();

  const handleTournamentJoin = async (tournamentId: string) => {
    // This will be handled by the PaymentModal in TournamentCard
    // After successful join, refresh tournaments
    if (refetchTournaments) {
      refetchTournaments();
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Tournament Layout - Two Column for desktop, single column for mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Takes 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-8">
            {/* All Available Tournaments */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-bold text-white">Available Tournaments</h2>
                </div>
                <Link href="/tournaments/upcoming" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {tournamentsLoading ? (
                  <div className="col-span-2 bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-gray-300">Loading tournaments...</p>
                  </div>
                ) : tournamentsError ? (
                  <div className="col-span-2 bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-red-400">Error loading tournaments: {tournamentsError}</p>
                  </div>
                ) : allTournaments && allTournaments.length > 0 ? (
                  allTournaments.slice(0, 6).map((tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                      onJoin={handleTournamentJoin}
                    />
                  ))
                ) : (
                  <div className="col-span-2 bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-gray-300">No tournaments available at the moment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Your Active Tournaments */}
            {isLoggedIn && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-purple-500" />
                    <h2 className="text-xl font-bold text-white">Your Active Tournaments</h2>
                  </div>
                  <Link href="/profile/tournaments" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                
                {userTournamentsLoading ? (
                  <div className="bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-gray-300">Loading your tournaments...</p>
                  </div>
                ) : userTournamentsError ? (
                  <div className="bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-red-400">Error loading your tournaments: {userTournamentsError}</p>
                  </div>
                ) : userTournaments.length > 0 ? (
                  <div className="space-y-3">
                    {userTournaments.map((participation) => (
                      <div key={participation.id} className="bg-gray-700/40 rounded-lg p-4 hover:bg-gray-700/60 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-600 h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold">
                              <Trophy className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{participation.tournament?.name}</div>
                              <div className="text-xs text-gray-400">
                                Balance: {formatCurrency(participation.token_balance || 0)} • 
                                Rank: #{participation.rank || 'N/A'}
                              </div>
                            </div>
                          </div>
                          <Link href={`/tournaments/${participation.tournament_id}`} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-700/40 rounded-lg p-8 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-2">No Active Tournaments</h3>
                    <p className="text-gray-300 mb-4">You haven't joined any tournaments yet. Check out the available tournaments above!</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Today's Games/Matches */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-green-500" />
                  <h2 className="text-xl font-bold text-white">Today's Games</h2>
                </div>
              </div>
              
              <div className="space-y-3">
                {gamesLoading ? (
                  <div className="bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-gray-300">Loading games...</p>
                  </div>
                ) : gamesError ? (
                  <div className="bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-red-400">Error loading games: {gamesError}</p>
                  </div>
                ) : todaysGames.length > 0 ? (
                  todaysGames.slice(0, 5).map((game) => (
                    <div key={game.id} className="bg-gray-700/40 rounded-lg p-4 hover:bg-gray-700/60 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-600 h-10 w-10 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{game.sport?.substring(0, 1) || 'S'}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{game.teams.team1.name} vs {game.teams.team2.name}</div>
                            <div className="text-xs text-gray-400">
                              {game.sport} • {game.time || 'TBD'}
                            </div>
                          </div>
                        </div>
                        <Link href={`/tournaments/matches/${game.id}`} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors">
                          Place Bet
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-gray-300">No games available at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Takes 1/3 width on desktop */}
          <div className="space-y-8">
            {/* Tournament Stats */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Tournament Stats</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/40 p-4 rounded-lg text-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">{userTournaments.length}</span>
                  <p className="text-xs sm:text-sm text-gray-400">Your Tournaments</p>
                </div>
                <div className="bg-gray-700/40 p-4 rounded-lg text-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">{allTournaments?.length || 0}</span>
                  <p className="text-xs sm:text-sm text-gray-400">Available</p>
                </div>
                <div className="bg-gray-700/40 p-4 rounded-lg text-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    ${allTournaments ? allTournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0).toLocaleString() : 0}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-400">Total Prize Pool</p>
                </div>
                <div className="bg-gray-700/40 p-4 rounded-lg text-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">{todaysGames.length}</span>
                  <p className="text-xs sm:text-sm text-gray-400">Today's Games</p>
                </div>
              </div>
            </div>
            
            {/* Tournament Rankings/Leaderboard */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-500" />
                  <h2 className="text-xl font-bold text-white">Top Players</h2>
                </div>
                <Link href="/tournaments/leaderboard" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  Full Rankings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-2">
                {userTournaments.length > 0 ? (
                  userTournaments
                    .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                    .slice(0, 5)
                    .map((player, index) => (
                      <div key={player.id} className="flex items-center bg-gray-700/40 p-3 rounded-lg">
                        <div className="w-8 text-center font-bold text-gray-400">{index + 1}</div>
                        <div className="flex-1 px-2">
                          <div className="text-white font-medium">{player.user_id.slice(0, 8)}</div>
                          <div className="text-xs text-gray-400">{player.tournament?.name}</div>
                        </div>
                        <div className="text-yellow-400 font-semibold">{formatCurrency(player.token_balance || 0)}</div>
                      </div>
                    ))
                ) : (
                  <div className="bg-gray-700/40 rounded-lg p-6 text-center">
                    <p className="text-gray-300">No rankings available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 