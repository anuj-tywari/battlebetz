import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';

interface TournamentsLayoutProps {
  children: ReactNode;
}

export default async function TournamentsLayout({ children }: TournamentsLayoutProps) {
  // Check authentication - redirect to arena if not authenticated
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // Redirect unauthenticated users to the arena page
    redirect('/arena');
  }
  
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Common tournament header and navigation can be added here if needed */}
      {children}
    </main>
  );
} 