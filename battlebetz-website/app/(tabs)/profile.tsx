import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { CreditCard as Edit, Share2, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

import Header from '../../components/Header';
import ProfileBalanceCard from '../../components/ProfileBalanceCard';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{user.username}</Text>
                {user.role !== 'consumer' && (
                  <View style={[
                    styles.roleBadge,
                    user.role === 'admin' ? styles.adminBadge : styles.promoterBadge
                  ]}>
                    <Text style={styles.roleBadgeText}>{user.role.toUpperCase()}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.profileUsername}>@{user.username}</Text>
              <View style={styles.profileActions}>
                <TouchableOpacity style={styles.profileActionButton}>
                  <Edit size={16} color="#EAEAEA" />
                  <Text style={styles.profileActionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileActionButton}>
                  <Share2 size={16} color="#EAEAEA" />
                  <Text style={styles.profileActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Battles</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>89</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>245</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>68%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
          </View>
          
          <ProfileBalanceCard />
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  profileName: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adminBadge: {
    backgroundColor: '#EF4444',
  },
  promoterBadge: {
    backgroundColor: '#10B981',
  },
  roleBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  profileUsername: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2E2E3A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  profileActionText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    color: '#A259FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2E2E3A',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});