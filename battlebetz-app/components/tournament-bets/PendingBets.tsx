import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PendingBet } from '@/types/betting';
import PendingBetItem from './PendingBetItem';

interface PendingBetsProps {
  bets: PendingBet[];
  onRemoveBet: (matchId: string, team: 'team1' | 'team2', betType: 'spread' | 'total' | 'moneyline') => void;
}

const PendingBets: React.FC<PendingBetsProps> = ({ bets, onRemoveBet }) => {
  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <View style={styles.pendingBetsSection}>
      <Text style={styles.pendingBetsTitle}>Your Pending Bets</Text>
      
      {bets.map((bet, index) => (
        <PendingBetItem 
          key={`${bet.matchId}-${bet.team}-${bet.betType}-${index}`}
          bet={bet}
          onRemove={onRemoveBet}
        />
      ))}
      
      <View style={styles.pendingBetsSummary}>
        <Text style={styles.pendingBetsSummaryText}>
          Total: {totalAmount} BBZ.T
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pendingBetsSection: {
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  pendingBetsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  pendingBetsSummary: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
    paddingTop: 12,
  },
  pendingBetsSummaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default PendingBets;