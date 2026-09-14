import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, DimensionValue } from 'react-native';
import { Trophy, TrendingUp, Target, TrendingUp as ArrowTrendingUp } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTournamentData } from '@/hooks/useTournamentData';
import { useBetData } from '@/hooks/useBetData';
import { useAuth } from '@/hooks/useAuth';

export default function TournamentOverview() {
  const { user } = useAuth();
  // const { tournamentId, roundName } = useLocalSearchParams();
  const tournamentId = '04e2c407-1eed-4035-8c3c-cb9c7793c195'
  const roundName = 'Sweet 16'
  
  // Fetch tournament data
  const { 
    tournament, 
    participant, 
    userStats,
    isLoading: isTournamentLoading
  } = useTournamentData(tournamentId as string, roundName as string);
  
  // Fetch bet data
  const { 
    bets, 
    stats: betStats,
    isLoading: isBetsLoading
  } = useBetData(user?.id as string, tournamentId as string, roundName as string);

  // Calculate ROI
  const calculateROI = () => {
    if (betStats.totalRisked === 0) return 0;
    return ((betStats.netProfit / betStats.totalRisked) * 100).toFixed(1);
  };

  // Determine if user is trending up
  const isTrending = useMemo(() => {
    // If we have less than 2 bets, we can't determine trend
    if (!bets || bets.length < 2) return false;
    
    // Sort bets by creation date (newest first)
    const sortedBets = [...bets].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Get the 3 most recent bets
    const recentBets = sortedBets.slice(0, 3);
    
    // Check if at least 2 of the 3 most recent bets were wins
    const recentWins = recentBets.filter(bet => bet.status === 'won').length;
    return recentWins >= 2;
  }, [bets]);

  // Determine current round index based on round name
  const roundIndex = useMemo(() => {
    const rounds = ['First Round', 'Round of 32', 'Sweet 16', 'E8', 'Elite Eight', 'Championship'];
    return rounds.findIndex(r => r === roundName);
  }, [roundName]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    const totalRounds = 6; // R64, R32, S16, E8, F4, CH
    if (roundIndex < 0) return '0%';
    return `${Math.round((roundIndex / (totalRounds - 1)) * 100)}%`;
  }, [roundIndex]);

  // Loading state
  if (isTournamentLoading || isBetsLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#A259FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.title}>{tournament?.name || 'Tournament Overview'}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        {/* Results Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <TrendingUp size={16} color="#10B981" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>
                {betStats.netProfit > 0 ? '+' : ''}{calculateROI()}%
              </Text>
              <Text style={styles.statLabel}>ROI</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(162, 89, 255, 0.1)' }]}>
              <Trophy size={16} color="#A259FF" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>
                {betStats.netProfit > 0 ? '+' : ''}{participant?.tokens || 0}
              </Text>
              <Text style={styles.statLabel}>BBZ.T</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Target size={16} color="#F59E0B" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>
                #{userStats?.rank || '-'}
              </Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: isTrending ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
              <ArrowTrendingUp size={16} color={isTrending ? "#10B981" : "#EF4444"} />
            </View>
            <View style={styles.statContent}>
              <Text style={[
                styles.trendingValue,
                isTrending ? styles.trendingYes : styles.trendingNo
              ]}>
                {isTrending ? 'Yes' : 'No'}
              </Text>
              <Text style={styles.statLabel}>Trending</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: progressPercentage as DimensionValue }]} />
          </View>
          <View style={styles.progressMarkers}>
            {['R64', 'R32', 'S16', 'E8', 'F4', 'CH'].map((round, index) => (
              <View 
                key={round} 
                style={[
                  styles.marker,
                  index < roundIndex && styles.markerCompleted,
                  index === roundIndex && styles.markerCurrent
                ]}
              >
                <Text style={styles.markerLabel}>{round}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    gap: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
    maxWidth: '22%',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  trendingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  trendingYes: {
    color: '#10B981',
  },
  trendingNo: {
    color: '#EF4444',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#2E2E3A',
  },
  progressContainer: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
    paddingBottom: 32, // Extra padding at bottom for markers
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2E2E3A',
    borderRadius: 3,
    marginBottom: 24,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#A259FF',
    borderRadius: 3,
  },
  progressMarkers: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2E2E3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCompleted: {
    backgroundColor: '#10B981',
  },
  markerCurrent: {
    backgroundColor: '#A259FF',
  },
  markerLabel: {
    color: '#EAEAEA',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});