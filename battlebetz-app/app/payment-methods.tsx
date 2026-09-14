import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Platform,
  Alert,
  TextInput
} from 'react-native';
import { 
  ArrowLeft, 
  CreditCard, 
  Plus, 
  Trash2, 
  Check,
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: 'Expires 12/25',
      isDefault: true,
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png'
    },
    {
      id: '2',
      type: 'card',
      name: 'Mastercard ending in 8888',
      details: 'Expires 09/26',
      isDefault: false,
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png'
    },
    {
      id: '3',
      type: 'paypal',
      name: 'PayPal',
      details: 'john.smith@example.com',
      isDefault: false,
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png'
    }
  ]);
  
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Set a payment method as default
  const setAsDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };
  
  // Delete a payment method
  const deletePaymentMethod = (id: string) => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(method => method.id !== id));
          }
        }
      ]
    );
  };
  
  // Add a new payment method
  const addPaymentMethod = (type: 'card' | 'paypal' | 'applepay' | 'googlepay') => {
    if (type === 'card') {
      setShowAddCardModal(true);
    } else {
      // For other payment methods, we would typically redirect to their respective authentication flows
      // For this demo, we'll just show an alert
      Alert.alert(
        `Add ${type === 'paypal' ? 'PayPal' : type === 'applepay' ? 'Apple Pay' : 'Google Pay'}`,
        `This would redirect you to authenticate with ${type === 'paypal' ? 'PayPal' : type === 'applepay' ? 'Apple Pay' : 'Google Pay'}.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK" }
        ]
      );
    }
  };
  
  // Save new card
  const saveNewCard = () => {
    // Validate card details
    if (!newCard.cardNumber || !newCard.cardholderName || !newCard.expiryDate || !newCard.cvv) {
      Alert.alert("Error", "Please fill in all card details");
      return;
    }
    
    // In a real app, you would send this to a payment processor
    // For this demo, we'll just add it to our local state
    const lastFour = newCard.cardNumber.slice(-4);
    const cardType = newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
    const icon = cardType === 'Visa' 
      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png'
      : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png';
    
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: `${cardType} ending in ${lastFour}`,
      details: `Expires ${newCard.expiryDate}`,
      isDefault: false,
      icon
    };
    
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setShowAddCardModal(false);
    setNewCard({
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: ''
    });
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
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Payment Methods List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Payment Methods</Text>
          
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethodCard}>
              <View style={styles.paymentMethodHeader}>
                <Image 
                  source={{ uri: method.icon }} 
                  style={styles.paymentMethodIcon} 
                  resizeMode="contain"
                />
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  <Text style={styles.paymentMethodDetails}>{method.details}</Text>
                </View>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.paymentMethodActions}>
                {!method.isDefault && (
                  <TouchableOpacity 
                    style={styles.setDefaultButton}
                    onPress={() => setAsDefault(method.id)}
                  >
                    <Check size={16} color="#A259FF" />
                    <Text style={styles.setDefaultButtonText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deletePaymentMethod(method.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                  <Text style={styles.deleteButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        {/* Add Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Payment Method</Text>
          
          <TouchableOpacity 
            style={styles.addMethodButton}
            onPress={() => addPaymentMethod('card')}
          >
            <CreditCard size={20} color="#EAEAEA" />
            <Text style={styles.addMethodButtonText}>Add Credit or Debit Card</Text>
            <ChevronRight size={20} color="#A259FF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addMethodButton}
            onPress={() => addPaymentMethod('paypal')}
          >
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png' }} 
              style={styles.paymentProviderIcon} 
              resizeMode="contain"
            />
            <Text style={styles.addMethodButtonText}>Connect with PayPal</Text>
            <ChevronRight size={20} color="#A259FF" />
          </TouchableOpacity>
          
          {Platform.OS === 'ios' && (
            <TouchableOpacity 
              style={styles.addMethodButton}
              onPress={() => addPaymentMethod('applepay')}
            >
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/1200px-Apple_Pay_logo.svg.png' }} 
                style={styles.paymentProviderIcon} 
                resizeMode="contain"
              />
              <Text style={styles.addMethodButtonText}>Add Apple Pay</Text>
              <ChevronRight size={20} color="#A259FF" />
            </TouchableOpacity>
          )}
          
          {Platform.OS === 'android' && (
            <TouchableOpacity 
              style={styles.addMethodButton}
              onPress={() => addPaymentMethod('googlepay')}
            >
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png' }} 
                style={styles.paymentProviderIcon} 
                resizeMode="contain"
              />
              <Text style={styles.addMethodButtonText}>Add Google Pay</Text>
              <ChevronRight size={20} color="#A259FF" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityNoteTitle}>Secure Payments</Text>
          <Text style={styles.securityNoteText}>
            All payment information is encrypted and securely stored. We never store your full card details on our servers.
          </Text>
        </View>
      </ScrollView>
      
      {/* Add Card Modal */}
      {showAddCardModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAddCardModal(false)}
              >
                <Trash2 size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCard.cardNumber}
                  onChangeText={(text) => setNewCard({...newCard, cardNumber: text})}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#6c757d"
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCard.cardholderName}
                  onChangeText={(text) => setNewCard({...newCard, cardholderName: text})}
                  placeholder="John Smith"
                  placeholderTextColor="#6c757d"
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newCard.expiryDate}
                    onChangeText={(text) => setNewCard({...newCard, expiryDate: text})}
                    placeholder="MM/YY"
                    placeholderTextColor="#6c757d"
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newCard.cvv}
                    onChangeText={(text) => setNewCard({...newCard, cvv: text})}
                    placeholder="123"
                    placeholderTextColor="#6c757d"
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.saveCardButton}
                onPress={saveNewCard}
              >
                <Text style={styles.saveCardButtonText}>Save Card</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddCardModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  paymentMethodCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethodIcon: {
    width: 40,
    height: 24,
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
  },
  paymentMethodDetails: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  paymentMethodActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  setDefaultButtonText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  addMethodButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  paymentProviderIcon: {
    width: 24,
    height: 24,
  },
  securityNote: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  securityNoteTitle: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  securityNoteText: {
    color: '#EAEAEA',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    width: '100%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 4,
  },
  cardForm: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  textInput: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  saveCardButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveCardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  cancelButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});