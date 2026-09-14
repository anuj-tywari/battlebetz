import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

/**
 * Client-side function to check if user is authenticated
 * Will redirect to login if not authenticated
 */
export async function requireAuth(redirectTo = '/login') {
  const session = await getSession();
  
  if (!session) {
    redirect(redirectTo);
    return null;
  }
  
  return session;
}

/**
 * Check if a user is authenticated (no redirect)
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
} 