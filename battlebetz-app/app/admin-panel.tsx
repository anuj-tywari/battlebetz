import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { 
  ArrowLeft,
  Users, 
  Settings,
  TrendingUp,
  Trophy,
  Building2
} from 'lucide-react-native';
import { Route, useRouter } from 'expo-router';
import { useProfileData } from '@/hooks/useProfileData';

export default function AdminPanelScreen() {
  const router = useRouter();
  const { userProfile, loading } = useProfileData();

  // Use useEffect for navigation instead of conditional hook calls
  useEffect(() => {
    // Only redirect if we have loaded the profile and it's not an admin
    if (!loading && userProfile && userProfile.role !== 'admin') {
      router.replace('/');
    }
  }, [loading, userProfile, router]);

  // Define admin actions outside the render return
  const adminActions = [
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Add, remove, and modify user accounts',
      icon: Users,
      route: '/user-management',
      color: '#10B981'
    },
    {
      id: 'metrics',
      title: 'Metrics & Analytics',
      description: 'View detailed business metrics',
      icon: TrendingUp,
      route: '/metrics',
      color: '#A259FF'
    },
    {
      id: 'competitions',
      title: 'Competition Management',
      description: 'Manage tournaments and leagues',
      icon: Trophy,
      route: '/competition-management',
      color: '#EF4444'
    },
    {
      id: 'system',
      title: 'System Settings',
      description: 'Configure application settings',
      icon: Settings,
      route: '/system-settings',
      color: '#3B82F6'
    }
  ];

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Handle no profile state
  if (!userProfile) {
    console.log("No user profile loaded");
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Unable to load profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome, {userProfile.username}</Text>
          <Text style={styles.welcomeSubtitle}>Manage platform settings</Text>
        </View>

        <View style={styles.actionsGrid}>
          {adminActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.route as Route)}
            >
              <View style={styles.actionContent}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <action.icon size={20} color={action.color} />
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Status</Text>
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
  loadingText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    fontFamily: 'Poppins-Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#1A1A1D',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  welcomeTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  welcomeSubtitle: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  actionsGrid: {
    gap: 8,
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: '#EAEAEA',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  actionDescription: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  quickActions: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  quickActionsTitle: {
    color: '#EAEAEA',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    backgroundColor: '#3D246C',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  quickActionText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});