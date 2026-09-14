'use client';

import { SessionProvider } from 'next-auth/react';
import { SupabaseProvider } from './supabase-auth-provider';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </SessionProvider>
  );
} 