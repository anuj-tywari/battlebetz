"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Share2, LogOut, Trophy, DollarSign, Activity, Target, TrendingUp, User, Clock, BarChart3, Calendar, Ticket, History, Settings, UserIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { useProfile } from '@/hooks/useProfile';
import { fetchUserMetrics, UserMetrics } from '@/services/metrics';
import { fetchUserActivity, UserActivity, formatRelativeTime } from '@/services/activity';
import { fetchUserTournaments, UserTournament } from '@/services/tournaments';
import { fetchUserBets, UserBet } from '@/services/bets';
import { fetchUserTransactions, UserTransaction } from '@/services/transactions';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  { id: 'bets', label: 'Bets', icon: Ticket },
  { id: 'transactions', label: 'Transactions', icon: History },
  // { id: 'stats', label: 'Stats', icon: Activity }
];

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading, isAuthenticated, signOut } = useAuth();
  const {
    profile,
    loading: profileLoading,
    fetchProfileByUsername,
    fetchProfile,
    error: profileError,
  } = useProfile();
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [tournaments, setTournaments] = useState<UserTournament[]>([]);
  const [bets, setBets] = useState<UserBet[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);

  const username = params?.username as string;

  // Debug logging for state transitions
  useEffect(() => {
    console.log('[ProfilePage] Auth:', { isAuthenticated, authLoading, user });
    console.log('[ProfilePage] Profile:', { profileLoading, profile, profileError });
    console.log('[ProfilePage] Local:', { isLoading, error });
  }, [isAuthenticated, authLoading, profileLoading, user, profile, profileError, isLoading, error]);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (authLoading || profileLoading || isLoading) {
      // Set a timeout to force-exit loading state after 10 seconds
      timeoutId = setTimeout(() => {
        console.log('[ProfilePage] Loading timeout reached - forcing load completion');
        setIsLoading(false);
        if (!profile && !error) {
          setError('Loading timed out. Please try refreshing the page.');
        }
      }, 10000); // 10 seconds timeout
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [authLoading, profileLoading, isLoading, profile, error]);

  // Fetch profile data
  const loadProfile = useCallback(async () => {
    if (!username) return;
    setIsLoading(true);
    setError(null);
    try {
      if (user?.id) {
        console.log('[ProfilePage] Loading profile with user ID:', user.id);
        const result = await fetchProfile(user.id);
        if (result.error) {
          setError(`Failed to load profile: ${result.error.message}`);
        }
      } else {
        console.log('[ProfilePage] Loading profile by username:', username);
        const result = await fetchProfileByUsername(username);
        if (result.error) {
          setError(`Failed to load profile: ${result.error.message}`);
        }
      }
    } catch (err: any) {
      console.error('[ProfilePage] Error loading profile:', err);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [username, fetchProfileByUsername, fetchProfile, user?.id]);

  // Main effect for auth and profile
  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!authLoading && !isAuthenticated) {
      console.log('[ProfilePage] User not authenticated, redirecting to login');
      setIsLoading(false);
      setError(null);
      router.push(`/login?callbackUrl=/profile/${username}`);
      return;
    }
    // If authenticated and not loading, and no profile, load it
    if (isAuthenticated && !authLoading && !profileLoading && !profile && !error) {
      console.log('[ProfilePage] User authenticated, loading profile');
      loadProfile();
    }
    // If profile error, set error and stop loading
    if (profileError && !error) {
      console.error('[ProfilePage] Profile error:', profileError);
      setError(profileError.message || 'Failed to load profile.');
      setIsLoading(false);
    }
  }, [username, authLoading, isAuthenticated, router, loadProfile, profileLoading, profile, error, profileError]);

  // Force reset loading state if all conditions are met but we're still loading
  useEffect(() => {
    if (!authLoading && !profileLoading && isLoading && profile) {
      console.log('[ProfilePage] Forcing loading state completion - all data available');
      setIsLoading(false);
    }
  }, [authLoading, profileLoading, isLoading, profile]);

  // Fetch user metrics and other data when profile is loaded
  useEffect(() => {
    const fetchData = async () => {
      if (profile?.id) {
        try {
          // Fetch metrics
          const userMetrics = await fetchUserMetrics(profile.id);
          setMetrics(userMetrics);
          
          // Fetch activity data
          const userActivities = await fetchUserActivity(profile.id, 5);
          setActivities(userActivities);
          
          // Fetch tournaments
          const tournamentsData = await fetchUserTournaments(profile.id);
          setTournaments(tournamentsData);
          
          // Fetch bets
          const betsData = await fetchUserBets(profile.id);
          setBets(betsData);
          
          // Fetch transactions
          const transactionsData = await fetchUserTransactions(profile.id);
          setTransactions(transactionsData);
        } catch (err) {
          console.error('[ProfilePage] Error fetching user data:', err);
        }
      }
    };

    if (profile) {
      fetchData();
    }
  }, [profile]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  // Show error state
  if (error) {
    const isUserNotFound = error.includes('not found');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {isUserNotFound ? 'User Not Found' : 'Error Loading Profile'}
          </h2>
          <p className="mb-4">{error}</p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading || profileLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl mb-4">You need to be logged in to view this profile</p>
        <Link
          href={`/login?callbackUrl=/profile/${username}`}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-purple-400" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Previous Stats */}
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-600/30 flex items-center justify-center mr-3">
                      <Trophy size={20} className="text-green-400" />
                    </div>
                    <span>Total Wins</span>
                  </div>
                  <span className="text-xl font-bold text-green-400">{metrics?.totalWins || 0}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center mr-3">
                      <Target size={20} className="text-blue-400" />
                    </div>
                    <span>Win Rate</span>
                  </div>
                  <span className="text-xl font-bold text-blue-400">{metrics?.winRate || 0}%</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center mr-3">
                      <Trophy size={20} className="text-purple-400" />
                    </div>
                    <span>Tournaments</span>
                  </div>
                  <span className="text-xl font-bold text-purple-400">{metrics?.tournamentsJoined || 0}</span>
                </div>
                
                {/* New Stats */}
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/30 flex items-center justify-center mr-3">
                      <DollarSign size={20} className="text-red-400" />
                    </div>
                    <span>Total Spent</span>
                  </div>
                  <span className="text-xl font-bold text-red-400">BBZT {metrics?.totalSpent || 0}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-600/30 flex items-center justify-center mr-3">
                      <TrendingUp size={20} className="text-green-400" />
                    </div>
                    <span>Total Earned</span>
                  </div>
                  <span className="text-xl font-bold text-green-400">BBZT {metrics?.totalEarned || 0}</span>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-purple-400" />
                Performance Overview
              </h3>
              <div className="space-y-4">
                {/* Profit/Loss */}
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center mr-3">
                      <TrendingUp size={20} className="text-blue-400" />
                    </div>
                    <span>Net Profit/Loss</span>
                  </div>
                  <span className={`text-xl font-bold ${
                    (metrics?.totalEarned || 0) - (metrics?.totalSpent || 0) >= 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {(metrics?.totalEarned || 0) - (metrics?.totalSpent || 0) >= 0 ? '+' : ''}
                    BBZT {(metrics?.totalEarned || 0) - (metrics?.totalSpent || 0)}
                  </span>
                </div>

                {/* Average Bet */}
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-600/30 flex items-center justify-center mr-3">
                      <DollarSign size={20} className="text-yellow-400" />
                    </div>
                    <span>Avg Bet Size</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-400">
                    BBZT {metrics?.totalBets > 0 ? Math.round((metrics?.totalSpent || 0) / metrics.totalBets) : 0}
                  </span>
                </div>

                {/* Best Streak */}
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-600/30 flex items-center justify-center mr-3">
                      <Trophy size={20} className="text-green-400" />
                    </div>
                    <span>Best Streak</span>
                  </div>
                  <span className="text-xl font-bold text-green-400">{metrics?.bestStreak || 0}</span>
                </div>

                {/* Total Bets */}
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center mr-3">
                      <Activity size={20} className="text-purple-400" />
                    </div>
                    <span>Total Bets</span>
                  </div>
                  <span className="text-xl font-bold text-purple-400">{metrics?.totalBets || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Recent Activity - now shows real data */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-center bg-gray-800 rounded-lg p-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        activity.type === 'bet' ? 'bg-blue-600/20' : 
                        activity.type === 'tournament' ? 'bg-purple-600/20' : 
                        'bg-green-600/20'
                      }`}>
                        {activity.type === 'bet' ? (
                          <Ticket size={18} className="text-blue-400" />
                        ) : activity.type === 'tournament' ? (
                          <Trophy size={18} className="text-purple-400" />
                        ) : (
                          <DollarSign size={18} className="text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-400">{formatRelativeTime(activity.created_at)}</p>
                      </div>
                      {activity.amount && (
                        <span className={`font-medium ${
                          activity.status === 'win' ? 'text-green-400' : 
                          activity.status === 'loss' ? 'text-red-400' : 
                          'text-yellow-400'
                        }`}>
                          {activity.status === 'win' ? '+' : activity.status === 'loss' ? '-' : ''}{activity.amount} BBZT
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="space-y-3">
                    {/* Show sample activities when no real data */}
                    <div className="flex items-center bg-gray-800 rounded-lg p-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mr-3">
                        <Trophy size={18} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Welcome to BattleBetz!</p>
                        <p className="text-sm text-gray-400">Account created successfully</p>
                      </div>
                      <span className="text-sm text-green-400 font-medium">New User</span>
                    </div>
                    
                    <div className="text-center py-4 text-gray-400 border-t border-gray-700">
                      <p className="text-sm">No recent activity yet</p>
                      <p className="text-xs mt-1">Join tournaments and place bets to see your activity here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'tournaments':
        return (
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-purple-400" />
              Tournaments Joined
            </h3>
            <div className="space-y-4">
              {tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <div key={tournament.id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-purple-600/20 flex items-center justify-center shrink-0">
                      <Trophy size={24} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{tournament.tournament?.name || 'Unknown Tournament'}</h4>
                      <p className="text-sm text-gray-400 mb-2">{formatRelativeTime(tournament.joined_at)}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tournament.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          tournament.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {tournament.status === 'active' ? 'Active' : 
                           tournament.status === 'completed' ? 'Completed' : 
                           'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="md:text-right mt-2 md:mt-0">
                      <p className="font-semibold text-lg">Rank: #{tournament.rank || 'N/A'}</p>
                      <Link href={`/tournaments/${tournament.tournament_id}`} className="text-sm text-purple-400 hover:text-purple-300">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  No tournaments joined yet
                </div>
              )}
            </div>
          </div>
        );
      
      case 'bets':
        return (
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Ticket size={18} className="text-purple-400" />
              Bet History
            </h3>
            {bets.length > 0 ? (
              <>
                {/* Desktop table view */}
                <div className="hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="text-left border-b border-gray-700">
                          <th className="pb-3">Event</th>
                          <th className="pb-3">Bet Type</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bets.map((bet) => (
                          <tr key={bet.id} className="border-b border-gray-800 text-sm">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center">
                                  <Activity size={14} className="text-blue-400" />
                                </div>
                                <span>{bet.match_title}</span>
                              </div>
                            </td>
                            <td className="py-3">{bet.bet_type}</td>
                            <td className="py-3">
                              <span className="font-medium">{bet.amount} BBZT</span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                bet.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                bet.status === 'won' ? 'bg-green-500/20 text-green-400' : 
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {bet.status === 'pending' ? 'Pending' : 
                                 bet.status === 'won' ? 'Won' : 'Lost'}
                              </span>
                            </td>
                            <td className="py-3 text-gray-400">{formatRelativeTime(bet.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Mobile card view */}
                <div className="md:hidden space-y-4">
                  {bets.map((bet) => (
                    <div key={bet.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center">
                            <Activity size={14} className="text-blue-400" />
                          </div>
                          <span className="font-medium">{bet.match_title}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          bet.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                          bet.status === 'won' ? 'bg-green-500/20 text-green-400' : 
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {bet.status === 'pending' ? 'Pending' : 
                           bet.status === 'won' ? 'Won' : 'Lost'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-400">Bet Type</p>
                          <p>{bet.bet_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Amount</p>
                          <p className="font-medium">{bet.amount} BBZT</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400">Date</p>
                          <p>{formatRelativeTime(bet.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-400">
                No bets placed yet
              </div>
            )}
          </div>
        );
      
      case 'transactions':
        return (
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History size={18} className="text-purple-400" />
              Transaction History
            </h3>
            {transactions.length > 0 ? (
              <>
                {/* Desktop table view */}
                <div className="hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="text-left border-b border-gray-700">
                          <th className="pb-3">Transaction</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-800 text-sm">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-purple-600/20 flex items-center justify-center">
                                  {transaction.type === 'deposit' ? (
                                    <DollarSign size={14} className="text-purple-400" />
                                  ) : (
                                    <Target size={14} className="text-teal-400" />
                                  )}
                                </div>
                                <div>
                                  <div>{transaction.title}</div>
                                  <div className="text-xs text-gray-400">
                                    {transaction.reference}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`font-medium ${transaction.type === 'withdraw' ? 'text-red-400' : 'text-green-400'}`}>
                                {transaction.type === 'withdraw' ? '-' : '+'}{transaction.amount} BBZT
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-1 rounded-full text-xs bg-gray-700">
                                {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                              </span>
                            </td>
                            <td className="py-3 text-gray-400">{formatRelativeTime(transaction.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Mobile card view */}
                <div className="md:hidden space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-purple-600/20 flex items-center justify-center">
                            {transaction.type === 'deposit' ? (
                              <DollarSign size={14} className="text-purple-400" />
                            ) : (
                              <Target size={14} className="text-teal-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.title}</div>
                            <div className="text-xs text-gray-400">{transaction.reference}</div>
                          </div>
                        </div>
                        <span className={`font-medium ${transaction.type === 'withdraw' ? 'text-red-400' : 'text-green-400'}`}>
                          {transaction.type === 'withdraw' ? '-' : '+'}{transaction.amount} BBZT
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-700">
                          {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </span>
                        <span className="text-gray-400">{formatRelativeTime(transaction.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-400">
                No transactions found
              </div>
            )}
          </div>
        );
      
      case 'stats':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Win Rate */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-purple-400" />
                Performance Stats
              </h3>
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 mb-4">
                  <div className="w-full h-full rounded-full border-[16px] border-gray-700"></div>
                  <div 
                    className="absolute top-0 left-0 w-full h-full rounded-full border-[16px] border-transparent border-t-purple-500 border-r-purple-500"
                    style={{ 
                      transform: `rotate(${((metrics?.winRate || 0) / 100) * 360}deg)`,
                      transition: 'transform 1s ease-out'
                    }}
                  ></div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-bold">
                    {metrics?.winRate || 0}%
                  </div>
                </div>
                <p className="text-center text-gray-400">Win Rate</p>
                <p className="text-center text-sm text-gray-500 mt-1">Based on {metrics?.totalBets || 0} bets</p>
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target size={18} className="text-purple-400" />
                Stats Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span>Tournaments Won</span>
                  <span className="font-bold text-yellow-400">{metrics?.tournamentsWon || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span>Total Losses</span>
                  <span className="font-bold text-red-400">{metrics?.totalLosses || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span>Total Spent</span>
                  <span className="font-bold">${metrics?.totalSpent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Earned</span>
                  <span className="font-bold text-green-400">${metrics?.totalEarned?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
            
            {/* Monthly Performance */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-purple-400" />
                Monthly Performance
              </h3>
              <div className="flex items-center justify-center h-[200px] text-gray-400">
                No monthly data available yet
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header - Glass Morphism Card */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-500">
                {profile.avatar_url ? (
                  <Image 
                    src={profile.avatar_url}
                    alt={profile.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-700 to-blue-700 flex items-center justify-center">
                    <User size={48} className="text-white/80" />
                  </div>
                )}
              </div>
              {user?.id === profile.id && (
                <button className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 shadow-lg">
                  <Edit size={16} />
                </button>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-1">{profile.username}</h1>
              <p className="text-purple-400 mb-3">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-gray-300 mb-4 max-w-2xl">{profile.bio}</p>
              )}
              
              {/* Stats Quick View */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                <div className="text-center">
                  <p className="text-xl font-bold">{metrics?.totalWins || 0}</p>
                  <p className="text-xs text-gray-400">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{metrics?.winRate || 0}%</p>
                  <p className="text-xs text-gray-400">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{metrics?.tournamentsJoined || 0}</p>
                  <p className="text-xs text-gray-400">Tournaments</p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              {user?.id === profile.id ? (
                <>
                  <Link href="/settings" className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Share2 size={16} />
                  <span>Share Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <div className="flex space-x-1 mx-auto p-1 bg-gray-800/40 backdrop-blur-md rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
