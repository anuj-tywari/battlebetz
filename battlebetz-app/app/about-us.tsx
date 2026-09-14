import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Target, TrendingUp, Users } from 'lucide-react-native';
import TopNavigation from '../components/TopNavigation';

export default function AboutUsScreen() {
  return (
    <View style={styles.container}>
      <TopNavigation />
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>About Us</Text>
            <Text style={styles.heroText}>
              We are avid sports betters who bet daily and frustrated with the big books taking and not focusing on the customer experience.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.content}>
            <View style={styles.valueCard}>
              <Target size={40} color="#A259FF" />
              <Text style={styles.valueTitle}>Customer First</Text>
              <Text style={styles.valueText}>
                Unlike traditional sportsbooks, we put our users' experience first. Every feature is designed with the bettor in mind.
              </Text>
            </View>

            <View style={styles.valueCard}>
              <TrendingUp size={40} color="#10B981" />
              <Text style={styles.valueTitle}>Innovation</Text>
              <Text style={styles.valueText}>
                We're revolutionizing sports betting by making it more social, engaging, and rewarding for everyone involved.
              </Text>
            </View>

            <View style={styles.valueCard}>
              <Users size={40} color="#F59E0B" />
              <Text style={styles.valueTitle}>Community</Text>
              <Text style={styles.valueText}>
                We believe betting is better with friends. Our platform brings together passionate sports fans and creates lasting connections.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.visionSection}>
          <View style={styles.content}>
            <Text style={styles.visionTitle}>Revolutionizing Sports Betting – Built by Experts, Driven by Passion</Text>
            <Text style={styles.visionText}>
              At Battle Betz, we've brought together top Sports Consultants, Professional Bettors, and Die-Hard Enthusiasts to elevate the sports betting experience like never before. Our passion fuels our mission—to unite the sports betting community and make betting more exciting, interactive, and rewarding.
            </Text>
            <Text style={styles.visionText}>
              We're introducing new, dynamic ways to engage, ensuring a thrilling and evolving experience that adapts to the needs of today's bettors. Whether you're here to compete, strategize, or simply have fun, Battle Betz is your ultimate destination for smarter, more exciting sports betting.
            </Text>
            <Text style={styles.visionText}>
              Join us and be part of the next evolution in sports betting.
            </Text>
            <View style={styles.signatureContainer}>
              <Text style={styles.signatureName}>Chase</Text>
              <Text style={styles.signatureTitle}>CEO, Battle Betz</Text>
            </View>
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
  hero: {
    backgroundColor: '#2E2E3A',
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  heroContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#EAEAEA',
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  heroText: {
    color: '#A259FF',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 32,
  },
  section: {
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  content: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  valueCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  valueTitle: {
    color: '#EAEAEA',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  valueText: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  visionSection: {
    backgroundColor: '#3D246C',
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  visionTitle: {
    color: '#EAEAEA',
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 44,
  },
  visionText: {
    color: '#EAEAEA',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
    opacity: 0.9,
  },
  signatureContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  signatureName: {
    color: '#A259FF',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  signatureTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    opacity: 0.8,
  },
});