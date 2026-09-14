import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { ChevronRight, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import SportCategorySelector, { League } from '../../components/SportCategorySelector';
import NewsItem from '../../components/NewsItem';
import TournamentsPromo from '../../components/TournamentsPromo';
import YourTournaments from '../../components/YourTournaments';
import Sweet16Odds from '../../components/Sweet16Odds';
import { fetchRssFeed, formatDate, RSS_FEEDS, type RssItem } from '@/src/services/rssService';
import useTournamentData from '@/hooks/useTournamentData';
import { useAuth } from '@/hooks/useAuth';

// Define a type for RSS feed leagues
type RssLeague = 'NCAA' | 'IPL' | 'NBA' | 'NHL' | string;

// Map RSS feed leagues to SportCategorySelector leagues
const leagueMapping: Record<RssLeague, League> = {
  'NCAA': 'march-madness',
  'IPL': 'ipl',
  'NBA': 'nba',
  'NHL': 'nhl',
  // Default fallback
  'default': 'all'
};

// Reverse mapping for filtering
const reverseLeagueMapping: Record<League, RssLeague> = {
  'all': 'all',
  'march-madness': 'NCAA',
  'ipl': 'IPL',
  'nba': 'NBA',
  'nhl': 'NHL',
};

// Current active tournament ID - could be fetched from config or API
const ACTIVE_TOURNAMENT_ID = "04e2c407-1eed-4035-8c3c-cb9c7793c195";
const ACTIVE_ROUND_NAME = "Sweet 16";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showMoreNews, setShowMoreNews] = React.useState(false);
  const [selectedLeague, setSelectedLeague] = React.useState<League>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [ncaaNews, setNcaaNews] = useState<RssItem[]>([]);
  const [iplNews, setIplNews] = useState<RssItem[]>([]);
  const [nbaNews, setNbaNews] = useState<RssItem[]>([]);
  const [nhlNews, setNhlNews] = useState<RssItem[]>([]);

  // Use the tournament data hook to check if user is participating
  const {
    tournament,
    participant,
    isParticipating,
    isLoading: isTournamentLoading
  } = useTournamentData(ACTIVE_TOURNAMENT_ID, ACTIVE_ROUND_NAME);

  // Helper function to fetch RSS feeds with loading and error states
  const fetchRssFeedWithState = async (feedUrl: string, league: string, setNewsFunction: React.Dispatch<React.SetStateAction<RssItem[]>>) => {
    try {
      // Add error handling for undefined or empty feedUrl
      if (!feedUrl) {
        console.warn(`Feed URL for ${league} is undefined or empty`);
        setNewsFunction([]);
        return;
      }

      const items = await fetchRssFeed(feedUrl, league);
      setNewsFunction(items);
    } catch (error) {
      console.error(`Error fetching ${league} RSS feed:`, error);
      // Set empty array instead of error state to prevent breaking the UI
      setNewsFunction([]);
      setError(error instanceof Error ? error : new Error(`Failed to fetch ${league} feed`));
    }
  };

  // Fetch news feeds
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Fetch all feeds in parallel, but with proper error handling
    Promise.all([
      fetchRssFeedWithState(RSS_FEEDS.NCAA || '', 'NCAA', setNcaaNews).catch(() => setNcaaNews([])),
      fetchRssFeedWithState(RSS_FEEDS.IPL || '', 'IPL', setIplNews).catch(() => setIplNews([])),
      fetchRssFeedWithState(RSS_FEEDS.NBA || '', 'NBA', setNbaNews).catch(() => setNbaNews([])),
      fetchRssFeedWithState(RSS_FEEDS.NHL || '', 'NHL', setNhlNews).catch(() => setNhlNews([]))
    ])
    .finally(() => {
      setLoading(false);
    });
  }, []);

  // Combine all news items and filter based on selected league
  const getAllNews = () => {
    const allNews = [
      ...ncaaNews.map(item => ({ ...item, league: 'NCAA' as RssLeague })),
      ...iplNews.map(item => ({ ...item, league: 'IPL' as RssLeague })),
      ...nbaNews.map(item => ({ ...item, league: 'NBA' as RssLeague })),
      ...nhlNews.map(item => ({ ...item, league: 'NHL' as RssLeague }))
    ];

    // Sort by publication date (newest first)
    return allNews.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });
  };

  // Filter news based on selected league
  const filteredNews = getAllNews().filter(news => {
    if (selectedLeague === 'all') {
      return true;
    }
    const targetLeague = reverseLeagueMapping[selectedLeague];
    return news.league === targetLeague;
  });

  const displayedNews = showMoreNews ? filteredNews : filteredNews.slice(0, 4);

  // Map RSS items to the format expected by NewsItem component
  const mapRssItemToNewsItem = (item: RssItem & { league?: RssLeague }, index: number) => {
    // Get the mapped league or default to 'all' if not found
    const mappedLeague: League = item.league && leagueMapping[item.league] 
      ? leagueMapping[item.league] 
      : 'all';
    
    return {
      id: `${item.league || 'unknown'}-${index}`,
      league: mappedLeague,
      title: item.title || 'No Title',
      time: formatDate(item.pubDate || ''),
      imageUrl: item.image || '',
      whyBet: item.description ? (item.description.substring(0, 60) + '...') : 'No description available',
      link: item.link || '#'
    };
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* Left Two-Thirds Column */}
        <View style={styles.leftColumn}>
          <ScrollView style={styles.scrollContent}>
            <View style={styles.section}>
              {/* Show loading state when fetching tournament data */}
              {isTournamentLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#A259FF" />
                  <Text style={styles.loadingText}>Loading tournament data...</Text>
                </View>
              ) : (
                <>
                  {/* YourTournaments will automatically hide itself if the user has no tournaments */}
                  <YourTournaments />
                  
                  {/* Always show TournamentsPromo - it will display available tournaments */}
                  <TournamentsPromo />
                </>
              )}
              <Sweet16Odds />
            </View>
          </ScrollView>
        </View>

        {/* Right One-Third Column */}
        <View style={styles.rightColumn}>
          <ScrollView style={styles.scrollContent}>
            {/* News Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Latest News</Text>
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/news')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <ChevronRight size={16} color="#A259FF" />
                </TouchableOpacity>
              </View>
              <SportCategorySelector 
                selectedLeague={selectedLeague}
                onSelectLeague={setSelectedLeague}
              />
              <View style={styles.newsContainer}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#A259FF" />
                    <Text style={styles.loadingText}>Loading news...</Text>
                  </View>
                ) : error && filteredNews.length === 0 ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load news. Please try again later.</Text>
                  </View>
                ) : displayedNews.length === 0 ? (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No news found for this category.</Text>
                  </View>
                ) : (
                  displayedNews.map((news, index) => (
                    <NewsItem 
                      key={`news-${index}`} 
                      {...mapRssItemToNewsItem(news, index)} 
                    />
                  ))
                )}
              </View>
              {filteredNews.length > 4 && (
                <TouchableOpacity 
                  style={styles.loadMoreButton}
                  onPress={() => setShowMoreNews(!showMoreNews)}
                >
                  <Text style={styles.loadMoreText}>
                    {showMoreNews ? 'Show Less' : 'Load More'}
                    </Text>
                  <ChevronDown 
                    size={16} 
                    color="#A259FF" 
                    style={{ 
                      transform: [{ rotate: showMoreNews ? '180deg' : '0deg' }]
                    }} 
                  />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
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
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: '#2E2E3A',
  },
  rightColumn: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  newsContainer: {
    gap: 12,
    marginTop: 16,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  loadMoreText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  sweet16Section: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
})