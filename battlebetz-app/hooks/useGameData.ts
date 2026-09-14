import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

// Define types for our game data
export interface Team {
  name: string;
  image: string;
  score?: number;
}

export interface TeamOdds {
  spread: string;
  spreadOdds: number; // New field for the actual odds value
  moneyline: string;
  moneylineOdds: number; // New field for the actual odds value
  total: string;
  totalOdds: number; // New field for the actual odds value
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
  description: number;
  odds: number;
  points?: number;
  created_at: string;
  event_time: string;
  updated_at: number;
  sport: string;
}

interface UseGamesDataProps {
  futureOnly?: boolean;
}

export const useGamesData = ({ futureOnly = false }: UseGamesDataProps = {}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        
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
          const groupedByEvent = data.reduce((acc, row: OddsRow) => {
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
            const team1Info = h2hOdds.find(odd => odd.name === t1name);
            const team2Info = h2hOdds.find(odd => odd.name === t2name);
            
            if (!team1Info || !team2Info) continue; // Skip if we can't identify the teams
            
            // Find spread info
            const team1Spread = spreadOdds.find(odd => odd.name === t1name);
            const team2Spread = spreadOdds.find(odd => odd.name === t2name);
            
            // Find total info - first look for over/under names, then fall back to any total odds
            let overTotal = totalOdds.find(odd => odd.name.toLowerCase() === 'over');
            let underTotal = totalOdds.find(odd => odd.name.toLowerCase() === 'under');
            
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
                // Format odds according to expected format and include actual odds value
                spread: team2Spread ? (team2Spread.points > 0 ? `+${team2Spread.points}` : `${team2Spread.points}`) : 'N/A',
                spreadOdds: team2Spread ? team2Spread.odds : defaultOdds,
                moneyline: `${team2Info.odds > 0 ? '+' : ''}${team2Info.odds}`,
                moneylineOdds: team2Info.odds,
                total: `o/u ${totalPoints}`, // Always provide a total value
                totalOdds: underTotal ? underTotal.odds : defaultOdds
              },
              status,
              ...(status === 'UPCOMING' && { time: formattedTime }),
              // Mark some games as featured (for example, first 2 games)
              featured: Math.random() > 0.7, // 30% chance of being featured
              eventTime: team1Info.event_time,
              sport: team1Info.sport
            };
            
            transformedData.push(game);
          }
          
          // Sort games: featured first, then by event time
          const sortedGames = transformedData.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            
            // If both have same featured status, sort by time
            const timeA = a.eventTime || '';
            const timeB = b.eventTime || '';
            return timeA.localeCompare(timeB);
          });
          
          setGames(sortedGames);
        } else {
          // If no data, set empty array
          setGames([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

  }, [futureOnly]);

  return { games, loading, error };
};