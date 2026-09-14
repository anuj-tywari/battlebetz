import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Heart, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type BattleCardProps = {
  challenger: {
    name: string;
    avatar: string;
  };
  game: string;
  bet: string;
  odds: string;
  amount: string;
  likes: number;
  comments: number;
  onAccept?: () => void;
  onDecline?: () => void;
  onCounter?: () => void;
};

export default function BattleCard({
  challenger,
  game,
  bet,
  odds,
  amount,
  likes,
  comments,
  onAccept,
  onDecline,
  onCounter
}: BattleCardProps) {
  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState(false);
  const slideAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(1);
  
  const handleAccept = () => {
    // Slide left and fade out
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -400,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setIsDeleted(true);
      onAccept?.();
    });
  };

  const handleDecline = () => {
    // Slide left and fade out
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -400,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setIsDeleted(true);
      onDecline?.();
    });
  };
  
  const handleCounter = () => {
    // First navigate to counter screen
    router.push({
      pathname: '/battle-counter',
      params: {
        challenger: challenger.name,
        game,
        bet,
        odds,
        amount,
      },
    });

    // Then slide out and remove the card
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -400,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setIsDeleted(true);
      onCounter?.();
    });
  };

  if (isDeleted) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image source={{ uri: challenger.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.challengerName}>{challenger.name}</Text>
              <Text style={styles.challengeType}>Direct challenge</Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>DIRECT</Text>
          </View>
        </View>
        
        <View style={styles.betDetails}>
          <View style={styles.betInfo}>
            <Text style={styles.gameText}>{game}</Text>
            <Text style={styles.betText}>{bet}</Text>
          </View>
          <View style={styles.betValues}>
            <Text style={styles.oddsText}>{odds}</Text>
            <Text style={styles.amountText}>{amount}</Text>
          </View>
        </View>
        
        <View style={styles.actionRow}>
          <View style={styles.interactions}>
            <TouchableOpacity style={styles.interactionButton}>
              <Heart size={16} color="#EAEAEA" />
              <Text style={styles.interactionText}>{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.interactionButton}>
              <MessageSquare size={16} color="#EAEAEA" />
              <Text style={styles.interactionText}>{comments}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.responseButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAccept}
            >
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.counterButton]}
              onPress={handleCounter}
            >
              <Text style={styles.actionButtonText}>Counter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.declineButton]}
              onPress={handleDecline}
            >
              <Text style={styles.actionButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    width: 280,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  challengerName: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  challengeType: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  badge: {
    backgroundColor: '#A259FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  betDetails: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  betInfo: {
    marginBottom: 8,
  },
  gameText: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  betText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  betValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oddsText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  amountText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  actionRow: {
    flexDirection: 'column',
    gap: 12,
  },
  interactions: {
    flexDirection: 'row',
    gap: 12,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  interactionText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  responseButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    backgroundColor: '#FF9800',
  },
  declineButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});