import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Calendar, Users, ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { formatCurrency } from '@/utils/format';
import { supabase } from '@/lib/supabase';

// Define types for data structures
interface LocalTournament {
  id: string;
  name: string | null;
  description: string | null;
  status: string | null;
  prize_pool: number | null;
  entry_fee: number | null;
  start_date: string | null;
  end_date: string | null;
  max_participants: number | null;
  type: string | null;
  is_public: boolean | null;
  participant_count?: number;
}

export const metadata: Metadata = {
  title: 'Upcoming Tournaments | BattleBetz',
  description: 'Browse all upcoming betting tournaments on BattleBetz',
};

export default async function UpcomingTournamentsPage() {
  // Check if user is logged in
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  console.log('Fetching upcoming tournaments...');
  
  // First, let's check what tournaments exist in the database
  const { data: allTournaments, error: allError } = await supabase
    .from('tournaments')
    .select('id, name, status')
    .limit(10);
    
  console.log('All tournaments in database:', {
    data: allTournaments,
    error: allError,
    count: allTournaments?.length || 0
  });
  
  // Fetch upcoming tournaments data from API - try both uppercase and lowercase
  const { data: dbTournaments = [], error: tournamentsError } = await supabase
    .from('tournaments')
    .select(`
      id,
      name,
      description,
      status,
      prize_pool,
      entry_fee,
      start_date,
      end_date,
      max_participants,
      type,
      is_public
    `)
    .in('status', ['upcoming', 'open', 'UPCOMING', 'OPEN'])
    .order('start_date', { ascending: true });

  console.log('Upcoming tournaments query result:', {
    data: dbTournaments,
    error: tournamentsError,
    count: dbTournaments?.length || 0
  });

  if (tournamentsError) {
    console.error('Error fetching upcoming tournaments:', tournamentsError);
  }
    
  // Convert to our local tournament type with participant_count
  const upcomingTournaments: LocalTournament[] = Array.isArray(dbTournaments) ? dbTournaments.map(t => ({...t, participant_count: 0})) : [];

  // Get participant count for each tournament
  if (upcomingTournaments.length > 0) {
    for (const tournament of upcomingTournaments) {
      const { count } = await supabase
        .from('tournament_round_participants')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_id', tournament.id);
        
      // Add the participant count to the tournament object
      tournament.participant_count = count || 0;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/tournaments"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Tournaments
          </Link>
          <h1 className="text-3xl font-bold text-white">Upcoming Tournaments</h1>
          <p className="text-gray-400 mt-2">Join exciting betting tournaments and compete for prizes</p>
        </div>

        {/* Tournament Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total Tournaments</p>
                <p className="text-2xl font-bold text-white">{upcomingTournaments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total Prize Pool</p>
                <p className="text-2xl font-bold text-white">
                  ${upcomingTournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-white">
                  {upcomingTournaments.reduce((sum, t) => sum + (t.participant_count || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Starting Soon</p>
                <p className="text-2xl font-bold text-white">
                  {upcomingTournaments.filter(t => {
                    if (!t.start_date) return false;
                    const startDate = new Date(t.start_date);
                    const now = new Date();
                    const diffDays = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                    return diffDays <= 7;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">All Upcoming Tournaments</h2>
          
          {upcomingTournaments && upcomingTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="group bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-600/40"
                >
                  <div className="relative h-48">
                    <Image
                      src="/assets/images/tournaments.png"
                      alt={tournament.name || 'Tournament'}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {tournament.status || 'UPCOMING'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-gray-900/80 text-white px-3 py-1 rounded-lg text-sm">
                        {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 truncate">
                      {tournament.name}
                    </h3>
                    
                    {tournament.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {tournament.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Entry Fee:</span>
                        <span className="text-green-400 font-semibold">${tournament.entry_fee}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Prize Pool:</span>
                        <span className="text-yellow-400 font-semibold">${tournament.prize_pool}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Participants:</span>
                        <span className="text-blue-400 font-semibold">
                          {tournament.participant_count || 0}/{tournament.max_participants}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link 
                        href={`/tournaments/${tournament.id}`}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        View Details
                      </Link>
                      <Link 
                        href={`/tournaments/join?id=${tournament.id}`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Join Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Tournaments</h3>
              <p className="text-gray-400 mb-6">Check back soon for new tournaments to join!</p>
              <Link 
                href="/tournaments"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse All Tournaments
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 