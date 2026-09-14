import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image, ActivityIndicator } from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, signInWithGoogle, session } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (session) {
      router.replace('/(tabs)');
    }
  }, [session, router]);

  const handleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      // Basic validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const { error } = await login(formData.email, formData.password);
      
      if (error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }
      
      // The auth state change will handle navigation
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

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to continue betting</Text>

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
          </TouchableOpacity> */}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
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
                placeholder="Enter your password"
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

          <TouchableOpacity 
            style={styles.forgotPasswordButton} 
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupPrompt}>
            <Text style={styles.signupPromptText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/signup')} disabled={isLoading}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    flex: 1,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    marginTop: 60,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  loginButton: {
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
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  signupPromptText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  signupLink: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});