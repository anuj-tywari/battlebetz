import { User } from '@/types/user';
import { Bet } from '@/types/bet';
import { Game } from '@/types/game';
import { Tournament } from '@/types/tournament';
import { Transaction } from '@/types/transaction';

// Get the Supabase URL and key from env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Define headers for Supabase REST API calls
const headers = {
  'Content-Type': 'application/json',
  'apikey': supabaseKey || '',
  'Authorization': `Bearer ${supabaseKey}`,
  'Prefer': 'return=representation'
};

/**
 * Fetch users directly from the Supabase REST API
 */
export async function fetchUsers(
  { page = 1, pageSize = 10, sortField = 'created_at', sortOrder = 'desc', search = '', accessToken = '' }:
  { page?: number; pageSize?: number; sortField?: string; sortOrder?: 'asc' | 'desc'; search?: string; accessToken?: string; } = {}
): Promise<{ users: User[]; totalCount: number }> {
  try {
    // Construct URL with query params
    let url = `${supabaseUrl}/rest/v1/users?select=*`;
    
    // Add search filter if provided
    if (search) {
      const searchFilter = encodeURIComponent(`username.ilike.%${search}%,email.ilike.%${search}%`);
      url += `&or=${searchFilter}`;
    }
    
    // Add sorting
    url += `&order=${sortField}.${sortOrder}`;
    
    // Add pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    url += `&limit=${pageSize}&offset=${from}`;
    
    // Add header to get count and include authorization token if provided
    const requestHeaders = {
      ...headers,
      'Prefer': 'count=exact',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
    };

    // Make the request
    const response = await fetch(url, { headers: requestHeaders });
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    
    // Get count from response headers
    const countHeader = response.headers.get('content-range');
    let totalCount = 0;
    
    if (countHeader) {
      // Content-Range format is "start-end/total"
      const match = countHeader.match(/\d+-\d+\/(\d+)/);
      if (match && match[1]) {
        totalCount = parseInt(match[1], 10);
      }
    }
    
    // If we couldn't get the count from the header, make a separate request to get the total count
    if (totalCount === 0) {
      const countUrl = `${supabaseUrl}/rest/v1/users?select=id`;
      
      // Add search filter if provided
      if (search) {
        const searchFilter = encodeURIComponent(`username.ilike.%${search}%,email.ilike.%${search}%`);
        url += `&or=${searchFilter}`;
      }
      
      const countResponse = await fetch(countUrl, { 
        headers: { ...headers, 'Prefer': 'count=exact' } 
      });
      
      if (countResponse.ok) {
        const data = await countResponse.json();
        totalCount = data.length;
      }
    }
    
    // Parse the user data
    const users = await response.json();
    
    // Map the response to match our User type
    const mappedUsers = users.map((user: any) => ({
      id: user.id,
      email: user.email || '',
      username: user.username || (user.email ? user.email.split('@')[0] : 'user'),
      role: user.role || 'consumer',
      isAdmin: user.is_admin || user.role === 'admin',
      balance: user.bbz_balance || user.balance || 0,
      avatarUrl: user.avatar_url || null,
      createdAt: user.created_at || new Date().toISOString()
    }));
    
    console.log(`Fetched ${mappedUsers.length} users, total count: ${totalCount}`);
    
    return { users: mappedUsers, totalCount };
  } catch (error) {
    console.error('Error fetching users via REST API:', error);
    return { users: [], totalCount: 0 };
  }
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(id: string, accessToken?: string): Promise<User | null> {
  try {
    const url = `${supabaseUrl}/rest/v1/users?id=eq.${id}&limit=1`;
    
    // Add authorization token if provided
    const requestHeaders = {
      ...headers,
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
    };
    
    const response = await fetch(url, { headers: requestHeaders });
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    const users = await response.json();
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error(`Error fetching user ${id} via REST API:`, error);
    return null;
  }
}

/**
 * Fetch user metrics by user ID
 */
export async function fetchUserMetrics(userId: string, accessToken?: string): Promise<any | null> {
  try {
    const url = `${supabaseUrl}/rest/v1/user_metric?user_id=eq.${userId}&limit=1`;
    
    // Add authorization token if provided
    const requestHeaders = {
      ...headers,
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
    };
    
    const response = await fetch(url, { headers: requestHeaders });
    if (!response.ok) {
      throw new Error(`Failed to fetch user metrics: ${response.statusText}`);
    }
    
    const metrics = await response.json();
    return metrics.length > 0 ? metrics[0] : null;
  } catch (error) {
    console.error(`Error fetching metrics for user ${userId} via REST API:`, error);
    return null;
  }
}

/**
 * Fetch user transactions by user ID
 */
export async function fetchUserTransactions(userId: string, accessToken?: string): Promise<Transaction[]> {
  try {
    const url = `${supabaseUrl}/rest/v1/transactions?user_id=eq.${userId}&order=created_at.desc`;
    
    // Add authorization token if provided
    const requestHeaders = {
      ...headers,
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
    };
    
    const response = await fetch(url, { headers: requestHeaders });
    if (!response.ok) {
      throw new Error(`Failed to fetch user transactions: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching transactions for user ${userId} via REST API:`, error);
    return [];
  }
}

/**
 * Update user
 */
export async function updateUser(id: string, updates: Partial<User>, accessToken?: string): Promise<User | null> {
  try {
    // Ensure we have the updated timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const url = `${supabaseUrl}/rest/v1/users?id=eq.${id}`;
    
    // Add authorization token if provided
    const requestHeaders = {
      ...headers,
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
    };
    
    const response = await fetch(url, { 
      method: 'PATCH',
      headers: requestHeaders,
      body: JSON.stringify(updatedData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
    
    const updatedUser = await response.json();
    return updatedUser.length > 0 ? updatedUser[0] : null;
  } catch (error) {
    console.error(`Error updating user ${id} via REST API:`, error);
    return null;
  }
}

/**
 * Set user as admin
 */
export async function setUserAsAdmin(email: string, accessToken?: string): Promise<User | null> {
  try {
    // Add authorization token if provided
    const requestHeaders = {
      ...headers,
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
    };
    
    // First find the user
    const findUrl = `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}&limit=1`;
    const findResponse = await fetch(findUrl, { headers: requestHeaders });
    
    if (!findResponse.ok) {
      throw new Error(`Failed to find user: ${findResponse.statusText}`);
    }
    
    const users = await findResponse.json();
    if (users.length === 0) {
      throw new Error(`No user found with email: ${email}`);
    }
    
    const user = users[0];
    
    // Update the user's role to admin
    const updateUrl = `${supabaseUrl}/rest/v1/users?id=eq.${user.id}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: requestHeaders,
      body: JSON.stringify({ role: 'admin', is_admin: true, updated_at: new Date().toISOString() })
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Failed to update user role: ${updateResponse.statusText}`);
    }
    
    // Get the updated user
    const updatedUsers = await updateResponse.json();
    return updatedUsers.length > 0 ? updatedUsers[0] : null;
  } catch (error) {
    console.error('Error setting user as admin via REST API:', error);
    throw error;
  }
}

/**
 * Fetch games directly from the Supabase REST API
 */
export async function fetchGames(): Promise<Game[]> {
  try {
    const url = `${supabaseUrl}/rest/v1/games?select=*&order=created_at.desc`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.statusText}`);
    }
    
    const gamesData = await response.json();
    
    // Map the response to include alias fields
    return gamesData.map((game: any) => ({
      ...game,
      homeTeam: game.home_team,
      awayTeam: game.away_team
    }));
  } catch (error) {
    console.error('Error fetching games via REST API:', error);
    return [];
  }
}

/**
 * Fetch a single game by ID
 */
export async function fetchGameById(id: string): Promise<Game | null> {
  try {
    const url = `${supabaseUrl}/rest/v1/games?event_id=eq.${id}&limit=1`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch game: ${response.statusText}`);
    }
    
    const games = await response.json();
    if (games.length === 0) {
      return null;
    }
    
    const game = games[0];
    return {
      ...game,
      homeTeam: game.home_team,
      awayTeam: game.away_team
    };
  } catch (error) {
    console.error(`Error fetching game ${id} via REST API:`, error);
    return null;
  }
}

/**
 * Fetch tournaments directly from the Supabase REST API
 */
export async function fetchTournaments(): Promise<Tournament[]> {
  try {
    const url = `${supabaseUrl}/rest/v1/tournaments?select=*&order=created_at.desc`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch tournaments: ${response.statusText}`);
    }
    
    const tournaments = await response.json();
    
    // Map database fields to our interface
    return tournaments.map((tournament: any) => ({
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
      createdAt: tournament.created_at,
      updatedAt: tournament.updated_at,
      createdBy: tournament.created_by,
      participantCount: tournament.participant_count || 0
    }));
  } catch (error) {
    console.error('Error fetching tournaments via REST API:', error);
    return [];
  }
}

/**
 * Fetch a single tournament by ID with prize distribution
 */
export async function fetchTournamentById(id: string): Promise<any> {
  try {
    // Fetch tournament details
    const tournamentUrl = `${supabaseUrl}/rest/v1/tournaments?id=eq.${id}&limit=1`;
    const tournamentResponse = await fetch(tournamentUrl, { headers });
    if (!tournamentResponse.ok) {
      throw new Error(`Failed to fetch tournament: ${tournamentResponse.statusText}`);
    }
    
    const tournaments = await tournamentResponse.json();
    if (tournaments.length === 0) {
      return null;
    }
    
    const tournament = tournaments[0];
    
    // Fetch prize distribution
    const prizeUrl = `${supabaseUrl}/rest/v1/tournament_prize_distribution?tournament_id=eq.${id}&order=position.asc`;
    const prizeResponse = await fetch(prizeUrl, { headers });
    let prizeDistribution = [];
    
    if (prizeResponse.ok) {
      prizeDistribution = await prizeResponse.json();
    }
    
    // Fetch rounds
    const roundsUrl = `${supabaseUrl}/rest/v1/tournament_rounds?tournament_id=eq.${id}&order=round_number.asc`;
    const roundsResponse = await fetch(roundsUrl, { headers });
    let rounds = [];
    
    if (roundsResponse.ok) {
      rounds = await roundsResponse.json();
    }
    
    // Map tournament fields to our interface format
    return {
      ...tournament,
      prizePool: tournament.prize_pool,
      entryFee: tournament.entry_fee,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      maxParticipants: tournament.max_participants,
      isPublic: tournament.is_public,
      createdAt: tournament.created_at,
      updatedAt: tournament.updated_at,
      createdBy: tournament.created_by,
      participantCount: tournament.participant_count || 0,
      prize_distribution: prizeDistribution,
      rounds: rounds
    };
  } catch (error) {
    console.error(`Error fetching tournament ${id} via REST API:`, error);
    return null;
  }
}

/**
 * Create a tournament
 */
export async function createTournament(tournamentData: Partial<Tournament>): Promise<Tournament | null> {
  try {
    // Prepare data for database
    const dbTournament = {
      name: tournamentData.name,
      description: tournamentData.description,
      rules: tournamentData.rules,
      status: tournamentData.status || 'draft',
      prize_pool: tournamentData.prizePool,
      entry_fee: tournamentData.entryFee,
      start_date: tournamentData.startDate,
      end_date: tournamentData.endDate,
      max_participants: tournamentData.maxParticipants,
      is_public: tournamentData.isPublic,
      type: tournamentData.type,
      created_at: new Date().toISOString()
    };
    
    const url = `${supabaseUrl}/rest/v1/tournaments`;
    const response = await fetch(url, { 
      method: 'POST',
      headers,
      body: JSON.stringify(dbTournament)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create tournament: ${response.statusText}`);
    }
    
    const createdTournaments = await response.json();
    if (createdTournaments.length === 0) {
      return null;
    }
    
    const createdTournament = createdTournaments[0];
    
    // Map response to our interface format
    return {
      id: createdTournament.id,
      name: createdTournament.name,
      description: createdTournament.description,
      rules: createdTournament.rules,
      status: createdTournament.status,
      prizePool: createdTournament.prize_pool,
      entryFee: createdTournament.entry_fee,
      startDate: createdTournament.start_date,
      endDate: createdTournament.end_date,
      maxParticipants: createdTournament.max_participants,
      isPublic: createdTournament.is_public,
      type: createdTournament.type,
      createdAt: createdTournament.created_at,
      updatedAt: createdTournament.updated_at,
      createdBy: createdTournament.created_by,
      participantCount: 0
    };
  } catch (error) {
    console.error('Error creating tournament via REST API:', error);
    return null;
  }
}

/**
 * Update a tournament
 */
export async function updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | null> {
  try {
    // Prepare data for database
    const dbUpdates = {
      name: updates.name,
      description: updates.description,
      rules: updates.rules,
      status: updates.status,
      prize_pool: updates.prizePool,
      entry_fee: updates.entryFee,
      start_date: updates.startDate,
      end_date: updates.endDate,
      max_participants: updates.maxParticipants,
      is_public: updates.isPublic,
      type: updates.type,
      round_count: updates.roundCount,
      entry_deadline: updates.entryDeadline,
      round_type: updates.roundType,
      payout_type: updates.payoutType,
      updated_at: new Date().toISOString()
    };
    
    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => {
      if (dbUpdates[key as keyof typeof dbUpdates] === undefined) {
        delete dbUpdates[key as keyof typeof dbUpdates];
      }
    });
    
    const url = `${supabaseUrl}/rest/v1/tournaments?id=eq.${id}`;
    const response = await fetch(url, { 
      method: 'PATCH',
      headers,
      body: JSON.stringify(dbUpdates)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update tournament: ${response.statusText}`);
    }
    
    // Handle prize distribution updates if provided
    if (updates.prizeDistribution && updates.prizeDistribution.length > 0) {
      // Delete existing prize distribution
      const deleteUrl = `${supabaseUrl}/rest/v1/tournament_prize_distribution?tournament_id=eq.${id}`;
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers
      });
      
      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete existing prize distribution: ${deleteResponse.statusText}`);
      }
      
      // Insert updated prize distribution
      const prizeDistributionData = updates.prizeDistribution.map(tier => ({
        tournament_id: id,
        position: tier.position,
        percentage: tier.percentage,
        amount: tier.amount,
        recipient_id: tier.recipientId || null
      }));
      
      const insertUrl = `${supabaseUrl}/rest/v1/tournament_prize_distribution`;
      const insertResponse = await fetch(insertUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(prizeDistributionData)
      });
      
      if (!insertResponse.ok) {
        throw new Error(`Failed to update prize distribution: ${insertResponse.statusText}`);
      }
    }
    
    // Handle rounds updates if provided
    if (updates.rounds && updates.rounds.length > 0) {
      for (const round of updates.rounds) {
        if (round.id) {
          // Update existing round
          const roundUrl = `${supabaseUrl}/rest/v1/tournament_rounds?id=eq.${round.id}`;
          const roundResponse = await fetch(roundUrl, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              round_name: round.roundName,
              status: round.status || 'upcoming',
              start_date: round.startDate,
              end_date: round.endDate
            })
          });
          
          if (!roundResponse.ok) {
            throw new Error(`Failed to update tournament round: ${roundResponse.statusText}`);
          }
          
          // Update rules
          if (round.rules) {
            const rulesUrl = `${supabaseUrl}/rest/v1/tournament_round_rules?round_id=eq.${round.id}`;
            const rulesResponse = await fetch(rulesUrl, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({
                max_total_bets: round.rules.maxTotalBets,
                max_parlay_length: round.rules.maxParlayLength,
                minimum_risk: round.rules.minimumRisk,
                survivor_metric: round.rules.survivorMetric,
                survivor_type: round.rules.survivorType
              })
            });
            
            if (!rulesResponse.ok) {
              throw new Error(`Failed to update round rules: ${rulesResponse.statusText}`);
            }
          }
        } else {
          // Create new round
          const createRoundUrl = `${supabaseUrl}/rest/v1/tournament_rounds`;
          const createRoundResponse = await fetch(createRoundUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              tournament_id: id,
              round_number: round.roundNumber,
              round_name: round.roundName,
              status: 'upcoming',
              start_date: round.startDate || dbUpdates.start_date,
              end_date: round.endDate || dbUpdates.end_date
            })
          });
          
          if (!createRoundResponse.ok) {
            throw new Error(`Failed to create new tournament round: ${createRoundResponse.statusText}`);
          }
          
          const roundData = await createRoundResponse.json();
          const roundId = roundData[0].id;
          
          // Insert rules for this round
          const rulesUrl = `${supabaseUrl}/rest/v1/tournament_round_rules`;
          const rulesResponse = await fetch(rulesUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              round_id: roundId,
              max_total_bets: round.rules?.maxTotalBets,
              max_parlay_length: round.rules?.maxParlayLength,
              minimum_risk: round.rules?.minimumRisk,
              survivor_metric: round.rules?.survivorMetric,
              survivor_type: round.rules?.survivorType
            })
          });
          
          if (!rulesResponse.ok) {
            throw new Error(`Failed to create round rules: ${rulesResponse.statusText}`);
          }
        }
      }
    }
    
    // Fetch the updated tournament
    return await fetchTournamentById(id);
  } catch (error) {
    console.error(`Error updating tournament ${id} via REST API:`, error);
    return null;
  }
}

/**
 * Delete a tournament
 */
export async function deleteTournament(id: string): Promise<boolean> {
  try {
    // 1. Check if tournament exists
    const checkUrl = `${supabaseUrl}/rest/v1/tournaments?id=eq.${id}&limit=1`;
    const checkResponse = await fetch(checkUrl, { headers });
    
    if (!checkResponse.ok) {
      throw new Error(`Failed to check tournament existence: ${checkResponse.statusText}`);
    }
    
    const tournament = await checkResponse.json();
    if (tournament.length === 0) {
      throw new Error(`Tournament not found with id: ${id}`);
    }
    
    // 2. Delete prize distribution
    const prizeUrl = `${supabaseUrl}/rest/v1/tournament_prize_distribution?tournament_id=eq.${id}`;
    const prizeResponse = await fetch(prizeUrl, {
      method: 'DELETE',
      headers
    });
    
    if (!prizeResponse.ok) {
      throw new Error(`Failed to delete prize distribution: ${prizeResponse.statusText}`);
    }
    
    // 3. Get all rounds for this tournament
    const roundsUrl = `${supabaseUrl}/rest/v1/tournament_rounds?tournament_id=eq.${id}&select=id`;
    const roundsResponse = await fetch(roundsUrl, { headers });
    
    if (!roundsResponse.ok) {
      throw new Error(`Failed to get tournament rounds: ${roundsResponse.statusText}`);
    }
    
    const rounds = await roundsResponse.json();
    
    // 4. Delete rules for each round
    for (const round of rounds) {
      const rulesUrl = `${supabaseUrl}/rest/v1/tournament_round_rules?round_id=eq.${round.id}`;
      const rulesResponse = await fetch(rulesUrl, {
        method: 'DELETE',
        headers
      });
      
      if (!rulesResponse.ok) {
        throw new Error(`Failed to delete round rules: ${rulesResponse.statusText}`);
      }
    }
    
    // 5. Delete all rounds
    const deleteRoundsUrl = `${supabaseUrl}/rest/v1/tournament_rounds?tournament_id=eq.${id}`;
    const deleteRoundsResponse = await fetch(deleteRoundsUrl, {
      method: 'DELETE',
      headers
    });
    
    if (!deleteRoundsResponse.ok) {
      throw new Error(`Failed to delete tournament rounds: ${deleteRoundsResponse.statusText}`);
    }
    
    // 6. Delete participants
    const participantsUrl = `${supabaseUrl}/rest/v1/tournament_round_participants?tournament_id=eq.${id}`;
    const participantsResponse = await fetch(participantsUrl, {
      method: 'DELETE',
      headers
    });
    
    if (!participantsResponse.ok && !participantsResponse.statusText.includes('does not exist')) {
      throw new Error(`Failed to delete tournament participants: ${participantsResponse.statusText}`);
    }
    
    // 7. Finally, delete the tournament
    const tournamentUrl = `${supabaseUrl}/rest/v1/tournaments?id=eq.${id}`;
    const tournamentResponse = await fetch(tournamentUrl, {
      method: 'DELETE',
      headers
    });
    
    if (!tournamentResponse.ok) {
      throw new Error(`Failed to delete tournament: ${tournamentResponse.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting tournament ${id} via REST API:`, error);
    return false;
  }
}

/**
 * Fetch bets directly from the Supabase REST API
 */
export async function fetchBets(): Promise<Bet[]> {
  try {
    const url = `${supabaseUrl}/rest/v1/bets?select=*,users(id,username,email)&order=created_at.desc`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch bets: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching bets via REST API:', error);
    return [];
  }
}

/**
 * Fetch a single bet by ID
 */
export async function fetchBetById(id: string): Promise<Bet | null> {
  try {
    const url = `${supabaseUrl}/rest/v1/bets?id=eq.${id}&select=*,users(id,username,email)&limit=1`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch bet: ${response.statusText}`);
    }
    
    const bets = await response.json();
    return bets.length > 0 ? bets[0] : null;
  } catch (error) {
    console.error(`Error fetching bet ${id} via REST API:`, error);
    return null;
  }
}

// Function to test the direct API connection
export async function testDirectApiConnection(): Promise<boolean> {
  try {
    // Try to access users table
    const url = `${supabaseUrl}/rest/v1/users?select=id&limit=1`;
    const response = await fetch(url, { headers });
    return response.ok;
  } catch (error) {
    console.error('Error testing direct API connection:', error);
    return false;
  }
} 