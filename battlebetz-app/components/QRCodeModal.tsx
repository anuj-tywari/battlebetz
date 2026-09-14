import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform
} from 'react-native';
import { X, Share2 } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard'

type QRCodeModalProps = {
  visible: boolean;
  onClose: () => void;
  promoCode: string;
};

export default function QRCodeModal({
  visible,
  onClose,
  promoCode,
}: QRCodeModalProps) {
  const handleShare = async () => {
    try {
      // Generate the full URL for the promo code
      const baseUrl = 'https://app.battlebetz.com';
      const url = `${baseUrl}/promo?promoCode=${promoCode}`;
      const message = `Join Battle Betz using my promo code: ${promoCode}\n${url}`;

      if (Platform.OS === 'web') {
        // For web, create a temporary textarea to copy to clipboard
        await Clipboard.setStringAsync(url)
        alert('Promo code and link copied to clipboard!');
      } else {
        // For native platforms, use Share API
        await Share.share({
          message,
          url: Platform.OS === 'ios' ? url : undefined,
          title: 'Battle Betz Promo Code',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Please try again.');
    }
  };

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
            <Text style={styles.modalTitle}>Scan QR Code</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#EAEAEA" />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <QRCode
              value={`https://app.battlebetz.com/promo?promoCode=${promoCode}`}
              size={200}
              color="#EAEAEA"
              backgroundColor="transparent"
            />
          </View>

          <View style={styles.promoCodeContainer}>
            <Text style={styles.promoCodeLabel}>Your Promo Code</Text>
            <Text style={styles.promoCodeText}>{promoCode}</Text>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color="white" />
            <Text style={styles.shareButtonText}>
              {Platform.OS === 'web' ? 'Copy to Clipboard' : 'Share Code'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.description}>
            Share this QR code with others to earn referral rewards when they
            join Battle Betz
          </Text>
        </View>
      </View>
    </Modal>
  );
}

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
    maxWidth: 320,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 4,
  },
  qrContainer: {
    padding: 24,
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    marginBottom: 24,
  },
  promoCodeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  promoCodeLabel: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  promoCodeText: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  shareButton: {
    backgroundColor: '#A259FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    color: '#EAEAEA',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    fontFamily: 'Poppins-Regular',
  },
});
