import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { CreditCard } from 'lucide-react-native';

interface PaymentFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail
}) => {
  return (
    <View style={styles.cardForm}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>First Name</Text>
        <View style={styles.inputContainer}>
          <CreditCard size={20} color="#A259FF" />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#6c757d"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Last Name</Text>
        <View style={styles.inputContainer}>
          <CreditCard size={20} color="#A259FF" />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#6c757d"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={styles.inputContainer}>
          <CreditCard size={20} color="#A259FF" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6c757d"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default PaymentForm;