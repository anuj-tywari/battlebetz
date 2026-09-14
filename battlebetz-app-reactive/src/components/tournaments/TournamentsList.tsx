"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, RefreshCw, Trophy, Lock } from 'lucide-react';
import { Database } from '@/types/supabase';
import TournamentCard from './TournamentCard';
import { useAllTournaments } from '@/hooks/useTournaments';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { joinTournament as joinTournamentService } from '@/services/tournaments';

interface TournamentsListProps {
  initialTournaments?: any[];
  showFilters?: boolean;
  requireAuth?: boolean;
}

export default function TournamentsList({ 
  initialTournaments = [], 
  showFilters = true,
  requireAuth = false
}: TournamentsListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    tournaments, 
    loading, 
    error
  } = useAllTournaments();
  
  const [statusFilter, setStatusFilter] = useState<Database['public']['Enums']['tournament_status'] | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<Database['public']['Enums']['sport_category'] | ''>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleJoinTournament = async (tournamentId: string) => {
    if (!user) {
      router.push(`/login?redirectTo=/tournaments/${tournamentId}`);
      return false;
    }
    
    const result = await joinTournamentService(tournamentId, user.id);
    return result.success;
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setCategoryFilter('');
  };

  const displayedTournaments = initialTournaments.length > 0 ? initialTournaments : tournaments;

  return (
    <div className="w-full">
      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tournaments</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFilter}
                className="flex items-center space-x-1 text-sm bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-1 text-sm bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full py-2 px-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sport Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="w-full py-2 px-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="FOOTBALL">Football</option>
                    <option value="BASKETBALL">Basketball</option>
                    <option value="BASEBALL">Baseball</option>
                    <option value="HOCKEY">Hockey</option>
                    <option value="SOCCER">Soccer</option>
                    <option value="ESPORTS">Esports</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && displayedTournaments.length === 0 && (
        <div className="text-center py-12">
          <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-400">Loading tournaments...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && displayedTournaments.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <div className="mb-4">
            <Trophy size={48} className="mx-auto text-gray-600" />
          </div>
          <h3 className="text-xl font-medium mb-2">No tournaments found</h3>
          <p className="text-gray-400 mb-6">
            {(statusFilter || categoryFilter) 
              ? 'Try changing your filters to see more tournaments'
              : 'Check back later for upcoming tournaments'}
          </p>
          {(statusFilter || categoryFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Tournament Cards Grid */}
      {displayedTournaments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTournaments.map((tournament) => (
            requireAuth ? (
              <div key={tournament.id} className="relative group">
                <TournamentCard
                  tournament={tournament}
                  onJoin={handleJoinTournament}
                  isPreview={true}
                />
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <Lock className="h-8 w-8 text-purple-400 mb-3" />
                  <p className="text-white font-medium mb-3 text-center px-4">
                    Login to view and join tournaments
                  </p>
                  <Link 
                    href={`/login?callbackUrl=/tournaments/${tournament.id}`}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
                  >
                    Login Now
                  </Link>
                </div>
              </div>
            ) : (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onJoin={handleJoinTournament}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
} 