import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image, Modal, ActivityIndicator } from 'react-native';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Gift } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { validateSignUpForm } from '@/utils/validation';

export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const promoCode = params.referralCode
  const { signup, signInWithGoogle } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    promoCode: promoCode as string
  });

  // Check if user is signing up as a Fantasy League Manager
  const isFantasyManager = params.role === 'fantasy-manager';

  const handleSignUp = async () => {
    setError('');
    setIsLoading(true);

    const validation = validateSignUpForm(formData)

    if(!validation.isValid){
      setError(validation.error);
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signup(formData.email, formData.password, formData.username, formData.promoCode, isFantasyManager);
      
      if (error) {
        setError(error.message || 'Failed to create account');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
      setShowWelcomeModal(true);
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message || 'Google sign in failed');
        setIsLoading(false);
        return;
      }
      
      // The redirect will handle navigation
    } catch (error) {
      setError('An unexpected error occurred with Google sign in');
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowWelcomeModal(false);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Battle Betz</Text>
        <Text style={styles.subtitle}>
          {isFantasyManager 
            ? 'Join as a Fantasy League Manager'
            : 'Join the community and start betting'}
        </Text>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View> */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#A259FF" />
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor="#6c757d"
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#A259FF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#6c757d"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#A259FF" />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#6c757d"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#A259FF" />
                ) : (
                  <Eye size={20} color="#A259FF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#A259FF" />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#6c757d"
                secureTextEntry={!showPassword}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Promo Code</Text>
            <View style={styles.inputContainer}>
            <User size={20} color="#A259FF" />
              <TextInput
                style={styles.input}
                placeholder="Referral Code (Optional)"
                placeholderTextColor="#6c757d"
                value={formData.promoCode}
                onChangeText={(text) => setFormData({ ...formData, promoCode: text })}
                editable={!isLoading}
              />
            </View>
          </View>

          {isFantasyManager && (
            <View style={styles.managerNote}>
              <Text style={styles.managerNoteText}>
                You are signing up as a Fantasy League Manager. You will have access to create and manage fantasy leagues.
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.signUpButton, isLoading && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signUpButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')} disabled={isLoading}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Welcome Modal */}
      <Modal
        visible={showWelcomeModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Gift size={40} color="#A259FF" />
              <Text style={styles.modalTitle}>Welcome to Battle Betz!</Text>
            </View>

            <View style={styles.coinReward}>
              <Text style={styles.rewardAmount}>BBZ 100</Text>
              <Text style={styles.rewardText}>
                You have been credited with BBZ Coins to start betting
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue to Tournaments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 24,
  },
  welcomeText: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center'
  },
  subtitle: {
    color: '#A259FF',
    fontSize: 16,
    marginBottom: 32,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    height: 56,
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4A4A4A',
  },
  dividerText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  eyeButton: {
    padding: 8,
  },
  managerNote: {
    backgroundColor: '#3D246C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  managerNoteText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: '#7747b3',
    opacity: 0.7,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  loginPromptText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  loginLink: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
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
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  coinReward: {
    alignItems: 'center',
    marginBottom: 32,
  },
  rewardAmount: {
    color: '#10B981',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  rewardText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  continueButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});