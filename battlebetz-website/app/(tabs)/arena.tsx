import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Trophy, ChevronRight, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

import Header from '../../components/Header';
import TournamentBets from '../../components/TournamentBets';

export default function ArenaScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [showTournamentBets, setShowTournamentBets] = useState(true);
  const [tournaments, setTournaments] = useState([
    {
      id: '1',
      name: 'March Madness',
      date: 'Mar 18',
      image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop',
      following: false,
      prize: '$5,000',
      entryFee: '$15',
      participants: '12,450'
    },
    {
      id: '2',
      name: 'IPL',
      date: 'Mar 22',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop',
      following: false,
      prize: '$10,000',
      entryFee: '$25',
      participants: '8,750'
    },
    {
      id: '3',
      name: 'NBA Play-offs',
      date: 'Apr 19',
      image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
      following: true,
      prize: '$25,000',
      entryFee: '$50',
      participants: '15,200'
    }
  ]);

  // Tournament bets data
  const tournamentBets = [
    {
      id: '1',
      tournament: 'March Madness',
      round: 1,
      match: '(1) Houston vs (16) Longwood',
      pick: 'Houston -21.5',
      odds: '-110',
      amount: 'BBZ.T 500',
      status: 'pending',
      gameTime: 'Today, 7:00 PM EST'
    },
    {
      id: '2',
      tournament: 'March Madness',
      round: 1,
      match: '(8) Nebraska vs (9) Texas A&M',
      pick: 'Texas A&M +1.5',
      odds: '-110',
      amount: 'BBZ.T 250',
      status: 'pending',
      gameTime: 'Today, 9:30 PM EST'
    }
  ];

  const deadline = new Date('2025-03-20T18:00:00-04:00');
  const now = new Date();
  const timeLeft = deadline.getTime() - now.getTime();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const handleFollow = (tournamentId) => {
    setTournaments(tournaments.map(t => 
      t.id === tournamentId ? { ...t, following: !t.following } : t
    ));
  };

  const handleSignUp = (tournamentId) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
      router.push({
        pathname: '/join-tournament',
        params: {
          tournamentId,
          name: tournament.name,
          date: tournament.date
        }
      });
    }
  };

  const handlePlaceBets = () => {
    router.push({
      pathname: '/place-tournament-bets',
      params: { name: 'March Madness' }
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to the Arena</Text>
            <Text style={styles.welcomeSubtitle}>See how you fare in competition Warrior</Text>
          </View>

          {showTournamentBets && (
            <View style={styles.tournamentBettingSection}>
              <View style={styles.tournamentBettingHeader}>
                <View style={styles.tournamentBettingTitle}>
                  <AlertCircle size={20} color="#F59E0B" />
                  <Text style={styles.tournamentBettingText}>Place Your Tournament Bets</Text>
                </View>
                <TouchableOpacity 
                  style={styles.placeBetsButton}
                  onPress={handlePlaceBets}
                >
                  <Text style={styles.placeBetsButtonText}>Place Bets</Text>
                  <ChevronRight size={16} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.tournamentBettingInfo}>
                <View style={styles.deadlineContainer}>
                  <Clock size={16} color="#EF4444" />
                  <Text style={styles.deadlineText}>
                    Deadline: {hoursLeft}h {minutesLeft}m
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>12 of 32 bets placed</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '37.5%' }]} />
                  </View>
                </View>
              </View>
            </View>
          )}

          <TournamentBets 
            bets={tournamentBets}
            onViewAll={() => router.push('/my-activity')}
          />
          
          <Text style={styles.sectionTitle}>Tournaments</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tournamentsRow}
          >
            {tournaments.map((tournament) => (
              <View key={tournament.id} style={styles.tournamentCard}>
                <Image
                  source={{ uri: tournament.image }}
                  style={styles.tournamentImage}
                />
                <View style={styles.tournamentOverlay}>
                  <View style={styles.tournamentContent}>
                    <Text style={styles.tournamentName}>{tournament.name}</Text>
                    <Text style={styles.tournamentDate}>{tournament.date}</Text>
                    
                    <View style={styles.tournamentStats}>
                      <View style={styles.statItem}>
                        <Trophy size={16} color="#FFD700" />
                        <Text style={styles.statValue}>{tournament.prize}</Text>
                        <Text style={styles.statLabel}>Prize Pool</Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{tournament.participants}</Text>
                        <Text style={styles.statLabel}>Players</Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{tournament.entryFee}</Text>
                        <Text style={styles.statLabel}>Entry</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.tournamentActions}>
                    <TouchableOpacity
                      style={[
                        styles.followButton,
                        tournament.following && styles.followingButton,
                      ]}
                      onPress={() => handleFollow(tournament.id)}
                    >
                      <Text
                        style={[
                          styles.followButtonText,
                          tournament.following && styles.followingButtonText,
                        ]}
                      >
                        {tournament.following ? 'Following' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.signupButton}
                      onPress={() => handleSignUp(tournament.id)}
                    >
                      <Text style={styles.signupButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  section: {
    padding: 16,
    paddingBottom: 80,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    color: '#EAEAEA',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  welcomeSubtitle: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  tournamentsRow: {
    gap: 16,
  },
  tournamentCard: {
    width: 300,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  tournamentImage: {
    width: '100%',
    height: '100%',
  },
  tournamentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  tournamentContent: {
    marginBottom: 16,
  },
  tournamentName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  tournamentDate: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  tournamentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(74, 74, 74, 0.5)',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  tournamentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#A259FF',
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  followingButtonText: {
    color: '#A259FF',
  },
  signupButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  tournamentBettingSection: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  tournamentBettingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tournamentBettingTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tournamentBettingText: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  placeBetsButton: {
    backgroundColor: '#A259FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
  },
  placeBetsButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  tournamentBettingInfo: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  deadlineText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2E2E3A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A259FF',
    borderRadius: 2,
  },
});