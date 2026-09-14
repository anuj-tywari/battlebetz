import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Users, Trophy, Shield, Crown, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import TopNavigation from '../components/TopNavigation';
import WaitingListModal from '../components/WaitingListModal';

export default function ComingSoonScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallMobile = width < 480;
  
  const [showWaitingListModal, setShowWaitingListModal] = useState(false);

  const handleWaitingListSubmit = (data: {
    name: string;
    email: string;
    telephone: string;
    interests: string[];
  }) => {
    // Here you would typically send this data to your backend
    console.log('Waiting list submission:', data);
    setShowWaitingListModal(false);
    
    // Show success message or navigate to thank you page
    router.push('/thankyou');
  };

  const features = [
    {
      id: 'peer-betting',
      title: 'Peer-to-Peer Betting',
      subtitle: 'Battle Against Friends',
      description: 'Challenge friends directly, set your own odds, and create personalized betting experiences. Our P2P platform lets you take control of your bets and build your reputation in the community.',
      icon: Users,
      color: '#A259FF',
      image: require('../assets/images/battle_your_friends.png'),
      eta: 'Lands Monday'
    },
    {
      id: 'fantasy',
      title: 'Fantasy League',
      subtitle: 'Build Your Dream Team',
      description: 'Create and manage your own fantasy leagues with custom rules, scoring systems, and prize pools. Compete in season-long battles or daily contests across multiple sports.',
      icon: Trophy,
      color: '#10B981',
      image: require('../assets/images/fantasy.png'),
      eta: 'Coming Q3'
    },
    {
      id: 'vault',
      title: 'The Vault',
      subtitle: 'Advanced Analytics Hub',
      description: 'Access premium betting insights, real-time analytics, and AI-powered predictions. The Vault gives you the edge with comprehensive data analysis and trend tracking.',
      icon: Shield,
      color: '#F59E0B',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
      eta: 'Lands Monday'
    },
    {
      id: 'world-series',
      title: 'Betting World Series',
      subtitle: 'Global Competition',
      description: "Compete against the world's best bettors in our premier tournament series. Multi-round elimination events with massive prize pools and live-streamed finals.",
      icon: Crown,
      color: '#3B82F6',
      image: require('../assets/images/best_of_best.png'),
      eta: 'Coming Q4'
    },
    {
      id: 'celebrity',
      title: 'Celebrity High Stakes',
      subtitle: 'Bet With The Stars',
      description: 'Join exclusive betting pools with celebrities and influencers. Watch live streams of high-stakes showdowns and participate in celebrity-hosted tournaments.',
      icon: Star,
      color: '#EC4899',
      image: require('../assets/images/celebrity_high_stakes.png'),
      eta: 'Coming Q4 2025'
    }
  ];

  return (
    <View style={styles.container}>
      <TopNavigation />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
            Coming Soon
          </Text>
          <Text style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}>
            The future of Battle Betz is packed with exciting features. Join our waiting list to be the first to know when they launch.
          </Text>
        </View>

        <View style={[styles.featuresGrid, isMobile && styles.featuresGridMobile]}>
          {features.map((feature, index) => (
            <View key={feature.id} style={[
              styles.featureCard, 
              isMobile ? styles.featureCardMobile : null
            ]}>
              {feature.id === 'celebrity' ? (
                <View style={styles.specialImageContainer}>
                  <Image 
                   source={feature.image}
                   style={{width: '100%', height: 300}}
                   resizeMode="cover"
                  />
               </View>
              ) : (
              <Image 
                source={typeof feature.image === 'string' ? { uri: feature.image } : feature.image}
                style={[
                  styles.featureImage,
                  isMobile && styles.featureImageMobile
                ]}
                resizeMode="cover"
              />
              )}
              <View style={styles.featureContent}>
                <View style={[
                  styles.iconContainer, 
                  { backgroundColor: `${feature.color}20` },
                  isMobile && styles.iconContainerMobile
                ]}>
                  <feature.icon size={isMobile ? 20 : 24} color={feature.color} />
                </View>
                <View style={[
                  styles.featureHeader,
                  isMobile && styles.featureHeaderMobile
                ]}>
                  <Text style={[
                    styles.featureTitle,
                    isMobile && styles.featureTitleMobile
                  ]}>
                    {feature.title}
                  </Text>
                  <Text style={[
                    styles.etaTag, 
                    { backgroundColor: feature.color },
                    isMobile && styles.etaTagMobile
                  ]}>
                    {feature.eta}
                  </Text>
                </View>
                <Text style={[
                  styles.featureSubtitle,
                  isMobile && styles.featureSubtitleMobile
                ]}>
                  {feature.subtitle}
                </Text>
                <Text style={[
                  styles.featureDescription,
                  isMobile && styles.featureDescriptionMobile
                ]}>
                  {feature.description}
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.notifyButton, 
                    { backgroundColor: feature.color }
                  ]}
                  onPress={() => setShowWaitingListModal(true)}
                >
                  <Text style={styles.notifyButtonText}>Get Notified</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <WaitingListModal
        visible={showWaitingListModal}
        onClose={() => setShowWaitingListModal(false)}
        onSubmit={handleWaitingListSubmit}
      />
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
  },
  hero: {
    backgroundColor: '#2E2E3A',
    padding: 40,
    alignItems: 'center',
  },
  heroTitle: {
    color: '#EAEAEA',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  heroTitleMobile: {
    fontSize: 28,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: '#A259FF',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 600,
    fontFamily: 'Poppins-Regular',
  },
  heroSubtitleMobile: {
    fontSize: 14,
    paddingHorizontal: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 20,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    justifyContent: 'flex-start', // Ensure cards align properly
  },
  featuresGridMobile: {
    gap: 16,
    padding: 16,
    flexDirection: 'column', // Force single column on mobile
  },
  featureCard: {
    width: '45%', // Two columns on desktop (approximately 50% minus margins)
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: '1%',
  },
  featureCardMobile: {
    width: '100%', // Full width on mobile
    marginHorizontal: 0,
    marginBottom: 16,
  },
  featureImage: {
    width: '100%',
    height: 250,
  },
  specialImageContainer: {
    width: '100%',
    height: 300,
  },
  featureImageMobile: {
    height: 180,
  },
  featureContent: {
    padding: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconContainerMobile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureHeaderMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureTitle: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  featureTitleMobile: {
    fontSize: 20,
  },
  etaTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  etaTagMobile: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 10,
  },
  featureSubtitle: {
    color: '#A259FF',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Poppins-Medium',
  },
  featureSubtitleMobile: {
    fontSize: 14,
    marginTop: 4,
  },
  featureDescription: {
    color: '#EAEAEA',
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
  },
  featureDescriptionMobile: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  notifyButton: {
    backgroundColor: '#FF00FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  notifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});
