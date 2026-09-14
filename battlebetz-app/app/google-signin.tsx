import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function GoogleSignInScreen() {
  const router = useRouter();

  useEffect(() => {
    // Only run on web platform
    if (Platform.OS === 'web') {
      // Redirect to Google's OAuth page
      window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
        'client_id=YOUR_CLIENT_ID' +
        '&redirect_uri=' + encodeURIComponent(window.location.origin + '/oauth/google/callback') +
        '&response_type=code' +
        '&scope=email profile' +
        '&access_type=offline' +
        '&prompt=consent';
    } else {
      // For non-web platforms, go back to login
      router.replace('/login');
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Redirecting to Google sign-in...</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});