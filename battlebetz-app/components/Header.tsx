import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { Bell, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import NewsTicker from './NewsTicker';

export default function Header() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://raw.githubusercontent.com/stackblitz/assets/main/projects/bb-logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Battle Betz</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <TouchableOpacity 
            style={styles.activityButton}
            onPress={() => router.push('/my-activity')}
          >
            <Activity size={14} color="#EAEAEA" />
            <Text style={styles.activityButtonText}>Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={18} color="#EAEAEA" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0D0D0D',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D0D0D',
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
  },
  logo: {
    width: 24,
    height: 24,
  },
  logoText: {
    color: '#EAEAEA',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  tickerContainer: {
    flex: 1,
    marginHorizontal: 16,
    maxWidth: 800,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
    justifyContent: 'flex-end',
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  activityButtonText: {
    color: '#EAEAEA',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  iconButton: {
    padding: 4,
  },
});