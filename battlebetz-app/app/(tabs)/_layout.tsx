import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { LayoutDashboard, Trophy, Settings, Activity, Wallet, Swords } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { UserRole } from '@/types/roles';
import RoleBadge from '@/components/RoleBadge';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { userProfile, userMetrics, loading } = useProfileData();
  const isDesktop = Platform.OS === 'web' && window.innerWidth > 768;

  // Determine the profile data to display
  const profileName = useMemo(() => {
    return userProfile?.username || user?.user_metadata?.username || 'User';
  }, [userProfile, user]);

  const profileUsername = useMemo(() => {
    return `@${userProfile?.username?.toLowerCase() || user?.user_metadata?.username?.toLowerCase() || 'user'}`;
  }, [userProfile, user]);

  const avatarSource = useMemo(() => {
    if (userProfile?.avatar_url) {
      return { uri: userProfile.avatar_url };
    }
    return { uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' };
  }, [userProfile]);

  const activeCompetitions = useMemo(() => {
    if (userProfile?.active_competitions) {
      try {
        return JSON.parse(userProfile.active_competitions);
      } catch (e) {
        console.error('Error parsing active competitions', e);
        return [];
      }
    }
    return [];
  }, [userProfile]);

  if (!isDesktop) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#A259FF',
          tabBarInactiveTintColor: '#6c757d',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tournaments"
          options={{
            title: 'Tournaments',
            tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Tabs>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarContent}>
          <View style={styles.menuItems}>
            <TouchableOpacity
              style={[styles.menuItem, pathname === '/(tabs)' && styles.menuItemActive]}
              onPress={() => router.push('/(tabs)')}
            >
              <LayoutDashboard size={20} color={pathname === '/(tabs)' ? '#A259FF' : '#EAEAEA'} />
              <Text style={[styles.menuText, pathname === '/(tabs)' && styles.menuTextActive]}>
                Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, pathname === '/(tabs)/tournaments' && styles.menuItemActive]}
              onPress={() => router.push('/(tabs)/tournaments')}
            >
              <Trophy size={20} color={pathname === '/(tabs)/tournaments' ? '#A259FF' : '#EAEAEA'} />
              <Text style={[styles.menuText, pathname === '/(tabs)/tournaments' && styles.menuTextActive]}>
                Tournaments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, pathname === '/(tabs)/battles' && styles.menuItemActive]}
            >
              <Swords size={20} color={pathname === '/(tabs)/battles' ? '#A259FF' : '#EAEAEA'} />
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuText, pathname === '/(tabs)/battles' && styles.menuTextActive]}>
                  Battles
                </Text>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Dropping this week</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, pathname === '/(tabs)/vault' && styles.menuItemActive]}
            >
              <Wallet size={20} color={pathname === '/(tabs)/vault' ? '#A259FF' : '#EAEAEA'} />
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuText, pathname === '/(tabs)/vault' && styles.menuTextActive]}>
                  Vault
                </Text>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Dropping this week</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <TouchableOpacity 
            style={styles.profileSection}
            onPress={() => router.push('/profile')}
          >
            {loading ? (
              <Text style={styles.loadingText}>Loading profile...</Text>
            ) : (
              <>
                <View style={styles.profileHeader}>
                  <Image 
                    source={avatarSource}
                    style={styles.profileAvatar}
                  />
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{profileName}</Text>
                    <Text style={styles.profileUsername}>{profileUsername}</Text>
                    {userProfile?.role && <RoleBadge role={userProfile.role as UserRole} />}
                  </View>
                </View>

                <View style={styles.balanceSection}>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceLabel}>BBZ Balance</Text>
                    <Text style={styles.balanceValue}>{userProfile?.bbz_balance?.toLocaleString() || '0'}</Text>
                  </View>
                </View>

                {activeCompetitions && activeCompetitions.length > 0 && (
                  <View style={styles.competitionsSection}>
                    <Text style={styles.competitionsTitle}>Active Competitions</Text>
                    <View style={styles.competitionsList}>
                      {activeCompetitions.map((comp, index) => (
                        <View key={index} style={styles.competitionItem}>
                          <Trophy size={14} color="#FFD700" />
                          <Text style={styles.competitionName}>{comp.name}</Text>
                          {comp.rank && <Text style={styles.competitionRank}>#{comp.rank}</Text>}
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' }
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="tournaments" />
          <Tabs.Screen name="results" />
          <Tabs.Screen name="preferences" />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0D0D0D',
  },
  sidebar: {
    width: 220,
    backgroundColor: '#1A1A1D',
    borderRightWidth: 1,
    borderRightColor: '#2E2E3A'
  },
  sidebarContent: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  menuItems: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: '#3D246C',
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  menuTextActive: {
    color: '#A259FF',
    fontFamily: 'Poppins-Medium',
  },
  comingSoonBadge: {
    backgroundColor: '#10B981',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  comingSoonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  mainContent: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#1A1A1D',
    borderTopWidth: 1,
    borderTopColor: '#2E2E3A',
  },
  profileSection: {
    marginTop: 'auto',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
  },
  profileHeader: {
    marginBottom: 12,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 12,
  },
  profileInfo: {
    gap: 4,
  },
  profileName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  profileUsername: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  balanceSection: {
    backgroundColor: '#3D246C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceLabel: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  balanceValue: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  tournamentBalance: {
    color: '#10B981',
  },
  competitionsSection: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  competitionsTitle: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  competitionsList: {
    gap: 4,
  },
  competitionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2E2E3A',
    borderRadius: 6,
    padding: 6,
  },
  competitionName: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  competitionRank: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    padding: 10,
  },
});