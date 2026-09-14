import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Share2, DollarSign } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

type PromoterCardProps = {
  promoCode: string;
  onShowQR: () => void;
};

export default function PromoterCard({ promoCode, onShowQR }: PromoterCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.qrSection}>
        <View style={styles.qrContainer}>
          <QRCode
            value={`https://app.battlebetz.com/promo?promoCode=${promoCode}`}
            size={120}
            color="#EAEAEA"
            backgroundColor="transparent"
          />
        </View>
        <View style={styles.promoInfo}>
          <Text style={styles.promoTitle}>Your Promo Code</Text>
          <Text style={styles.promoCode}>{promoCode}</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={onShowQR}
          >
            <Share2 size={16} color="white" />
            <Text style={styles.shareButtonText}>Share Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.benefitsContainer}>
        <View style={styles.benefitHeader}>
          <DollarSign size={20} color="#10B981" />
          <Text style={styles.benefitsTitle}>Promoter Benefit</Text>
        </View>
        <View style={styles.benefitCard}>
          <Text style={styles.benefitAmount}>20%</Text>
          <Text style={styles.benefitText}>
            of our tournament fee for each referral who joins a tournament
          </Text>
        </View>
        <Text style={styles.benefitExample}>
          Example: If your referral joins a $15 tournament, you earn $3
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3D246C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
  },
  promoInfo: {
    flex: 1,
  },
  promoTitle: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  promoCode: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  shareButton: {
    backgroundColor: '#A259FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  benefitsContainer: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 16,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  benefitsTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  benefitCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  benefitAmount: {
    color: '#10B981',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  benefitText: {
    color: '#EAEAEA',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  benefitExample: {
    color: '#A259FF',
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: 'Poppins-Regular',
  },
});