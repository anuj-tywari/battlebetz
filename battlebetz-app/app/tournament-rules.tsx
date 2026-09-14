import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Trophy, Users, DollarSign, Clock, ChevronRight, TrendingUp, Target } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function TournamentRulesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tournament Rules</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Our Tournament is Different</Text>
          <Text style={styles.sectionText}>
            Unlike traditional sports betting apps, our tournament offers you the chance to experience 
            the thrill of betting with zero financial risk beyond your entry fee. Once you're in, 
            there's no risk of losing real money—just the opportunity to win big based on your 
            strategy and skill.
          </Text>
          <Text style={styles.sectionText}>
            Our unique structure makes competition engaging and keeps you in the game, even if your 
            team gets knocked out! We've designed a format that ensures a level playing field where 
            anyone can win, regardless of experience.
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionText}>
            Each participant starts with 1,000 BetzCoin (BBZ.T) our symbolic betting currency used 
            exclusively within the tournament. Every round, you must place bets using your entire 
            available balance. Your ranking is determined by Return on Investment (ROI)—the percentage 
            growth of your BBZ.T balance over the tournament.
          </Text>
          
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Higher ROI = Higher Rankings = Bigger Prizes</Text>
            <Text style={styles.bulletPoint}>• You have full control over how you distribute your bets</Text>
            <Text style={styles.bulletPoint}>• Parlays, spreads, over/unders, and money lines are all available</Text>
            <Text style={styles.bulletPoint}>• Unused BBZ.T does not carry over—you must use it all in each round</Text>
            <Text style={styles.bulletPoint}>• Seeding dynamically pairs top-ranked competitors against lower-ranked ones</Text>
          </View>
        </View>

        {/* Example Journey */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Example of How You Can Win</Text>
          <View style={styles.exampleTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Round</Text>
              <Text style={styles.tableHeaderCell}>Balance</Text>
              <Text style={styles.tableHeaderCell}>ROI</Text>
              <Text style={styles.tableHeaderCell}>Ranking</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Round 1</Text>
              <Text style={styles.tableCell}>1,330</Text>
              <Text style={styles.tableCell}>+33%</Text>
              <Text style={styles.tableCell}>345/1,000</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Round 2</Text>
              <Text style={styles.tableCell}>2,115</Text>
              <Text style={styles.tableCell}>+59%</Text>
              <Text style={styles.tableCell}>99/500</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Round 3</Text>
              <Text style={styles.tableCell}>3,765</Text>
              <Text style={styles.tableCell}>+78%</Text>
              <Text style={styles.tableCell}>20/250</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Round 4</Text>
              <Text style={styles.tableCell}>7,153</Text>
              <Text style={styles.tableCell}>+90%</Text>
              <Text style={styles.tableCell}>1/125</Text>
            </View>
            <View style={[styles.tableRow, styles.finalRow]}>
              <Text style={styles.tableCell}>Final</Text>
              <Text style={styles.tableCell}>7,153</Text>
              <Text style={styles.tableCell}>615.38%</Text>
              <Text style={styles.tableCell}>Champion</Text>
            </View>
          </View>
        </View>

        {/* Tournament Structure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournament Structure</Text>
          <View style={styles.roundsContainer}>
            <View style={styles.roundCard}>
              <View style={styles.roundHeader}>
                <Trophy size={20} color="#FFD700" />
                <Text style={styles.roundTitle}>Sweet 16</Text>
                <Text style={styles.roundDate}>March 27-28</Text>
              </View>
              <View style={styles.roundDetails}>
                <Text style={styles.roundDetail}>• 8 Games</Text>
                <Text style={styles.roundDetail}>• Top 50% ROI Advance</Text>
                <Text style={styles.roundDetail}>• Max 5 Bets</Text>
                <Text style={styles.roundDetail}>• Max 5-Leg Parlays</Text>
              </View>
            </View>

            <View style={styles.roundCard}>
              <View style={styles.roundHeader}>
                <Trophy size={20} color="#FFD700" />
                <Text style={styles.roundTitle}>Elite Eight</Text>
                <Text style={styles.roundDate}>March 29-30</Text>
              </View>
              <View style={styles.roundDetails}>
                <Text style={styles.roundDetail}>• 4 Games</Text>
                <Text style={styles.roundDetail}>• Top 50% ROI Advance</Text>
                <Text style={styles.roundDetail}>• Max 3 Bets</Text>
                <Text style={styles.roundDetail}>• Max 5-Leg Parlays</Text>
              </View>
            </View>

            <View style={styles.roundCard}>
              <View style={styles.roundHeader}>
                <Trophy size={20} color="#FFD700" />
                <Text style={styles.roundTitle}>Final Four</Text>
                <Text style={styles.roundDate}>April 5</Text>
              </View>
              <View style={styles.roundDetails}>
                <Text style={styles.roundDetail}>• 2 Games</Text>
                <Text style={styles.roundDetail}>• Top 50% ROI Advance</Text>
                <Text style={styles.roundDetail}>• Max 3 Bets</Text>
                <Text style={styles.roundDetail}>• Player Props Available</Text>
              </View>
            </View>

            <View style={styles.roundCard}>
              <View style={styles.roundHeader}>
                <Trophy size={20} color="#FFD700" />
                <Text style={styles.roundTitle}>Championship</Text>
                <Text style={styles.roundDate}>April 7</Text>
              </View>
              <View style={styles.roundDetails}>
                <Text style={styles.roundDetail}>• 1 Game</Text>
                <Text style={styles.roundDetail}>• Winner by Highest ROI</Text>
                <Text style={styles.roundDetail}>• Max 3 Bets</Text>
                <Text style={styles.roundDetail}>• Player Props Available</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Prize Pool */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prize Pool & Payouts</Text>
          <View style={styles.prizeCard}>
            <View style={styles.prizeInfo}>
              <Text style={styles.prizeHighlight}>Winner Takes ALL!</Text>
              <Text style={styles.prizeText}>
                Minimum payout $300 and increases as more participants join
              </Text>
            </View>
          </View>
        </View>

        {/* Live Rankings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Rankings & Seeding</Text>
          <Text style={styles.sectionText}>
            Stay engaged with real-time leaderboards and watch your ranking shift with every bet placed. 
            Our dynamic seeding ensures fair matchups, pitting high performers against lower-ranked participants.
          </Text>
        </View>

        {/* Why Join */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why You Should Join</Text>
          <View style={styles.reasonsGrid}>
            <View style={styles.reasonCard}>
              <DollarSign size={24} color="#10B981" />
              <Text style={styles.reasonTitle}>Low Risk, High Reward</Text>
              <Text style={styles.reasonText}>No real money is at stake beyond your entry fee</Text>
            </View>
            
            <View style={styles.reasonCard}>
              <Target size={24} color="#A259FF" />
              <Text style={styles.reasonTitle}>Strategy-Driven</Text>
              <Text style={styles.reasonText}>Success is based on ROI, not just lucky picks</Text>
            </View>
            
            <View style={styles.reasonCard}>
              <Trophy size={24} color="#FFD700" />
              <Text style={styles.reasonTitle}>March Madness Excitement</Text>
              <Text style={styles.reasonText}>Follow along with the real tournament</Text>
            </View>
            
            <View style={styles.reasonCard}>
              <TrendingUp size={24} color="#F59E0B" />
              <Text style={styles.reasonTitle}>Scalable Prizes</Text>
              <Text style={styles.reasonText}>More players = bigger rewards!</Text>
            </View>
          </View>
        </View>

        {/* Join Now */}
        <View style={styles.joinSection}>
          <View style={styles.joinContent}>
            <Trophy size={32} color="#FFD700" />
            <Text style={styles.joinTitle}>Ready to Join?</Text>
            <Text style={styles.joinText}>
              Don't miss your chance to compete in the ultimate sports betting tournament
            </Text>
            <TouchableOpacity 
              style={styles.joinButton}
              onPress={() => router.push('/join-tournament')}
            >
              <Text style={styles.joinButtonText}>Join Tournament</Text>
              <ChevronRight size={20} color="white" />
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
  sectionText: {
    color: '#EAEAEA',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  bulletPoints: {
    marginTop: 16,
  },
  bulletPoint: {
    color: '#EAEAEA',
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  exampleTable: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3D246C',
    padding: 12,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
    padding: 12,
  },
  finalRow: {
    backgroundColor: '#3D246C',
  },
  tableCell: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  roundsContainer: {
    gap: 16,
  },
  roundCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
  },
  roundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  roundTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  roundDate: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  roundDetails: {
    backgroundColor: '#1A1A1D',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  roundDetail: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  prizeCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 24,
  },
  prizeInfo: {
    alignItems: 'center',
  },
  prizeHighlight: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  prizeText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center'
  },
  reasonCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  reasonTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  reasonText: {
    color: '#A259FF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  joinSection: {
    backgroundColor: '#3D246C',
    borderRadius: 12,
    padding: 24,
    marginBottom: 40,
  },
  joinContent: {
    alignItems: 'center',
    gap: 16,
  },
  joinTitle: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  joinText: {
    color: '#A259FF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  joinButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});