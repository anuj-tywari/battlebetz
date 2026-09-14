import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Animated } from 'react-native';
import { Trophy, Clock, ChevronRight, Users, DollarSign, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import Header from '../../components/Header';
import TournamentStats from '../../components/TournamentStats';
import TodaysGames from '../../components/TodaysGames';
import TournamentRankings from '../../components/TournamentRankings';
import TournamentManagement from '@/components/TournamentManagement';
import TournamentOverview from '@/components/TournamentOverview';
import TournamentsPromo from '@/components/TournamentsPromo';
import UpcomingTournaments from '@/components/UpcomingTournaments';
import YourTournaments from '@/components/YourTournaments';
import { useAuth } from '@/hooks/useAuth';
import useTournamentData from '@/hooks/useTournamentData';

// Constants for current tournament and round
const ACTIVE_TOURNAMENT_ID = "04e2c407-1eed-4035-8c3c-cb9c7793c195";
const ACTIVE_ROUND_NAME = "Sweet 16";

export default function TournamentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showExpandedRankings, setShowExpandedRankings] = useState(false);
  const [isOverviewCollapsed, setIsOverviewCollapsed] = useState(false);
  const [isSentimentCollapsed, setIsSentimentCollapsed] = useState(false);
  const [overviewAnimation] = useState(new Animated.Value(1));
  const [sentimentAnimation] = useState(new Animated.Value(1));
  
  // Use the tournament data hook to check if user is participating
  const {
    tournament,
    participant,
    isParticipating,
    isLoading: isTournamentLoading
  } = useTournamentData(ACTIVE_TOURNAMENT_ID, ACTIVE_ROUND_NAME);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-03-27T21:00:00-04:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleOverview = () => {
    const toValue = isOverviewCollapsed ? 1 : 0;
    Animated.spring(overviewAnimation, {
      toValue,
      useNativeDriver: false,
      bounciness: 0,
    }).start();
    setIsOverviewCollapsed(!isOverviewCollapsed);
  };

  if (showExpandedRankings) {
    return (
      <View style={styles.container}>
        <TournamentRankings 
          expanded={true} 
          onBack={() => setShowExpandedRankings(false)} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      {/* Welcome Header */}
      <View style={styles.welcomeHeader}>
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeLeft}>
              <Trophy size={32} color="#FFD700" />
              <Text style={styles.welcomeTitle}>Welcome to our Sweet Sixteen Tournament</Text>
              <Text style={styles.welcomeText}>
                Get ready the beta launch of our exciting tournament experience.
              </Text>
            </View>
            <Image 
              source={require('../Public Folder/Bracket Logo.png')}
              style={styles.bracketImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.leftColumn}>
          <ScrollView style={styles.columnScroll}>
            {/* Conditional rendering based on participation status */}
            {isTournamentLoading ? (
              // Loading state
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading tournament data...</Text>
              </View>
            ) : (
              // Display both components with YourTournaments first if the user is participating
              <>
                {isParticipating && <YourTournaments />}
                <UpcomingTournaments />
              </>
            )}

            <TodaysGames />
          </ScrollView>
        </View>

        <View style={styles.rightColumn}>
          <ScrollView style={styles.columnScroll}>
            <View style={styles.statsSection}>
              <TournamentStats />
            </View>
            <View style={styles.rankingsSection}>
              <TournamentRankings />
            </View>
          </ScrollView>
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
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    marginBottom: 12,
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  welcomeHeader: {
    backgroundColor: '#0D0D0D',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  welcomeContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  welcomeLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  welcomeTitle: {
    color: '#A259FF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  welcomeText: {
    color: '#EAEAEA',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  bracketImage: {
    width: 200,
    height: 200,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: '#2E2E3A',
  },
  rightColumn: {
    flex: 1,
  },
  columnScroll: {
    flex: 1,
    padding: 12,
  },
  statsSection: {
    marginBottom: 12,
  },
  rankingsSection: {
    marginBottom: 16,
  }
});