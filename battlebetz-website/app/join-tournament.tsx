import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Platform,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Alert
} from 'react-native';
import { 
  ArrowLeft, 
  CreditCard, 
  DollarSign, 
  Trophy,
  Check,
  ChevronDown,
  X,
  Tag,
  Users
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function JoinTournamentScreen() {
  const router = useRouter();
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([]);
  const [otherTournament, setOtherTournament] = useState('');
  const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [extraTournament, setExtraTournament] = useState<string | null>(null);
  const [isPromoterCode, setIsPromoterCode] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < cleaned.length && i < 16; i += 4) {
      parts.push(cleaned.substr(i, 4));
    }
    return parts.join(' ');
  };

  // Format expiry date
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Handle expiry date input
  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setExpiryDate(formatted);
  };

  // Handle card number input
  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const tournaments = [
    { id: 'march-madness', name: 'March Madness', fee: 15 },
    { id: 'ipl', name: 'IPL League', fee: 15 },
    { id: 'nba-playoffs', name: 'NBA Play-offs', fee: 15 },
    { id: 'stanley-cup', name: 'NHL Stanley Cup', fee: 15 }
  ];

  const toggleTournament = (tournamentId: string) => {
    setSelectedTournaments(prev => 
      prev.includes(tournamentId)
        ? prev.filter(id => id !== tournamentId)
        : [...prev, tournamentId]
    );
  };

  const getTotalFee = () => {
    let total = tournaments
      .filter(t => selectedTournaments.includes(t.id))
      .reduce((sum, t) => sum + t.fee, 0);

    // Apply promoter code discount when more than 2 competitions are selected
    if (isPromoterCode && selectedTournaments.length > 2) {
      total -= 10;
    }
    // Apply regular promo code discount if total is over $30
    else if (appliedPromoCode && total >= 30) {
      total -= 10;
    }

    return total;
  };

  const handleApplyPromoCode = () => {
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
        'You will get $10 off when you select more than 2 competitions'
      );
      return;
    }

    // Check for regular promo code
    if (promoCode.toUpperCase() === 'MARCH2025') {
      setAppliedPromoCode(promoCode);
      Alert.alert(
        'Promo Code Applied!', 
        'You can now add another tournament for $5 or get $10 off when total is over $30'
      );
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code');
    }
  };

  const handleAddExtraTournament = () => {
    if (!appliedPromoCode) return;
    
    Alert.alert(
      'Add Tournament',
      'Select an additional tournament for just $5',
      tournaments
        .filter(t => !selectedTournaments.includes(t.id))
        .map(t => ({
          text: t.name,
          onPress: () => {
            setExtraTournament(t.id);
            setSelectedTournaments(prev => [...prev, t.id]);
          }
        }))
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#EAEAEA" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Join Tournament</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Tournament Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Tournaments</Text>
              <Text style={styles.sectionDescription}>Enter tournaments that you want to join</Text>

              <View style={styles.tournamentList}>
                {tournaments.map(tournament => (
                  <TouchableOpacity
                    key={tournament.id}
                    style={[
                      styles.tournamentOption,
                      selectedTournaments.includes(tournament.id) && styles.tournamentOptionSelected,
                      extraTournament === tournament.id && styles.tournamentOptionPromo
                    ]}
                    onPress={() => toggleTournament(tournament.id)}
                  >
                    <View style={styles.tournamentInfo}>
                      <Trophy size={20} color={selectedTournaments.includes(tournament.id) ? '#A259FF' : '#EAEAEA'} />
                      <Text style={styles.tournamentName}>{tournament.name}</Text>
                    </View>
                    <View style={styles.tournamentFee}>
                      <Text style={[
                        styles.feeAmount,
                        extraTournament === tournament.id && styles.promoFeeAmount
                      ]}>
                        {extraTournament === tournament.id ? 'USD 5' : `USD ${tournament.fee}`}
                      </Text>
                      {selectedTournaments.includes(tournament.id) && (
                        <Check size={20} color="#A259FF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}

                <View style={styles.otherTournamentContainer}>
                  <TextInput
                    style={styles.otherTournamentInput}
                    placeholder="Enter other tournament name"
                    placeholderTextColor="#6c757d"
                    value={otherTournament}
                    onChangeText={setOtherTournament}
                  />
                </View>
              </View>
            </View>

            {/* Payment Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Details</Text>
              <Text style={styles.sectionDescription}>Add your card to complete registration</Text>

              {/* Promo Code Section */}
              <View style={styles.promoCodeSection}>
                <View style={styles.promoCodeContainer}>
                  <View style={styles.promoCodeInput}>
                    {isPromoterCode ? (
                      <Users size={20} color="#10B981" />
                    ) : (
                      <Tag size={20} color="#A259FF" />
                    )}
                    <TextInput
                      style={styles.promoCodeTextInput}
                      placeholder="Enter promo code"
                      placeholderTextColor="#6c757d"
                      value={promoCode}
                      onChangeText={setPromoCode}
                      autoCapitalize="characters"
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.applyButton}
                    onPress={handleApplyPromoCode}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {appliedPromoCode && (
                  <View style={[
                    styles.promoAppliedContainer,
                    isPromoterCode && styles.promoterPromoContainer
                  ]}>
                    <Check size={16} color={isPromoterCode ? '#10B981' : '#A259FF'} />
                    <Text style={[
                      styles.promoAppliedText,
                      isPromoterCode && styles.promoterPromoText
                    ]}>
                      {isPromoterCode 
                        ? 'Promoter code applied! Select 3+ tournaments for $10 off'
                        : `Promo code applied! ${getTotalFee() >= 30 
                            ? '$10 discount applied'
                            : 'Add another tournament for $5'}`
                      }
                    </Text>
                    {!isPromoterCode && getTotalFee() < 30 && !extraTournament && (
                      <TouchableOpacity 
                        style={styles.addTournamentButton}
                        onPress={handleAddExtraTournament}
                      >
                        <Text style={styles.addTournamentButtonText}>Add Tournament</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.cardForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Card Number</Text>
                  <View style={styles.inputContainer}>
                    <CreditCard size={20} color="#A259FF" />
                    <TextInput
                      style={styles.input}
                      placeholder="1234 5678 9012 3456"
                      placeholderTextColor="#6c757d"
                      value={cardNumber}
                      onChangeText={handleCardNumberChange}
                      keyboardType="numeric"
                      maxLength={19}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Cardholder Name</Text>
                  <View style={styles.inputContainer}>
                    <CreditCard size={20} color="#A259FF" />
                    <TextInput
                      style={styles.input}
                      placeholder="Name on card"
                      placeholderTextColor="#6c757d"
                      value={cardName}
                      onChangeText={setCardName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Expiry Date</Text>
                    <View style={styles.inputContainer}>
                      <CreditCard size={20} color="#A259FF" />
                      <TextInput
                        style={styles.input}
                        placeholder="MM/YY"
                        placeholderTextColor="#6c757d"
                        value={expiryDate}
                        onChangeText={handleExpiryChange}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <View style={styles.inputContainer}>
                      <CreditCard size={20} color="#A259FF" />
                      <TextInput
                        style={styles.input}
                        placeholder="123"
                        placeholderTextColor="#6c757d"
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Total and Submit */}
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>USD {getTotalFee()}</Text>
              </View>

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!selectedTournaments.length && !otherTournament) && styles.submitButtonDisabled
                ]}
                disabled={!selectedTournaments.length && !otherTournament}
              >
                <Text style={styles.submitButtonText}>Complete Registration</Text>
              </TouchableOpacity>
            </View>

            {/* Extra padding for keyboard */}
            <View style={styles.keyboardSpacer} />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  headerTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
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
  tournamentList: {
    gap: 12,
  },
  tournamentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tournamentOptionSelected: {
    borderColor: '#A259FF',
    backgroundColor: '#3D246C',
  },
  tournamentOptionPromo: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  tournamentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tournamentName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  tournamentFee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feeAmount: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  promoFeeAmount: {
    color: '#10B981',
    textDecorationLine: 'none',
  },
  otherTournamentContainer: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
  },
  otherTournamentInput: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  promoCodeSection: {
    marginBottom: 24,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  promoCodeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  promoCodeTextInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'Poppins-Regular',
  },
  applyButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  promoAppliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(162, 89, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  promoterPromoContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  promoAppliedText: {
    flex: 1,
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  promoterPromoText: {
    color: '#10B981',
  },
  addTournamentButton: {
    backgroundColor: '#A259FF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addTournamentButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  cardForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
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
  },
  submitButtonDisabled: {
    backgroundColor: '#4A4A4A',
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
});