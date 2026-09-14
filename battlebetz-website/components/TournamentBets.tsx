import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trophy, Clock, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type TournamentBet = {
  id: string;
  tournament: string;
  round: number;
  match: string;
  pick: string;
  odds: string;
  amount: string;
  status: 'pending' | 'won' | 'lost';
  gameTime: string;
};

type TournamentBetsProps = {
  bets: TournamentBet[];
  onViewAll?: () => void;
};

export default function TournamentBets({ bets, onViewAll }: TournamentBetsProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Trophy size={20} color="#F59E0B" />
          <Text style={styles.title}>Tournament Bets</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={onViewAll}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#A259FF" />
        </TouchableOpacity>
      </View>

      {bets.map((bet) => (
        <View key={bet.id} style={styles.betCard}>
          <View style={styles.betHeader}>
            <Text style={styles.tournamentName}>{bet.tournament}</Text>
            <View style={styles.roundBadge}>
              <Text style={styles.roundText}>Round {bet.round}</Text>
            </View>
          </View>

          <View style={styles.betDetails}>
            <Text style={styles.matchText}>{bet.match}</Text>
            <View style={styles.betInfo}>
              <View style={styles.pickContainer}>
                <Text style={styles.pickLabel}>Your Pick:</Text>
                <Text style={styles.pickText}>{bet.pick}</Text>
              </View>
              <View style={styles.oddsContainer}>
                <Text style={styles.oddsLabel}>Odds:</Text>
                <Text style={styles.oddsText}>{bet.odds}</Text>
              </View>
            </View>
            <View style={styles.betFooter}>
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Amount:</Text>
                <Text style={styles.amountText}>{bet.amount}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Clock size={14} color="#A259FF" />
                <Text style={styles.timeText}>{bet.gameTime}</Text>
              </View>
            </View>
          </View>

          {bet.status !== 'pending' && (
            <View style={[
              styles.statusBadge,
              bet.status === 'won' ? styles.wonBadge : styles.lostBadge
            ]}>
              <Text style={styles.statusText}>
                {bet.status === 'won' ? 'WON' : 'LOST'}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
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
    color: '#F59E0B',
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
  betCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  roundBadge: {
    backgroundColor: '#3D246C',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  roundText: {
    color: '#A259FF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  betDetails: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  matchText: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  betInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pickContainer: {
    flex: 1,
  },
  pickLabel: {
    color: '#A259FF',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  pickText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  oddsContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  oddsLabel: {
    color: '#A259FF',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  oddsText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    color: '#A259FF',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  amountText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
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
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
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
});