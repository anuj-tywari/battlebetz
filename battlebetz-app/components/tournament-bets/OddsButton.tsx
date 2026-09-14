import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { BetType, TeamType } from '@/types/betting';

interface OddsButtonProps {
  matchId: string;
  team: TeamType;
  betType: BetType;
  oddsDisplay: string;
  isNegative?: boolean;
  isSelected: boolean;
  onSelect: (matchId: string, team: TeamType, betType: BetType, oddsDisplay: string, subName?: string) => void;
}

const OddsButton: React.FC<OddsButtonProps> = ({
  matchId,
  team,
  betType,
  oddsDisplay,
  isNegative = false,
  isSelected,
  onSelect
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.oddsItem,
        isSelected && styles.oddsItemSelected
      ]}
      onPress={() => onSelect(matchId, team, betType, oddsDisplay)}
    >
      <Text style={[
        styles.oddsValue, 
        isNegative && styles.negativeOdds,
        isSelected && styles.oddsValueSelected
      ]}>
        {oddsDisplay}
      </Text>
      {isSelected && (
        <View style={styles.checkmark}>
          <Check size={10} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  oddsItem: {
    width: 72,
    alignItems: 'center',
    padding: 4,
    borderRadius: 4,
    position: 'relative',
  },
  oddsItemSelected: {
    backgroundColor: '#3D246C',
  },
  oddsValue: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  oddsValueSelected: {
    color: '#FFFFFF',
  },
  negativeOdds: {
    color: '#EF4444', // red
  },
  positiveOdds: {
    color: '#10B981', // green
  },
  checkmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 2,
  },
});

export default OddsButton;