export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: string | null;
  created_at: string;
  updated_at: string;
  users?: { id: string; name: string; email: string };
}
