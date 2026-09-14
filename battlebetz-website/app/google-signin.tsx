import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Linking } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

// Define user info interface
interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export default function GoogleSignInScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // This is a simplified implementation that would need to be replaced with a proper OAuth flow
  // In a production app, you would need to:
  // 1. Set up a backend server to handle the OAuth flow securely
  // 2. Use Firebase Auth, Auth0, or another auth provider's SDK
  // 3. Or implement the full OAuth flow with proper PKCE

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // In a real implementation, this would be your OAuth endpoint
      // For demo purposes, we'll simulate a successful sign-in
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful sign-in
      const mockUserInfo: UserInfo = {
        id: '12345678',
        email: 'user@example.com',
        name: 'John Doe',
        picture: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
        given_name: 'John',
        family_name: 'Doe'
      };
      
      setUserInfo(mockUserInfo);
      
      // Navigate to the main app after successful sign-in
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1500);
    } catch (error) {
      setError('Authentication failed. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  // This function would open your web-based OAuth flow
  const openWebAuth = async () => {
    try {
      // This would be your OAuth authorization URL
      const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?PARAMS_HERE';
      
      // For a real implementation, you would use WebBrowser.openAuthSessionAsync
      // and handle the redirect URL with your token
      
      // For demo purposes, we'll just call the regular sign-in function
      handleSignIn();
    } catch (error) {
      setError('Failed to open authentication page');
      console.error('Web auth error:', error);
    }
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
        <Text style={styles.headerTitle}>Sign in with Google</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#A259FF" />
        ) : userInfo ? (
          <View style={styles.successContainer}>
            <Text style={styles.successMessage}>
              Successfully signed in as {userInfo.name}
            </Text>
            <Text style={styles.redirectMessage}>
              Redirecting to app...
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.message}>
              Sign in with your Google account to access Battle Betz
            </Text>
            
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={openWebAuth}
            >
              <Text style={styles.googleButtonText}>
                Continue with Google
              </Text>
            </TouchableOpacity>
            
            {error && (
              <Text style={styles.errorText}>
                {error}
              </Text>
            )}

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                Note: This is a demo implementation. In a production app, you would be redirected to Google's authentication page.
              </Text>
            </View>
          </>
        )}
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 32,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#1A1A1D',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A259FF',
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  errorText: {
    color: '#FF4D4F',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
  },
  successMessage: {
    color: '#10B981',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 16,
    textAlign: 'center',
  },
  redirectMessage: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  noteContainer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: 'rgba(162, 89, 255, 0.1)',
    borderRadius: 8,
    maxWidth: 400,
  },
  noteText: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});