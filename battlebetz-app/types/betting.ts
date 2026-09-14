// Betting types
export type BetType = 'spread' | 'total' | 'moneyline';
export type TeamType = 'team1' | 'team2';

export interface BetSelection {
  id: string;
  team: TeamType;
  teamName: string;
  matchup: string;
  odds: number;
  betType: BetType;
  oddsDisplay: string;
  subName?: string; // For overrides like "over" or "under"
  sport?: string; // Add sport field
}

export interface PendingBet extends BetSelection {
  amount: number;
}