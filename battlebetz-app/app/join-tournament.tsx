import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, X, Lock } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

// Custom hook for tournament join process
import { useTournamentJoin } from '@/hooks/useTournamentJoin';

// Modular components
import TournamentCard from '@/components/tournament/TournamentCard';
import PromoCodeSection from '@/components/tournament/PromoCodeSection';
import PaymentForm from '@/components/tournament/PaymentForm';
import SuccessModal from '@/components/tournament/SuccessModal';
import ProcessingModal from '@/components/tournament/ProcessingModal';

export default function JoinTournamentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const tournamentId = params.tournamentId as string;

  // Use the tournament join hook to manage state and actions
  const [
    {
      tournament,
      currentRound,
      isLoading,
      isProcessing,
      isSuccess,
      error,
      promoCode,
      appliedPromoCode,
      isPromoterCode,
      firstName,
      lastName,
      email
    },
    {
      fetchTournament,
      applyPromoCode,
      updateFirstName,
      updateLastName,
      updateEmail,
      updatePromoCode,
      handleSubmit,
      handleContinue,
      getTotalFee
    }
  ] = useTournamentJoin();

  // Fetch tournament data when component mounts or tournamentId changes
  useEffect(() => {
    if (tournamentId) {
      fetchTournament(tournamentId);
    }
  }, [tournamentId, fetchTournament]);

  // Handle continue after successful registration
  const onContinue = () => {
    handleContinue();
    router.push('/(tabs)/tournaments');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Tournament</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.push('/(tabs)')}
        >
          <X size={24} color="#EAEAEA" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A259FF" />
          <Text style={styles.loadingText}>Loading tournament details...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => tournamentId && fetchTournament(tournamentId)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Tournament Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tournament</Text>
            <Text style={styles.sectionDescription}>
              {tournament?.name || 'Tournament Details'}
            </Text>

            {tournament && <TournamentCard tournament={tournament} />}
          </View>

          {/* Payment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <Text style={styles.sectionDescription}>Add your details to complete registration</Text>

            {/* Promo Code Section */}
            <PromoCodeSection 
              promoCode={promoCode}
              setPromoCode={updatePromoCode}
              appliedPromoCode={appliedPromoCode}
              isPromoterCode={isPromoterCode}
              onApplyPromoCode={applyPromoCode}
            />

            {/* Payment Form */}
            <PaymentForm 
              firstName={firstName}
              setFirstName={updateFirstName}
              lastName={lastName}
              setLastName={updateLastName}
              email={email}
              setEmail={updateEmail}
            />
          </View>

          {/* Total and Submit */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>USD ${getTotalFee()}</Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                isProcessing && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Lock size={20} color="white" />
                  <Text style={styles.submitButtonText}>
                    Complete Registration
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.secureText}>
              🔒 Payments are securely processed by Finix
            </Text>
          </View>

          {/* Extra padding for keyboard */}
          <View style={styles.keyboardSpacer} />
        </ScrollView>
      )}

      {/* Success Modal */}
      <SuccessModal
        visible={isSuccess}
        tournament={tournament}
        onContinue={onContinue}
      />

      {/* Processing Payment Modal */}
      <ProcessingModal visible={isProcessing} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#1A1A1D',
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  content: {
    flex: 1,
    padding: 16,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  section: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  sectionDescription: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  totalSection: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  totalAmount: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  submitButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  keyboardSpacer: {
    height: Platform.OS === 'ios' ? 120 : 80,
  },
  secureText: {
    color: '#A259FF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  retryButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});