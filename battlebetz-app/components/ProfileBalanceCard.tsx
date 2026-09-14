import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { DollarSign, CreditCard, Plus, X } from 'lucide-react-native';
import { useProfileData } from '@/hooks/useProfileData';

const BBZ_PACKAGES = [
  { id: '1', bbz: 100, price: 3, popular: false },
  { id: '2', bbz: 1000, price: 10, popular: true },
  { id: '3', bbz: 4000, price: 20, popular: false },
];

export default function ProfileBalanceCard() {
  const { userProfile, userMetrics } = useProfileData();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get the balance values with fallbacks
  const bbzBalance = userMetrics?.bbz_balance || userProfile?.bbz_balance || 0;
  const bbztBalance = userProfile?.bbzt_balance || 0;  // Default to 0 as specified
  const usdBalance = userMetrics?.usd_balance || 0;

  const handleTopUp = () => {
    // In a real app, this would process the payment and update the balance
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setShowTopUpModal(false);
      setSelectedPackage(null);
    }, 2000);
  };

  return (
    <>
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceTitle}>Balance</Text>
        </View>
        <View style={styles.balanceItems}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>BBZ Balance</Text>
            <Text style={styles.balanceValue}>BBZ {bbzBalance.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>BBZ.T Balance</Text>
            <Text style={[styles.balanceValue, styles.tournamentBalance]}>BBZ.T {bbztBalance.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>USD Balance</Text>
            <Text style={styles.balanceValue}>USD {usdBalance.toFixed(2)}</Text>
          </View>
        </View>
        {/* <TouchableOpacity 
          style={styles.addFundsButton}
          onPress={() => setShowTopUpModal(true)}
        >
          <DollarSign size={16} color="white" />
          <Text style={styles.addFundsButtonText}>Top up your BBZ</Text>
        </TouchableOpacity> */}
      </View>

      <Modal
        visible={showTopUpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTopUpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Top up BBZ</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowTopUpModal(false)}
              >
                <X size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>

            <View style={styles.packagesContainer}>
              {BBZ_PACKAGES.map((pkg) => (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.packageCard,
                    selectedPackage === pkg.id && styles.packageCardSelected,
                    pkg.popular && styles.packageCardPopular
                  ]}
                  onPress={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>BEST VALUE</Text>
                    </View>
                  )}
                  <Text style={styles.packageBBZ}>BBZ {pkg.bbz.toLocaleString()}</Text>
                  <Text style={styles.packagePrice}>${pkg.price}</Text>
                  <Text style={styles.packageRate}>
                    ${(pkg.price / pkg.bbz * 1000).toFixed(2)} per 1000 BBZ
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.paymentSection}>
              <View style={styles.savedCard}>
                <CreditCard size={20} color="#EAEAEA" />
                <Text style={styles.savedCardText}>•••• 4242</Text>
                <TouchableOpacity style={styles.changeCardButton}>
                  <Text style={styles.changeCardText}>Change</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[
                  styles.topUpButton,
                  !selectedPackage && styles.topUpButtonDisabled
                ]}
                disabled={!selectedPackage}
                onPress={handleTopUp}
              >
                <Text style={styles.topUpButtonText}>
                  {selectedPackage 
                    ? `Top up ${BBZ_PACKAGES.find(p => p.id === selectedPackage)?.bbz.toLocaleString()} BBZ`
                    : 'Select an amount'}
                </Text>
              </TouchableOpacity>
            </View>

            {showConfirmation && (
              <View style={styles.confirmationOverlay}>
                <View style={styles.confirmationContent}>
                  <View style={styles.confirmationIcon}>
                    <Plus size={32} color="#10B981" />
                  </View>
                  <Text style={styles.confirmationTitle}>Top-up Successful!</Text>
                  <Text style={styles.confirmationText}>
                    Your BBZ balance has been updated
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: '#3D246C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  balanceHeader: {
    marginBottom: 16,
  },
  balanceTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  balanceItems: {
    marginBottom: 16,
    gap: 12,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  balanceValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  tournamentBalance: {
    color: '#10B981',
  },
  addFundsButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addFundsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1D',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '90%',
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
  packagesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  packageCard: {
    flex: 1,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packageCardSelected: {
    borderColor: '#A259FF',
    backgroundColor: '#3D246C',
  },
  packageCardPopular: {
    backgroundColor: '#3D246C',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#10B981',
    borderRadius: 12,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  packageBBZ: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  packagePrice: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  packageRate: {
    color: '#A259FF',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  paymentSection: {
    gap: 16,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  savedCardText: {
    color: '#EAEAEA',
    fontSize: 16,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  changeCardButton: {
    backgroundColor: '#4A4A4A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  changeCardText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  topUpButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  topUpButtonDisabled: {
    backgroundColor: '#4A4A4A',
  },
  topUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationContent: {
    alignItems: 'center',
    gap: 16,
  },
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationTitle: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  confirmationText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});