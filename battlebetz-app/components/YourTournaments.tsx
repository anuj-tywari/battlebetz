import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Trophy, Calendar, DollarSign, Check, Users, ChevronRight, BarChart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

// Define tournament interface based on the data structure
interface TournamentParticipation {
  id: string;
  tournament_id: string;
  user_id: string;
  round_name: string;
  joined_at: string;
  token_balance: number;
  rank?: number;
  status?: string;
  tournament?: {
    id: string;
    name: string;
    type: string;
    status: string;
    start_date: string;
    end_date: string;
    entry_deadline?: string;
    is_public: boolean;
    entry_fee: number;
    prize_pool: number;
    image_url?: string;
    // participant_count?: number;
  };
  round?: {
    id: string;
    tournament_id: string;
    participant_count: number;
    round_name: string;
    start_date: string;
    end_date: string;
    status: string;
  };
}

export default function YourTournaments() {
  const router = useRouter();
  const { user } = useAuth();
  const [userTournaments, setUserTournaments] = useState<TournamentParticipation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch all tournaments the user is participating in
    const fetchUserTournaments = async () => {
      if (!user) {
        setUserTournaments([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get all tournament participations for the user with tournament and round details
        const { data, error: fetchError } = await supabase
          .from('tournament_round_participants')
          .select(`
            id, 
            tournament_id,
            user_id,
            round_id,
            joined_at,
            token_balance,
            rank,
            status,
            tournament:tournaments (
              id,
              name,
              type,
              status,
              start_date,
              end_date,
              entry_deadline,
              is_public,
              entry_fee,
              prize_pool
            ),
            round:tournament_rounds (
              id,
              tournament_id,
              round_name,
              start_date,
              end_date,
              status,
              participant_count
            )
          `)
          .eq('user_id', user.id)
          .in('round.status', ['active','upcoming'])
          .in('status', ['upcoming', 'active'])
          .order('joined_at', { ascending: false });

        console.log(data)
        
        if (fetchError) throw fetchError;
        
        // Sort by tournament status and start date
        const sortedTournaments = data?.sort((a, b) => {
          // Active tournaments first
          const statusA = a.tournament?.status || '';
          const statusB = b.tournament?.status || '';
          
          if (statusA === 'active' && statusB !== 'active') return -1;
          if (statusA !== 'active' && statusB === 'active') return 1;
          
          // Then by round start date (closest first)
          const startDateA = new Date(a.round?.start_date || a.tournament?.start_date || '').getTime();
          const startDateB = new Date(b.round?.start_date || b.tournament?.start_date || '').getTime();
          return startDateA - startDateB;
        });
        
        setUserTournaments(sortedTournaments || []);
      } catch (err) {
        console.error('Error fetching user tournaments:', err);
        setError('Unable to load your tournaments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserTournaments();
  }, [user]);
  
  // Navigate to place bets screen with tournament and round info
  const handleMakePicks = (tournamentId: string, roundId: string) => {
    router.push({ 
      pathname: '/place-tournament-bets',
      params: { 
        tournamentId,
        roundId
      }
    });
  };
  
  // Navigate to tournament details/dashboard
  const handleViewTournament = (tournamentId: string) => {
    router.push({
      pathname: '/tournament-details',
      params: { tournamentId }
    });
  };
  
  // Calculate time remaining until round ends
  const getTimeRemaining = (endDateString: string) => {
    const now = new Date();
    const endDate = new Date(endDateString);
    const diffTime = endDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Ended';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`;
    } else {
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours}h ${diffMinutes}m remaining`;
    }
  };
  
  // Get status color based on tournament status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'; // Green
      case 'upcoming': return '#3B82F6'; // Blue
      case 'completed': return '#6B7280'; // Gray
      case 'canceled': return '#EF4444'; // Red
      default: return '#A259FF'; // Purple (default)
    }
  };
  
  // Get appropriate status text
  const getStatusText = (tournamentStatus: string, roundStatus: string) => {
    if (roundStatus === 'active') return 'ACTIVE ROUND';
    if (roundStatus === 'upcoming') return 'UPCOMING ROUND';
    if (roundStatus === 'completed') return 'ROUND COMPLETED';
    return tournamentStatus.toUpperCase();
  };
  
  // Default placeholder images for tournaments without images
  const getDefaultImage = (tournamentType: string) => {
    const defaultImages = {
      'basketball_ncaa': 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
      'cricket_ipl': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2187&auto=format&fit=crop',
      'NBA': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2187&auto=format&fit=crop',
      'NHL': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=2187&auto=format&fit=crop',
      'default': 'https://images.unsplash.com/photo-1457131760772-7017c6180f05?q=80&w=2187&auto=format&fit=crop'
    };
    
    return defaultImages[tournamentType] || defaultImages.default;
  };

  // Calculate card width based on screen size (show max 5 cards in view)
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = Math.min(screenWidth * 0.75, 300);
  
  // If no tournaments are found or user is not logged in, return null
  if (!user || (!isLoading && userTournaments.length === 0)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Trophy size={24} color="#A259FF" />
          <Text style={styles.title}>Your Tournaments</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/tournaments')}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#A259FF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A259FF" />
          <Text style={styles.loadingText}>Loading your tournaments...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => setIsLoading(true)} // This will trigger the useEffect again
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          snapToInterval={cardWidth + 16} // Snap to each card + padding
          decelerationRate="fast"
        >
          {userTournaments.map((participation) => {
            // Extract tournament and round info
            const tournament = participation.tournament;
            const round = participation.round;
            
            if (!tournament || !round) return null;
            
            const tournamentStatus = tournament.status || 'unknown';
            const roundStatus = round.status || 'unknown';
            const statusColor = getStatusColor(roundStatus);
            const statusText = getStatusText(tournamentStatus, roundStatus);
            const timeRemaining = getTimeRemaining(round.end_date);
            const isActive = roundStatus === 'active';
            
            return (
              <View 
                key={participation.id}
                style={[styles.tournamentCard, { width: cardWidth }]}
              >
                <Image 
                  source={{ uri: tournament.image_url || getDefaultImage(tournament.type) }}
                  style={styles.tournamentImage}
                />
                
                {/* Status badge */}
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${statusColor}DD` }
                ]}>
                  <Text style={styles.statusText}>{statusText}</Text>
                </View>
                
                {/* Time remaining badge */}
                {roundStatus !== 'completed' && (
                  <View style={styles.timeBadge}>
                    <Calendar size={12} color="#FFFFFF" />
                    <Text style={styles.timeText}>{timeRemaining}</Text>
                  </View>
                )}
                
                <View style={styles.cardContent}>
                  <Text style={styles.tournamentName}>{tournament.name}</Text>
                  <Text style={styles.roundName}>{round.round_name}</Text>
                  
                  <View style={styles.detailRow}>
                    <Trophy size={18} color="#A259FF" />
                    <Text style={styles.detailText}>
                      Your Tokens: {participation.token_balance.toLocaleString()}
                    </Text>
                  </View>
                  
                  {participation.rank && (
                    <View style={styles.rankContainer}>
                      <BarChart size={18} color="#FFD700" />
                      <Text style={styles.rankText}>
                        Current Rank: #{participation.rank}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <DollarSign size={18} color="#A259FF" />
                    <Text style={styles.detailText}>
                      Prize Pool: ${tournament.prize_pool.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Users size={18} color="#A259FF" />
                    <Text style={styles.detailText}>
                      {round.participant_count || 'Many'} participants
                    </Text>
                  </View>
                  
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => handleViewTournament(tournament.id)}
                    >
                      <Trophy size={18} color="#FFFFFF" />
                      <Text style={styles.viewButtonText}>Details</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.picksButton,
                        !isActive && styles.disabledButton
                      ]}
                      onPress={() => isActive && handleMakePicks(tournament.id, round.id)}
                      disabled={!isActive}
                    >
                      {isActive ? (
                        <>
                          <BarChart size={18} color="#FFFFFF" />
                          <Text style={styles.picksButtonText}>Make Picks</Text>
                        </>
                      ) : (
                        <>
                          <Check size={18} color="#FFFFFF" />
                          <Text style={styles.picksButtonText}>
                            {roundStatus === 'completed' ? 'Completed' : 'Upcoming'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(162, 89, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewAllText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  scrollContent: {
    paddingRight: 16,
    gap: 16,
  },
  tournamentCard: {
    backgroundColor: '#1A1A1D',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3E3E4A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tournamentImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  timeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  cardContent: {
    padding: 16,
  },
  tournamentName: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  roundName: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  picksButton: {
    flex: 1,
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  disabledButton: {
    backgroundColor: '#6B7280',
    opacity: 0.8,
  },
  picksButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  loadingText: {
    color: '#EAEAEA',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  retryButton: {
    backgroundColor: '#A259FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});