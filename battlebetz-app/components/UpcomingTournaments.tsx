import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  FlatList,
  ActivityIndicator,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { Trophy, Calendar, DollarSign, Users, Info, LogIn, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define tournament interface
interface TournamentItem {
  id: string;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  entry_deadline: string;
  is_public: boolean;
  entry_fee: number;
  prize_pool: number;
  image_url?: string;
  participant_count?: number;
}

export default function UpcomingTournaments() {
  const router = useRouter();
  const { user } = useAuth();
  const [availableTournaments, setAvailableTournaments] = useState<TournamentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  
  // Calculate screen dimensions and card sizing
  const screenWidth = Dimensions.get('window').width;
  const cardMargin = 8;
  const numColumns = 4;
  // Adjust cardWidth calculation to make cards smaller, matching TournamentsPromo sizing
  const cardWidth = (screenWidth - (32 + cardMargin * 2 * numColumns)) / numColumns * 0.95; // Slightly smaller
  
  // Calculate initial and expanded number of tournaments to display
  const initialRowCount = 1;
  const expandedRowCount = 3;
  const initialDisplayCount = 4; // Show 3 tournaments in one row
  const maxDisplayCount = 8; // Show max 6 tournaments (2 rows)
  
  useEffect(() => {
    // Fetch all available tournaments that the user hasn't joined
    const fetchAvailableTournaments = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Get all tournaments with 'open' or 'upcoming' status
        const { data: allTournaments, error: tournamentsError } = await supabase
          .from('tournaments')
          .select(`
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
          `)
          .in('status', ['open', 'upcoming'])
          .gt('entry_deadline', new Date().toISOString());
        
        if (tournamentsError) throw tournamentsError;
        
        // 2. Get tournaments the user is already participating in
        const { data: participatingTournaments, error: participatingError } = await supabase
          .from('tournament_round_participants')
          .select('tournament_id')
          .eq('user_id', user.id);
          
        if (participatingError) throw participatingError;
        
        // 3. Filter out tournaments the user is already in
        const participatedIds = participatingTournaments?.map(p => p.tournament_id) || [];
        
        const filteredTournaments = allTournaments?.filter(
          tournament => !participatedIds.includes(tournament.id)
        ) || [];
        
        // 4. Sort by entry deadline (ascending) and then by prize pool (descending)
        const sortedTournaments = filteredTournaments.sort((a, b) => {
          // First sort by entry deadline (closest first)
          const deadlineA = new Date(a.entry_deadline || a.start_date).getTime();
          const deadlineB = new Date(b.entry_deadline || b.start_date).getTime();
          
          if (deadlineA !== deadlineB) {
            return deadlineA - deadlineB;
          }
          
          // If deadlines are the same, sort by prize pool (highest first)
          return b.prize_pool - a.prize_pool;
        });
        
        // 5. Limit to max display count
        setAvailableTournaments(sortedTournaments.slice(0, maxDisplayCount));
      } catch (err) {
        console.error('Error fetching available tournaments:', err);
        setError('Unable to load tournaments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableTournaments();
  }, [user, maxDisplayCount]);
  
  // Toggle expanded state with animation
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  
  // Determine if we should show the "View More" button
  const showViewMore = availableTournaments.length > initialDisplayCount;
  
  // Determine how many tournaments to display
  const visibleTournaments = expanded 
    ? availableTournaments
    : availableTournaments.slice(0, initialDisplayCount);
  
  // Navigate to join tournament screen with selected tournament ID
  const handleJoinTournament = (tournamentId: string) => {
    router.push({ 
      pathname: '/join-tournament',
      params: { tournamentId }
    });
  };
  
  // Navigate to tournament details screen
  const handleMoreInfo = (tournamentId: string) => {
    router.push({
      pathname: '/tournament-details',
      params: { tournamentId }
    });
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate days remaining until deadline
  const getDaysRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  // Handle case when there are no tournaments available
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Trophy size={56} color="#A259FF" style={{ opacity: 0.5 }} />
      <Text style={styles.emptyStateTitle}>No Tournaments Available</Text>
      <Text style={styles.emptyStateSubtitle}>
        Check back soon for new tournaments to join!
      </Text>
    </View>
  );

  // Render tournament card
  const renderTournamentCard = ({ item: tournament }) => {
    const daysRemaining = tournament.entry_deadline ? 
      getDaysRemaining(tournament.entry_deadline) : 
      getDaysRemaining(tournament.start_date);
      
    return (
      <View 
                key={tournament.id}
                style={[styles.tournamentCard, { width: cardWidth, margin: cardMargin }]}
              >
                <Image 
                  source={{ uri: tournament.image_url || getDefaultImage(tournament.type) }}
                  style={styles.tournamentImage}
                />
                
                {/* Status badge */}
                <View style={[
                  styles.statusBadge,
                  tournament.status === 'open' ? styles.openBadge : styles.upcomingBadge
                ]}>
                  <Text style={styles.statusText}>
                    {tournament.status === 'open' ? 'OPEN' : 'UPCOMING'}
                  </Text>
                </View>
                
                {/* Days remaining badge */}
                {daysRemaining > 0 && (
                  <View style={styles.daysBadge}>
                    <Calendar size={10} color="#FFFFFF" />
                    <Text style={styles.daysText}>
                      {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
                
                <View style={styles.cardContent}>
                  <Text style={styles.tournamentName} numberOfLines={1} ellipsizeMode="tail">
                    {tournament.name}
                  </Text>
                  
                  <View style={styles.detailRow}>
                    <DollarSign size={12} color="#A259FF" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      ${tournament.entry_fee}
                    </Text>
                  </View>
                  
                  <View style={styles.prizePoolContainer}>
                    <Trophy size={12} color="#FFD700" />
                    <Text style={styles.prizePoolText} numberOfLines={1}>
                      ${tournament.prize_pool.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Calendar size={12} color="#A259FF" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {formatDate(tournament.start_date)}
                    </Text>
                  </View>
                  
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={styles.infoButton}
                      onPress={() => handleMoreInfo(tournament.id)}
                    >
                      <Info size={12} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Details</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.joinButton}
                      onPress={() => handleJoinTournament(tournament.id)}
                    >
                      <LogIn size={12} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Join</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Trophy size={28} color="#FFD700" />
          <Text style={styles.title}>Upcoming Tournaments</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A259FF" />
          <Text style={styles.loadingText}>Loading tournaments...</Text>
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
      ) : availableTournaments.length === 0 ? (
        renderEmptyState()
      ) : (
        <View>
          <View style={styles.cardsContainer}>
            {visibleTournaments.map((tournament) => {
              const daysRemaining = tournament.entry_deadline ? 
                getDaysRemaining(tournament.entry_deadline) : 
                getDaysRemaining(tournament.start_date);
                
              return (
                <View 
                  key={tournament.id}
                  style={styles.tournamentCard}
                >
                  <Image 
                    source={{ uri: tournament.image_url || getDefaultImage(tournament.type) }}
                    style={styles.tournamentImage}
                  />
                  
                  {/* Status badge */}
                  <View style={[
                    styles.statusBadge,
                    tournament.status === 'open' ? styles.openBadge : styles.upcomingBadge
                  ]}>
                    <Text style={styles.statusText}>
                      {tournament.status === 'open' ? 'OPEN' : 'UPCOMING'}
                    </Text>
                  </View>
                  
                  {/* Days remaining badge */}
                  {daysRemaining > 0 && (
                    <View style={styles.daysBadge}>
                      <Calendar size={10} color="#FFFFFF" />
                      <Text style={styles.daysText}>
                        {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.cardContent}>
                    <Text style={styles.tournamentName} numberOfLines={1} ellipsizeMode="tail">
                      {tournament.name}
                    </Text>
                    
                    <View style={styles.detailRow}>
                      <DollarSign size={12} color="#A259FF" />
                      <Text style={styles.detailText} numberOfLines={1}>
                        ${tournament.entry_fee}
                      </Text>
                    </View>
                    
                    <View style={styles.prizePoolContainer}>
                      <Trophy size={12} color="#FFD700" />
                      <Text style={styles.prizePoolText} numberOfLines={1}>
                        ${tournament.prize_pool.toLocaleString()}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Calendar size={12} color="#A259FF" />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {formatDate(tournament.start_date)}
                      </Text>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity 
                        style={styles.infoButton}
                        onPress={() => handleMoreInfo(tournament.id)}
                      >
                        <Info size={12} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Details</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.joinButton}
                        onPress={() => handleJoinTournament(tournament.id)}
                      >
                        <LogIn size={12} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Join</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          
          {showViewMore && (
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={toggleExpanded}
            >
              <Text style={styles.expandButtonText}>
                {expanded ? 'Show Less' : 'Show More'}
              </Text>
              <ChevronDown 
                size={16} 
                color="#A259FF" 
                style={{ 
                  transform: [{ rotate: expanded ? '180deg' : '0deg' }]
                }} 
              />
            </TouchableOpacity>
          )}
        </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width:'100%'
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
    marginBottom: 16,
    width: '23.5%', // Use percentage width for responsive sizing
    marginHorizontal: '.75%', // Small margin for spacing
  },
  tournamentImage: {
    width: '100%',
    height: 120, // Keep image height more compact
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  openBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.85)',
  },
  upcomingBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.85)',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  daysBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  daysText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  cardContent: {
    padding: 12,
  },
  tournamentName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  detailText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  prizePoolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  prizePoolText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  infoButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1A1D',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3E3E4A',
  },
  expandButtonText: {
    color: '#A259FF',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    padding: 20,
  },
  emptyStateTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  emptyStateSubtitle: {
    color: '#A259FF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});