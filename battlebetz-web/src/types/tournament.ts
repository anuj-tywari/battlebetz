export interface Tournament {
  id: string;
  name: string;
  description?: string | null;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'upcoming' | 'active' | 'completed' | 'cancelled' | string;
  prize_pool: number | null;
  entry_fee: number | null;
  start_date: string | null;
  end_date: string | null;
  entry_deadline?: string | null;
  max_participants?: number | null;
  type?: string | null;
  is_public?: boolean | null;
  participant_count?: number;
  is_user_participating?: boolean;
  category?: string;
  image_url?: string;
  created_at?: string;
}

export interface TournamentParticipation {
  id: string;
  tournament_id: string;
  user_id: string;
  round_id?: string | null;
  joined_at: string;
  token_balance: number;
  rank?: number | null;
  status?: 'active' | 'eliminated' | 'completed' | string | null;
  tournament?: Tournament;
  round?: {
    id: string;
    tournament_id: string;
    round_name: string;
    start_date: string;
    end_date: string;
    status: string;
    participant_count: number;
  } | null;
}

export interface TournamentStats {
  totalTournaments: number;
  activeTournaments: number;
  totalParticipants: number;
  totalPrizePool: number;
}

export type UserTournament = TournamentParticipation; 