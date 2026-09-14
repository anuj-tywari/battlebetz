import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

interface TournamentLayoutProps {
  children: ReactNode;
  params: { id: string };
}

export default async function TournamentLayout({ children, params }: TournamentLayoutProps) {
  // Get session but don't redirect if not authenticated
  // Public users can view tournament details (join and betting actions will be protected separately)
  const session = await getServerSession(authOptions);
  
  return <>{children}</>;
} 