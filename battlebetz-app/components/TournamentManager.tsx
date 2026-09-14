import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Trophy, DollarSign, Swords, TrendingUp, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function TournamentManager() {
  const router = useRouter();

  const roundInfo = {
    current: 1,
    name: 'Sweet Sixteen',
    totalBets: 32,
    standardBets: 24,
    parlays: 8,
    betsPlaced: 12,
    balance: 1000,
    deadline: 'March 27, 2025 7:00 PM EST'
  };

  const renderProgress = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${percentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{completed} of {total}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Trophy size={24} color="#FFD700" />
          <View>
            <Text style={styles.roundTitle}>Round {roundInfo.current}</Text>
            <Text style={styles.roundName}>{roundInfo.name}</Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>BBZ.T Balance</Text>
          <Text style={styles.balanceValue}>{roundInfo.balance}</Text>
        </View>
      </View>

      <View style={styles.deadlineContainer}>
        <Text style={styles.deadlineLabel}>Betting Deadline</Text>
        <Text style={styles.deadlineValue}>{roundInfo.deadline}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Swords size={16} color="#A259FF" />
            <Text style={styles.statTitle}>Standard Bets</Text>
          </View>
          {renderProgress(roundInfo.betsPlaced, roundInfo.standardBets)}
          <Text style={styles.statDescription}>
            Single game bets with -110 standard odds
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.statTitle}>Parlays</Text>
          </View>
          {renderProgress(0, roundInfo.parlays)}
          <Text style={styles.statDescription}>
            Multi-game bets with enhanced odds
          </Text>
        </View>
      </View>

      <View style={styles.bettingRules}>
        <Text style={styles.rulesTitle}>Round 1 Betting Rules</Text>
        <View style={styles.ruleItem}>
          <DollarSign size={16} color="#A259FF" />
          <Text style={styles.ruleText}>
            Minimum 24 standard bets required
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <DollarSign size={16} color="#A259FF" />
          <Text style={styles.ruleText}>
            Maximum 8 parlay bets allowed
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <DollarSign size={16} color="#A259FF" />
          <Text style={styles.ruleText}>
            Each bet must be between BBZ.T 10-500
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.placeBetsButton}
        onPress={() => router.push('/place-tournament-bets')}
      >
        <Text style={styles.placeBetsText}>Place Tournament Bets</Text>
        <ChevronRight size={20} color="white" />
      </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roundTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  roundName: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    color: '#A259FF',
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  balanceValue: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  deadlineContainer: {
    backgroundColor: '#1A1A1D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  deadlineLabel: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
  },
  deadlineValue: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1D',
    borderRadius: 8,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statTitle: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2E2E3A',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A259FF',
    borderRadius: 2,
  },
  progressText: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  statDescription: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  bettingRules: {
    backgroundColor: '#1A1A1D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  rulesTitle: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ruleText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  placeBetsButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeBetsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});