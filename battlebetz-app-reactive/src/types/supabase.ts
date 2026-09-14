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
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          role: Database['public']['Enums']['user_role'];
          promo_code: string | null;
          created_at: string;
          updated_at: string;
          is_admin: boolean | null;
          bbz_balance: number | null;
          bbzt_balance: number | null;
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          location: string | null;
          notifications_enabled: boolean | null;
          private_profile: boolean | null;
          show_winnings: boolean | null;
          show_battle_history: boolean | null;
          referred_by: string | null;
          referral_count: number | null;
          referral_earnings: number | null;
          status: boolean | null;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          role?: Database['public']['Enums']['user_role'];
          promo_code?: string | null;
          created_at?: string;
          updated_at?: string;
          is_admin?: boolean | null;
          bbz_balance?: number | null;
          bbzt_balance?: number | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          notifications_enabled?: boolean | null;
          private_profile?: boolean | null;
          show_winnings?: boolean | null;
          show_battle_history?: boolean | null;
          referred_by?: string | null;
          referral_count?: number | null;
          referral_earnings?: number | null;
          status?: boolean | null;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          role?: Database['public']['Enums']['user_role'];
          promo_code?: string | null;
          created_at?: string;
          updated_at?: string;
          is_admin?: boolean | null;
          bbz_balance?: number | null;
          bbzt_balance?: number | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          notifications_enabled?: boolean | null;
          private_profile?: boolean | null;
          show_winnings?: boolean | null;
          show_battle_history?: boolean | null;
          referred_by?: string | null;
          referral_count?: number | null;
          referral_earnings?: number | null;
          status?: boolean | null;
        };
        Relationships: [];
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_metric: {
        Row: {
          id: number;
          user_id: string;
          battle_count: number | null;
          battle_won_count: number | null;
          battle_lost_count: number | null;
          following_count: number | null;
          friend_count: number | null;
          bbz_balance: number | null;
          usd_balance: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          battle_count?: number | null;
          battle_won_count?: number | null;
          battle_lost_count?: number | null;
          following_count?: number | null;
          friend_count?: number | null;
          bbz_balance?: number | null;
          usd_balance?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          battle_count?: number | null;
          battle_won_count?: number | null;
          battle_lost_count?: number | null;
          following_count?: number | null;
          friend_count?: number | null;
          bbz_balance?: number | null;
          usd_balance?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_metric_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      bets: {
        Row: {
          id: string;
          user_id: string;
          tournament_id: string | null;
          net_amount: number;
          odds: number;
          potential_payout: number;
          prediction: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          risk: number;
          bet_type_id: number;
          tournament_round: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          tournament_id?: string | null;
          net_amount: number;
          odds: number;
          potential_payout: number;
          prediction?: string | null;
          status: string;
          created_at?: string;
          updated_at?: string;
          risk: number;
          bet_type_id: number;
          tournament_round?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          tournament_id?: string | null;
          net_amount?: number;
          odds?: number;
          potential_payout?: number;
          prediction?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          risk?: number;
          bet_type_id?: number;
          tournament_round?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bets_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bets_tournament_id_fkey";
            columns: ["tournament_id"];
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          }
        ];
      };
      tournaments: {
        Row: {
          id: string;
          status: string | null;
          type: string | null;
          name: string | null;
          prize_pool: number | null;
          entry_fee: number | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string | null;
          is_public: boolean | null;
          max_participants: number | null;
          round_count: number | null;
          entry_deadline: string | null;
          round_type: string | null;
          payout_type: string | null;
          description: string | null;
          rules: string | null;
        };
        Insert: {
          id?: string;
          status?: string | null;
          type?: string | null;
          name?: string | null;
          prize_pool?: number | null;
          entry_fee?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string | null;
          is_public?: boolean | null;
          max_participants?: number | null;
          round_count?: number | null;
          entry_deadline?: string | null;
          round_type?: string | null;
          payout_type?: string | null;
          description?: string | null;
          rules?: string | null;
        };
        Update: {
          id?: string;
          status?: string | null;
          type?: string | null;
          name?: string | null;
          prize_pool?: number | null;
          entry_fee?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string | null;
          is_public?: boolean | null;
          max_participants?: number | null;
          round_count?: number | null;
          entry_deadline?: string | null;
          round_type?: string | null;
          payout_type?: string | null;
          description?: string | null;
          rules?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string;
          home_team: string;
          away_team: string;
          start_time: string;
          status: string;
          home_score: number | null;
          away_score: number | null;
          created_at: string;
          updated_at: string | null;
          round_id: string | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          home_team: string;
          away_team: string;
          start_time: string;
          status: string;
          home_score?: number | null;
          away_score?: number | null;
          created_at?: string;
          updated_at?: string | null;
          round_id?: string | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          home_team?: string;
          away_team?: string;
          start_time?: string;
          status?: string;
          home_score?: number | null;
          away_score?: number | null;
          created_at?: string;
          updated_at?: string | null;
          round_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "matches_tournament_id_fkey";
            columns: ["tournament_id"];
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_round_id_fkey";
            columns: ["round_id"];
            referencedRelation: "tournament_rounds";
            referencedColumns: ["id"];
          }
        ];
      };
      tournament_rounds: {
        Row: {
          id: string;
          tournament_id: string;
          round_name: string;
          participant_count: number;
          status: string;
          start_date: string;
          end_date: string;
          updated_at: string | null;
          created_at: string;
          round_number: number | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          round_name: string;
          participant_count?: number;
          status?: string;
          start_date: string;
          end_date: string;
          updated_at?: string | null;
          created_at?: string;
          round_number?: number | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          round_name?: string;
          participant_count?: number;
          status?: string;
          start_date?: string;
          end_date?: string;
          updated_at?: string | null;
          created_at?: string;
          round_number?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "tournament_rounds_tournament_id_fkey";
            columns: ["tournament_id"];
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          }
        ];
      };
      tournament_round_participants: {
        Row: {
          id: string;
          tournament_id: string;
          user_id: string;
          joined_at: string;
          token_balance: number;
          created_at: string;
          updated_at: string;
          round_id: string | null;
          rank: number | null;
          status: string | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          user_id: string;
          joined_at?: string;
          token_balance?: number;
          created_at?: string;
          updated_at?: string;
          round_id?: string | null;
          rank?: number | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          user_id?: string;
          joined_at?: string;
          token_balance?: number;
          created_at?: string;
          updated_at?: string;
          round_id?: string | null;
          rank?: number | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tournament_round_participants_tournament_id_fkey";
            columns: ["tournament_id"];
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tournament_round_participants_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tournament_round_participants_round_id_fkey";
            columns: ["round_id"];
            referencedRelation: "tournament_rounds";
            referencedColumns: ["id"];
          }
        ];
      };
      games: {
        Row: {
          event_id: number;
          sport: string | null;
          start_time: string | null;
          status: string | null;
          home_team: string | null;
          away_team: string | null;
          home_score: number | null;
          away_score: number | null;
          created_at: string;
          updated_at: string | null;
          home_team_id: number | null;
          away_team_id: number | null;
          bet_status: string;
        };
        Insert: {
          event_id: number;
          sport?: string | null;
          start_time?: string | null;
          status?: string | null;
          home_team?: string | null;
          away_team?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          created_at?: string;
          updated_at?: string | null;
          home_team_id?: number | null;
          away_team_id?: number | null;
          bet_status?: string;
        };
        Update: {
          event_id?: number;
          sport?: string | null;
          start_time?: string | null;
          status?: string | null;
          home_team?: string | null;
          away_team?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          created_at?: string;
          updated_at?: string | null;
          home_team_id?: number | null;
          away_team_id?: number | null;
          bet_status?: string;
        };
        Relationships: [];
      };
      odds: {
        Row: {
          event_id: string;
          type: string;
          name: string;
          description: string;
          odds: number | null;
          points: number | null;
          created_at: string;
          event_time: string | null;
          updated_at: string | null;
          sport: string | null;
          status: string;
        };
        Insert: {
          event_id: string;
          type: string;
          name: string;
          description: string;
          odds?: number | null;
          points?: number | null;
          created_at?: string;
          event_time?: string | null;
          updated_at?: string | null;
          sport?: string | null;
          status?: string;
        };
        Update: {
          event_id?: string;
          type?: string;
          name?: string;
          description?: string;
          odds?: number | null;
          points?: number | null;
          created_at?: string;
          event_time?: string | null;
          updated_at?: string | null;
          sport?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          content: string;
          is_read: boolean;
          created_at: string;
          updated_at: string | null;
          link: string | null;
          metadata: JSON | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string | null;
          link?: string | null;
          metadata?: JSON | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string | null;
          link?: string | null;
          metadata?: JSON | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number | null;
          type: string | null;
          status: string | null;
          reference_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount?: number | null;
          type?: string | null;
          status?: string | null;
          reference_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number | null;
          type?: string | null;
          status?: string | null;
          reference_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          category: Database['public']['Enums']['news_category'];
          published: boolean;
          created_at: string;
          updated_at: string;
          image_url: string | null;
          slug: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id: string;
          category: Database['public']['Enums']['news_category'];
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          image_url?: string | null;
          slug?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_id?: string;
          category?: Database['public']['Enums']['news_category'];
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          image_url?: string | null;
          slug?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    }
    Views: {
      [_ in never]: never;
    }
    Functions: {
      [_ in never]: never;
    }
    Enums: {
      user_role: 'USER' | 'ADMIN';
      bet_status: 'PENDING' | 'WON' | 'LOST' | 'CANCELLED';
      tournament_status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
      news_category: 'GENERAL' | 'TOURNAMENT' | 'MATCH' | 'PROMOTION';
      sport_category: 'FOOTBALL' | 'BASKETBALL' | 'BASEBALL' | 'HOCKEY' | 'SOCCER' | 'ESPORTS' | 'OTHER';
    }
    CompositeTypes: {
      [_ in never]: never;
    }
  }
} 