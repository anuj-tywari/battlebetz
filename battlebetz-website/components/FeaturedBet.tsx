import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Heart, MessageSquare, Swords } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { FEATURED_BET_WIDTH } from '@/constants/layout';

type FeaturedBetProps = {
  teams: string;
  headline: string;
  likes: number;
  comments: number;
  team1Image: string;
  team2Image: string;
  sportIcon?: string;
};

export default function FeaturedBet({
  teams,
  headline,
  likes,
  comments,
  team1Image,
  team2Image,
  sportIcon = "🏀"
}: FeaturedBetProps) {
  const router = useRouter();
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);

  // Split team names and format them with "vs"
  const [team1, team2] = teams.split(' vs ');

  return (
    <View style={styles.container}>
      {/* Main Image Container */}
      <View style={styles.imageContainer}>
        {/* Left Player Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: team1Image }}
            style={[styles.playerImage]}
            onLoadStart={() => setLoading1(true)}
            onLoadEnd={() => setLoading1(false)}
            onError={() => setError1(true)}
            resizeMode="cover"
          />
        </View>
        
        {/* Right Player Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: team2Image }}
            style={[styles.playerImage]}
            onLoadStart={() => setLoading2(true)}
            onLoadEnd={() => setLoading2(false)}
            onError={() => setError2(true)}
            resizeMode="cover"
          />
        </View>

        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />

        {/* Loading Indicator */}
        {(loading1 || loading2) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#A259FF" size="large" />
          </View>
        )}

        {/* Content Overlay */}
        <View style={styles.contentOverlay}>
          {/* Top Row */}
          <View style={styles.topRow}>
            <View style={styles.sportBadge}>
              <Text style={styles.sportIcon}>{sportIcon}</Text>
              <View style={styles.teamsContainer}>
                <Text style={styles.teamText}>{team1}</Text>
                <Text style={styles.vsText}>vs</Text>
                <Text style={styles.teamText}>{team2}</Text>
              </View>
            </View>
          </View>

          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            <View style={styles.headlineBubble}>
              <Text style={styles.headlineText} numberOfLines={1}>{headline}</Text>
            </View>

            <View style={styles.interactionBar}>
              <View style={styles.interactionButtons}>
                <TouchableOpacity style={styles.interactionButton}>
                  <Heart size={18} color="#EAEAEA" />
                  <Text style={styles.interactionText}>{likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactionButton}>
                  <MessageSquare size={18} color="#EAEAEA" />
                  <Text style={styles.interactionText}>{comments}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.battleButton}
                onPress={() => router.push('/battle')}
              >
                <Swords size={18} color="white" />
                <Text style={styles.battleButtonText}>BATTLE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: FEATURED_BET_WIDTH,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2E2E3A',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  imageWrapper: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 46, 58, 0.4)',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 46, 58, 0.8)',
  },
  contentOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
    backdropFilter: 'blur(8px)',
  },
  sportIcon: {
    fontSize: 16,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  vsText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  bottomRow: {
    gap: 12,
  },
  headlineBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    backdropFilter: 'blur(8px)',
  },
  headlineText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interactionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(46, 46, 58, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  interactionText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  battleButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  battleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});