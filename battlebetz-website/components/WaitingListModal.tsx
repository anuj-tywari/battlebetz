import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Platform
} from 'react-native';
import { X, ChevronDown, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

type InterestOption = 'Tournaments' | 'Battles' | 'Fantasy League' | 'The Vault' | 'Betting World Series' | 'Celebrity High Stakes';

interface WaitingListModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    telephone: string;
    interests: InterestOption[];
  }) => void;
}

export default function WaitingListModal({ visible, onClose, onSubmit }: WaitingListModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [showInterests, setShowInterests] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<InterestOption[]>([]);
  const router = useRouter(); // Initialize useRouter hook

  const interestOptions: InterestOption[] = [
    'Tournaments',
    'Battles',
    'Fantasy League',
    'The Vault',
    'Betting World Series',
    'Celebrity High Stakes'
  ];

  const toggleInterest = (interest: InterestOption) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!name || !email || selectedInterests.length === 0) {
      return;
    }
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + 'leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: name,
          email: email,
          telephone: telephone,
          interested_in: selectedInterests.join(', ')
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Continue with onSubmit if API call succeeds
    } catch (error) {
      console.error('Error submitting to waiting list:', error);
      alert('There was an error submitting your information. Please try again.');
      return;
    }


    onSubmit({
      name,
      email,
      telephone,
      interests: selectedInterests
    });
    
    // Navigate to thank you page instead of signup
    router.push('/thankyou');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Join the Waiting List</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color="#EAEAEA" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.description}>
              Be among the first to experience the future of sports betting. Sign up for early access and exclusive updates.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#6c757d"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#6c757d"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Telephone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#6c757d"
                keyboardType="phone-pad"
                value={telephone}
                onChangeText={setTelephone}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>I'm Interested In</Text>
              <TouchableOpacity
                style={styles.interestsButton}
                onPress={() => setShowInterests(!showInterests)}
              >
                <Text style={styles.interestsButtonText}>
                  {selectedInterests.length === 0 
                    ? 'Select your interests'
                    : `${selectedInterests.length} selected`}
                </Text>
                <ChevronDown size={20} color="#A259FF" />
              </TouchableOpacity>

              {showInterests && (
                <View style={styles.interestsList}>
                  {interestOptions.map((interest) => (
                    <TouchableOpacity
                      key={interest}
                      style={[
                        styles.interestOption,
                        selectedInterests.includes(interest) && styles.interestOptionSelected
                      ]}
                      onPress={() => toggleInterest(interest)}
                    >
                      <Text style={[
                        styles.interestOptionText,
                        selectedInterests.includes(interest) && styles.interestOptionTextSelected
                      ]}>
                        {interest}
                      </Text>
                      {selectedInterests.includes(interest) && (
                        <Check size={16} color="#A259FF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!name || !email || selectedInterests.length === 0) && 
                styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!name || !email || selectedInterests.length === 0}
            >
              <Text style={styles.submitButtonText}>Join Waiting List</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  description: {
    color: '#A259FF',
    fontSize: 16,
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  interestsButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interestsButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  interestsList: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
  },
  interestOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  interestOptionSelected: {
    backgroundColor: 'rgba(162, 89, 255, 0.1)',
  },
  interestOptionText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  interestOptionTextSelected: {
    color: '#A259FF',
    fontFamily: 'Poppins-Medium',
  },
  submitButton: {
    backgroundColor: '#FF00FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#000000',
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});