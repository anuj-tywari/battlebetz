import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { PendingBet } from '@/types/betting';

interface PendingBetItemProps {
  bet: PendingBet;
  onRemove: (matchId: string, team: 'team1' | 'team2', betType: 'spread' | 'total' | 'moneyline') => void;
}

const PendingBetItem: React.FC<PendingBetItemProps> = ({ bet, onRemove }) => {
  return (
    <View style={styles.pendingBetCard}>
      <View style={styles.pendingBetInfo}>
        <Text style={styles.pendingBetTeam}>{bet.teamName}</Text>
        <Text style={styles.pendingBetOdds}>
          {bet.betType === 'moneyline' ? 'ML' : 
           bet.betType === 'spread' ? 'Spread' : 'Total'}: {bet.oddsDisplay}
        </Text>
        <Text style={styles.pendingBetAmount}>{bet.amount} BBZ.T</Text>
      </View>
      <TouchableOpacity
        style={styles.removeBetButton}
        onPress={() => onRemove(bet.matchId, bet.team, bet.betType)}
      >
        <X size={16} color="#FF4D4F" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pendingBetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  pendingBetInfo: {
    flex: 1,
  },
  pendingBetTeam: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  pendingBetOdds: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  pendingBetAmount: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  removeBetButton: {
    padding: 8,
  },
});

export default PendingBetItem;