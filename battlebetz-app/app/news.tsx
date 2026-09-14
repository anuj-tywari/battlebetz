import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Platform, Linking, useWindowDimensions } from 'react-native';
import { Search, X, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { 
  fetchRssFeed, 
  formatDate, 
  getReadTime, 
  RSS_FEEDS,
  type RssItem 
} from '@/src/services/rssService';

type League = 'all' | 'NCAA' | 'IPL' | 'NBA' | 'NHL';

export default function NewsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<League>('all');
  const [loading, setLoading] = useState({ ncaa: false, ipl: false, nba: false, nhl: false });
  const [error, setError] = useState({ ncaa: null, ipl: null, nba: null, nhl: null });
  const [ncaaNews, setNcaaNews] = useState<RssItem[]>([]);
  const [iplNews, setIplNews] = useState<RssItem[]>([]);
  const [nbaNews, setNbaNews] = useState<RssItem[]>([]);
  const [nhlNews, setNhlNews] = useState<RssItem[]>([]);

  const leagues = [
    { id: 'all', name: 'All News' },
    { id: 'NCAA', name: 'NCAA' },
    { id: 'IPL', name: 'IPL' },
    { id: 'NBA', name: 'NBA' },
    { id: 'NHL', name: 'NHL' }
  ];

  const fetchRssFeedWithState = async (feedUrl: string, league: string, setNewsFunction: React.Dispatch<React.SetStateAction<RssItem[]>>) => {
    setLoading(prev => ({ ...prev, [league.toLowerCase()]: true }));
    setError(prev => ({ ...prev, [league.toLowerCase()]: null }));
    
    try {
      const items = await fetchRssFeed(feedUrl, league);
      setNewsFunction(items);
    } catch (error) {
      console.error(`Error fetching ${league} RSS feed:`, error);
      setError(prev => ({ ...prev, [league.toLowerCase()]: error }));
    } finally {
      setLoading(prev => ({ ...prev, [league.toLowerCase()]: false }));
    }
  };

  useEffect(() => {
    fetchRssFeedWithState(RSS_FEEDS.NCAA, 'ncaa', setNcaaNews);
  }, []);

  useEffect(() => {
    fetchRssFeedWithState(RSS_FEEDS.IPL, 'ipl', setIplNews);
  }, []);

  useEffect(() => {
    fetchRssFeedWithState(RSS_FEEDS.NBA, 'nba', setNbaNews);
  }, []);

  useEffect(() => {
    fetchRssFeedWithState(RSS_FEEDS.NHL, 'nhl', setNhlNews);
  }, []);

  const getAllNews = () => {
    const allNews = [
      ...ncaaNews.map(item => ({ ...item, league: 'NCAA' })),
      ...iplNews.map(item => ({ ...item, league: 'IPL' })),
      ...nbaNews.map(item => ({ ...item, league: 'NBA' })),
      ...nhlNews.map(item => ({ ...item, league: 'NHL' }))
    ];

    return allNews.filter(item => {
      const matchesLeague = selectedLeague === 'all' || item.league === selectedLeague;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLeague && matchesSearch;
    });
  };

  const filteredNews = getAllNews();

  const handleNewsItemPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't open URL: ", err));
  };

  console.log('Screen width:', width, 'Is Desktop:', isDesktop);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Latest News</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchAndFilters}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#A259FF" />
          <TextInput
            style={styles.searchInput as any}
            placeholder="Search news..."
            placeholderTextColor="#6c757d"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <X size={16} color="#EAEAEA" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.leagueFiltersWrapper}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.leagueFilters}
          contentContainerStyle={styles.leagueFiltersContent}
        >
          {leagues.map(league => (
            <TouchableOpacity
              key={league.id}
              style={[
                styles.leagueFilter,
                selectedLeague === league.id && styles.leagueFilterActive
              ]}
              onPress={() => setSelectedLeague(league.id as League)}
            >
              <Text 
                style={
                  selectedLeague === league.id ? styles.leagueFilterTextActive : styles.leagueFilterText
                }
              >
                {league.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.newsFeedContainer}>
        <ScrollView 
          style={styles.newsFeed}
          contentContainerStyle={styles.newsFeedContent}
          showsVerticalScrollIndicator={false}
        >
          {(loading.ncaa || loading.ipl || loading.nba || loading.nhl) && filteredNews.length === 0 && (
            <View style={styles.loadingContainer as any}>
              <Text style={styles.loadingText}>Loading news...</Text>
            </View>
          )}

          {Object.values(error).some(e => e) && filteredNews.length === 0 && (
            <View style={styles.errorContainer as any}>
              <Text style={styles.errorText}>Failed to load some news feeds. Pull down to refresh.</Text>
            </View>
          )}

          {filteredNews.length === 0 && 
            !Object.values(loading).some(l => l) && 
            !Object.values(error).some(e => e) && (
            <View style={styles.noResultsContainer as any}>
              <Text style={styles.noResultsText}>No news found matching your criteria.</Text>
            </View>
          )}

          {isDesktop ? (
            <View style={styles.desktopGrid}>
              {filteredNews.map((item, index) => (
                <TouchableOpacity 
                  key={`${item.league}-${index}`}
                  style={[styles.newsItem, styles.desktopNewsItem]}
                  onPress={() => handleNewsItemPress(item.link)}
                >
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.newsImage}
                    resizeMode="cover"
                  />
                  <View style={styles.newsContent}>
                    <View style={styles.newsHeader}>
                      <Text style={styles.newsLeague}>{item.league}</Text>
                      <Text style={styles.newsDate}>{formatDate(item.pubDate)}</Text>
                    </View>
                    <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.newsFooter}>
                      <Text style={styles.newsReadTime}>{getReadTime(item.description)}</Text>
                      <ChevronRight size={16} color="#A259FF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            filteredNews.map((item, index) => (
              <TouchableOpacity 
                key={`${item.league}-${index}`}
                style={styles.newsItem}
                onPress={() => handleNewsItemPress(item.link)}
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.newsImage}
                  resizeMode="cover"
                />
                <View style={styles.newsContent}>
                  <View style={styles.newsHeader}>
                    <Text style={styles.newsLeague}>{item.league}</Text>
                    <Text style={styles.newsDate}>{formatDate(item.pubDate)}</Text>
                  </View>
                  <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.newsReadTime}>{getReadTime(item.description)}</Text>
                    <ChevronRight size={16} color="#A259FF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#0D0D0D',
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E2E3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  placeholder: {
    width: 40,
  },
  searchAndFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0D0D0D',
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leagueFiltersWrapper: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  leagueFilters: {
    flexGrow: 0,
  },
  leagueFiltersContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    flexDirection: 'row',
  },
  leagueFilter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2E2E3A',
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  leagueFilterActive: {
    backgroundColor: '#A259FF',
  },
  leagueFilterText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  leagueFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  newsFeedContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  newsFeed: {
    flex: 1,
  },
  newsFeedContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100, 
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 16,
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
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  desktopNewsItem: {
    width: '23%', 
    marginBottom: 16,
  },
  newsItem: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsImage: {
    width: '100%',
    height: 180,
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  newsLeague: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  newsDate: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  newsTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsReadTime: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});