import React from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';

interface ProcessingModalProps {
  visible: boolean;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.processingModalContent}>
          <ActivityIndicator 
            size="large" 
            color="#A259FF" 
            style={styles.processingIndicator} 
          />
          <Text style={styles.processingTitle}>Processing Payment</Text>
          <Text style={styles.processingDescription}>
            Please wait while we verify your payment...
          </Text>
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
  processingModalContent: {
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  processingIndicator: {
    marginBottom: 16,
  },
  processingTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  processingDescription: {
    color: '#A259FF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default ProcessingModal;