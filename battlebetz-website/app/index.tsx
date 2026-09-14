import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, Dimensions, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, Users, Shield, TrendingUp, Crown, Swords, ChevronRight, DollarSign, Menu, X } from 'lucide-react-native';
import WaitingListModal from '../components/WaitingListModal';
import SweetSixteenCountdown from '../components/SweetSixteenCountdown';

export default function LandingPage() {
  const router = useRouter();
  const [showWaitingListModal, setShowWaitingListModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Close menu when resizing from mobile to desktop
  useEffect(() => {
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }
  }, [isMobile]);

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
      image: require('../assets/images/FeaturedBet_Basketball Players.jpg'),
      entryFee: 15,
      prize: "Min $2,000"
    },
    {
      title: "IPL 2025",
      date: "Mar 22 - May 26",
      strapline: "Cricket's Biggest T20 League",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop",
      entryFee: 15,
      prize: "Min $2,000"
    },
    {
      title: "NBA Playoffs",
      date: "Apr 20 - Jun 23",
      strapline: "The Road to the NBA Championship",
      image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop",
      entryFee: 15,
      prize: "Min $2,000"
    },
    {
      title: "NHL Stanley Cup",
      date: "Apr 22 - Jun 25",
      strapline: "Battle for Lord Stanley's Cup",
      image: require('../assets/images/FeaturedBetPanel_NHL.jpg'),
      entryFee: 15,
      prize: "Min $2,000"
    }
  ];

  const NavLinks = () => (
    <View style={[styles.navLinks, isMobile && menuOpen ? styles.mobileNavLinks : isMobile && styles.navLinksHidden]}>
      <TouchableOpacity 
        style={styles.navLink}
        onPress={() => {
          router.push('/about');
          if (isMobile) setMenuOpen(false);
        }}
      >
        <Text style={styles.navLinkText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navLink}
        onPress={() => {
          router.push('/tournaments');
          if (isMobile) setMenuOpen(false);
        }}
      >
        <Text style={styles.navLinkText}>Tournaments</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navLink}
        onPress={() => {
          router.push('/public-news');
          if (isMobile) setMenuOpen(false);
        }}
      >
        <Text style={styles.navLinkText}>News</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navLink}
        onPress={() => {
          router.push('/coming-soon');
          if (isMobile) setMenuOpen(false);
        }}
      >
        <Text style={styles.navLinkText}>Coming Soon</Text>
      </TouchableOpacity>
      
      {isMobile && (
        <TouchableOpacity 
          style={[styles.waitingListButton, styles.mobileWaitingListButton]}
          onPress={() => {
            setShowWaitingListModal(true);
            setMenuOpen(false);
          }}
        >
          <Text style={styles.waitingListButtonText}>Join Waiting List</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.navContent}>
          <TouchableOpacity 
            style={styles.navLeft}
            onPress={() => router.push('/')}
          >
            <Image 
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              width={240}
              height={80}
            />
          </TouchableOpacity>
          
          {!isMobile && <NavLinks />}

          {!isMobile && (
            <View style={styles.authButtons}>
              <TouchableOpacity 
                style={styles.waitingListButton}
                onPress={() => setShowWaitingListModal(true)}
              >
                <Text style={styles.waitingListButtonText}>Join Waiting List</Text>
              </TouchableOpacity>
            </View>
          )}

          {isMobile && (
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} color="#EAEAEA" /> : <Menu size={24} color="#EAEAEA" />}
            </TouchableOpacity>
          )}
        </View>
        
        {isMobile && <NavLinks />}
      </View>

      <ScrollView>
        <SweetSixteenCountdown />

        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={[styles.heroColumns, isMobile && styles.heroColumnsMobile]}>
              <View style={[styles.heroTextColumn, isMobile && styles.heroTextColumnMobile]}>
                <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
                  Enter the World's First March Madness Betting Tournament
                </Text>
                <Text style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}>
                  Join thousands of players in tournaments and battles. Compete, strategize, and win big.
                </Text>
              </View>
              <View style={[styles.heroImageColumn, isMobile && styles.heroImageColumnMobile]}>
                <Image
                  source={require('../assets/images/hero-image.png')}
                  resizeMode="contain"
                  style={[styles.heroImage, isMobile && styles.heroImageMobile]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.featuredSection}>
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>Featured Tournaments</Text>
            
            <View style={[styles.tournamentHeader, isMobile && styles.tournamentHeaderMobile]}>
              <View style={styles.stakeInfo}>
                <DollarSign size={isMobile ? 18 : 24} color="#10B981" />
                <View>
                  <Text style={[styles.stakeDescription, isMobile && styles.stakeDescriptionMobile]}>
                    Prize pool grows with each participant
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
                style={[styles.globalJoinButton, styles.mobileGlobalJoinButton]}
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
                    source={tournament.image}
                    style={styles.tournamentImage}
                  />
                  <View style={styles.tournamentOverlay}>
                    <Text style={styles.tournamentName}>{tournament.title}</Text>
                    <Text style={styles.tournamentDate}>{tournament.date}</Text>
                    <Text style={styles.tournamentStrapline}>{tournament.strapline}</Text>
                    
                    <View style={styles.tournamentStats}>
                      <View style={styles.statItem}>
                        <DollarSign size={16} color="#10B981" />
                        <Text style={styles.statValue}>${tournament.entryFee}</Text>
                        <Text style={styles.statLabel}>Entry Fee</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Trophy size={16} color="#A259FF" />
                        <Text style={styles.statValue}>{tournament.prize}</Text>
                        <Text style={styles.statLabel}>Prize Pool</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>Why Choose Battle Betz?</Text>
            <Text style={[styles.sectionSubtitle, isMobile && styles.sectionSubtitleMobile]}>
              We are the Future of Sports Betting
            </Text>
            <View style={[styles.featuresGrid, isMobile && styles.featuresGridMobile]}>
              <View style={[styles.featureCard, isMobile && styles.featureCardMobile]}>
                <Crown size={isMobile ? 32 : 40} color="#A259FF" />
                <Text style={styles.featureTitle}>Tournaments</Text>
                <Text style={styles.featureDescription}>
                  Compete in large-scale tournaments with massive prize pools and prove your betting prowess.
                </Text>
              </View>
              <View style={[styles.featureCard, isMobile && styles.featureCardMobile]}>
                <Swords size={isMobile ? 32 : 40} color="#10B981" />
                <Text style={styles.featureTitle}>Social Betting</Text>
                <Text style={styles.featureDescription}>
                  Challenge friends, make rivals, and build your reputation in our vibrant betting community.
                </Text>
              </View>
              <View style={[styles.featureCard, isMobile && styles.featureCardMobile]}>
                <Shield size={isMobile ? 32 : 40} color="#F59E0B" />
                <Text style={styles.featureTitle}>Secure Platform</Text>
                <Text style={styles.featureDescription}>
                  Advanced security measures and transparent odds ensure fair play for all participants.
                </Text>
              </View>
              <View style={[styles.featureCard, isMobile && styles.featureCardMobile]}>
                <TrendingUp size={isMobile ? 32 : 40} color="#EF4444" />
                <Text style={styles.featureTitle}>Analytics</Text>
                <Text style={styles.featureDescription}>
                  Access detailed statistics and insights to make informed betting decisions.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.sectionContent}>
            <Text style={[styles.ctaTitle, isMobile && styles.ctaTitleMobile]}>
              Ready to Join the future of sports betting?
            </Text>
            <Text style={[styles.ctaSubtitle, isMobile && styles.ctaSubtitleMobile]}>
              Get ready for March 27th to kick off the Tournament
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => setShowWaitingListModal(true)}
            >
              <Text style={styles.ctaButtonText}>Join Waiting List</Text>
            </TouchableOpacity>
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
  navbar: {
    backgroundColor: '#1A1A1D',
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 240,
    height: 50,
  },
  logoText: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  navLinksHidden: {
    display: 'none',
  },
  mobileNavLinks: {
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1D',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
    zIndex: 99,
    gap: 16,
  },
  navLink: {
    padding: 6,
  },
  navLinkText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitingListButton: {
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  mobileWaitingListButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  waitingListButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  menuButton: {
    padding: 6,
  },
  hero: {
    backgroundColor: '#2E2E3A',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  heroContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  heroColumns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  heroColumnsMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  heroTextColumn: {
    flex: 1,
  },
  heroTextColumnMobile: {
    flex: 0,
    width: '100%'
  },
  heroTitle: {
    color: '#A259FF',
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    lineHeight: 44,
  },
  heroTitleMobile: {
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center'
  },
  heroSubtitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    lineHeight: 32,
  },
  heroSubtitleMobile: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center'
  },
  heroImageColumn: {
    flex: 1,
    height: 400,
  },
  heroImageColumnMobile: {
    flex: 0,
    width: '100%',
    height: 240, 
    marginTop: 16, 
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  heroImageMobile: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    maxWidth: '100%',
  },
  featuredSection: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: '#3D246C',
  },
  sectionContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitleMobile: {
    fontSize: 28,
  },
  sectionSubtitle: {
    color: '#A259FF',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    marginBottom: 48,
    textAlign: 'center',
  },
  sectionSubtitleMobile: {
    fontSize: 18,
    marginBottom: 32,
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
  stakeDescription: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  stakeDescriptionMobile: {
    fontSize: 12,
  },
  globalJoinButton: {
    backgroundColor: '#A259FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  mobileGlobalJoinButton: {
    marginBottom: 24,
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
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2E2E3A',
    display: 'flex', 
    flexDirection: 'column',
  },
  tournamentCardMobile: {
    width: '100%',
    maxWidth: 320,
  },
  tournamentImage: {
    width: '100%',
    height: 140,
  },
  tournamentOverlay: {
    padding: 16,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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
  tournamentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(74, 74, 74, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginTop: 'auto',
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
  featuresGridMobile: {
    gap: 16,
  },
  featureCard: {
    width: 260,
    backgroundColor: '#3D246C',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  featureCardMobile: {
    width: '100%',
    padding: 24,
  },
  featureTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  featureDescription: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    backgroundColor: '#3D246C',
    paddingVertical: 60,
    paddingHorizontal: 16,
  },
  ctaTitle: {
    color: '#EAEAEA',
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaTitleMobile: {
    fontSize: 24,
  },
  ctaSubtitle: {
    color: '#A259FF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaSubtitleMobile: {
    fontSize: 16,
  },
  ctaButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    maxWidth: 300,
    marginHorizontal: 'auto',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  }
});