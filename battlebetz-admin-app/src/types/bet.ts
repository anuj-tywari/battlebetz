export interface Bet {
  id: string;
  user_id: string;
  tournament_id?: string | null;
  round_id?: string | null;
  amount: number;
  outcome: 'win' | 'loss' | 'pending';
  profit_loss: number;
  created_at: string;
  updated_at: string;
  users?: { id: string; name: string; email: string };
  tournaments?: { id: string; name: string };
}
