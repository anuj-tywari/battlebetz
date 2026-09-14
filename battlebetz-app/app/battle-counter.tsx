import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Image,
  Platform
} from 'react-native';
import { 
  ArrowLeft, 
  RefreshCw, 
  Check, 
  X, 
  DollarSign,
  Minus,
  Plus
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function BattleCounterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract parameters from the route
  const originalBet = {
    challenger: params.challenger as string || '@challenger',
    game: params.game as string || 'Lakers vs Warriors',
    bet: params.bet as string || 'Lakers -3.5',
    odds: params.odds as string || 'ML: -110',
    amount: params.amount as string || 'BBZ 100',
  };
  
  // State for counter offer
  const [counterAmount, setCounterAmount] = useState((parseInt(originalBet.amount.replace('BBZ ', ''), 10) * 0.8).toString());
  const [counterOdds, setCounterOdds] = useState('-120');
  const [potentialWinnings, setPotentialWinnings] = useState('0');
  
  // Calculate potential winnings based on odds and amount
  const calculateWinnings = (amount: string, odds: string) => {
    const betAmount = parseInt(amount, 10);
    const oddsValue = parseInt(odds, 10);
    
    if (isNaN(betAmount) || isNaN(oddsValue)) return '0';
    
    let winnings = 0;
    if (oddsValue > 0) {
      // Positive odds (e.g. +150) means you win $150 on a $100 bet
      winnings = betAmount * (oddsValue / 100);
    } else {
      // Negative odds (e.g. -150) means you need to bet $150 to win $100
      winnings = betAmount * (100 / Math.abs(oddsValue));
    }
    
    return winnings.toFixed(2);
  };
  
  // Update winnings when amount or odds change
  React.useEffect(() => {
    const winnings = calculateWinnings(counterAmount, counterOdds);
    setPotentialWinnings(winnings);
  }, [counterAmount, counterOdds]);
  
  // Increment/decrement amount
  const adjustAmount = (increment: boolean) => {
    const currentAmount = parseInt(counterAmount, 10) || 0;
    const newAmount = increment 
      ? Math.min(currentAmount + 10, 1000) // Max bet of 1000
      : Math.max(currentAmount - 10, 10);  // Min bet of 10
    setCounterAmount(newAmount.toString());
  };
  
  // Increment/decrement odds
  const adjustOdds = (increment: boolean) => {
    const currentOdds = parseInt(counterOdds, 10) || 0;
    const newOdds = increment 
      ? currentOdds + 5
      : currentOdds - 5;
    setCounterOdds(newOdds.toString());
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
        <Text style={styles.headerTitle}>Counter Offer</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Original Bet Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Original Bet</Text>
          <View style={styles.originalBetCard}>
            <View style={styles.betHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' }}
                style={styles.challengerAvatar}
              />
              <Text style={styles.challengerName}>{originalBet.challenger}</Text>
            </View>
            <View style={styles.betDetails}>
              <Text style={styles.betGame}>{originalBet.game}</Text>
              <Text style={styles.betSelection}>{originalBet.bet}</Text>
              <View style={styles.betFooter}>
                <Text style={styles.betOdds}>{originalBet.odds}</Text>
                <Text style={styles.betAmount}>{originalBet.amount}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Counter Offer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Counter Offer</Text>
          
          {/* Amount Adjustment */}
          <Text style={styles.inputLabel}>Counter Amount</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.adjustButton}
              onPress={() => adjustAmount(false)}
            >
              <Minus size={20} color="#EAEAEA" />
            </TouchableOpacity>
            
            <View style={styles.amountInputWrapper}>
              <Text style={styles.amountPrefix}>BBZ</Text>
              <TextInput
                style={styles.amountInput}
                value={counterAmount}
                onChangeText={setCounterAmount}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.adjustButton}
              onPress={() => adjustAmount(true)}
            >
              <Plus size={20} color="#EAEAEA" />
            </TouchableOpacity>
          </View>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {[25, 50, 75, 100, 150].map(amount => (
              <TouchableOpacity 
                key={amount}
                style={[
                  styles.quickAmountButton,
                  parseInt(counterAmount) === amount && styles.quickAmountButtonActive
                ]}
                onPress={() => setCounterAmount(amount.toString())}
              >
                <Text style={[
                  styles.quickAmountText,
                  parseInt(counterAmount) === amount && styles.quickAmountTextActive
                ]}>
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Odds Adjustment */}
          <Text style={styles.inputLabel}>Counter Odds</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.adjustButton}
              onPress={() => adjustOdds(false)}
            >
              <Minus size={20} color="#EAEAEA" />
            </TouchableOpacity>
            
            <View style={styles.oddsInputWrapper}>
              <TextInput
                style={styles.oddsInput}
                value={counterOdds}
                onChangeText={setCounterOdds}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.adjustButton}
              onPress={() => adjustOdds(true)}
            >
              <Plus size={20} color="#EAEAEA" />
            </TouchableOpacity>
          </View>
          
          {/* Quick Odds Buttons */}
          <View style={styles.quickAmounts}>
            {['-150', '-120', '-110', '+100', '+120'].map(odds => (
              <TouchableOpacity 
                key={odds}
                style={[
                  styles.quickAmountButton,
                  counterOdds === odds && styles.quickAmountButtonActive
                ]}
                onPress={() => setCounterOdds(odds)}
              >
                <Text style={[
                  styles.quickAmountText,
                  counterOdds === odds && styles.quickAmountTextActive
                ]}>
                  {odds}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Potential Winnings */}
          <View style={styles.winningsContainer}>
            <Text style={styles.winningsLabel}>Potential Winnings:</Text>
            <Text style={styles.winningsAmount}>BBZ {potentialWinnings}</Text>
          </View>
          
          {/* Message */}
          <Text style={styles.inputLabel}>Message (Optional)</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Add a message to your counter offer..."
            placeholderTextColor="#6c757d"
            multiline
            numberOfLines={3}
          />
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.counterButton}
            onPress={() => {
              // Submit counter offer and navigate back
              router.back();
            }}
          >
            <RefreshCw size={20} color="white" />
            <Text style={styles.counterButtonText}>Send Counter</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryButtons}>
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={() => {
                // Accept original bet and navigate back
                router.back();
              }}
            >
              <Check size={20} color="white" />
              <Text style={styles.acceptButtonText}>Accept Original</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.declineButton}
              onPress={() => {
                // Decline bet and navigate back
                router.back();
              }}
            >
              <X size={20} color="white" />
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  originalBetCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
  },
  betHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  challengerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  challengerName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  betDetails: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  betGame: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  betSelection: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  betOdds: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  betAmount: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  inputLabel: {
    color: '#EAEAEA',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adjustButton: {
    backgroundColor: '#2E2E3A',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountInputWrapper: {
    flex: 1,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  amountPrefix: {
    color: '#A259FF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  amountInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  oddsInputWrapper: {
    flex: 1,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  oddsInput: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAmountButton: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  quickAmountButtonActive: {
    backgroundColor: '#A259FF',
  },
  quickAmountText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  quickAmountTextActive: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  winningsContainer: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  winningsLabel: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  winningsAmount: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  messageInput: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    color: '#EAEAEA',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    fontFamily: 'Poppins-Regular',
  },
  actionButtons: {
    marginBottom: 40,
  },
  counterButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  counterButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  declineButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});