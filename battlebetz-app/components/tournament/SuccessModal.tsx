import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { Tournament } from '@/services/tournamentService';

interface SuccessModalProps {
  visible: boolean;
  tournament: Tournament | null;
  onContinue: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  tournament,
  onContinue
}) => {
  if (!tournament) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Trophy size={48} color="#FFD700" />
          <Text style={styles.modalTitle}>Welcome to {tournament.name}!</Text>
          <Text style={styles.modalDescription}>
            Your tournament balance has been credited with BBZ.T 1,000. Good luck in the tournament!
          </Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Tournament Balance</Text>
            <Text style={styles.balanceValue}>BBZ.T 1,000</Text>
          </View>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={onContinue}
          >
            <Text style={styles.continueButtonText}>Continue to Tournament</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    alignItems: 'center',
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  modalDescription: {
    color: '#A259FF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  balanceCard: {
    backgroundColor: '#3D246C',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  balanceValue: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  continueButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SuccessModal;