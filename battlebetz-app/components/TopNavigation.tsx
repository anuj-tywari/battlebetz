import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function TopNavigation() {
  const router = useRouter();
  const isDesktop = Platform.OS === 'web' && window.innerWidth > 768;

  return (
    <View style={styles.navbar}>
      <View style={styles.navContent}>
        <TouchableOpacity 
          style={styles.navLeft}
          onPress={() => router.push('/')}
        >
          <Image 
            source={require('../app/Public Folder/Group 17-1.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
        
        <View style={styles.navLinks}>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => router.push('/about-us')}
          >
            <Text style={styles.navLinkText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => router.push('/news')}
          >
            <Text style={styles.navLinkText}>News</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    padding: 16,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 32,
    resizeMode: 'contain',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  navLink: {
    padding: 8,
  },
  navLinkText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  }
});