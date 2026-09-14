"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Users, Calendar, Coins, ArrowRight, Clock } from 'lucide-react';
import { Tournament } from '@/services/tournaments';
import { formatDate, formatCurrency, formatCountdown, mapSportCategoryToIcon } from '@/utils/format';
import { Database } from '@/types/supabase';

interface TournamentBannerProps {
  tournament: Tournament;
}

export default function TournamentBanner({ tournament }: TournamentBannerProps) {
  const isUpcoming = tournament.status === 'UPCOMING';
  const isActive = tournament.status === 'ACTIVE';
  const isFull = (tournament.participant_count || 0) >= (tournament.max_participants || 0);

  // Since category doesn't exist in Tournament type, use a default
  const sportCategory = 'default';
  const sportIcon = mapSportCategoryToIcon(sportCategory as any);
  
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

  const getStatusColor = () => {
    switch (tournament.status) {
      case 'UPCOMING':
        return 'bg-blue-600';
      case 'ACTIVE':
        return 'bg-green-600';
      case 'COMPLETED':
        return 'bg-gray-600';
      case 'CANCELLED':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = () => {
    switch (tournament.status) {
      case 'UPCOMING':
        return 'Upcoming';
      case 'ACTIVE':
        return 'Live';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
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

  return (
    <div className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-purple-500/10 mb-6">
      <div className={`relative h-56 bg-gradient-to-r ${gradientColor}`}>
        <div className="absolute inset-0 opacity-40">
          <Image
            src={imagePath}
            alt={safeCategory}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        <div className="absolute top-4 left-4">
          <div className="flex items-center bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
            {sportIcon && <span className="mr-1.5">{sportIcon}</span>}
            <span className="capitalize">{safeCategory.toLowerCase()}</span>
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <div className={`${getStatusColor()} rounded-full px-3 py-1.5 text-sm flex items-center shadow-lg`}>
            {isActive && (
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            )}
            {getStatusText()}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-16 px-6 pb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {tournament.name}
          </h2>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-2 mb-3">
            {tournament.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center text-gray-300">
              <Calendar size={16} className="mr-2 text-purple-400" />
              <span>{formatDate(tournament.start_date)}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <Users size={16} className="mr-2 text-purple-400" />
              <span>
                <span className="text-white">{tournament.participant_count || 0}</span>/{tournament.max_participants || 0}
              </span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <Coins size={16} className="mr-2 text-yellow-400" />
              <span>Entry: {formatCurrency(tournament.entry_fee)}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <Trophy size={16} className="mr-2 text-yellow-400" />
              <span>Prize: {formatCurrency(tournament.prize_pool)}</span>
            </div>
            
            {isUpcoming && !isFull && (
              <div className="flex items-center text-purple-400">
                <Clock size={16} className="mr-2" />
                <span>{formatCountdown(tournament.start_date)}</span>
              </div>
            )}
            
            <div className="ml-auto">
              <Link
                href={`/tournaments/${tournament.id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                View Tournament
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 