"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, LogOut } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [stats, setStats] = useState({
    winnings: 0,
    tournamentsJoined: 0,
    betsPlaced: 0,
    hitRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?callbackUrl=/profile');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        // Fetch tournaments joined
        const { data: tournaments } = await fetch(`/api/users/${user.id}/tournaments`).then(res => res.json());
        // Fetch bets
        const { data: bets } = await fetch(`/api/users/${user.id}/bets`).then(res => res.json());
        // Calculate stats
        const uniqueTournaments = new Set(tournaments?.map((t: any) => t.tournament_id) || []);
        let totalWinnings = 0;
        let wonBets = 0;
        bets?.forEach((bet: any) => {
          if (bet.status === 'won') {
            totalWinnings += bet.net_amount;
            wonBets++;
          } else if (bet.status === 'lost') {
            totalWinnings -= bet.risk;
          }
        });
        const settledBets = bets?.filter((bet: any) => bet.status === 'won' || bet.status === 'lost') || [];
        const hitRate = settledBets.length > 0 ? (wonBets / settledBets.length) * 100 : 0;
        setStats({
          winnings: totalWinnings,
          tournamentsJoined: uniqueTournaments.size,
          betsPlaced: bets?.length || 0,
          hitRate,
        });
      } finally {
        setIsLoading(false);
      }
    }
    if (user?.id) fetchStats();
  }, [user]);

  if (authLoading || profileLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const avatarUrl = profile?.avatar_url ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop';
  const username = profile?.username || user?.username || 'User';
  const bio = profile?.bio || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <div className="relative">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-md"
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-white text-center">{username}</h2>
        {bio && <p className="mt-2 text-gray-400 text-center max-w-xs">{bio}</p>}
        <div className="flex gap-4 mt-6 w-full justify-center flex-wrap">
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-6 py-4 min-w-[120px]">
            <span className="text-lg font-semibold text-purple-400">{stats.winnings > 0 ? '+' : ''}{stats.winnings} BBZ</span>
            <span className="text-xs text-gray-400 mt-1">Winnings</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-6 py-4 min-w-[120px]">
            <span className="text-lg font-semibold text-purple-400">{stats.tournamentsJoined}</span>
            <span className="text-xs text-gray-400 mt-1">Tournaments</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-6 py-4 min-w-[120px]">
            <span className="text-lg font-semibold text-purple-400">{stats.betsPlaced}</span>
            <span className="text-xs text-gray-400 mt-1">Bets Placed</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-6 py-4 min-w-[120px]">
            <span className="text-lg font-semibold text-purple-400">{Math.round(stats.hitRate)}%</span>
            <span className="text-xs text-gray-400 mt-1">Hit Rate</span>
          </div>
        </div>
        <div className="flex gap-4 mt-8 w-full justify-center">
          <button
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            onClick={() => router.push('/edit-profile')}
          >
            <Edit size={18} /> Edit Profile
          </button>
          <button
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg transition"
            onClick={signOut}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
} 