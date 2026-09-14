"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Users, Calendar, Coins, ArrowRight, Clock, Timer, BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';
import { Tournament } from '@/types/tournament';
import { formatDate, formatCurrency, formatCountdown, mapSportCategoryToIcon } from '@/utils/format';
import { useAuth } from '@/components/providers/auth-provider';
import PaymentModal from '@/components/tournaments/PaymentModal';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin?: (tournamentId: string) => Promise<boolean>;
  isPreview?: boolean;
}

export default function TournamentCard({ 
  tournament, 
  onJoin,
  isPreview = false
}: TournamentCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const isUpcoming = tournament.status === 'UPCOMING' || tournament.status === 'upcoming';
  const isActive = tournament.status === 'ACTIVE' || tournament.status === 'active';
  const isFull = (tournament.participant_count || 0) >= (tournament.max_participants || 0);

  // Since category doesn't exist in Tournament type, use a default
  const sportCategory = 'default';
  const sportIconName = mapSportCategoryToIcon(sportCategory as any);
  
  // Add a default category to handle undefined cases
  const safeCategory = sportCategory || 'default';
  
  // Create a mapping of sport categories to background gradient colors
  const categoryGradients: Record<string, string> = {
    'FOOTBALL': 'from-blue-900 to-blue-700',
    'BASKETBALL': 'from-orange-900 to-orange-700',
    'BASEBALL': 'from-red-900 to-red-700',
    'HOCKEY': 'from-blue-900 to-indigo-700',
    'SOCCER': 'from-green-900 to-green-700',
    'ESPORTS': 'from-purple-900 to-purple-700',
    'OTHER': 'from-gray-900 to-gray-700',
    'default': 'from-indigo-900 to-purple-700'
  };
  
  // Get the appropriate gradient based on the sport category
  const gradientColor = categoryGradients[safeCategory] || categoryGradients.default;

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login?returnUrl=/tournaments');
      return;
    }

    // Use PaymentModal instead of onJoin prop
    setIsPaymentModalOpen(true);
  };

  const handleCardClick = () => {
    if (!isPreview) {
      router.push(`/tournaments/${tournament.id}`);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh the page or update state as needed
    router.refresh();
  };

  const getStatusColor = () => {
    switch (tournament.status) {
      case 'UPCOMING':
      case 'upcoming':
        return 'bg-blue-600';
      case 'ACTIVE':
      case 'active':
        return 'bg-green-600';
      case 'COMPLETED':
      case 'completed':
        return 'bg-gray-600';
      case 'CANCELLED':
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = () => {
    switch (tournament.status) {
      case 'UPCOMING':
      case 'upcoming':
        return 'Upcoming';
      case 'ACTIVE':
      case 'active':
        return 'Live';
      case 'COMPLETED':
      case 'completed':
        return 'Completed';
      case 'CANCELLED':
      case 'cancelled':
        return 'Cancelled';
      default:
        return tournament.status;
    }
  };

  // Sports-specific image paths
  const sportImages: Record<string, string> = {
    'FOOTBALL': '/assets/images/FeaturedBetPanel_NHL.jpg',
    'BASKETBALL': '/assets/images/FeaturedBet_Basketball Players.jpg',
    'BASEBALL': '/assets/images/battle_your_friends.png',
    'HOCKEY': '/assets/images/FeaturedBetPanel_NHL.jpg',
    'SOCCER': '/assets/images/best_of_best.png',
    'ESPORTS': '/assets/images/celebrity.png',
    'OTHER': '/assets/images/bracket-mayhem.png',
    'default': '/assets/images/battle_your_friends.png'
  };
  
  // Get the appropriate image path
  const imagePath = sportImages[safeCategory] || sportImages.default;

  // Format date with time
  const formatDateWithTime = (date: string) => {
    if (!date) return 'TBD';
    return formatDate(date, { includeTime: true });
  };
  
  // Calculate if tournament is starting soon (within 48 hours)
  const isStartingSoon = () => {
    if (!tournament.start_date) return false;
    const startDate = new Date(tournament.start_date);
    const now = new Date();
    const diffHours = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 48;
  };
  
  // Calculate if tournament is ending soon (within 24 hours)
  const isEndingSoon = () => {
    if (!tournament.end_date) return false;
    const endDate = new Date(tournament.end_date);
    const now = new Date();
    const diffHours = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  };
  
  // Calculate participant count with placeholder if not available
  const participantCount = tournament.participant_count || 0;
  
  // Calculate progress of tournament capacity
  const capacityPercentage = tournament.max_participants 
    ? Math.min(100, Math.round((participantCount / tournament.max_participants) * 100))
    : 0;
  
  // Get progress bar color based on capacity
  const getProgressColor = () => {
    if (capacityPercentage < 25) return 'bg-green-500';
    if (capacityPercentage < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Format remaining spots text
  const getRemainingSpots = () => {
    if (!tournament.max_participants) return 'Unlimited spots';
    const remaining = tournament.max_participants - participantCount;
    if (remaining <= 0) return 'Tournament full';
    return `${remaining} ${remaining === 1 ? 'spot' : 'spots'} left`;
  };

  return (
    <>
      <div
        className={`block bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 ${isPreview ? '' : 'hover:-translate-y-1 cursor-pointer'} border border-gray-700 overflow-hidden h-full`}
        onClick={handleCardClick}
      >
        {/* Header with badge */}
        <div className="relative p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white pr-16 line-clamp-2">{tournament.name}</h3>
            <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          {/* Tournament timing indicators */}
          {isStartingSoon() && (
            <div className="mt-2 flex items-center text-amber-400 text-xs font-medium">
              <Timer size={14} className="mr-1" />
              Starting soon
            </div>
          )}
          
          {isEndingSoon() && isActive && (
            <div className="mt-2 flex items-center text-red-400 text-xs font-medium">
              <Timer size={14} className="mr-1" />
              Ending soon
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="p-4">
          {/* Error message */}
          {joinError && (
            <div className="mb-4 px-3 py-2 bg-red-900/30 border border-red-600 rounded text-red-200 text-sm">
              {joinError}
            </div>
          )}
          
          {/* Tournament details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Entry Fee</span>
              <div className="flex items-center">
                <Coins size={16} className="text-amber-400 mr-1.5" />
                <span className="font-medium">
                  {tournament.entry_fee ? formatCurrency(tournament.entry_fee) : 'Free'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Prize Pool</span>
              <div className="flex items-center">
                <Trophy size={16} className="text-amber-400 mr-1.5" />
                <span className="font-medium">
                  {tournament.prize_pool ? formatCurrency(tournament.prize_pool) : 'TBD'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Start Date</span>
              <div className="flex items-center">
                <Calendar size={16} className="text-blue-400 mr-1.5" />
                <span className="font-medium text-xs">
                  {formatDateWithTime(tournament.start_date || '')}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Participants</span>
              <div className="flex items-center">
                <Users size={16} className="text-purple-400 mr-1.5" />
                <span className="font-medium">
                  {participantCount}
                  {tournament.max_participants ? ` / ${tournament.max_participants}` : ''}
                </span>
              </div>
            </div>
          </div>
          
          {/* Capacity progress bar */}
          {tournament.max_participants && tournament.max_participants > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Capacity</span>
                <span className="text-xs font-medium">{getRemainingSpots()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${getProgressColor()}`} 
                  style={{ width: `${capacityPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Optional tournament description - truncated */}
          {tournament.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-300 line-clamp-2">
                {tournament.description}
              </p>
            </div>
          )}
          
          {/* Action button */}
          <div className="mt-auto">
            {tournament.status === 'COMPLETED' || tournament.status === 'completed' ? (
              <button
                className="w-full py-2.5 rounded-md flex justify-center items-center font-medium bg-gray-700 text-gray-300 cursor-default"
              >
                <BarChart size={16} className="mr-2" />
                View Results
              </button>
            ) : isUpcoming && !isPreview ? (
              <button
                onClick={handleJoin}
                disabled={isJoining || isFull}
                className={`w-full py-2.5 rounded-md flex justify-center items-center font-medium transition-colors ${
                  isFull 
                    ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isJoining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Joining...
                  </>
                ) : isFull ? (
                  'Tournament Full'
                ) : (
                  <>
                    <ArrowRight size={16} className="mr-2" />
                    Join Tournament
                  </>
                )}
              </button>
            ) : (
              <button
                className="w-full py-2.5 rounded-md flex justify-center items-center font-medium bg-gray-700 text-gray-300"
              >
                {isActive ? (
                  <>
                    <Trophy size={16} className="mr-2" />
                    {isPreview ? 'Login to View' : 'View Tournament'}
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} className="mr-2" />
                    {isPreview ? 'Login to Join' : 'View Details'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        tournament={tournament}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
} 