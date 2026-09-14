import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, X } from 'lucide-react-native';
import WaitingListModal from './WaitingListModal';

export default function TopNavigation() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [showWaitingListModal, setShowWaitingListModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when resizing from mobile to desktop
  useEffect(() => {
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }
  }, [isMobile, menuOpen]);

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
    <>
      <View style={styles.navbar}>
        <View style={styles.navContent}>
          <TouchableOpacity 
            style={styles.navLeft}
            onPress={() => router.push('/')}
          >
            <Image 
              source={require('../assets/images/logo.png')}
              width={100}
              height={50}
              resizeMode="contain"
              style={styles.logo}
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

      <WaitingListModal
        visible={showWaitingListModal}
        onClose={() => setShowWaitingListModal(false)}
        onSubmit={handleWaitingListSubmit}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
});