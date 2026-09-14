import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchTournamentById, 
  fetchCurrentRound, 
  addTournamentParticipant,
  Tournament,
  TournamentRound
} from '@/services/tournamentService';
import {
  processTournamentPayment,
  verifyPayment,
  setupPaymentDeepLinkHandling,
  BuyerInfo
} from '@/services/paymentService';

export interface TournamentJoinState {
  tournament: Tournament | null;
  currentRound: TournamentRound | null;
  isLoading: boolean;
  isProcessing: boolean;
  isSuccess: boolean;
  error: string | null;
  promoCode: string;
  appliedPromoCode: string | null;
  isPromoterCode: boolean;
  firstName: string;
  lastName: string;
  email: string;
  checkoutFormId: string | null;
  paymentInitiated: boolean;
}

export interface TournamentJoinActions {
  fetchTournament: (tournamentId: string) => Promise<void>;
  applyPromoCode: () => void;
  updateFirstName: (value: string) => void;
  updateLastName: (value: string) => void;
  updateEmail: (value: string) => void;
  updatePromoCode: (value: string) => void;
  handleSubmit: () => Promise<void>;
  handleContinue: () => void;
  getTotalFee: () => number;
}

/**
 * Custom hook to manage the tournament join process
 */
export const useTournamentJoin = (): [TournamentJoinState, TournamentJoinActions] => {
  const { user } = useAuth();
  const paymentVerificationAttempts = useRef(0);
  
  // State management
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [currentRound, setCurrentRound] = useState<TournamentRound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [isPromoterCode, setIsPromoterCode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Payment state
  const [checkoutFormId, setCheckoutFormId] = useState<string | null>(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  
  // Fetch tournament data
  const fetchTournamentData = useCallback(async (tournamentId: string) => {
    if (!tournamentId) {
      setError('No tournament ID provided');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch tournament details
      const tournamentData = await fetchTournamentById(tournamentId);
      if (!tournamentData) {
        throw new Error('Tournament not found');
      }
      
      setTournament(tournamentData);
      
      // Fetch the current round for this tournament
      const roundData = await fetchCurrentRound(tournamentId);
      if (roundData) {
        setCurrentRound(roundData);
      }
      
      // Load stored checkout form ID if available
      const storedId = await AsyncStorage.getItem('currentCheckoutFormId');
      if (storedId) {
        setCheckoutFormId(storedId);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load tournament data');
      console.error('Error fetching tournament data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Apply promo code
  const applyPromoCode = useCallback(() => {
    if (!promoCode) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    // Check for promoter code
    if (promoCode.toUpperCase() === 'PROMOTER2025') {
      setIsPromoterCode(true);
      setAppliedPromoCode(promoCode);
      Alert.alert(
        'Promoter Code Applied!', 
        'You will get $10 off your entry'
      );
      return;
    }

    // Check for regular promo code
    if (promoCode.toUpperCase() === 'MARCH2025') {
      setAppliedPromoCode(promoCode);
      Alert.alert(
        'Promo Code Applied!', 
        'You can now get $10 off your tournament entry'
      );
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code');
    }
  }, [promoCode]);
  
  // Calculate the total fee with any discounts applied
  const getTotalFee = useCallback(() => {
    if (!tournament) return 0;
    
    let total = tournament.entry_fee;
    if (appliedPromoCode) {
      total -= 10; // $10 discount for promo codes
    }
    return Math.max(total, 0); // Ensure total is never negative
  }, [tournament, appliedPromoCode]);
  
  // Register user for the tournament after successful payment
  const completeRegistration = useCallback(async () => {
    if (!user || !tournament || !currentRound) {
      console.error('Missing required data for registration:', { user, tournament, currentRound });
      return;
    }
    
    try {
      // Add user to tournament as a participant
      await addTournamentParticipant(
        user.id,
        tournament.id,
        currentRound.id,
        1000 // Default tournament tokens
      );
      
      // Show success state
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error completing registration:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Registration could not be completed. Please contact support.');
    }
  }, [user, tournament, currentRound]);
  
  // Verify payment and complete registration
  const verifyAndCompletePayment = useCallback(async (formId: string) => {
    if (!formId) {
      setIsProcessing(false);
      Alert.alert('Error', 'Could not verify payment: Missing reference ID');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Reset verification attempts counter
      paymentVerificationAttempts.current = 0;
      
      // Verify payment with retry logic
      const result = await verifyPayment(
        formId,
        20, // max attempts
        completeRegistration
      );
      
      if (!result.success) {
        setIsProcessing(false);
        Alert.alert(
          'Payment Verification Issue',
          'We could not confirm your payment status. If you completed payment, please contact support with reference ID: ' + formId
        );
      }
    } catch (error) {
      console.error('Error in verifyAndCompletePayment:', error);
      setIsProcessing(false);
      Alert.alert(
        'Payment Verification Error',
        'We encountered an error verifying your payment. Please contact support with reference: ' + formId
      );
    }
  }, [completeRegistration]);
  
  // Set up payment deep link handling
  useEffect(() => {
    const cleanup = setupPaymentDeepLinkHandling(
      checkoutFormId,
      verifyAndCompletePayment,
      paymentInitiated,
      Linking
    );
    
    return cleanup;
  }, [checkoutFormId, verifyAndCompletePayment, paymentInitiated]);
  
  // Process tournament payment
  const handlePayment = useCallback(async () => {
    if (!tournament) {
      Alert.alert('Error', 'Tournament details not available');
      return;
    }

    try {
      setIsProcessing(true);
      setPaymentInitiated(true);
      
      // Prepare payment details
      const tournamentName = tournament.name;
      const tournamentDescription = `Registration for ${tournament.name}`;
      const feeAmountCents = getTotalFee() * 100; // Convert dollars to cents
      
      // Prepare buyer details
      const buyerInfo: BuyerInfo = {
        first_name: firstName,
        last_name: lastName,
        email: email,
      };
      
      // Process the payment
      const paymentResult = await processTournamentPayment(
        tournamentName,
        tournamentDescription,
        feeAmountCents,
        buyerInfo
      );
      
      if (!paymentResult.success) {
        throw new Error('Failed to initiate payment process');
      }
      
      // Store the checkout form ID for later verification
      if (paymentResult.checkoutFormId) {
        setCheckoutFormId(paymentResult.checkoutFormId);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Error',
        'There was an error processing your payment. Please try again later.'
      );
      setIsProcessing(false);
      setPaymentInitiated(false);
    }
  }, [tournament, firstName, lastName, email, getTotalFee]);
  
  // Submit form and process payment
  const handleSubmit = useCallback(async () => {
    // Basic validation
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'Please enter your details to continue');
      return;
    }

    try {
      // For testing purposes, bypass payment and go straight to registration
      // In production, use: await handlePayment();
      await completeRegistration();
    } catch (err) {
      console.error('Error in submission:', err);
      Alert.alert('Error', 'Payment process could not be initiated. Please try again.');
    }
  }, [firstName, lastName, email, handlePayment, completeRegistration]);
  
  // Handle continue after successful registration
  const handleContinue = useCallback(() => {
    setIsSuccess(false);
    // Navigation would be handled by the component
  }, []);
  
  // Form field updaters
  const updateFirstName = useCallback((value: string) => setFirstName(value), []);
  const updateLastName = useCallback((value: string) => setLastName(value), []);
  const updateEmail = useCallback((value: string) => setEmail(value), []);
  const updatePromoCode = useCallback((value: string) => setPromoCode(value), []);
  
  // Combine state and actions
  const state: TournamentJoinState = {
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
    email,
    checkoutFormId,
    paymentInitiated
  };
  
  const actions: TournamentJoinActions = {
    fetchTournament: fetchTournamentData,
    applyPromoCode,
    updateFirstName,
    updateLastName,
    updateEmail,
    updatePromoCode,
    handleSubmit,
    handleContinue,
    getTotalFee
  };
  
  return [state, actions];
};