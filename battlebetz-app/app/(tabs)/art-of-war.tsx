import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { Trophy, Users, Shield, Clock, TrendingUp, DollarSign, Crown, Swords, Brain, Target, ChevronRight, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import Header from '../../components/Header';

export default function ArtOfWarScreen() {
  const router = useRouter();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const features = [
    {
      id: '1',
      title: 'Strategic Gameplay',
      description: 'Win through skill, not luck. Perfect for analytical minds.',
      icon: Brain,
      color: '#A259FF'
    },
    {
      id: '2',
      title: 'Custom Leagues',
      description: 'Create private leagues with your own rules and stakes.',
      icon: Shield,
      color: '#10B981'
    },
    {
      id: '3',
      title: 'Long-term Battles',
      description: 'Multi-week competitions test true strategic ability.',
      icon: Target,
      color: '#F59E0B'
    },
    {
      id: '4',
      title: 'Alliance System',
      description: 'Form alliances and compete as teams.',
      icon: Users,
      color: '#3B82F6'
    }
  ];

  const customLeagues = [
    {
      id: '1',
      name: 'Pro Strategists',
      members: 24,
      stake: 'BBZ 1,000',
      duration: '3 months',
      image: 'https://images.unsplash.com/photo-1529154166925-574a0236a4f4?q=80&w=2574&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'Elite Warriors',
      members: 16,
      stake: 'BBZ 5,000',
      duration: '6 months',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2068&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Masters League',
      members: 32,
      stake: 'BBZ 2,500',
      duration: '4 months',
      image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop'
    }
  ];

  const handleCreateLeague = () => {
    setShowComingSoonModal(true);
  };

  const handleSignUp = () => {
    setShowComingSoonModal(false);
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1529154166925-574a0236a4f4?q=80&w=2574&auto=format&fit=crop' }}
              style={styles.heroImage}
            />
            <View style={styles.heroOverlay}>
              <Crown size={40} color="#FFD700" />
              <Text style={styles.heroTitle}>Art of War</Text>
              <Text style={styles.heroSubtitle}>Strategic Fantasy League</Text>
              <Text style={styles.heroDescription}>
                Where strategy meets competition. Create or join leagues, set your stakes, make your own rules.
              </Text>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                  <feature.icon size={24} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>

          {/* Custom Leagues */}
          <View style={styles.leaguesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Leagues</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color="#A259FF" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.leaguesContainer}
            >
              {customLeagues.map((league) => (
                <View key={league.id} style={styles.leagueCard}>
                  <Image source={{ uri: league.image }} style={styles.leagueImage} />
                  <View style={styles.leagueOverlay}>
                    <Text style={styles.leagueName}>{league.name}</Text>
                    
                    <View style={styles.leagueStats}>
                      <View style={styles.leagueStat}>
                        <Users size={16} color="#A259FF" />
                        <Text style={styles.leagueStatValue}>{league.members}</Text>
                        <Text style={styles.leagueStatLabel}>Members</Text>
                      </View>
                      
                      <View style={styles.leagueStat}>
                        <DollarSign size={16} color="#10B981" />
                        <Text style={styles.leagueStatValue}>{league.stake}</Text>
                        <Text style={styles.leagueStatLabel}>Stake</Text>
                      </View>
                      
                      <View style={styles.leagueStat}>
                        <Clock size={16} color="#F59E0B" />
                        <Text style={styles.leagueStatValue}>{league.duration}</Text>
                        <Text style={styles.leagueStatLabel}>Duration</Text>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.joinLeagueButton}>
                      <Text style={styles.joinLeagueButtonText}>Join League</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Create League CTA */}
          <View style={styles.createLeagueCTA}>
            <View style={styles.ctaContent}>
              <Swords size={32} color="#A259FF" />
              <Text style={styles.ctaTitle}>Create Your Own League</Text>
              <Text style={styles.ctaDescription}>
                Set your own rules, stakes, and duration. Invite friends and start competing.
              </Text>
              <TouchableOpacity 
                style={styles.createLeagueButton}
                onPress={handleCreateLeague}
              >
                <Text style={styles.createLeagueButtonText}>Create League</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Coming Soon Modal */}
      <Modal
        visible={showComingSoonModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowComingSoonModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowComingSoonModal(false)}
              >
                <X size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Crown size={48} color="#FFD700" />
              <Text style={styles.modalTitle}>Coming Soon!</Text>
              <Text style={styles.modalDescription}>
                The Art of War leagues are launching soon. Sign up now to be notified when you can create your own strategic league.
              </Text>

              <View style={styles.modalFeatures}>
                <View style={styles.modalFeature}>
                  <Shield size={20} color="#10B981" />
                  <Text style={styles.modalFeatureText}>Custom league rules</Text>
                </View>
                <View style={styles.modalFeature}>
                  <Users size={20} color="#A259FF" />
                  <Text style={styles.modalFeatureText}>Team alliances</Text>
                </View>
                <View style={styles.modalFeature}>
                  <Trophy size={20} color="#F59E0B" />
                  <Text style={styles.modalFeatureText}>Flexible prize pools</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={handleSignUp}
              >
                <Text style={styles.signUpButtonText}>Sign Up for Early Access</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  heroBanner: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroTitle: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
    fontFamily: 'Poppins-Bold',
  },
  heroSubtitle: {
    color: '#EAEAEA',
    fontSize: 20,
    marginBottom: 12,
    fontFamily: 'Poppins-Medium',
  },
  heroDescription: {
    color: '#A259FF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    width: '47%',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  featureDescription: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  leaguesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  leaguesContainer: {
    gap: 16,
    paddingRight: 16,
  },
  leagueCard: {
    width: 300,
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  leagueImage: {
    width: '100%',
    height: '100%',
  },
  leagueOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
  },
  leagueName: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  leagueStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(74, 74, 74, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  leagueStat: {
    alignItems: 'center',
    gap: 4,
  },
  leagueStatValue: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  leagueStatLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  joinLeagueButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinLeagueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  createLeagueCTA: {
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    padding: 24,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    fontFamily: 'Poppins-Bold',
  },
  ctaDescription: {
    color: '#A259FF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
  },
  createLeagueButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  createLeagueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    alignItems: 'flex-end',
    padding: 16,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  modalDescription: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  modalFeatures: {
    width: '100%',
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  modalFeatureText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  signUpButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});