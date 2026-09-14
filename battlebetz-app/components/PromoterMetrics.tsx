import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Users, Trophy, TrendingUp, DollarSign } from 'lucide-react-native';

type PromoterMetricsProps = {
  signups: number;
  tournaments: number;
  conversionRate: number;
  earnings: number;
};

export default function PromoterMetrics({ 
  signups, 
  tournaments, 
  conversionRate, 
  earnings 
}: PromoterMetricsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promoter Stats</Text>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(162, 89, 255, 0.1)' }]}>
            <Users size={20} color="#A259FF" />
          </View>
          <Text style={styles.metricValue}>{signups}</Text>
          <Text style={styles.metricLabel}>Sign-ups</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
            <Trophy size={20} color="#FFD700" />
          </View>
          <Text style={styles.metricValue}>{tournaments}</Text>
          <Text style={styles.metricLabel}>Tournaments</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <TrendingUp size={20} color="#10B981" />
          </View>
          <Text style={styles.metricValue}>{conversionRate}%</Text>
          <Text style={styles.metricLabel}>Conversion</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <DollarSign size={20} color="#EF4444" />
          </View>
          <Text style={styles.metricValue}>${earnings}</Text>
          <Text style={styles.metricLabel}>Earnings</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  metricLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});