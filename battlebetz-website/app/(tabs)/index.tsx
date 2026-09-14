import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import Header from '../../components/Header';
import NewsTicker from '../../components/NewsTicker';
import TournamentBanner from '../../components/TournamentBanner';
import CountdownBar from '../../components/CountdownBar';
import BattleBetzPromo from '../../components/BattleBetzPromo';
import SportCategorySelector from '../../components/SportCategorySelector';
import NewsItem from '../../components/NewsItem';
import TournamentBets from '../../components/TournamentBets';

export default function HomeScreen() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState('Today');
  const [timeFilterModalVisible, setTimeFilterModalVisible] = useState(false);
  const [showMoreNews, setShowMoreNews] = useState(false);
  const [showBattleBetzPromo, setShowBattleBetzPromo] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('march-madness');
  
  const timeFilterOptions = ['Today', 'Tomorrow', 'Week Ahead', 'Futures'];

  // Tournament bets data
  const tournamentBets = [
    {
      id: '1',
      tournament: 'March Madness',
      round: 1,
      match: '(1) Houston vs (16) Longwood',
      pick: 'Houston -21.5',
      odds: '-110',
      amount: 'BBZ.T 500',
      status: 'pending',
      gameTime: 'Today, 7:00 PM EST'
    },
    {
      id: '2',
      tournament: 'March Madness',
      round: 1,
      match: '(8) Nebraska vs (9) Texas A&M',
      pick: 'Texas A&M +1.5',
      odds: '-110',
      amount: 'BBZ.T 250',
      status: 'pending',
      gameTime: 'Today, 9:30 PM EST'
    },
    {
      id: '3',
      tournament: 'March Madness',
      round: 1,
      match: '(5) San Diego St vs (12) UAB',
      pick: 'San Diego St -4.5',
      odds: '-110',
      amount: 'BBZ.T 1000',
      status: 'pending',
      gameTime: 'Tomorrow, 12:15 PM EST'
    }
  ];

  const handlePlaceBets = () => {
    router.push({
      pathname: '/place-tournament-bets',
      params: { name: 'March Madness' }
    });
  };

  const allNewsItems = [
    {
      id: '1',
      league: 'march-madness',
      title: "March Madness: Top Seeds Revealed",
      time: "2 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop",
      whyBet: "Early betting lines show value on underdogs"
    },
    {
      id: '2',
      league: 'march-madness',
      title: "Bracket Busters: Teams to Watch",
      time: "3 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop",
      whyBet: "Historical data favors these underdogs"
    },
    {
      id: '3',
      league: 'march-madness',
      title: "First Round Matchups Analysis",
      time: "4 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop",
      whyBet: "Key statistics for opening games"
    },
    {
      id: '4',
      league: 'march-madness',
      title: "Injury Report: Key Players Status",
      time: "5 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop",
      whyBet: "Impact on team performance and odds"
    },
    {
      id: '5',
      league: 'march-madness',
      title: "Cinderella Stories: Dark Horses",
      time: "6 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop",
      whyBet: "Potential upset picks with great odds"
    }
  ];

  // Filter news based on selected league
  const filteredNews = allNewsItems.filter(news => 
    selectedLeague === 'all' ? true : news.league === selectedLeague
  );

  const displayedNews = showMoreNews ? filteredNews : filteredNews.slice(0, 4);

  const isDesktop = Platform.OS === 'web' && window.innerWidth > 768;

  return (
    <View style={styles.container}>
      <Header />
      <NewsTicker />
      <CountdownBar 
        targetDate={new Date('2025-03-20T17:00:00-04:00')} 
        title="MM 1st Round"
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.desktopContent
        ]}
      >
        <View style={[styles.mainContent, isDesktop && styles.desktopMainContent]}>
          <View style={[styles.section, isDesktop && styles.desktopSection]}>
            <TournamentBanner />
            
            {showBattleBetzPromo && (
              <BattleBetzPromo onClose={() => setShowBattleBetzPromo(false)} />
            )}
            
            <View style={styles.tournamentBettingSection}>
              <View style={styles.tournamentBettingHeader}>
                <View style={styles.tournamentBettingTitle}>
                  <Text style={styles.tournamentBettingText}>Tournament Bets</Text>
                </View>
                <TouchableOpacity 
                  style={styles.placeBetsButton}
                  onPress={handlePlaceBets}
                >
                  <Text style={styles.placeBetsButtonText}>Place Bets</Text>
                  <ChevronRight size={16} color="white" />
                </TouchableOpacity>
              </View>

              <TournamentBets 
                bets={tournamentBets}
                onViewAll={() => router.push('/my-activity')}
              />
            </View>
          </View>
          
          <View style={[styles.section, styles.lastSection, isDesktop && styles.desktopSection]}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            <SportCategorySelector 
              selectedLeague={selectedLeague}
              onLeagueSelect={setSelectedLeague}
            />
            <View style={styles.newsContainer}>
              {displayedNews.map(news => (
                <NewsItem key={news.id} {...news} />
              ))}
              
              {filteredNews.length > 4 && (
                <TouchableOpacity 
                  style={styles.showMoreButton}
                  onPress={() => setShowMoreNews(!showMoreNews)}
                >
                  <Text style={styles.showMoreText}>
                    {showMoreNews ? 'Show Less' : 'Show More'}
                  </Text>
                  <ChevronRight 
                    size={16} 
                    color="#A259FF" 
                    style={[
                      styles.showMoreIcon,
                      showMoreNews && styles.showMoreIconRotated
                    ]} 
                  />
                </TouchableOpacity>
              )}
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
  scrollContent: {
    padding: 16,
  },
  desktopContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  mainContent: {
    flex: 1,
  },
  desktopMainContent: {
    flexDirection: 'row',
    gap: 24,
  },
  section: {
    flex: 1,
  },
  desktopSection: {
    flex: 1,
    minWidth: 0, // Prevents flex items from overflowing
  },
  lastSection: {
    paddingBottom: 80,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  tournamentBettingSection: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  tournamentBettingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tournamentBettingTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tournamentBettingText: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  placeBetsButton: {
    backgroundColor: '#A259FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  placeBetsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  newsContainer: {
    gap: 12,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    marginTop: 8,
  },
  showMoreText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  showMoreIcon: {
    marginLeft: 4,
    transform: [{ rotate: '0deg' }],
  },
  showMoreIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
});