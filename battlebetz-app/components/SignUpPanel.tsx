import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Trophy, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SignUpPanel() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setIsVisible(false)}
        >
          <X size={20} color="#EAEAEA" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Trophy size={40} color="#FFD700" />
          <Text style={styles.title}>Join March Madness 2025</Text>
          <Text style={styles.subtitle}>
            Sign up now to get BBZ 100 and start betting
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
  },
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    width: '90%',
    maxWidth: 360,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#A259FF',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1D',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  signUpButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  loginButton: {
    backgroundColor: '#1A1A1D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});