import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput, ActivityIndicator
} from 'react-native';
import { ArrowLeft, Search, X, Users, Activity, DollarSign, Target, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { usePlatformMetrics } from '@/hooks/usePlatformMetrics';

export default function MatrixScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userProfile, loading: profileLoading } = useProfileData();
  const { metrics, loading, error } = usePlatformMetrics();
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect non-admin/internal users
  useEffect(() => {
    if (!profileLoading && userProfile && userProfile.role !== 'admin' && userProfile.role !== 'internal') {
      router.replace('/');
    }
  }, [profileLoading, userProfile]);

  if (loading || profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EAEAEA" />
      </View>
    );
  }

  if (error || !metrics) {
    return <Text style={styles.errorText}>Failed to load metrics. Try again later.</Text>;
  }

  // Helper to render a single metric card
  const renderMetricItem = (
    icon: JSX.Element,
    value: string | number,
    label: string
  ) => (
    <View style={styles.metricCard}>
      {icon}
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Platform Matrix</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#A259FF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search metrics..."
              placeholderTextColor="#6c757d"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                <X size={16} color="#EAEAEA" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Metrics Grid */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Metrics & Analytics</Text>
          <View style={styles.metricsGrid}>
            {renderMetricItem(<Users size={20} color="#A259FF" />, metrics.totalUsers.toLocaleString(), 'Total Users')}
            {renderMetricItem(<TrendingUp size={20} color="#10B981" />, metrics.totalTournaments, 'Total Tournaments')}
            {renderMetricItem(<DollarSign size={20} color="#F59E0B" />, `$${metrics.totalPayouts.toLocaleString()}`, 'Total Payouts')}
            {renderMetricItem(<Activity size={20} color="#10B981" />, metrics.totalBetsPlaced.toLocaleString(), 'Total Bets Placed')}
            {renderMetricItem(<Target size={20} color="#EF4444" />, metrics.avgBetsPerRound, 'Avg Bets / Round')}
            {renderMetricItem(<Target size={20} color="#EF4444" />, metrics.avgBetsPerTournament, 'Avg Bets / Tournament')}
            {renderMetricItem(<Target size={20} color="#EF4444" />, metrics.avgLegsPerBet, 'Avg Legs / Bet')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
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
  searchSection: {
    backgroundColor: '#1A1A1D',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    fontFamily: 'Poppins-Bold',
  },
  metricLabel: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
});
