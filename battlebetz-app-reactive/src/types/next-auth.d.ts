import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User as SupabaseUser } from '@supabase/supabase-js';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      bbz_balance?: number;
      username?: string;
      status?: boolean;
    } & DefaultSession['user'];
  }

  interface User extends SupabaseUser {
    id: string;
    name: string;
    email: string;
    role: string;
    bbz_balance?: number;
    username?: string;
    status?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
    bbz_balance?: number;
    username?: string;
    status?: boolean;
  }
} 