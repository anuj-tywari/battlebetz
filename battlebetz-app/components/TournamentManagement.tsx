import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Trophy, DollarSign, Book, Target, Clock, Plus, AlertTriangle } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCountdown } from '@/hooks/useCountdown';
import { useTournamentData } from '@/hooks/useTournamentData';
import { useBetData } from '@/hooks/useBetData';
import { useAuth } from '@/hooks/useAuth';

export default function TournamentManagement() {
  const router = useRouter();
  const { user } = useAuth();
  // const { tournamentId, roundName } = useLocalSearchParams();
  const tournamentId = '04e2c407-1eed-4035-8c3c-cb9c7793c195'
  const roundName = 'Sweet 16'
  
  // Fetch tournament data
  const { 
    tournament,
    tournamentRound, 
    participant,
    isLoading: isTournamentLoading,
    isParticipating,
    joinTournamentRound
  } = useTournamentData(tournamentId as string, roundName as string);
  
  // Fetch bet data
  const { 
    bets, 
    stats: betStats,
    isLoading: isBetsLoading 
  } = useBetData(user?.id as string, tournamentId as string, roundName as string);

  // If we have a tournament round, use its start date for countdown
  const targetDate = useMemo(() => 
    tournamentRound?.start_date 
      ? new Date(tournamentRound.start_date) 
      : new Date('2025-03-27T12:00:00-04:00')
  , [tournamentRound]);
  
  const timeLeft = useCountdown(targetDate);

  // Count standard bets vs parlays
  const betCounts = useMemo(() => {
    if (!bets) return { standard: 0, parlay: 0 };
    
    return bets.reduce((counts, bet) => {
      if (bet.bet_type_id === 1) { // Assuming 1 is standard bet type
        counts.standard++;
      } else {
        counts.parlay++;
      }
      return counts;
    }, { standard: 0, parlay: 0 });
  }, [bets]);

  // Define betting limits
  const betLimits = useMemo(() => {
    return {
      standard: tournament?.standard_bet_limit || 5,
      parlay: tournament?.parlay_bet_limit || 3
    };
  }, [tournament]);

  // Calculate remaining bets and check token balance
  const standardBetsRemaining = betLimits.standard - bets.length;
  const parlayBetsRemaining = betLimits.parlay - betCounts.parlay;
  const userTokens = participant?.tokens || 0;
  const hasTokenBalance = userTokens > 0;

  // Check if user can place bets (has remaining bets AND token balance)
  const canPlaceBets = standardBetsRemaining > 0 && hasTokenBalance;

  // Define stats cards data
  const stats = useMemo(() => [
    {
      id: '1',
      label: 'Bets Made',
      value: `${bets.length}/${betLimits.standard}`,
      icon: Trophy,
      color: '#10B981'
    },
    {
      id: '2',
      label: 'Total Risk',
      value: `${betStats.totalRisked.toFixed(0)}`,
      icon: AlertTriangle,
      color: '#F43F5E'
    },
    {
      id: '3',
      label: 'Balance',
      value: `${userTokens}`,
      icon: DollarSign,
      color: userTokens > 0 ? '#F59E0B' : '#F43F5E'
    }
  ], [betCounts, betLimits, betStats.totalRisked, userTokens]);

  const handleNavigateToRules = () => router.push('/tournament-rules');
  const handleNavigateToPlaceBets = () => router.push('/place-tournament-bets');
  
  // Format date range for display
  const formatDateRange = () => {
    if (!tournamentRound) return "";
    
    const startDate = new Date(tournamentRound.start_date);
    const endDate = new Date(tournamentRound.end_date);
    
    // Format to "Mar 27-28" style
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    
    return `${startMonth} ${startDay}-${endDay}`;
  };

  // Loading state
  if (isTournamentLoading || isBetsLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#A259FF" />
      </View>
    );
  }

  // Determine if we should show join button or main content
  if (!isParticipating()) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Trophy size={20} color="#FFD700" />
            <Text style={styles.title}>{tournament?.name || 'Tournament'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.rulesButton}
            onPress={handleNavigateToRules}
            activeOpacity={0.7}
          >
            <Book size={16} color="#EAEAEA" />
            <Text style={styles.rulesButtonText}>Rules</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.joinContainer}>
          <Text style={styles.joinText}>
            Join this tournament round to start placing bets!
          </Text>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={joinTournamentRound}
            activeOpacity={0.8}
          >
            <Plus size={20} color="white" />
            <Text style={styles.joinButtonText}>Join Tournament</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tournament Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.title}>{tournament?.name || 'Tournament'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.rulesButton}
          onPress={handleNavigateToRules}
          activeOpacity={0.7}
        >
          <Book size={16} color="#EAEAEA" />
          <Text style={styles.rulesButtonText}>Rules</Text>
        </TouchableOpacity>
      </View>

      {/* Round Info & Countdown */}
      <View style={styles.roundInfo}>
        <View style={styles.roundDetails}>
          <Text style={styles.roundName}>{tournamentRound?.round_name || roundName}</Text>
          <Text style={styles.roundDates}>{formatDateRange()}</Text>
        </View>
        {tournamentRound?.status === 'upcoming' && (
          <View style={styles.countdown}>
            <Clock size={16} color="#F59E0B" />
            <Text style={styles.countdownText}>
              Starts in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </Text>
          </View>
        )}
        {tournamentRound?.status === 'active' && (
          <View style={[styles.countdown, styles.activeCountdown]}>
            <Clock size={16} color="#10B981" />
            <Text style={[styles.countdownText, styles.activeCountdownText]}>
              Round Active - Place Your Bets!
            </Text>
          </View>
        )}
        {tournamentRound?.status === 'completed' && (
          <View style={[styles.countdown, styles.completedCountdown]}>
            <Trophy size={16} color="#EAEAEA" />
            <Text style={[styles.countdownText, styles.completedCountdownText]}>
              Round Completed
            </Text>
          </View>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
              <stat.icon size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Place Bets Button - only show if tournament is active */}
      {(tournamentRound?.status === 'active' || tournamentRound?.status === 'upcoming') && (
        <TouchableOpacity 
          style={[
            styles.placeBetsButton, 
            !canPlaceBets && styles.disabledButton
          ]}
          onPress={handleNavigateToPlaceBets}
          activeOpacity={canPlaceBets ? 0.8 : 1}
          disabled={!canPlaceBets}
        >
          <Plus size={20} color="white" />
          <Text style={[
            styles.placeBetsButtonText,
            !canPlaceBets && styles.disabledButtonText
          ]}>
            Place Tournament Bets
          </Text>
        </TouchableOpacity>
      )}

      {/* Bets Remaining Info - only show if tournament is active */}
      {(tournamentRound?.status === 'active' || tournamentRound?.status === 'upcoming') && (
        <View style={styles.betsInfo}>
          {!hasTokenBalance ? (
            <Text style={styles.noMoreBetsText}>
              0 tokens remaining
            </Text>
          ) : standardBetsRemaining <= 0 ? (
            <Text style={styles.noMoreBetsText}>
              You've used all your available bets for this round
            </Text>
          ) : (
            <Text style={styles.betsInfoText}>
              {standardBetsRemaining} standard bet{standardBetsRemaining !== 1 ? 's' : ''} remaining
            </Text>
          )}
        </View>
      )}
      
      {/* Completed tournament message */}
      {tournamentRound?.status === 'completed' && (
        <View style={styles.betsInfo}>
          <Text style={styles.betsInfoText}>
            Round completed. Your final rank: #{participant.rank || 'N/A'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  rulesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  rulesButtonText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  roundInfo: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  roundDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  roundName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  roundDates: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3D246C',
    padding: 10,
    borderRadius: 6,
  },
  activeCountdown: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  completedCountdown: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
  },
  countdownText: {
    color: '#F59E0B',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  activeCountdownText: {
    color: '#10B981',
  },
  completedCountdownText: {
    color: '#EAEAEA',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  placeBetsButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    shadowColor: '#A259FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#6B7280',
    shadowColor: 'transparent',
  },
  placeBetsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  disabledButtonText: {
    color: '#D1D5DB',
  },
  betsInfo: {
    backgroundColor: '#1A1A1D',
    borderRadius: 8,
    padding: 14,
  },
  betsInfoText: {
    color: '#A259FF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  noMoreBetsText: {
    color: '#F43F5E',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  joinContainer: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  joinText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  joinButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});