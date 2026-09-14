import { supabase } from './supabase';

// Dashboard statistics
export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  activeGames: number;
  newBets: number;
  userGrowth: number;
  revenueGrowth: number;
  gameGrowth: number;
  betGrowth: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    // Get users and calculate growth
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, created_at');
    
    if (usersError) {
      console.error('Error fetching users for dashboard:', usersError.message);
      throw usersError;
    }
    
    const userCount = users ? users.length : 0;
    
    // Calculate user growth from last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthCount = users ? users.filter(u => new Date(u.created_at) < lastMonth).length : 0;
    const userGrowth = lastMonthCount > 0 
      ? ((userCount - lastMonthCount) / lastMonthCount) * 100
      : 0;
    
    // Get total revenue from transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount, type, created_at')
      .in('type', ['deposit', 'withdrawal']);
    
    if (transactionsError) {
      console.error('Error fetching transactions for dashboard:', transactionsError.message);
      throw transactionsError;
    }
    
    const totalDeposits = transactions
      ? transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + (t.amount || 0), 0)
      : 0;
      
    const totalWithdrawals = transactions
      ? transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + (t.amount || 0), 0)
      : 0;
      
    const totalRevenue = totalDeposits - totalWithdrawals;
    
    // Calculate revenue growth
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const previousMonthStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
    const previousMonthEnd = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
    
    const currentMonth = new Date();
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const previousMonthRevenue = transactions
      ? transactions
          .filter(t => {
            const txDate = new Date(t.created_at);
            return txDate >= previousMonthStart && txDate <= previousMonthEnd;
          })
          .reduce((sum, t) => {
            return sum + (t.type === 'deposit' ? t.amount || 0 : -(t.amount || 0));
          }, 0)
      : 0;
    
    const currentMonthRevenue = transactions
      ? transactions
          .filter(t => {
            const txDate = new Date(t.created_at);
            return txDate >= currentMonthStart;
          })
          .reduce((sum, t) => {
            return sum + (t.type === 'deposit' ? t.amount || 0 : -(t.amount || 0));
          }, 0)
      : 0;
    
    const revenueGrowth = previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0;
    
    // Get active games
    const { count: activeGames, error: gamesError } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (gamesError) {
      console.error('Error fetching games for dashboard:', gamesError.message);
      throw gamesError;
    }
    
    // Calculate game growth
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const { count: lastWeekGames, error: lastWeekGamesError } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .lt('created_at', lastWeek.toISOString());
    
    if (lastWeekGamesError) {
      console.error('Error fetching last week games:', lastWeekGamesError.message);
      throw lastWeekGamesError;
    }
    
    const gameGrowth = lastWeekGames && lastWeekGames > 0
      ? (((activeGames || 0) - lastWeekGames) / lastWeekGames) * 100
      : 0;
    
    // Get new bets today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: newBets, error: betsError } = await supabase
      .from('bets')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    
    if (betsError) {
      console.error('Error fetching bets for dashboard:', betsError.message);
      throw betsError;
    }
    
    // Calculate bet growth
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    dayBeforeYesterday.setHours(0, 0, 0, 0);
    
    const { count: yesterdayBets, error: yesterdayBetsError } = await supabase
      .from('bets')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString());
    
    if (yesterdayBetsError) {
      console.error('Error fetching yesterday bets:', yesterdayBetsError.message);
      throw yesterdayBetsError;
    }
    
    const betGrowth = yesterdayBets && yesterdayBets > 0
      ? (((newBets || 0) - yesterdayBets) / yesterdayBets) * 100
      : 0;
    
    return {
      totalUsers: userCount,
      totalRevenue,
      activeGames: activeGames || 0,
      newBets: newBets || 0,
      userGrowth,
      revenueGrowth,
      gameGrowth,
      betGrowth
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalUsers: 0,
      totalRevenue: 0,
      activeGames: 0,
      newBets: 0,
      userGrowth: 0,
      revenueGrowth: 0,
      gameGrowth: 0,
      betGrowth: 0
    };
  }
}

// User data types and functions
export interface User {
  id: string;
  email: string;
  username: string;
  role: string | null;
  isAdmin: boolean | null;
  balance: number | null;
  avatarUrl: string | null;
  createdAt: string;
}

// Creates mock users for testing when database isn't available
function getMockUsers(): User[] {
  return [
    {
      id: '1',
      email: 'admin@example.com',
      username: 'admin',
      role: 'admin',
      isAdmin: true,
      balance: 5000,
      avatarUrl: null,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'user1@example.com',
      username: 'testuser1',
      role: 'user',
      isAdmin: false,
      balance: 1000,
      avatarUrl: null,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      email: 'user2@example.com',
      username: 'testuser2',
      role: 'user',
      isAdmin: false,
      balance: 2500,
      avatarUrl: null,
      createdAt: new Date().toISOString()
    }
  ];
}

export async function fetchUsers(
  page: number = 1, 
  pageSize: number = 10,
  sortField: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ users: User[]; totalCount: number }> {
  try {
    // Get total count from public users table
    const { count: totalCount, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    if (countError) {
      console.error('Error counting users:', countError.message);
      throw countError;
    }
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    // Query users with pagination
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order(sortField, { ascending: sortOrder === 'asc' })
      .range(from, to);
    if (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
    if (!data || data.length === 0) {
      return { users: [], totalCount: 0 };
    }
    const users = data.map(user => ({
      id: user.id || user.user_id,
      email: user.email || '',
      username: user.username || user.email?.split('@')[0] || 'user',
      role: user.role || 'consumer',
      isAdmin: user.is_admin || user.role === 'admin',
      balance: user.bbz_balance || user.balance || 0,
      avatarUrl: user.avatar_url || null,
      createdAt: user.created_at || new Date().toISOString()
    }));
    return { 
      users, 
      totalCount: totalCount || users.length
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], totalCount: 0 };
  }
}

export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      username: data.username,
      role: data.role,
      isAdmin: data.is_admin,
      balance: data.bbz_balance,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
}

// Tournament data types and functions
export interface Tournament {
  id: string;
  name: string | null;
  status: string | null;
  prizePool: number | null;
  entryFee: number | null;
  startDate: string | null;
  endDate: string | null;
  maxParticipants: number | null;
  isPublic: boolean | null;
  description: string | null;
  rules: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  participantCount: number | null;
}

export async function fetchTournaments(
  page: number = 1, 
  pageSize: number = 10,
  sortField: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ tournaments: Tournament[]; totalCount: number }> {
  try {
    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from('tournaments')
      .select('*', { count: 'exact', head: true });
      
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Query tournaments with pagination
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order(sortField, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { tournaments: [], totalCount: 0 };
    }

    const tournaments = data.map(tournament => ({
      id: tournament.id,
      name: tournament.name,
      description: tournament.description,
      rules: tournament.rules,
      status: tournament.status,
      prizePool: tournament.prize_pool,
      entryFee: tournament.entry_fee,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      maxParticipants: tournament.max_participants,
      isPublic: tournament.is_public,
      type: tournament.type,
      createdAt: tournament.created_at || new Date().toISOString(),
      updatedAt: tournament.updated_at,
      createdBy: tournament.created_by,
      participantCount: tournament.participant_count
    }));

    return { tournaments, totalCount: totalCount || 0 };
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return { tournaments: [], totalCount: 0 };
  }
}

export async function fetchTournamentById(id: string): Promise<Tournament | null> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Map database fields to our interface
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      rules: data.rules,
      status: data.status,
      prizePool: data.prize_pool,
      entryFee: data.entry_fee,
      startDate: data.start_date,
      endDate: data.end_date,
      maxParticipants: data.max_participants,
      isPublic: data.is_public,
      type: data.type,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
      participantCount: data.participant_count
    };
  } catch (error) {
    console.error(`Error fetching tournament ${id}:`, error);
    return null;
  }
}

// Game data types and functions
export interface Game {
  eventId: number;
  sport: string | null;
  startTime: string | null;
  status: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  betStatus: string;
}

export async function fetchGames(): Promise<Game[]> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;

    return data.map(game => ({
      eventId: game.event_id,
      sport: game.sport,
      startTime: game.start_time,
      status: game.status,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      betStatus: game.bet_status
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

// Bet data types and functions
export interface Bet {
  id: string;
  userId: string;
  tournamentId: string | null;
  netAmount: number;
  odds: number;
  potentialPayout: number;
  prediction: string | null;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  risk: number;
  createdAt: string;
}

export async function fetchBets(): Promise<Bet[]> {
  try {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(bet => ({
      id: bet.id,
      userId: bet.user_id,
      tournamentId: bet.tournament_id,
      netAmount: bet.net_amount,
      odds: bet.odds,
      potentialPayout: bet.potential_payout,
      prediction: bet.prediction,
      status: bet.status,
      risk: bet.risk,
      createdAt: bet.created_at
    }));
  } catch (error) {
    console.error('Error fetching bets:', error);
    return [];
  }
}

// Chart data functions for dashboard
export interface ChartDataPoint {
  name: string;
  value: number;
}

export async function fetchUserSignupData(): Promise<ChartDataPoint[]> {
  try {
    // Get last 7 days dates
    const days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get user signups for each day
    const result = await Promise.all(days.map(async (day) => {
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());
      
      if (error) throw error;
      
      return {
        name: dayNames[day.getDay()],
        value: count || 0
      };
    }));
    
    return result;
  } catch (error) {
    console.error('Error fetching user signup data:', error);
    return [];
  }
}

export async function fetchRevenueData(): Promise<ChartDataPoint[]> {
  try {
    // Get last 7 days
    const days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get revenue for each day
    const result = await Promise.all(days.map(async (day) => {
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .in('type', ['deposit', 'withdrawal'])
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());
      
      if (error) throw error;
      
      // Calculate net revenue (deposits minus withdrawals)
      const dayTotal = data ? data.reduce((sum, t) => {
        if (t.type === 'deposit') {
          return sum + (t.amount || 0);
        } else if (t.type === 'withdrawal') {
          return sum - (t.amount || 0);
        }
        return sum;
      }, 0) : 0;
      
      return {
        name: dayNames[day.getDay()],
        value: dayTotal
      };
    }));
    
    return result;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return [];
  }
}

// Recent activity for dashboard
export interface ActivityItem {
  id: string;
  user: string;
  activity: string;
  time: string;
  type: 'bet' | 'transaction' | 'user' | 'tournament';
}

export async function fetchRecentActivity(limit = 5): Promise<ActivityItem[]> {
  try {
    // Get recent bets
    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select('id, user_id, status, risk, created_at, users!bets_user_id_fkey(id, username)')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (betsError) {
      console.error('Error fetching recent bets:', betsError.message);
      throw betsError;
    }
    
    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, user_id, type, amount, created_at, users!transactions_user_id_fkey(id, username)')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (transactionsError) {
      console.error('Error fetching recent transactions:', transactionsError.message);
      throw transactionsError;
    }
    
    // Get recent user signups
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (usersError) {
      console.error('Error fetching recent users:', usersError.message);
      throw usersError;
    }
    
    // Format bet activities
    const betActivities = bets.map(bet => {
      let username = 'Unknown User';
      
      // Extract username from foreign key relationship
      if (bet.users) {
        if (Array.isArray(bet.users) && bet.users.length > 0) {
          username = bet.users[0].username || 'Unknown User';
        } else if (typeof bet.users === 'object' && bet.users !== null && 'username' in bet.users) {
          username = String(bet.users.username || 'Unknown User');
        }
      }
      
      return {
        id: `bet-${bet.id}`,
        user: username,
        activity: `${bet.status === 'won' ? 'Won' : 'Placed'} a bet of BBZ ${bet.risk}`,
        time: formatTimeAgo(new Date(bet.created_at)),
        type: 'bet' as const
      };
    });
    
    // Format transaction activities
    const transactionActivities = transactions.map(tx => {
      let username = 'Unknown User';
      
      // Extract username from foreign key relationship
      if (tx.users) {
        if (Array.isArray(tx.users) && tx.users.length > 0) {
          username = tx.users[0].username || 'Unknown User';
        } else if (typeof tx.users === 'object' && tx.users !== null && 'username' in tx.users) {
          username = String(tx.users.username || 'Unknown User');
        }
      }
      
      return {
        id: `tx-${tx.id}`,
        user: username,
        activity: `${tx.type === 'deposit' ? 'Deposited' : tx.type === 'withdrawal' ? 'Withdrew' : 'Processed'} BBZ ${tx.amount || 0}`,
        time: formatTimeAgo(new Date(tx.created_at)),
        type: 'transaction' as const
      };
    });
    
    // Format user activities
    const userActivities = users.map(user => ({
      id: `user-${user.id}`,
      user: user.username,
      activity: 'Created a new account',
      time: formatTimeAgo(new Date(user.created_at)),
      type: 'user' as const
    }));
    
    // Combine all activities and sort by date
    const allActivities = [
      ...betActivities,
      ...transactionActivities,
      ...userActivities
    ].sort((a, b) => {
      const timeA = new Date(parseTimeAgo(a.time));
      const timeB = new Date(parseTimeAgo(b.time));
      return timeB.getTime() - timeA.getTime();
    }).slice(0, limit);
    
    return allActivities;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

// Helper function to parse time ago string back to approximate date
function parseTimeAgo(timeAgo: string): Date {
  const now = new Date();
  
  if (timeAgo === 'just now') {
    return now;
  }
  
  const match = timeAgo.match(/(\d+) (\w+) ago/);
  if (!match) return now;
  
  const amount = parseInt(match[1], 10);
  const unit = match[2];
  
  const result = new Date(now);
  
  if (unit.startsWith('day')) {
    result.setDate(result.getDate() - amount);
  } else if (unit.startsWith('hour')) {
    result.setHours(result.getHours() - amount);
  } else if (unit.startsWith('minute')) {
    result.setMinutes(result.getMinutes() - amount);
  }
  
  return result;
} 