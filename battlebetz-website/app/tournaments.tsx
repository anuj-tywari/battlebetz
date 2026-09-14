import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Trophy, Users, TrendingUp, ChevronRight, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import TopNavigation from '../components/TopNavigation';
import WaitingListModal from '../components/WaitingListModal';

export default function TournamentsScreen() {
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
    console.log('Waiting list submission:', data);
    setShowWaitingListModal(false);
    router.push('/thankyou');
  };

  const tournaments = [
    {
      title: "March Madness",
      date: "Mar 19 - Apr 8",
      strapline: "The Ultimate College Basketball Tournament",
      image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop"
    },
    {
      title: "IPL 2025",
      date: "Mar 22 - May 26",
      strapline: "Cricket's Biggest T20 League",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop"
    },
    {
      title: "NBA Playoffs",
      date: "Apr 20 - Jun 23",
      strapline: "The Road to the NBA Championship",
      image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop"
    },
    {
      title: "NHL Stanley Cup",
      date: "Apr 22 - Jun 25",
      strapline: "Battle for Lord Stanley's Cup",
      image: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?q=80&w=2067&auto=format&fit=crop"
    }
  ];

  return (
    <View style={styles.container}>
      <TopNavigation />
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroPattern}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={i} style={[
                styles.patternCircle,
                { 
                  left: `${(i % 5) * 25}%`,
                  top: `${Math.floor(i / 5) * 25}%`
                }
              ]} />
            ))}
          </View>
          <View style={styles.heroContent}>
            <View style={[styles.heroTextContainer, isMobile && styles.heroTextContainerMobile]}>
              <View style={styles.textWrapper}>
                <Text style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}>
                  Tournaments
                </Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
                  The Arena
                </Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={[styles.heroText, isMobile && styles.heroTextMobile]}>
                  We know every sports better believes they have the edge, we wanted to create an environment for risk takers, sports scholars and strategists to go up against each other.
                </Text>
              </View>
            </View>
            {!isMobile && (
              <Image 
                source={require('../assets/images/TheArena.jpg')}
                style={styles.heroImage}
              />
            )}
          </View>
          {isMobile && (
            <View style={styles.heroImageContainerMobile}>
              <Image 
                source={require('../assets/images/pexels-silverkblack-23495580.jpg')}
                style={styles.heroImageMobile}
              />
            </View>
          )}
        </View>

        <View style={styles.howItWorksSection}>
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>How it Works</Text>
            <View style={[styles.howItWorksContainer, isMobile && styles.howItWorksContainerMobile]}>
              {!isMobile && (
                <View style={styles.howItWorksImage}>
                  <Image 
                    source={require('../assets/images/pexels-silverkblack-23495580.jpg')}
                    style={styles.processImage}
                  />
                  <View style={styles.imageOverlay} />
                </View>
              )}
              <View style={[styles.stepsContainer, isMobile && styles.stepsContainerMobile]}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, isMobile && styles.stepTitleMobile]}>
                      Get Your Tournament Coins
                    </Text>
                    <Text style={[styles.stepDescription, isMobile && styles.stepDescriptionMobile]}>
                      Once you buy your stake, you will receive 1,000 Tournament coins
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, isMobile && styles.stepTitleMobile]}>
                      Place Your Bets
                    </Text>
                    <Text style={[styles.stepDescription, isMobile && styles.stepDescriptionMobile]}>
                      You will be expected to bet all your coins per round within the parameters set
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, isMobile && styles.stepTitleMobile]}>
                      Advance or Eliminate
                    </Text>
                    <Text style={[styles.stepDescription, isMobile && styles.stepDescriptionMobile]}>
                      Each round will have an elimination based on performance
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, isMobile && styles.stepTitleMobile]}>
                      Strategy vs Fortune
                    </Text>
                    <Text style={[styles.stepDescription, isMobile && styles.stepDescriptionMobile]}>
                      We have structured the tournaments to balance luck vs skill, strategy vs fortune
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.featuredSection}>
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Featured Tournaments
            </Text>
            
            <View style={[styles.tournamentHeader, isMobile && styles.tournamentHeaderMobile]}>
              <View style={styles.stakeInfo}>
                <DollarSign size={isMobile ? 20 : 24} color="#10B981" />
                <View>
                  <Text style={[styles.stakeTitle, isMobile && styles.stakeTitleMobile]}>
                    $15 Entry Fee
                  </Text>
                  <Text style={[styles.stakeDescription, isMobile && styles.stakeDescriptionMobile]}>
                    Prize pool grows with each participant<sup>*</sup>
                  </Text>
                </View>
              </View>
              {!isMobile && (
                <TouchableOpacity 
                  style={styles.globalJoinButton}
                  onPress={() => setShowWaitingListModal(true)}
                >
                  <Text style={styles.globalJoinButtonText}>Join Tournaments</Text>
                  <ChevronRight size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
            
            {isMobile && (
              <TouchableOpacity 
                style={[styles.globalJoinButton, styles.globalJoinButtonMobile]}
                onPress={() => setShowWaitingListModal(true)}
              >
                <Text style={styles.globalJoinButtonText}>Join Tournaments</Text>
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            )}

            <View style={[styles.tournamentGrid, isMobile && styles.tournamentGridMobile]}>
              {tournaments.map((tournament, index) => (
                <View key={index} style={[styles.tournamentCard, isMobile && styles.tournamentCardMobile]}>
                  <Image 
                    source={{ uri: tournament.image }}
                    style={styles.tournamentImage}
                  />
                  <View style={styles.tournamentOverlay}>
                    <Text style={styles.tournamentName}>{tournament.title}</Text>
                    <Text style={styles.tournamentDate}>{tournament.date}</Text>
                    <Text style={styles.tournamentStrapline}>{tournament.strapline}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={[styles.footnoteContainer, isMobile && styles.footnoteContainerMobile]}>
              <Text style={styles.footnoteText}><sup>*</sup> Minimum prize pool is $2000, maximum prize pool is $5000</Text>
            </View>
          </View>
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
  hero: {
    backgroundColor: '#2E2E3A',
    paddingVertical: 40,
    paddingHorizontal: 16,
    
    overflow: 'hidden',
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  patternCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A259FF',
  },
  heroContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    position: 'relative',
    zIndex: 1,
  },
  heroTextContainer: {
    flex: 1,
    width: '100%',
  },
  heroTextContainerMobile: {
    flex: 1,
    width: '100%',
  },
  textWrapper: {
    width: '100%',
    flexDirection: 'row',
  },
  heroSubtitle: {
    color: '#A259FF',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  heroSubtitleMobile: {
    fontSize: 18,
  },
  heroTitle: {
    color: '#EAEAEA',
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'left',
    width: '100%',
  },
  heroTitleMobile: {
    fontSize: 32,
  },
  heroText: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    maxWidth: 600,
    textAlign: 'left',
    width: '100%',
  },
  heroTextMobile: {
    fontSize: 14,
    lineHeight: 22,
  },
  heroImage: {
    width: 400,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
  },
  heroImageContainerMobile: {
    width: '100%',
    marginTop: 24,
  },
  heroImageMobile: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  howItWorksSection: {
    backgroundColor: '#1A1A1D',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  sectionContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitleMobile: {
    fontSize: 24,
    marginBottom: 20,
  },
  howItWorksContainer: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
  },
  howItWorksContainerMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  howItWorksImage: {
    flex: 1,
    height: 300,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  processImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(162, 89, 255, 0.1)',
  },
  stepsContainer: {
    flex: 1,
    gap: 20,
  },
  stepsContainerMobile: {
    flex: 0,
    width: '100%',
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A259FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  stepTitleMobile: {
    fontSize: 16,
  },
  stepDescription: {
    color: '#A259FF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  stepDescriptionMobile: {
    fontSize: 13,
    lineHeight: 18,
  },
  featuredSection: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: '#3D246C',
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 46, 58, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tournamentHeaderMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  },
  stakeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stakeTitle: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  stakeTitleMobile: {
    fontSize: 16,
  },
  stakeDescription: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  stakeDescriptionMobile: {
    fontSize: 12,
  },
  globalJoinButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  globalJoinButtonMobile: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  globalJoinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  tournamentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  tournamentGridMobile: {
    gap: 12,
  },
  tournamentCard: {
    width: 280,
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2E2E3A',
  },
  tournamentCardMobile: {
    width: '100%',
    maxWidth: 320,
    height: 300,
  },
  tournamentImage: {
    width: '100%',
    height: 140,
  },
  tournamentOverlay: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  tournamentName: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  tournamentDate: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  tournamentStrapline: {
    color: '#EAEAEA',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  footnoteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  footnoteContainerMobile: {
    paddingVertical: 8,
  },
  footnoteText: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});