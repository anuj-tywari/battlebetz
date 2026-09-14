import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, Linking } from 'react-native';
import { Info, ChevronRight, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react-native';
import Header from '../../components/Header';
import TopUpsets from '../../components/TopUpsets';
import { fetchRssFeed, formatDate, getReadTime, RSS_FEEDS, type RssItem } from '@/src/services/rssService';
import { Sport } from '../../components/SportFilters';

type GameResult = {
  id: string;
  date: string;
  league: Sport; // Add this property to fix the grouping issue
  teams: {
    team1: {
      name: string;
      score: number;
      image: string;
    };
    team2: {
      name: string;
      score: number;
      image: string;
    };
  };
  status: 'FINAL' | 'LIVE';
  time?: string;
};

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  source: string;
  time: string;
  readTime: string;
}

// Map RSS feed leagues to Sport type
const leagueMapping: Record<string, Sport> = {
  'NCAA': 'NCAA',
  'IPL': 'IPL',
  'NBA': 'NBA',
  'NHL': 'NHL',
};

// Define the leagues object that was missing
const leagues: Record<Sport, string> = {
  'NCAA': 'NCAA Basketball',
  'IPL': 'Indian Premier League',
  'NBA': 'National Basketball Association',
  'NHL': 'National Hockey League',
  'all': 'All Sports'
};

// Last 14 days of results (2 weeks before tournament)
const results: GameResult[] = [
  {
    id: '1',
    date: 'March 5, 2025',
    league: 'NCAA', // Add league property
    teams: {
      team1: {
        name: 'Houston',
        score: 82,
        image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop'
      },
      team2: {
        name: 'Kansas',
        score: 76,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  },
  {
    id: '2',
    date: 'March 7, 2025',
    league: 'NCAA', // Add league property
    teams: {
      team1: {
        name: 'Purdue',
        score: 85,
        image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop'
      },
      team2: {
        name: 'Illinois',
        score: 78,
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  },
  {
    id: '3',
    date: 'March 8, 2025',
    league: 'IPL', // Add league property
    teams: {
      team1: {
        name: 'Mumbai Indians',
        score: 186,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop'
      },
      team2: {
        name: 'Chennai Super Kings',
        score: 189,
        image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  },
  {
    id: '4',
    date: 'March 10, 2025',
    league: 'NCAA', // Add league property
    teams: {
      team1: {
        name: 'UConn',
        score: 88,
        image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop'
      },
      team2: {
        name: 'Marquette',
        score: 79,
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  },
  {
    id: '5',
    date: 'March 12, 2025',
    league: 'IPL', // Add league property
    teams: {
      team1: {
        name: 'Royal Challengers',
        score: 175,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop'
      },
      team2: {
        name: 'Delhi Capitals',
        score: 172,
        image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  },
  {
    id: '6',
    date: 'March 14, 2025',
    league: 'NCAA', // Add league property
    teams: {
      team1: {
        name: 'Tennessee',
        score: 92,
        image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop'
      },
      team2: {
        name: 'Kentucky',
        score: 84,
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  },
  {
    id: '7',
    date: 'March 15, 2025',
    league: 'NCAA', // Add league property
    teams: {
      team1: {
        name: 'Arizona',
        score: 95,
        image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop'
      },
      team2: {
        name: 'UCLA',
        score: 82,
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  }
];

export default function ScoresScreen() {
  const [selectedSport, setSelectedSport] = useState<Sport>('NCAA');
  const [showPhotoInfo, setShowPhotoInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [ncaaNews, setNcaaNews] = useState<RssItem[]>([]);
  const [iplNews, setIplNews] = useState<RssItem[]>([]);
  const [nbaNews, setNbaNews] = useState<RssItem[]>([]);
  const [nhlNews, setNhlNews] = useState<RssItem[]>([]);

  const photoOfTheDay = {
    url: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
    caption: 'March Madness Intensity',
    location: 'Houston, TX',
    photographer: '@mike_b',
    date: 'March 19, 2025',
    description: 'Share your cool photos of the day and we will update our favorite, tag you and location and you will receive BBZ 250'
  };

  // Helper function to fetch RSS feeds with loading and error states
  const fetchRssFeedWithState = async (feedUrl: string, league: string, setNewsFunction: React.Dispatch<React.SetStateAction<RssItem[]>>) => {
    try {
      const items = await fetchRssFeed(feedUrl, league);
      setNewsFunction(items);
    } catch (error) {
      console.error(`Error fetching ${league} RSS feed:`, error);
      setError(error instanceof Error ? error : new Error(`Failed to fetch ${league} feed`));
    }
  };

  // Fetch news feeds
  useEffect(() => {
    setLoading(true);
    
    // Fetch all feeds in parallel
    Promise.all([
      fetchRssFeedWithState(RSS_FEEDS.NCAA, 'NCAA', setNcaaNews),
      fetchRssFeedWithState(RSS_FEEDS.IPL, 'IPL', setIplNews),
      fetchRssFeedWithState(RSS_FEEDS.NBA, 'NBA', setNbaNews),
      fetchRssFeedWithState(RSS_FEEDS.NHL, 'NHL', setNhlNews)
    ])
    .finally(() => {
      setLoading(false);
    });
  }, []);

  // Group results by date and league
  const groupedResults = results.reduce((acc, result) => {
    const date = result.date;
    const league = result.league;
    
    if (!acc[date]) {
      acc[date] = {
        'NCAA': [],
        'IPL': [],
        'NBA': [],
        'NHL': [],
        'all': []
      };
    }
    
    acc[date][league].push(result);
    acc[date]['all'].push(result);
    
    return acc;
  }, {} as Record<string, Record<Sport, GameResult[]>>);

  // Combine all news items
  const getAllNews = () => {
    const allNews = [
      ...ncaaNews.map(item => ({ ...item, league: 'NCAA' })),
      ...iplNews.map(item => ({ ...item, league: 'IPL' })),
      ...nbaNews.map(item => ({ ...item, league: 'NBA' })),
      ...nhlNews.map(item => ({ ...item, league: 'NHL' }))
    ];

    // Sort by publication date (newest first)
    return allNews.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });
  };

  // Filter news by selected sport
  const filteredNews = getAllNews().filter(item => {
    if (selectedSport === 'all') return true;
    return item.league === selectedSport;
  });

  // Handle opening news links
  const handleNewsItemPress = (link: string) => {
    Linking.openURL(link).catch(err => 
      console.error("Couldn't open link: ", err)
    );
  };

  // Map RSS items to the format expected by the news section
  const mapRssItemToNewsItem = (item: RssItem) => ({
    id: `${item.league}-${item.title.substring(0, 10)}`,
    title: item.title,
    excerpt: item.description.substring(0, 80) + '...',
    image: item.image,
    league: item.league || '',
    time: formatDate(item.pubDate),
    readTime: getReadTime(item.description),
    link: item.link
  });

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* Left Column - Two Thirds */}
        <View style={styles.leftColumn}>
          <ScrollView style={styles.columnScroll}>
            {/* Photo of the Day Section */}
            <View style={styles.photoSection}>
              <View style={styles.photoHeader}>
                <Text style={styles.photoTitle}>Photo of the Day</Text>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => setShowPhotoInfo(!showPhotoInfo)}
                  onMouseEnter={() => Platform.OS === 'web' && setShowPhotoInfo(true)}
                  onMouseLeave={() => Platform.OS === 'web' && setShowPhotoInfo(false)}
                >
                  <Info size={16} color="#A259FF" />
                  {showPhotoInfo && (
                    <View style={styles.infoTooltip}>
                      <Text style={styles.tooltipText}>
                        Share your cool photos of the day and we will update our favorite, tag you and location and you will receive BBZ 250
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.photoCard}>
                <Image 
                  source={{ uri: photoOfTheDay.url }}
                  style={styles.photo}
                />
                <View style={styles.photoInfo}>
                  <Text style={styles.photoCaption}>{photoOfTheDay.caption}</Text>
                  <View style={styles.photoMetadata}>
                    <Text style={styles.photoLocation}>📍 {photoOfTheDay.location}</Text>
                    <Text style={styles.photoCredit}>📸 {photoOfTheDay.photographer}</Text>
                    <Text style={styles.photoDate}>{photoOfTheDay.date}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Results by Date */}
            <View style={styles.resultsContainer}>
              {Object.entries(groupedResults).map(([date, leagueGames]) => (
                <View key={date} style={styles.dateSection}>
                  <Text style={styles.dateHeader}>{date}</Text>
                  
                  {Object.entries(leagueGames).map(([leagueKey, games]) => {
                    // Skip the 'all' category or empty arrays
                    if (leagueKey === 'all' || games.length === 0) return null;
                    
                    const leagueName = leagues[leagueKey as Sport];
                    
                    return (
                      <View key={leagueKey} style={styles.leagueSection}>
                        <Text style={styles.leagueHeader}>{leagueName}</Text>
                        
                        <View style={styles.gamesGrid}>
                          {games.map(game => (
                            <View key={game.id} style={styles.gameCard}>
                              <View style={styles.teamRow}>
                                <Image source={{ uri: game.teams.team1.image }} style={styles.teamLogo} />
                                <Text style={styles.teamName} numberOfLines={1}>{game.teams.team1.name}</Text>
                                <Text style={[styles.score, game.teams.team1.score > game.teams.team2.score && styles.winningScore]}>
                                  {game.teams.team1.score}
                                </Text>
                              </View>
                              
                              <View style={styles.teamRow}>
                                <Image source={{ uri: game.teams.team2.image }} style={styles.teamLogo} />
                                <Text style={styles.teamName} numberOfLines={1}>{game.teams.team2.name}</Text>
                                <Text style={[styles.score, game.teams.team2.score > game.teams.team1.score && styles.winningScore]}>
                                  {game.teams.team2.score}
                                </Text>
                              </View>
                              
                              <View style={[styles.statusBadge, game.status === 'FINAL' ? styles.finalBadge : styles.liveBadge]}>
                                <Text style={styles.statusText}>{game.status}</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Right Column - One Third */}
        <View style={styles.rightColumn}>
          <View style={styles.rightColumnContent}>
            {/* Top Upsets Section */}
            <View style={styles.topUpsetsContainer}>
              <TopUpsets />
            </View>

            {/* News Section */}
            <View style={styles.newsHeader}>
              <Text style={styles.newsTitle}>Related News</Text>
            </View>
            <ScrollView style={styles.newsScroll}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#A259FF" />
                  <Text style={styles.loadingText}>Loading news...</Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Failed to load news. Please try again later.</Text>
                </View>
              ) : filteredNews.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No news found for this category.</Text>
                </View>
              ) : (
                filteredNews.map((item) => {
                  const newsItem = mapRssItemToNewsItem(item);
                  return (
                    <TouchableOpacity 
                      key={newsItem.id} 
                      style={styles.newsCard}
                      onPress={() => handleNewsItemPress(item.link)}
                    >
                      <Image source={{ uri: newsItem.image }} style={styles.newsImage} />
                      <View style={styles.newsContent}>
                        <Text style={styles.newsHeadline} numberOfLines={2}>
                          {newsItem.title}
                        </Text>
                      
                        <View style={styles.newsFooter}>
                          <Text style={styles.newsTime}>
                            {newsItem.time}
                          </Text>
                          <View style={styles.readTimeContainer}>
                            <Text style={styles.readTime}>
                              {newsItem.readTime}
                            </Text>
                            <ExternalLink size={14} color="#A259FF" />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A25',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  leftColumn: {
    flex: 2,
    marginRight: 16,
  },
  rightColumn: {
    flex: 1,
  },
  rightColumnContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  columnScroll: {
    flex: 1,
  },
  photoSection: {
    padding: 16,
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  infoButton: {
    padding: 8,
    position: 'relative',
  },
  infoTooltip: {
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: [{ translateY: -24 }],
    backgroundColor: '#2E2E3A',
    padding: 12,
    borderRadius: 8,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#EAEAEA',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Poppins-Regular',
  },
  photoCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 300,
  },
  photoInfo: {
    padding: 12,
  },
  photoCaption: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  photoMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoLocation: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#BBBBBB',
  },
  photoCredit: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#BBBBBB',
  },
  photoDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#BBBBBB',
  },
  messageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 46, 58, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  messageContent: {
    backgroundColor: 'rgba(61, 36, 108, 0.8)',
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A259FF',
  },
  messageTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  messageText: {
    color: '#EAEAEA',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  rewardBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  rewardText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  resultsContainer: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  leagueSection: {
    marginBottom: 16,
  },
  leagueHeader: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gameCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 8,
    width: '19%', // Fixed from calc(20% - 8px) to a direct percentage
    position: 'relative',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  teamLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  teamName: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  score: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    width: 24,
    textAlign: 'right',
    fontFamily: 'Poppins-SemiBold',
  },
  winningScore: {
    color: '#10B981',
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  finalBadge: {
    backgroundColor: '#6B7280',
  },
  liveBadge: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  topUpsetsContainer: {
    padding: 16,
  },
  newsFeed: {
    flex: 1,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
  },
  newsFeedTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  newsScroll: {
    flex: 1,
  },
  newsCard: {
    backgroundColor: '#1A1A25',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 12,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsSource: {
    color: '#A259FF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  newsTime: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  newsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  newsHeadline: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  newsExcerpt: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#BBBBBB',
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#BBBBBB',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#BBBBBB',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});