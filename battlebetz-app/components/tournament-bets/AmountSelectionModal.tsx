import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { X, DollarSign } from 'lucide-react-native';
import { BetSelection } from '@/types/betting';

interface AmountSelectionModalProps {
  visible: boolean;
  match: BetSelection | null;
  amount: string;
  onAmountChange: (amount: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  quickAmounts: number[];
}

const AmountSelectionModal: React.FC<AmountSelectionModalProps> = ({
  visible,
  match,
  amount,
  onAmountChange,
  onClose,
  onConfirm,
  quickAmounts
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select BBZ.T Amount</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color="#EAEAEA" />
            </TouchableOpacity>
          </View>

          {match && (
            <View style={styles.selectedMatchInfo}>
              <Text style={styles.selectedMatchup}>{match.matchup}</Text>
              <View style={styles.betDetails}>
                <Text style={styles.selectedTeam}>
                  {match.teamName}
                </Text>
                <Text style={styles.betType}>
                  {match.betType === 'moneyline' ? 'Moneyline' : 
                   match.betType === 'spread' ? 'Spread' : 'Total'}: 
                </Text>
                <Text style={[
                  styles.oddsDisplay,
                  match.odds < 0 ? styles.negativeOdds : styles.positiveOdds
                ]}>
                  {match.oddsDisplay}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.amountInputContainer}>
            <DollarSign size={20} color="#A259FF" />
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={onAmountChange}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#6c757d"
            />
            <Text style={styles.bbztText}>BBZ.T</Text>
          </View>

          <View style={styles.quickAmounts}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  parseInt(amount) === quickAmount && styles.quickAmountButtonSelected
                ]}
                onPress={() => onAmountChange(quickAmount.toString())}
              >
                <Text style={[
                  styles.quickAmountText,
                  parseInt(amount) === quickAmount && styles.quickAmountTextSelected
                ]}>
                  {quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.confirmButton,
              !amount && styles.confirmButtonDisabled
            ]}
            onPress={onConfirm}
            disabled={!amount}
          >
            <Text style={styles.confirmButtonText}>Confirm Amount</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 4,
  },
  selectedMatchInfo: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectedMatchup: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  betDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedTeam: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  betType: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  oddsDisplay: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  negativeOdds: {
    color: '#EF4444', // red
  },
  positiveOdds: {
    color: '#10B981', // green
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  bbztText: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '23%',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  quickAmountButtonSelected: {
    backgroundColor: '#3D246C',
    borderWidth: 2,
    borderColor: '#A259FF',
  },
  quickAmountText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  quickAmountTextSelected: {
    color: '#A259FF',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  confirmButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#4A4A4A',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default AmountSelectionModal;