import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, Swords } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type BattleBetzPromoProps = {
  onClose: () => void;
};

export default function BattleBetzPromo({ onClose }: BattleBetzPromoProps) {
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Swords size={20} color="#A259FF" />
          <Text style={styles.title}>Battle Betz</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={20} color="#EAEAEA" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>
        Battle with the Community through peer to peer bets. Join now to get 100 BBZ coins and get going.
      </Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>USD wallet coming soon</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.signupButton}
        onPress={handleSignUp}
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3D246C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  infoText: {
    color: '#10B981',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  signupButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});