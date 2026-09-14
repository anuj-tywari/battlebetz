import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trophy, Clock, ChevronRight, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.signUpContainer}>
        <View style={styles.signUpContent}>
          <Trophy size={32} color="#A259FF" />
          <Text style={styles.signUpTitle}>Join March Madness 2025</Text>
          <Text style={styles.signUpDescription}>
            Sign up now to place your tournament bets and compete for the $5,000 prize pool
          </Text>
          <View style={styles.signUpButtons}>
            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.learnMoreButton}
              onPress={() => router.push('/about-us')}
            >
              <Text style={styles.learnMoreButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={16} color="#A259FF" />
              <Text style={styles.statValue}>12,450+</Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
            <View style={styles.statItem}>
              <Trophy size={16} color="#FFD700" />
              <Text style={styles.statValue}>$5,000</Text>
              <Text style={styles.statLabel}>Prize Pool</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={16} color="#F59E0B" />
              <Text style={styles.statValue}>8 Days</Text>
              <Text style={styles.statLabel}>Until Start</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bets.map((bet) => (
        <View key={bet.id} style={styles.betCard}>
          <View style={styles.betInfo}>
            <View style={styles.matchInfo}>
              <Text style={styles.matchText} numberOfLines={1}>{bet.match}</Text>
              <View style={styles.timeContainer}>
                <Clock size={12} color="#A259FF" />
                <Text style={styles.timeText}>{bet.gameTime}</Text>
              </View>
            </View>

            <View style={styles.betDetails}>
              <View style={styles.pickContainer}>
                <Text style={styles.pickText}>{bet.pick}</Text>
                <Text style={styles.oddsText}>{bet.odds}</Text>
              </View>
              <Text style={styles.amountText}>{bet.amount}</Text>
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
    gap: 4,
  },
  signUpContainer: {
    backgroundColor: '#3D246C',
    borderRadius: 12,
    padding: 24,
  },
  signUpContent: {
    alignItems: 'center',
  },
  signUpTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  signUpDescription: {
    color: '#A259FF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
  },
  signUpButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  signUpButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  learnMoreButton: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  learnMoreButtonText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  betCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  betInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginBottom: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#A259FF',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  betDetails: {
    alignItems: 'flex-end',
  },
  pickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickText: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  oddsText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  amountText: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 2,
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
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