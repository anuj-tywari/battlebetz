import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trophy, Users, DollarSign } from 'lucide-react-native';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

export default function PromoCodePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const code = params.promoCode; // Get the promo_code from the query parameter
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [promoDetails, setPromoDetails] = useState<{
    username: string;
    referralCount: number;
    avatar_url?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!code) {
          throw new Error('No promo code provided');
        }
        // Fetch promoter details
        const { data: promoter, error: promoterError } = await supabase
          .from('promo_codes')
          .select('username, referral_count, avatar_url')
          .eq('promo_code', code)
          .single();
        
        if (promoterError) {
          throw new Error('Invalid promo code');
        }

        if (!promoter) {
          throw new Error('Promoter not found');
        }

        setPromoDetails({
          username: promoter.username,
          referralCount: promoter.referral_count,
          avatar_url: promoter.avatar_url
        });
      } catch (err) {
        console.error('Error occurred:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchPromoDetails();
    } else {
      setLoading(false);
      setError('No promo code provided');
    }
  }, [code]);

  const handleSignUp = () => {
    router.push({
      pathname: '/signup',
      params: {
        referralCode: code as string,
      },
    });
  };

  const handleLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A259FF" />
        <Text style={styles.loadingText}>Loading promo details...</Text>
      </View>
    );
  }

  if (error || !promoDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Invalid promo code'}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>You're already logged in!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Trophy size={48} color="#FFD700" />

        <Text style={styles.title}>Join Battle Betz</Text>
        <Text style={styles.subtitle}>
          You've been invited by {promoDetails.username}
        </Text>

        {promoDetails.avatar_url && (
          <Image
            source={{ uri: promoDetails.avatar_url }}
            style={styles.promoterAvatar}
          />
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Users size={24} color="#A259FF" />
            <Text style={styles.statValue}>{promoDetails.referralCount}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>

          <View style={styles.statItem}>
            <DollarSign size={24} color="#10B981" />
            <Text style={styles.statValue}>BBZ 100</Text>
            <Text style={styles.statLabel}>Welcome Bonus</Text>
          </View>
        </View>

        <View style={styles.promoInfo}>
          <Text style={styles.promoTitle}>Sign up now to receive:</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>• BBZ 100 welcome bonus</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>• $10 off tournament entry</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>
              • Access to exclusive promotions
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up Now</Text>
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Log In</Text>
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
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  title: {
    color: '#EAEAEA',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    color: '#A259FF',
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  promoterAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    minWidth: 140,
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  promoInfo: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  promoTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  benefitItem: {
    marginBottom: 12,
  },
  benefitText: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  buttons: {
    width: '100%',
  },
  button: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  signUpButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});