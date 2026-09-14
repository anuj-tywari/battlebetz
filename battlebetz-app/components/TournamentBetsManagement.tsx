import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trophy, Clock, ChevronRight, Target, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type TournamentBet = {
  id: string;
  game: string;
  pick: string;
  odds: string;
  amount: string;
  status: 'pending' | 'won' | 'lost';
  type: 'spread' | 'moneyline' | 'total' | 'parlay';
  placedAt: string;
};

const mockBets: TournamentBet[] = [
  {
    id: '1',
    game: '(1) Houston vs (16) Longwood',
    pick: 'Houston -21.5',
    odds: '-110',
    amount: 'BBZ.T 500',
    status: 'pending',
    type: 'spread',
    placedAt: '2025-03-27 12:30 PM EDT'
  },
  {
    id: '2',
    game: '(8) Nebraska vs (9) Texas A&M',
    pick: 'Texas A&M +1.5',
    odds: '-110',
    amount: 'BBZ.T 250',
    status: 'pending',
    type: 'spread',
    placedAt: '2025-03-27 12:45 PM EDT'
  },
  {
    id: '3',
    game: '(5) San Diego St vs (12) UAB',
    pick: 'Under 142.5',
    odds: '-110',
    amount: 'BBZ.T 1000',
    status: 'pending',
    type: 'total',
    placedAt: '2025-03-27 1:15 PM EDT'
  }
];

export default function TournamentBetsManagement() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.title}>Tournament Bets</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/my-activity')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#A259FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.betsContainer}>
        {mockBets.map((bet) => (
          <View key={bet.id} style={styles.betCard}>
            <View style={styles.betHeader}>
              <View style={styles.betTypeContainer}>
                {bet.type === 'spread' && <Target size={16} color="#A259FF" />}
                {bet.type === 'moneyline' && <TrendingUp size={16} color="#10B981" />}
                {bet.type === 'total' && <Trophy size={16} color="#F59E0B" />}
                <Text style={styles.betType}>{bet.type.toUpperCase()}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Clock size={14} color="#A259FF" />
                <Text style={styles.timeText}>{bet.placedAt}</Text>
              </View>
            </View>

            <View style={styles.betDetails}>
              <Text style={styles.gameText}>{bet.game}</Text>
              <View style={styles.betInfo}>
                <View style={styles.betPick}>
                  <Text style={styles.pickText}>{bet.pick}</Text>
                  <Text style={styles.oddsText}>{bet.odds}</Text>
                </View>
                <Text style={styles.amountText}>{bet.amount}</Text>
              </View>
            </View>

            <View style={styles.betStatus}>
              {bet.status === 'pending' && (
                <View style={[styles.statusBadge, styles.pendingBadge]}>
                  <Text style={styles.statusText}>PENDING</Text>
                </View>
              )}
              {bet.status === 'won' && (
                <View style={[styles.statusBadge, styles.wonBadge]}>
                  <Text style={styles.statusText}>WON</Text>
                </View>
              )}
              {bet.status === 'lost' && (
                <View style={[styles.statusBadge, styles.lostBadge]}>
                  <Text style={styles.statusText}>LOST</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Bets Placed</Text>
          <Text style={styles.summaryValue}>3/5</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>BBZ.T Wagered</Text>
          <Text style={styles.summaryValue}>1,750</Text>
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
  header: {
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
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  betsContainer: {
    gap: 12,
  },
  betCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  betTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2E2E3A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  betType: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  betDetails: {
    backgroundColor: '#2E2E3A',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  gameText: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  betInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  betPick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  oddsText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  amountText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  betStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  pendingBadge: {
    backgroundColor: '#F59E0B',
  },
  wonBadge: {
    backgroundColor: '#10B981',
  },
  lostBadge: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  summary: {
    marginTop: 16,
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#A259FF',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  summaryValue: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});