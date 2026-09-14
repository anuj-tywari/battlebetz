import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Target, TrendingUp, Users } from 'lucide-react-native';
import TopNavigation from '../components/TopNavigation';

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallMobile = width < 480;

  return (
    <View style={styles.container}>
      <TopNavigation />
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
              About Battle Betz
            </Text>
            <Text style={[styles.heroText, isMobile && styles.heroTextMobile]}>
              We're revolutionizing sports betting by creating a platform that puts you first. No more unfair odds, hidden fees, or complicated interfaces.
            </Text>
          </View>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Our Vision
            </Text>
            <Text style={[styles.visionText, isMobile && styles.visionTextMobile]}>
              At Battle Betz, we're transforming sports betting into a strategic, social experience.
              We understand the frustration with traditional sportsbooks – that's why we've created a platform where strategy meets competition, and where every bettor has a fair chance to win.
            </Text>
          </View>
        </View>

        {/* Core Values Section */}
        <View style={styles.valuesSection}>
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Our Core Values
            </Text>
            <View style={[styles.valuesGrid, isMobile && styles.valuesGridMobile]}>
              <View style={[styles.valueCard, isMobile && styles.valueCardMobile]}>
                <Target size={isMobile ? 28 : 32} color="#A259FF" />
                <Text style={[styles.valueTitle, isMobile && styles.valueTitleMobile]}>
                  Customer First
                </Text>
                <Text style={styles.valueText}>
                  Every feature and decision is made with our users in mind.
                </Text>
              </View>

              <View style={[styles.valueCard, isMobile && styles.valueCardMobile]}>
                <TrendingUp size={isMobile ? 28 : 32} color="#10B981" />
                <Text style={[styles.valueTitle, isMobile && styles.valueTitleMobile]}>
                  Innovation
                </Text>
                <Text style={styles.valueText}>
                  Constantly pushing boundaries in sports betting.
                </Text>
              </View>

              <View style={[styles.valueCard, isMobile && styles.valueCardMobile]}>
                <Users size={isMobile ? 28 : 32} color="#F59E0B" />
                <Text style={[styles.valueTitle, isMobile && styles.valueTitleMobile]}>
                  Community
                </Text>
                <Text style={styles.valueText}>
                  A thriving community of passionate sports fans.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.teamSection}>
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Built By Bettors, For Bettors
            </Text>
            <Text style={[styles.teamText, isMobile && styles.teamTextMobile]}>
              Our team consists of experienced sports bettors, data analysts, and technology experts who understand what makes a great betting platform.
            </Text>
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
    paddingVertical: 48,
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
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroTitleMobile: {
    fontSize: 28,
  },
  heroText: {
    color: '#A259FF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 28,
  },
  heroTextMobile: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  section: {
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  content: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitleMobile: {
    fontSize: 24,
  },
  visionText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 900,
    marginHorizontal: 'auto',
  },
  visionTextMobile: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  valuesSection: {
    backgroundColor: '#2E2E3A',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  valuesGridMobile: {
    gap: 12,
  },
  valueCard: {
    backgroundColor: '#3D246C',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: 280,
  },
  valueCardMobile: {
    width: '100%',
    maxWidth: 320,
    padding: 20,
  },
  valueTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginTop: 12,
    marginBottom: 8,
  },
  valueTitleMobile: {
    fontSize: 18,
  },
  valueText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  teamSection: {
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  teamText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 900,
    marginHorizontal: 'auto',
  },
  teamTextMobile: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});