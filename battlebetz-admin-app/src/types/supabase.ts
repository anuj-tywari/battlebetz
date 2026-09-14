// types/supabase.ts
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
          id: string
          email: string
          name: string
          phone: string | null
          status: 'active' | 'inactive'
          balance: number
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          status?: 'active' | 'inactive'
          balance?: number
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          status?: 'active' | 'inactive'
          balance?: number
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          status: 'active' | 'inactive' | 'maintenance'
          game_type: string
          min_bet: number
          max_bet: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          status?: 'active' | 'inactive' | 'maintenance'
          game_type: string
          min_bet?: number
          max_bet?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          status?: 'active' | 'inactive' | 'maintenance'
          game_type?: string
          min_bet?: number
          max_bet?: number
          created_at?: string
          updated_at?: string
        }
      }
      bets: {
        Row: {
          id: string
          user_id: string
          game_id: string
          amount: number
          outcome: 'win' | 'loss' | 'pending'
          profit_loss: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          amount: number
          outcome?: 'win' | 'loss' | 'pending'
          profit_loss?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          amount?: number
          outcome?: 'win' | 'loss' | 'pending'
          profit_loss?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus'
          amount: number
          status: 'pending' | 'completed' | 'failed'
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus'
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus'
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
