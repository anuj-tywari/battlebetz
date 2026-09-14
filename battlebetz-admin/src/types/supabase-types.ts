export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bets: {
        Row: {
          id: string
          user_id: string
          tournament_id: string | null
          net_amount: number
          odds: number
          potential_payout: number
          prediction: string | null
          status: 'pending' | 'won' | 'lost' | 'cancelled'
          created_at: string
          updated_at: string
          risk: number
          bet_type_id: number
          tournament_round: string | null
        }
        Insert: {
          id?: string
          user_id: string
          tournament_id?: string | null
          net_amount: number
          odds: number
          potential_payout: number
          prediction?: string | null
          status: 'pending' | 'won' | 'lost' | 'cancelled'
          created_at?: string
          updated_at?: string
          risk: number
          bet_type_id: number
          tournament_round?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          tournament_id?: string | null
          net_amount?: number
          odds?: number
          potential_payout?: number
          prediction?: string | null
          status?: 'pending' | 'won' | 'lost' | 'cancelled'
          created_at?: string
          updated_at?: string
          risk?: number
          bet_type_id?: number
          tournament_round?: string | null
        }
      }
      games: {
        Row: {
          event_id: number
          sport: string | null
          start_time: string | null
          status: string | null
          home_team: string | null
          away_team: string | null
          created_at: string
          updated_at: string | null
          home_team_id: number | null
          away_team_id: number | null
          bet_status: string
        }
        Insert: {
          event_id: number
          sport?: string | null
          start_time?: string | null
          status?: string | null
          home_team?: string | null
          away_team?: string | null
          created_at?: string
          updated_at?: string | null
          home_team_id?: number | null
          away_team_id?: number | null
          bet_status?: string
        }
        Update: {
          event_id?: number
          sport?: string | null
          start_time?: string | null
          status?: string | null
          home_team?: string | null
          away_team?: string | null
          created_at?: string
          updated_at?: string | null
          home_team_id?: number | null
          away_team_id?: number | null
          bet_status?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          status: string | null
          type: string | null
          name: string | null
          prize_pool: number | null
          entry_fee: number | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string | null
          is_public: boolean | null
          max_participants: number | null
          round_count: number | null
          entry_deadline: string | null
          round_type: string | null
          payout_type: string | null
          description: string | null
          rules: string | null
        }
        Insert: {
          id?: string
          status?: string | null
          type?: string | null
          name?: string | null
          prize_pool?: number | null
          entry_fee?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string | null
          is_public?: boolean | null
          max_participants?: number | null
          round_count?: number | null
          entry_deadline?: string | null
          round_type?: string | null
          payout_type?: string | null
          description?: string | null
          rules?: string | null
        }
        Update: {
          id?: string
          status?: string | null
          type?: string | null
          name?: string | null
          prize_pool?: number | null
          entry_fee?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string | null
          is_public?: boolean | null
          max_participants?: number | null
          round_count?: number | null
          entry_deadline?: string | null
          round_type?: string | null
          payout_type?: string | null
          description?: string | null
          rules?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string
          role: string | null
          promo_code: string | null
          created_at: string
          updated_at: string
          is_admin: boolean | null
          bbz_balance: number | null
          bbzt_balance: number | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          location: string | null
          notifications_enabled: boolean | null
          private_profile: boolean | null
          show_winnings: boolean | null
          show_battle_history: boolean | null
          referred_by: string | null
          referral_count: number | null
          referral_earnings: number | null
        }
        Insert: {
          id?: string
          email: string
          username: string
          role?: string | null
          promo_code?: string | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean | null
          bbz_balance?: number | null
          bbzt_balance?: number | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
          notifications_enabled?: boolean | null
          private_profile?: boolean | null
          show_winnings?: boolean | null
          show_battle_history?: boolean | null
          referred_by?: string | null
          referral_count?: number | null
          referral_earnings?: number | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          role?: string | null
          promo_code?: string | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean | null
          bbz_balance?: number | null
          bbzt_balance?: number | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
          notifications_enabled?: boolean | null
          private_profile?: boolean | null
          show_winnings?: boolean | null
          show_battle_history?: boolean | null
          referred_by?: string | null
          referral_count?: number | null
          referral_earnings?: number | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number | null
          type: 'deposit' | 'withdrawal' | 'bet_placed' | 'winning' | null
          status: 'pending' | 'completed' | 'failed' | null
          reference_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount?: number | null
          type?: 'deposit' | 'withdrawal' | 'bet_placed' | 'winning' | null
          status?: 'pending' | 'completed' | 'failed' | null
          reference_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number | null
          type?: 'deposit' | 'withdrawal' | 'bet_placed' | 'winning' | null
          status?: 'pending' | 'completed' | 'failed' | null
          reference_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 