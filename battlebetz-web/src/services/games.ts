import { supabase } from '@/lib/supabase';

// Define types for our game data
export interface Team {
  name: string;
  image: string;
  score?: number;
}

export interface TeamOdds {
  spread: string;
  spreadOdds: number;
  moneyline: string;
  moneylineOdds: number;
  total: string;
  totalOdds: number;
}

export interface Game {
  id: string;
  teams: {
    team1: Team;
    team2: Team;
  };
  team1Odds: TeamOdds;
  team2Odds: TeamOdds;
  status: 'UPCOMING' | 'LIVE' | 'FINAL';
  time?: string;
  featured?: boolean;
  eventTime?: string;
  sport?: string;
}

interface OddsRow {
  event_id: string;
  type: string;
  name: string;
  description: string;
  odds: number | null;
  points?: number | null;
  created_at: string;
  event_time: string | null;
  updated_at: string | null;
  sport: string | null;
  status: string;
}

interface UseGamesDataProps {
  futureOnly?: boolean;
}

export const getGamesData = async ({ futureOnly = false }: UseGamesDataProps = {}) => {
  try {
    // Get today's date in ISO format (YYYY-MM-DD)
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 7); 
    const todayStr = now.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Get current time in ISO format for future filtering
    const currentTime = now.toISOString();

    // Prepare query
    let query = supabase
      .from('odds')
      .select('*')
      .in('type', ['moneyline', 'spread', 'total']);
    
    if (futureOnly) {
      // Only get games that haven't started yet
      query = query.gt('event_time', currentTime);
    } else {
      // Get games for next 7 days
      query = query
        .gte('event_time', `${todayStr}T00:00:00`)
        .lt('event_time', `${endDateStr}T23:59:59`);
    }
    
    // Execute query with ordering
    const { data, error } = await query.order('event_time', { ascending: true });
    
    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Group the odds by event_id
      const groupedByEvent = data.reduce((acc: any, row: OddsRow) => {
        if (!acc[row.event_id]) {
          acc[row.event_id] = {
            moneyline: [],
            spread: [],
            total: []
          };
        }
        
        // Add to the appropriate type group
        acc[row.event_id][row.type].push(row);
        
        return acc;
      }, {});
      
      // Transform the grouped data to match our Game interface
      const transformedData: Game[] = [];
      
      for (const eventId in groupedByEvent) {
        const eventData = groupedByEvent[eventId];
        const h2hOdds = eventData.moneyline || [];
        const spreadOdds = eventData.spread || [];
        const totalOdds = eventData.total || [];

        if (h2hOdds.length < 2) continue; // Skip if we don't have odds for both teams
        
        const t1name = h2hOdds[0].name;
        const t2name = h2hOdds[1].name;
        
        // Find team info from the h2h odds (usually contains team names)
        const team1Info = h2hOdds.find((odd: any) => odd.name === t1name);
        const team2Info = h2hOdds.find((odd: any) => odd.name === t2name);
        
        if (!team1Info || !team2Info) continue; // Skip if we can't identify the teams
        
        // Find spread info
        const team1Spread = spreadOdds.find((odd: any) => odd.name === t1name);
        const team2Spread = spreadOdds.find((odd: any) => odd.name === t2name);
        
        // Find total info - first look for over/under names, then fall back to any total odds
        let overTotal = totalOdds.find((odd: any) => odd.name.toLowerCase() === 'over');
        let underTotal = totalOdds.find((odd: any) => odd.name.toLowerCase() === 'under');
        
        // If we don't have explicit over/under, just use the first and second total odds
        if (!overTotal && !underTotal && totalOdds.length >= 2) {
          overTotal = totalOdds[0];
          underTotal = totalOdds[1];
        } else if (!overTotal && totalOdds.length >= 1) {
          // If we have at least one total odds record, use it for both
          overTotal = totalOdds[0];
          underTotal = totalOdds[0];
        }
        
        // Determine game status based on current time vs event_time
        const eventTime = new Date(team1Info.event_time);
        let status: 'UPCOMING' | 'LIVE' | 'FINAL' = 'UPCOMING';
        
        if (now > eventTime) {
          // If the event has started more than 3 hours ago, mark as FINAL
          // Otherwise, mark as LIVE
          const hoursElapsed = (now.getTime() - eventTime.getTime()) / (1000 * 60 * 60);
          status = hoursElapsed > 3 ? 'FINAL' : 'LIVE';
        }
        
        // Format time for display
        const formattedTime = eventTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) + ' EST';
        
        // Get the total points (should be the same for both over and under)
        // Default to placeholder value of 220 if not found
        const totalPoints = (overTotal?.points || underTotal?.points) ?? 220;
        
        // Default odds if not found
        const defaultOdds = -110;
        
        // Create game object with the updated odds structure
        const game: Game = {
          id: eventId,
          teams: {
            team1: {
              name: team1Info.name,
              // Use placeholder images for now
              image: `https://ui-avatars.com/api/?name=${encodeURIComponent(team1Info.name)}&background=random`,
              // Add scores for completed games (would need to come from a different table in reality)
              ...(status === 'FINAL' && { score: Math.floor(Math.random() * 50) + 50 })
            },
            team2: {
              name: team2Info.name,
              image: `https://ui-avatars.com/api/?name=${encodeURIComponent(team2Info.name)}&background=random`,
              ...(status === 'FINAL' && { score: Math.floor(Math.random() * 50) + 50 })
            }
          },
          team1Odds: {
            // Format odds according to expected format and include actual odds value
            spread: team1Spread ? (team1Spread.points > 0 ? `+${team1Spread.points}` : `${team1Spread.points}`) : 'N/A',
            spreadOdds: team1Spread ? team1Spread.odds : defaultOdds,
            moneyline: `${team1Info.odds > 0 ? '+' : ''}${team1Info.odds}`,
            moneylineOdds: team1Info.odds,
            total: `o/u ${totalPoints}`, // Always provide a total value
            totalOdds: overTotal ? overTotal.odds : defaultOdds
          },
          team2Odds: {
            spread: team2Spread ? (team2Spread.points > 0 ? `+${team2Spread.points}` : `${team2Spread.points}`) : 'N/A',
            spreadOdds: team2Spread ? team2Spread.odds : defaultOdds,
            moneyline: `${team2Info.odds > 0 ? '+' : ''}${team2Info.odds}`,
            moneylineOdds: team2Info.odds,
            total: `o/u ${totalPoints}`,
            totalOdds: underTotal ? underTotal.odds : defaultOdds
          },
          status,
          time: formattedTime,
          eventTime: team1Info.event_time,
          sport: team1Info.sport,
          featured: Math.random() > 0.7 // Randomly mark some games as featured
        };
        
        transformedData.push(game);
      }
      
      return transformedData;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching games data:', error);
    throw error;
  }
};

/**
 * Get today's games
 */
export const getTodaysGames = async () => {
  return getGamesData({ futureOnly: false });
};

/**
 * Get upcoming games only
 */
export const getUpcomingGames = async () => {
  return getGamesData({ futureOnly: true });
};

/**
 * Get games by tournament (for backward compatibility)
 */
export const getGamesByTournament = async (tournamentId: string) => {
  try {
    // For now, just return all games since we don't have tournament-specific games
    // In a real implementation, you'd filter by tournament_id
    const games = await getGamesData({ futureOnly: false });
    return { data: games, error: null };
  } catch (error) {
    console.error('Error fetching games by tournament:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch games' };
  }
};

 