import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { ArrowLeft, Search, X, Trophy, Clock, DollarSign, Users, MessageSquare, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserBets, Bet, SubBet, useBetData } from '@/hooks/useBetData';
import { supabase } from '@/utils/supabaseClient';

interface ProcessedSubBet {
  id: string;
  name: string;
  description: string;
  odds: number;
  points: number | null;
  status: string;
  type: string;
  displayTitle: string;
}

interface ProcessedBet {
  id: string;
  type: 'win' | 'loss' | 'pending';
  title: string;
  description: string;
  amount: string;
  time: string;
  status: string;
  risk: number;
  potentialPayout: number;
  netAmount: number;
  betType: string;
  subbets?: ProcessedSubBet[];
}

export default function MyActivityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Define proper types for the states
  const [bets, setBets] = useState<Bet[] | null>(null);
  const [subbets, setSubbets] = useState<SubBet[] | null>(null);
  const [processedOpenBets, setProcessedOpenBets] = useState<ProcessedBet[] | null>(null);
  const [processedClosedBets, setProcessedClosedBets] = useState<ProcessedBet[] | null>(null);
  const [fetchError, setFetchError] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Other activity stays as hardcoded data for now
  const otherActivity = [
    {
      id: '1',
      type: 'deposit',
      title: 'Deposit successful',
      description: 'Added funds to your account',
      amount: '+USD 100',
      time: '1 hour ago'
    },
    {
      id: '2',
      type: 'social',
      title: 'New follower',
      description: '@alex_k started following you',
      time: '3 hours ago'
    },
    {
      id: '3',
      type: 'tournament',
      title: 'Joined March Madness',
      description: 'Tournament starts in 2 days',
      time: '4 hours ago'
    },
    {
      id: '4',
      type: 'like',
      title: 'Your bet received 5 likes',
      description: 'Lakers -3.5 vs Warriors',
      time: '6 hours ago'
    }
  ];

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  // Create an optimized title for a subbet
  const createSubbetDisplayTitle = (subbet: SubBet): string => {
    // Check if it's a total bet (over/under)
    if (subbet.type?.toLowerCase().includes('total')) {
      return subbet.description || 'Total';
    }
    
    // Check if it's a spread bet
    if (subbet.type?.toLowerCase().includes('spread') && subbet.points !== null) {
      const pointsSign = subbet.points > 0 ? '+' : '';
      return `${subbet.name} ${pointsSign}${subbet.points}`;
    }
    
    // Default to moneyline or other bet types
    return subbet.name || 'Selection';
  };

  // Process subbets for a specific bet
  const processSubbets = (betId: string, allSubbets: SubBet[]): ProcessedSubBet[] => {
    return allSubbets
      .filter(subbet => subbet.bet_id === betId)
      .map(subbet => {
        const displayTitle = createSubbetDisplayTitle(subbet);
        
        return {
          id: subbet.id,
          name: subbet.name || 'Selection',
          description: subbet.description || '',
          odds: subbet.odds,
          points: subbet.points,
          status: subbet.status,
          type: subbet.type || '',
          displayTitle: displayTitle
        };
      });
  };

  // Process bets for display
  const processBets = (bets: Bet[], allSubbets: SubBet[] | null): { open: ProcessedBet[], closed: ProcessedBet[] } => {
    const open: ProcessedBet[] = [];
    const closed: ProcessedBet[] = [];

    bets.forEach(bet => {
      // Count subbets for this bet to determine bet type
      const betSubbets = allSubbets ? allSubbets.filter(subbet => subbet.bet_id === bet.id) : [];
      const betType = betSubbets.length > 1 ? 'Parlay' : 'Standard';
      
      // Round potential payout to 2 decimal places
      const roundedPotentialPayout = Math.round((bet.potential_payout + Number.EPSILON) * 100) / 100;
      
      const processedBet: ProcessedBet = {
        id: bet.id,
        type: bet.status === 'won' ? 'win' : bet.status === 'lost' ? 'loss' : 'pending',
        title: bet.prediction || 'Bet', // Use prediction field for title if available
        description: bet.tournament_round || 'Unknown Round',
        amount: bet.status === 'won' 
          ? `+BBZ ${bet.net_amount}`
          : bet.status === 'lost'
          ? `-BBZ ${bet.risk}`
          : `BBZ ${bet.risk}`,
        time: formatRelativeTime(bet.created_at),
        status: bet.status,
        // Add risk and potential payout data
        risk: bet.risk,
        potentialPayout: roundedPotentialPayout,
        netAmount: bet.net_amount,
        betType: betType,
        // Add subbets if available
        subbets: processSubbets(bet.id, betSubbets)
      };

      if (bet.status === 'open' || bet.status === 'pending') {
        open.push(processedBet);
      } else if (bet.status === 'won' || bet.status === 'lost' || bet.status === 'closed' || bet.status === 'settled') {
        closed.push(processedBet);
      }
    });

    return { open, closed };
  };

  // Fetch subbets for a list of bet IDs
  const fetchSubbetsForBets = async (userId: string, betIds: string[]) => {
    try {
      if (!betIds.length) return null;
      
      const { data, error } = await supabase
        .from('subbets')
        .select('*')
        .eq('user_id', userId)
        .in('bet_id', betIds);
        
      if (error) throw error;
      return data as SubBet[];
    } catch (error) {
      console.error('Error fetching subbets:', error);
      return null;
    }
  };

  useEffect(() => {
    // Only run if user exists and has an ID
    if (user?.id) {
      setLoading(true);
      
      // Call the async function inside useEffect
      const loadBetsAndSubbets = async () => {
        try {
          const { bets: userBets, fetUserBetsError } = await fetchUserBets(user.id);
          
          if (userBets) {
            setBets(userBets);
            
            // Fetch subbets for these bets
            const betIds = userBets.map(bet => bet.id);
            const userSubbets = await fetchSubbetsForBets(user.id, betIds);
            setSubbets(userSubbets);
            
            // Process the bets for display with their subbets
            const { open, closed } = processBets(userBets, userSubbets);
            setProcessedOpenBets(open);
            setProcessedClosedBets(closed);
          }
          
          if (fetUserBetsError) {
            setFetchError(fetUserBetsError);
          }
        } catch (error) {
          setFetchError(error);
          console.error('Error loading bets:', error);
        } finally {
          setLoading(false);
        }
      };

      loadBetsAndSubbets();
    }
  }, [user]);

  // Filter function for search
  const filterBySearch = (item: ProcessedBet) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.amount.toLowerCase().includes(query)
    );
  };

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'win':
        return <Trophy size={16} color="#10B981" />;
      case 'loss':
        return <Trophy size={16} color="#EF4444" />;
      case 'deposit':
        return <DollarSign size={16} color="#10B981" />;
      case 'social':
        return <Users size={16} color="#A259FF" />;
      case 'tournament':
        return <Trophy size={16} color="#F59E0B" />;
      case 'like':
        return <Heart size={16} color="#EF4444" />;
      default:
        return <MessageSquare size={16} color="#A259FF" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        
        {/* <View style={styles.searchContainer}>
          <Search size={20} color="#A259FF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search activity..."
            placeholderTextColor="#6c757d"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <X size={16} color="#EAEAEA" />
            </TouchableOpacity>
          )}
        </View> */}
      </View>

      <View style={styles.content}>
        {/* Wins & Losses Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Wins & Losses</Text>
          <View style={styles.columnContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A259FF" />
              </View>
            ) : fetchError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load data</Text>
              </View>
            ) : processedClosedBets && processedClosedBets.length > 0 ? (
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.activityList}>
                  {processedClosedBets.filter(filterBySearch).map((activity) => (
                    <TouchableOpacity 
                      key={activity.id} 
                      style={styles.activityCard}
                      onPress={() => {
                        // Navigate to bet details page
                        // router.push(`/bet/${activity.id}`);
                      }}
                    >
                      <View style={styles.activityHeader}>
                        {renderActivityIcon(activity.type)}
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                      
                      <View style={styles.betMainContent}>
                        <View style={styles.betTitleContainer}>
                          <Text style={styles.activityTitle}>{activity.title}</Text>
                          <Text style={styles.activityDescription}>{activity.description}</Text>
                        </View>
                        
                        <View style={styles.amountsContainer}>
                          <Text style={styles.betTypeLabel}>{activity.betType}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.betFinancialsContainer}>
                        <Text style={styles.riskLabel}>Risk: <Text style={styles.riskAmount}>BBZ {activity.risk}</Text></Text>
                        <Text style={styles.netLabel}>Net: <Text style={[
                          styles.netAmount,
                          activity.type === 'win' ? styles.winAmount : styles.lossAmount
                        ]}>
                          {activity.type === 'win' ? '+' : '-'}BBZ {Math.abs(activity.netAmount)}
                        </Text></Text>
                      </View>
                      
                      {/* Display subbets if they exist */}
                      {activity.subbets && activity.subbets.length > 0 && (
                        <View style={styles.subbetsContainer}>
                          {activity.subbets.map(subbet => (
                            <View key={subbet.id} style={styles.subbet}>
                              <View style={styles.subbetHeader}>
                                <Text style={styles.subbetName}>{subbet.displayTitle}</Text>
                                <Text style={[
                                  styles.subbetStatus,
                                  subbet.status === 'won' ? styles.winAmount : 
                                  subbet.status === 'lost' ? styles.lossAmount : 
                                  styles.pendingAmount
                                ]}>
                                  {subbet.status.toUpperCase()}
                                </Text>
                              </View>
                              <View style={styles.subbetDetailsRow}>
                                {subbet.type?.toLowerCase().includes('total') ? (
                                  <Text style={styles.subbetOdds}>
                                    {subbet.odds > 0 ? `+${subbet.odds}` : subbet.odds}
                                  </Text>
                                ) : (
                                  <Text style={styles.subbetDescription}>
                                    {subbet.description}
                                    {subbet.description ? ' • ' : ''}
                                    <Text style={styles.subbetOdds}>
                                      {subbet.odds > 0 ? `+${subbet.odds}` : subbet.odds}
                                    </Text>
                                  </Text>
                                )}
                                {!subbet.description && !subbet.type?.toLowerCase().includes('total') && (
                                  <Text style={styles.subbetOdds}>
                                    {subbet.odds > 0 ? `+${subbet.odds}` : subbet.odds}
                                  </Text>
                                )}
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No closed bets yet</Text>
              </View>
            )}
          </View>
        </View>

        {/* Pending Bets Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Pending Bets</Text>
          <View style={styles.columnContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A259FF" />
              </View>
            ) : fetchError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load data</Text>
              </View>
            ) : processedOpenBets && processedOpenBets.length > 0 ? (
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.activityList}>
                  {processedOpenBets.filter(filterBySearch).map((bet) => (
                    <TouchableOpacity 
                      key={bet.id} 
                      style={styles.activityCard}
                      onPress={() => {
                        // Navigate to bet details page
                        // router.push(`/bet/${bet.id}`);
                      }}
                    >
                      <View style={styles.activityHeader}>
                        <Clock size={16} color="#F59E0B" />
                        <Text style={styles.activityTime}>{bet.time}</Text>
                      </View>
                      
                      <View style={styles.betMainContent}>
                        <View style={styles.betTitleContainer}>
                          <Text style={styles.activityTitle}>{bet.description}</Text>
                          <Text style={styles.activityDescription}>{bet.id}</Text>
                        </View>
                        
                        <View style={styles.amountsContainer}>
                          <Text style={styles.betTypeLabel}>{bet.betType}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.betFinancialsContainer}>
                        <Text style={styles.riskLabel}>Risk: <Text style={styles.riskAmount}>BBZ {bet.risk}</Text></Text>
                        <Text style={styles.payoutLabel}>To Win: <Text style={styles.payoutAmount}>BBZ {bet.potentialPayout}</Text></Text>
                      </View>
                      
                      {/* Display subbets if they exist */}
                      {bet.subbets && bet.subbets.length > 0 && (
                        <View style={styles.subbetsContainer}>
                          {bet.subbets.map(subbet => (
                            <View key={subbet.id} style={styles.subbet}>
                              <View style={styles.subbetHeader}>
                                <Text style={styles.subbetName}>{subbet.displayTitle}</Text>
                                <Text style={[
                                  styles.subbetStatus,
                                  styles.pendingAmount
                                ]}>
                                  {subbet.status.toUpperCase()}
                                </Text>
                              </View>
                              <View style={styles.subbetDetailsRow}>
                                {subbet.type?.toLowerCase().includes('total') ? (
                                  <Text style={styles.subbetOdds}>
                                    {subbet.odds > 0 ? `+${subbet.odds}` : subbet.odds}
                                  </Text>
                                ) : (
                                  <Text style={styles.subbetDescription}>
                                    {subbet.description}
                                    {subbet.description ? ' • ' : ''}
                                    <Text style={styles.subbetOdds}>
                                      {subbet.odds > 0 ? `+${subbet.odds}` : subbet.odds}
                                    </Text>
                                  </Text>
                                )}
                                {!subbet.description && !subbet.type?.toLowerCase().includes('total') && (
                                  <Text style={styles.subbetOdds}>
                                    {subbet.odds > 0 ? `+${subbet.odds}` : subbet.odds}
                                  </Text>
                                )}
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No pending bets</Text>
              </View>
            )}
          </View>
        </View>

        {/* Other Activity Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Other</Text>
          <View style={styles.columnContent}>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.activityList}>
                {otherActivity
                  .filter(activity => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    return (
                      activity.title.toLowerCase().includes(query) ||
                      activity.description.toLowerCase().includes(query) ||
                      (activity.amount && activity.amount.toLowerCase().includes(query))
                    );
                  })
                  .map((activity) => (
                    <View key={activity.id} style={styles.activityCard}>
                      <View style={styles.activityHeader}>
                        {renderActivityIcon(activity.type)}
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                      {activity.amount && (
                        <Text style={[
                          styles.activityAmount,
                          activity.amount.includes('+') ? styles.winAmount : styles.lossAmount
                        ]}>
                          {activity.amount}
                        </Text>
                      )}
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#1A1A1D',
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  column: {
    flex: 1,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  columnContent: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  columnTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  activityList: {
    gap: 8,
    paddingBottom: 8,
  },
  activityCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTime: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  activityTitle: {
    color: '#EAEAEA',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  activityDescription: {
    color: '#A259FF',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  winAmount: {
    color: '#10B981',
  },
  lossAmount: {
    color: '#EF4444',
  },
  pendingAmount: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#6c757d',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  subbetsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#5A5A5A',
    paddingTop: 8,
    gap: 8,
  },
  subbet: {
    backgroundColor: '#3A3A3A',
    borderRadius: 6,
    padding: 8,
  },
  subbetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subbetName: {
    color: '#EAEAEA',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  subbetStatus: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  subbetDescription: {
    color: '#BBBBBB',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  subbetDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subbetOdds: {
    color: '#A259FF',
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  betMainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  betTitleContainer: {
    flex: 1,
  },
  amountsContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  betTypeLabel: {
    color: '#BBBBBB',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  amountDetails: {
    alignItems: 'flex-end',
  },
  riskLabel: {
    color: '#BBBBBB',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  riskAmount: {
    color: '#EAEAEA',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  payoutLabel: {
    color: '#BBBBBB',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  payoutAmount: {
    color: '#F59E0B',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  netLabel: {
    color: '#BBBBBB',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  netAmount: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  betFinancialsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 4,
  },
});