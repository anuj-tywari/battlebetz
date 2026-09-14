export interface Game {
  event_id: number;
  sport: string | null;
  start_time: string | null;
  status: string | null;
  home_team: string | null;
  away_team: string | null;
  created_at: string;
  updated_at: string | null;
  home_team_id: number | null;
  away_team_id: number | null;
  bet_status: string;
  
  // Aliases for convenience when using different naming conventions
  homeTeam?: string | null;
  awayTeam?: string | null;
}
