import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Crown, Shield, Swords, ChevronRight, TrendingUp, Trophy, Users } from 'lucide-react-native';
import TopNavigation from '../components/TopNavigation';

export default function FantasyLeagueScreen() {
  return (
    <View style={styles.container}>
      <TopNavigation />
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>Fantasy League</Text>
            <Text style={styles.heroTitle}>The Art of War</Text>
            <Text style={styles.heroText}>
              We think about Fantasy as the long game, a long term war where you have to win your battles. Create your own leagues with your own rules while participating in our champion of champions. Become the King of Battle Betz.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Featured Leagues</Text>
            <View style={styles.leaguesGrid}>
              {[
                {
                  name: "Pro Strategists",
                  members: "24",
                  duration: "3 months",
                  image: "https://images.unsplash.com/photo-1529154166925-574a0236a4f4?q=80&w=2574&auto=format&fit=crop"
                },
                {
                  name: "Elite Warriors",
                  members: "16",
                  duration: "6 months",
                  image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2068&auto=format&fit=crop"
                },
                {
                  name: "Masters League",
                  members: "32",
                  duration: "4 months",
                  image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop"
                }
              ].map((league, index) => (
                <View key={index} style={styles.leagueCard}>
                  <Image 
                    source={{ uri: league.image }}
                    style={styles.leagueImage}
                  />
                  <View style={styles.leagueOverlay}>
                    <Text style={styles.leagueName}>{league.name}</Text>
                    <View style={styles.leagueStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{league.members}</Text>
                        <Text style={styles.statLabel}>Members</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{league.duration}</Text>
                        <Text style={styles.statLabel}>Duration</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>Join Competition Manager Waiting List</Text>
                      <ChevronRight size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>League Features</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <Crown size={40} color="#A259FF" />
                <Text style={styles.featureTitle}>Champion of Champions</Text>
                <Text style={styles.featureText}>
                  Compete in our premier league to become the ultimate Battle Betz champion.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Shield size={40} color="#10B981" />
                <Text style={styles.featureTitle}>Custom Rules</Text>
                <Text style={styles.featureText}>
                  Create your own league with customized rules, scoring, and duration.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Swords size={40} color="#F59E0B" />
                <Text style={styles.featureTitle}>Strategic Warfare</Text>
                <Text style={styles.featureText}>
                  Engage in long-term battles that test your strategic abilities.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.content}>
            <Text style={styles.ctaTitle}>Create Your League</Text>
            <Text style={styles.ctaText}>
              Start your own fantasy league and invite friends to compete.
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Join Competition Manager Waiting List</Text>
              <ChevronRight size={20} color="white" />
            </TouchableOpacity>
          </View>
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
  hero: {
    backgroundColor: '#2E2E3A',
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  heroContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  heroSubtitle: {
    color: '#A259FF',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#EAEAEA',
    fontSize: 56,
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  heroText: {
    color: '#A259FF',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 32,
  },
  section: {
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  content: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 48,
    textAlign: 'center',
  },
  leaguesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  leagueCard: {
    width: 360,
    height: 480,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2E2E3A',
  },
  leagueImage: {
    width: '100%',
    height: 240,
  },
  leagueOverlay: {
    padding: 24,
  },
  leagueName: {
    color: '#EAEAEA',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  leagueStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  joinButton: {
    backgroundColor: '#A259FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  featuresSection: {
    backgroundColor: '#2E2E3A',
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  featureCard: {
    width: 320,
    backgroundColor: '#3D246C',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  featureTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  featureText: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    paddingVertical: 80,
    paddingHorizontal: 16,
    backgroundColor: '#3D246C',
  },
  ctaTitle: {
    color: '#EAEAEA',
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaText: {
    color: '#A259FF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 32,
  },
  ctaButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    maxWidth: 400,
    marginHorizontal: 'auto',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});