import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, ChevronRight } from 'lucide-react-native';
import TopNavigation from '../components/TopNavigation';

export default function ThankYouScreen() {
  const router = useRouter();

  // Redirect to home after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleExploreNow = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <TopNavigation />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.checkCircle}>
            <Check size={40} color="#FFFFFF" strokeWidth={3} />
          </View>
          
          <Text style={styles.title}>Welcome to Battle Betz!</Text>
          
          <Text style={styles.message}>
            We are excited to have you join our community. Check your email for confirmation and next steps.
          </Text>
          
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleExploreNow}
          >
            <Text style={styles.buttonText}>Explore Now</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.redirectText}>
            You will be automatically redirected to the home page in a few seconds...
          </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    shadowColor: '#A259FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A259FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  message: {
    fontSize: 16,
    color: '#EAEAEA',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A259FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  redirectText: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  }
});