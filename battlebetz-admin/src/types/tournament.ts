export interface Tournament {
  id: string;
  name: string | null;
  description: string | null;
  rules: string | null;
  status: 'draft' | 'active' | 'upcoming' | 'completed' | 'cancelled' | string;
  prizePool: number | null;
  entryFee: number | null;
  startDate: string | null;
  endDate: string | null;
  maxParticipants: number | null;
  isPublic: boolean | null;
  type: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  participantCount: number | null;
  roundCount?: number | null;
  entryDeadline?: string | null;
  roundType?: string | null;
  payoutType?: string | null;
  prizeDistribution?: TournamentPrize[];
  rounds?: TournamentRound[];
}

export interface TournamentRound {
  id?: string;
  tournamentId: string;
  roundNumber: number;
  roundName?: string;
  startDate: string | null;
  endDate: string | null;
  status?: 'upcoming' | 'active' | 'completed' | string;
  rules?: {
    maxTotalBets?: number | null;
    maxParlayLength?: number | null;
    minimumRisk?: number | null;
    survivorMetric?: string | null;
    survivorType?: 'roi' | 'tokens' | 'wins' | string;
  };
}

export interface TournamentPrize {
  id?: string;
  tournamentId?: string;
  position: number;
  percentage?: number | null;
  amount?: number | null;
  recipientId?: string | null;
  payoutType?: 'fixed' | 'percentage';
}

export const DEFAULT_TOURNAMENT: Tournament = {
  id: '',
  name: '',
  description: '',
  rules: '',
  status: 'draft',
  prizePool: 0,
  entryFee: 0,
  startDate: null,
  endDate: null,
  maxParticipants: null,
  isPublic: true,
  type: null,
  createdAt: new Date().toISOString(),
  updatedAt: null,
  createdBy: null,
  participantCount: 0,
  roundCount: 1,
  roundType: 'elimination',
  payoutType: 'percentage'
};
