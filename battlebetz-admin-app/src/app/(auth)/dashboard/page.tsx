'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from 'recharts';
import { Users, DollarSign, Gamepad2, ArrowUp, ArrowDown, Loader2, AlertTriangle, Trophy, User, UserPlus, Coins } from 'lucide-react';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  user: string;
  activity: string;
  time: string;
  rawTime: number;
  type: 'bet' | 'transaction' | 'signup' | 'game' | 'tournament';
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { supabase, isAuthenticated, hasCredentials, authError } = useSupabase();
  const router = useRouter();

  // Fetch dashboard data
  useEffect(() => {
    // Don't fetch data if we already know we're not authenticated or missing credentials
    if (!isAuthenticated || !hasCredentials) {
      setError(authError || "Authentication or configuration issue");
      setIsLoading(false);
      return;
    }
    
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Query for users count
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        if (usersError) throw usersError;
        
        // Query for transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('amount, type, created_at');
        
        if (transactionsError) throw transactionsError;
        
        // Query for active games
        const { count: gamesCount, error: gamesError } = await supabase
          .from('games')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
        
        if (gamesError) throw gamesError;
        
        // Query for today's bets
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: betsToday, error: betsError } = await supabase
          .from('bets')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
        
        if (betsError) throw betsError;
        
        // Query for recent activity - use both bets and transactions for more comprehensive data
        const { data: recentBets, error: betsActivityError } = await supabase
          .from('bets')
          .select(`
            id,
            risk,
            status,
            created_at,
            users (id, username)
          `)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (betsActivityError) throw betsActivityError;

        const { data: recentTransactions, error: transactionsActivityError } = await supabase
          .from('transactions')
          .select(`
            id,
            amount,
            type,
            created_at,
            users (id, username)
          `)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (transactionsActivityError) throw transactionsActivityError;
        
        // Calculate metrics
        let revenue = 0;
        if (transactions && transactions.length > 0) {
          const totalDeposits = transactions
            .filter(t => t.type === 'deposit')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const totalWithdrawals = transactions
            .filter(t => t.type === 'withdrawal')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          revenue = totalDeposits - totalWithdrawals;
        }
        
        // Calculate growth metrics based on actual data
        // For users: compare current user count with count from a month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        // Get user count from a month ago
        const { count: lastMonthUsers, error: lastMonthUsersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', oneMonthAgo.toISOString());
        
        if (lastMonthUsersError) throw lastMonthUsersError;
        
        // Calculate user growth percentage
        const userGrowth = lastMonthUsers ? 
          (((usersCount || 0) - lastMonthUsers) / lastMonthUsers) * 100 : 0;
        
        // Get revenue from last month
        const { data: lastMonthTransactions, error: lastMonthTransError } = await supabase
          .from('transactions')
          .select('amount, type')
          .lt('created_at', oneMonthAgo.toISOString());
          
        if (lastMonthTransError) throw lastMonthTransError;
        
        // Calculate last month's revenue
        let lastMonthRevenue = 0;
        if (lastMonthTransactions && lastMonthTransactions.length > 0) {
          const lastMonthDeposits = lastMonthTransactions
            .filter(t => t.type === 'deposit')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const lastMonthWithdrawals = lastMonthTransactions
            .filter(t => t.type === 'withdrawal')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          lastMonthRevenue = lastMonthDeposits - lastMonthWithdrawals;
        }
        
        // Calculate revenue growth
        const revenueGrowth = lastMonthRevenue ? 
          ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
        
        // Get games count from last week
        const { count: lastWeekGames, error: lastWeekGamesError } = await supabase
          .from('games')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .lt('created_at', oneWeekAgo.toISOString());
          
        if (lastWeekGamesError) throw lastWeekGamesError;
        
        // Calculate game growth
        const gameGrowth = lastWeekGames ? 
          (((gamesCount || 0) - lastWeekGames) / lastWeekGames) * 100 : 0;
        
        // Get yesterday's bets
        const { count: yesterdayBets, error: yesterdayBetsError } = await supabase
          .from('bets')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString());
          
        if (yesterdayBetsError) throw yesterdayBetsError;
        
        // Calculate bet growth
        const betGrowth = yesterdayBets ? 
          (((betsToday || 0) - yesterdayBets) / yesterdayBets) * 100 : 0;
        
        // Chart data for user signups by day of week
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Get user signup data
        const { data: userSignupRawData, error: signupError } = await supabase
          .from('users')
          .select('created_at');
        
        if (signupError) throw signupError;
        
        const userSignupCounts = new Array(7).fill(0);
        const currentDay = new Date().getDay();
        
        if (userSignupRawData && userSignupRawData.length > 0) {
          userSignupRawData.forEach(user => {
            const date = new Date(user.created_at);
            const dayDiff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff < 7) {
              const index = (currentDay - dayDiff + 7) % 7;
              userSignupCounts[index]++;
            }
          });
        }
        
        const userSignupData = dayNames.map((name, i) => ({
          name,
          users: userSignupCounts[i],
        }));
        
        // Revenue data by day of week
        const { data: revenueRawData, error: revenueDataError } = await supabase
          .from('transactions')
          .select('amount, created_at, type')
          .eq('type', 'deposit');
        
        if (revenueDataError) throw revenueDataError;
        
        const revenueCounts = new Array(7).fill(0);
        
        if (revenueRawData && revenueRawData.length > 0) {
          revenueRawData.forEach(transaction => {
            const date = new Date(transaction.created_at);
            const dayDiff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff < 7) {
              const index = (currentDay - dayDiff + 7) % 7;
              revenueCounts[index] += transaction.amount || 0;
            }
          });
        }
        
        const revenueData = dayNames.map((name, i) => ({
          name,
          amount: revenueCounts[i],
        }));
        
        // Format recent activity - combine bets and transactions for more activity data
        const formattedBetActivity = recentBets?.map(bet => {
          let username = 'Unknown User';
          if (bet.users) {
            if (typeof bet.users === 'object' && bet.users !== null) {
              username = (bet.users as any).username || 'Unknown User';
            }
          }
          
          return {
            id: bet.id,
            user: username,
            activity: `${bet.status === 'won' ? 'Won' : 'Placed'} a bet of BBZ ${bet.risk || 0}`,
            time: formatTimeAgo(new Date(bet.created_at)),
            rawTime: new Date(bet.created_at).getTime(),
            type: 'bet'
          };
        }) || [];
        
        const formattedTransactionActivity = recentTransactions?.map(transaction => {
          let username = 'Unknown User';
          if (transaction.users) {
            if (typeof transaction.users === 'object' && transaction.users !== null) {
              username = (transaction.users as any).username || 'Unknown User';
            }
          }
          
          const actionText = transaction.type === 'deposit' ? 'Deposited' : 
                            transaction.type === 'withdrawal' ? 'Withdrew' :
                            transaction.type === 'win' ? 'Won' : 'Received';
          
          return {
            id: transaction.id,
            user: username,
            activity: `${actionText} BBZ ${transaction.amount || 0}`,
            time: formatTimeAgo(new Date(transaction.created_at)),
            rawTime: new Date(transaction.created_at).getTime(),
            type: 'transaction'
          };
        }) || [];
        
        // Get recent user signups (last 7 days)
        const { data: recentUserSignups, error: recentUsersError } = await supabase
          .from('users')
          .select('id, username, created_at')
          .gte('created_at', oneWeekAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentUsersError) throw recentUsersError;
        
        const formattedUserSignups = recentUserSignups?.map(user => {
          return {
            id: user.id,
            user: user.username || 'New User',
            activity: 'Joined BattleBetz',
            time: formatTimeAgo(new Date(user.created_at)),
            rawTime: new Date(user.created_at).getTime(),
            type: 'signup'
          };
        }) || [];
        
        // Get recent games (last 7 days)
        const { data: recentGames, error: recentGamesError } = await supabase
          .from('games')
          .select('*')
          .gte('created_at', oneWeekAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentGamesError) throw recentGamesError;
        
        const formattedGamesActivity = recentGames?.map((game, index) => {
          return {
            id: `game-${index}`,
            user: 'System',
            activity: `New game: ${game.status || 'Unknown status'}`,
            time: formatTimeAgo(new Date(game.created_at)),
            rawTime: new Date(game.created_at).getTime(),
            type: 'game'
          };
        }) || [];
        
        // Get recent tournaments (last 7 days)
        const { data: recentTournaments, error: recentTournamentsError } = await supabase
          .from('tournaments')
          .select('*')
          .gte('created_at', oneWeekAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentTournamentsError) throw recentTournamentsError;
        
        const formattedTournamentsActivity = recentTournaments?.map((tournament, index) => {
          return {
            id: `tournament-${index}`,
            user: 'System',
            activity: `New tournament with prize pool BBZ ${tournament.prize_pool || 0}`,
            time: formatTimeAgo(new Date(tournament.created_at)),
            rawTime: new Date(tournament.created_at).getTime(),
            type: 'tournament'
          };
        }) || [];
        
        // Combine all activities and sort by timestamp
        const combinedActivities = [
          ...formattedBetActivity, 
          ...formattedTransactionActivity,
          ...formattedUserSignups,
          ...formattedGamesActivity,
          ...formattedTournamentsActivity
        ]
          .sort((a, b) => b.rawTime - a.rawTime)
          .slice(0, 5);
        
        // Create the final data object
        const stats = {
          totalUsers: usersCount || 0,
          revenue: revenue || 0,
          activeGames: gamesCount || 0,
          betsToday: betsToday || 0,
          userGrowth,
          revenueGrowth,
          gameGrowth,
          betGrowth,
          userSignupData,
          revenueData,
          recentActivity: combinedActivities.length > 0 ? combinedActivities : [],
        };
        
        setDashboardData(stats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [isAuthenticated, supabase]);

  // Helper function to format time ago
  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    }
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    }
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  // Extract data from the response
  const stats = dashboardData ? {
    totalUsers: dashboardData.totalUsers,
    totalRevenue: dashboardData.revenue,
    activeGames: dashboardData.activeGames,
    newBets: dashboardData.betsToday,
    userGrowth: dashboardData.userGrowth,
    revenueGrowth: dashboardData.revenueGrowth,
    gameGrowth: dashboardData.gameGrowth,
    betGrowth: dashboardData.betGrowth
  } : null;
  
  const userSignupData = dashboardData?.userSignupData || [];
  const revenueData = dashboardData?.revenueData || [];
  const recentActivityData = dashboardData?.recentActivity || [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {!hasCredentials && !isLoading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Configuration Error</h3>
          </div>
          <p className="text-red-800 mb-3">Supabase credentials are missing. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.</p>
          
          <div className="bg-white bg-opacity-50 p-3 rounded text-sm font-mono text-red-800 mb-3">
            <p># Example .env.local</p>
            <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</p>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm" 
            className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
          >
            Reload Page
          </Button>
        </div>
      )}
      
      {!isAuthenticated && hasCredentials && !isLoading && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 mb-3">You need to be authenticated to view dashboard data. Please log in again if you're seeing this message.</p>
          <Button 
            onClick={() => router.push('/login')} 
            variant="outline" 
            size="sm" 
            className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
          >
            Go to Login
          </Button>
        </div>
      )}
      
      {error && isAuthenticated && hasCredentials && !isLoading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 mb-3">{typeof error === 'string' ? error : 'An error occurred while loading dashboard data.'}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm" 
            className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
          >
            Try Again
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString() || '0'}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <span className={`flex items-center ${stats?.userGrowth && stats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.userGrowth && stats.userGrowth >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats?.userGrowth || 0).toFixed(1)}%
                </span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">BBZ {stats?.totalRevenue.toLocaleString() || '0'}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <span className={`flex items-center ${stats?.revenueGrowth && stats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.revenueGrowth && stats.revenueGrowth >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats?.revenueGrowth || 0).toFixed(1)}%
                </span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Games</CardTitle>
              <Gamepad2 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeGames.toLocaleString() || '0'}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <span className={`flex items-center ${stats?.gameGrowth && stats.gameGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.gameGrowth && stats.gameGrowth >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats?.gameGrowth || 0).toFixed(1)}%
                </span>
                <span className="ml-1">from last week</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Bets Today</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.newBets.toLocaleString() || '0'}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <span className={`flex items-center ${stats?.betGrowth && stats.betGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.betGrowth && stats.betGrowth >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats?.betGrowth || 0).toFixed(1)}%
                </span>
                <span className="ml-1">from yesterday</span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : userSignupData.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-gray-500">No user signup data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userSignupData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" name="Users" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : revenueData.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-gray-500">No revenue data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`BBZ ${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="amount" name="Revenue" stroke="#4f46e5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : recentActivityData.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent activity found</p>
          ) : (
            <div className="space-y-4">
              {recentActivityData.map((activity: Activity) => {
                // Determine icon and color based on activity type
                let Icon = User;
                let bgColor = "bg-indigo-100 dark:bg-indigo-900";
                let textColor = "text-indigo-600 dark:text-indigo-300";
                
                if (activity.type === 'bet') {
                  Icon = Coins;
                  bgColor = "bg-green-100 dark:bg-green-900";
                  textColor = "text-green-600 dark:text-green-300";
                } else if (activity.type === 'transaction') {
                  Icon = DollarSign;
                  bgColor = "bg-blue-100 dark:bg-blue-900";
                  textColor = "text-blue-600 dark:text-blue-300";
                } else if (activity.type === 'signup') {
                  Icon = UserPlus;
                  bgColor = "bg-purple-100 dark:bg-purple-900";
                  textColor = "text-purple-600 dark:text-purple-300";
                } else if (activity.type === 'game') {
                  Icon = Gamepad2;
                  bgColor = "bg-orange-100 dark:bg-orange-900";
                  textColor = "text-orange-600 dark:text-orange-300";
                } else if (activity.type === 'tournament') {
                  Icon = Trophy;
                  bgColor = "bg-yellow-100 dark:bg-yellow-900";
                  textColor = "text-yellow-600 dark:text-yellow-300";
                }
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                    <div className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.user}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          activity.type === 'bet' ? 'bg-green-100 text-green-800' :
                          activity.type === 'transaction' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'signup' ? 'bg-purple-100 text-purple-800' :
                          activity.type === 'game' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.activity}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 