import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image,
  ActivityIndicator,
  Linking
} from 'react-native';
import { Users, User, TrendingUp, Star, Search, X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import TopNavigation from '../components/TopNavigation';
import Constants from 'expo-constants';

type League = 'all' | 'NCAA' | 'IPL' | 'NBA' | 'NHL';

// Define RSS item interface
interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  image?: string;
}

export default function PublicNewsScreen() {
  const router = useRouter();
  const [selectedLeague, setSelectedLeague] = useState<League>('NCAA');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['ncaaNews', 'iplNews', 'nbaNews', 'nhlNews']);
  const [ncaaNews, setNcaaNews] = useState<RssItem[]>([]);
  const [iplNews, setIplNews] = useState<RssItem[]>([]);
  const [nbaNews, setNbaNews] = useState<RssItem[]>([]);
  const [nhlNews, setNhlNews] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    ncaa: false,
    ipl: false,
    nba: false,
    nhl: false
  });
  const [error, setError] = useState<{[key: string]: string | null}>({
    ncaa: null,
    ipl: null,
    nba: null,
    nhl: null
  });

  const leagues: League[] = ['all', 'NCAA', 'IPL', 'NBA', 'NHL'];

  const togglePanelExpansion = (panelId: string) => {
    setExpandedPanels(prev => 
      prev.includes(panelId) 
        ? prev.filter(id => id !== panelId)
        : [...prev, panelId]
    );
  };

  // Helper function to fetch RSS feeds
  const fetchRssFeed = async (feedUrl: string, league: string, setNewsFunction: React.Dispatch<React.SetStateAction<RssItem[]>>) => {
    setLoading(prev => ({ ...prev, [league.toLowerCase()]: true }));
    setError(prev => ({ ...prev, [league.toLowerCase()]: null }));
    
    try {
      const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'https://battle-betz-api.impute.pro/api/v1/';
      const rssUrl = `${apiUrl}proxy/rss?url=${encodeURIComponent(feedUrl)}`;
      
      const response = await fetch(rssUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${league} RSS feed`);
      }
      
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 10);
      const parsedItems: RssItem[] = [];
      
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        
        // Try to extract image from description or media:content
        let image = '';
        const mediaContent = item.querySelector('media\\:content, content');
        if (mediaContent && mediaContent.getAttribute('url')) {
          image = mediaContent.getAttribute('url') || '';
        } else if (description) {
          // Try to extract image from HTML description
          const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch && imgMatch[1]) {
            image = imgMatch[1];
          }
        }
        
        // If no image found, use a placeholder based on league
        if (!image) {
          const placeholders = {
            ncaa: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
            ipl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop',
            nba: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
            nhl: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?q=80&w=2067&auto=format&fit=crop'
          };
          image = placeholders[league.toLowerCase() as keyof typeof placeholders];
        }
        
        parsedItems.push({
          title,
          description,
          link,
          pubDate,
          image
        });
      });
      
      setNewsFunction(parsedItems);
    } catch (err) {
      console.error(`Error fetching ${league} news:`, err);
      setError(prev => ({ ...prev, [league.toLowerCase()]: `Failed to load ${league} news. Please try again later.` }));
    } finally {
      setLoading(prev => ({ ...prev, [league.toLowerCase()]: false }));
    }
  };

  // Fetch NCAA RSS feed
  useEffect(() => {
    fetchRssFeed('https://www.ncaa.com/news/basketball-men/d1/rss.xml', 'ncaa', setNcaaNews);
  }, []);

  // Fetch IPL RSS feed
  useEffect(() => {
    fetchRssFeed('https://www.espncricinfo.com/rss/content/story/feeds/0.xml', 'ipl', setIplNews);
  }, []);

  // Fetch NBA RSS feed
  useEffect(() => {
    fetchRssFeed('https://www.rotowire.com/rss/news.php?sport=NBA', 'nba', setNbaNews);
  }, []);

  // Fetch NHL RSS feed
  useEffect(() => {
    fetchRssFeed('https://thehockeywriters.com/feed/', 'nhl', setNhlNews);
  }, []);

  // Filter news based on search query
  const filteredNcaaNews = ncaaNews.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIplNews = iplNews.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNbaNews = nbaNews.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNhlNews = nhlNews.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const panels = [
    {
      id: 'teams',
      title: 'Teams',
      icon: Users,
      data: {
        NCAA: [
          { 
            title: 'Houston Dominates Regular Season', 
            subtitle: '30-4 record',
            image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop'
          },
          { 
            title: 'Purdue Claims Big Ten Title', 
            subtitle: 'Conference champions',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
          }
        ],
        IPL: [
          { 
            title: 'Mumbai Indians Analysis', 
            subtitle: 'Squad breakdown',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop'
          },
          { 
            title: 'Chennai Super Kings Preview', 
            subtitle: 'Team strategy',
            image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070&auto=format&fit=crop'
          }
        ],
        NBA: [
          { 
            title: 'Celtics Lead East', 
            subtitle: 'Conference standings',
            image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
          },
          { 
            title: 'Nuggets in West', 
            subtitle: 'Title defense',
            image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1974&auto=format&fit=crop'
          }
        ],
        NHL: [
          { 
            title: 'Bruins Top Atlantic', 
            subtitle: 'Division leaders',
            image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?q=80&w=2067&auto=format&fit=crop'
          },
          { 
            title: 'Rangers Surge', 
            subtitle: 'Metropolitan race',
            image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=2071&auto=format&fit=crop'
          }
        ]
      }
    },
    {
      id: 'players',
      title: 'Players',
      icon: User,
      data: {
        NCAA: [
          { 
            title: 'Zach Edey POY Favorite', 
            subtitle: 'Purdue center dominates',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
          },
          { 
            title: 'Rising Stars Watch', 
            subtitle: 'Top performers',
            image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop'
          }
        ],
        IPL: [
          { 
            title: 'Top 10 Players', 
            subtitle: 'Season preview',
            image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=2070&auto=format&fit=crop'
          },
          { 
            title: 'Impact Players', 
            subtitle: 'Key matchups',
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop'
          }
        ],
        NBA: [
          { 
            title: 'MVP Race Update', 
            subtitle: 'Top contenders',
            image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
          },
          { 
            title: 'Rookie Watch', 
            subtitle: 'Future stars',
            image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1974&auto=format&fit=crop'
          }
        ],
        NHL: [
          { 
            title: 'Scoring Leaders', 
            subtitle: 'Points race',
            image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?q=80&w=2067&auto=format&fit=crop'
          },
          { 
            title: 'Goalie Rankings', 
            subtitle: 'Save percentages',
            image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=2071&auto=format&fit=crop'
          }
        ]
      }
    },
    {
      id: 'odds',
      title: 'Odds',
      icon: TrendingUp,
      data: {
        NCAA: [
          { 
            title: 'Tournament Odds', 
            subtitle: 'Full bracket preview',
            image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop'
          },
          { 
            title: 'First Round Lines', 
            subtitle: 'Opening matchups',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
          }
        ],
        IPL: [
          { 
            title: 'Title Odds 2025', 
            subtitle: 'Championship lines',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop'
          },
          { 
            title: 'Match Odds', 
            subtitle: 'Opening week',
            image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070&auto=format&fit=crop'
          }
        ],
        NBA: [
          { 
            title: 'Championship Lines', 
            subtitle: 'Title favorites',
            image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
          },
          { 
            title: 'Playoff Picture', 
            subtitle: 'Race analysis',
            image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1974&auto=format&fit=crop'
          }
        ],
        NHL: [
          { 
            title: 'Stanley Cup Odds', 
            subtitle: 'Latest movement',
            image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?q=80&w=2067&auto=format&fit=crop'
          },
          { 
            title: 'Division Winners', 
            subtitle: 'Race updates',
            image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=2071&auto=format&fit=crop'
          }
        ]
      }
    },
    {
      id: 'features',
      title: 'Features',
      icon: Star,
      data: {
        NCAA: [
          { 
            title: 'March Madness Guide', 
            subtitle: 'Complete coverage',
            image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop'
          },
          { 
            title: 'Cinderella Watch', 
            subtitle: 'Potential upsets',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
          }
        ],
        IPL: [
          { 
            title: 'Season Preview', 
            subtitle: 'Complete guide',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop'
          },
          { 
            title: 'Format Changes', 
            subtitle: 'New rules impact',
            image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070&auto=format&fit=crop'
          }
        ],
        NBA: [
          { 
            title: 'Playoff Race', 
            subtitle: 'Final stretch',
            image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
          },
          { 
            title: 'In-Season Impact', 
            subtitle: 'Tournament effect',
            image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1974&auto=format&fit=crop'
          }
        ],
        NHL: [
          { 
            title: 'Trade Deadline', 
            subtitle: 'Market analysis',
            image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?q=80&w=2067&auto=format&fit=crop'
          },
          { 
            title: 'Playoff Push', 
            subtitle: 'Final games',
            image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=2071&auto=format&fit=crop'
          }
        ]
      }
    }
  ];

  const filteredPanels = panels.map(panel => ({
    ...panel,
    data: selectedLeague === 'all'
      ? Object.fromEntries(
          Object.entries(panel.data).map(([league, items]) => [
            league,
            items.filter(item =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
            )
          ])
        )
      : {
          [selectedLeague]: panel.data[selectedLeague].filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
  }));

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Extract short description from HTML content
  const extractShortDescription = (htmlContent: string) => {
    // Remove HTML tags and get plain text
    const plainText = htmlContent.replace(/<[^>]+>/g, '');
    // Get first 100 characters
    return plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '');
  };

  return (
    <View style={styles.container}>
      <TopNavigation />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              
              <Search size={20} color="#A259FF" />
              <TextInput
                style={styles.searchInput}
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

          {/* League Filter */}
          <View style={styles.filterSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.leagueFilters}
            >
              {leagues.map((league) => (
                <TouchableOpacity
                  key={league}
                  style={[
                    styles.leagueButton,
                    selectedLeague === league && styles.leagueButtonActive
                  ]}
                  onPress={() => setSelectedLeague(league)}
                >
                  <Text style={[
                    styles.leagueButtonText,
                    selectedLeague === league && styles.leagueButtonTextActive
                  ]}>
                    {league === 'all' ? 'All Leagues' : league}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* NCAA RSS Feed News Panel */}
          {(selectedLeague === 'NCAA' || selectedLeague === 'all') && (
            <View 
              style={[
                styles.panel,
                expandedPanels.includes('ncaaNews') && styles.panelExpanded
              ]}
            >
              <TouchableOpacity 
                style={styles.panelHeader}
                onPress={() => togglePanelExpansion('ncaaNews')}
              >
                <View style={styles.panelHeaderLeft}>
                  <Star size={20} color="#A259FF" />
                  <Text style={styles.panelTitle}>NCAA Basketball News</Text>
                </View>
                {expandedPanels.includes('ncaaNews') ? (
                  <ChevronUp size={20} color="#A259FF" />
                ) : (
                  <ChevronDown size={20} color="#A259FF" />
                )}
              </TouchableOpacity>
              <View style={styles.panelContent}>
                {loading.ncaa ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#A259FF" />
                    <Text style={styles.loadingText}>Loading NCAA news...</Text>
                  </View>
                ) : error.ncaa ? (
                  <Text style={styles.errorText}>{error.ncaa}</Text>
                ) : filteredNcaaNews.length === 0 ? (
                  <Text style={styles.noResultsText}>No news items found</Text>
                ) : (
                  filteredNcaaNews.map((item, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.panelItem}
                      onPress={() => {
                        if (item.link) {
                          Linking.openURL(item.link);
                        }
                      }}
                    >
                      <Image 
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemContent}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>
                          {formatDate(item.pubDate)}
                        </Text>
                        <Text style={styles.itemDescription}>
                          {extractShortDescription(item.description)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          )}

          {/* IPL RSS Feed News Panel */}
          {(selectedLeague === 'IPL' || selectedLeague === 'all') && (
            <View 
              style={[
                styles.panel,
                expandedPanels.includes('iplNews') && styles.panelExpanded
              ]}
            >
              <TouchableOpacity 
                style={styles.panelHeader}
                onPress={() => togglePanelExpansion('iplNews')}
              >
                <View style={styles.panelHeaderLeft}>
                  <Star size={20} color="#A259FF" />
                  <Text style={styles.panelTitle}>IPL News</Text>
                </View>
                {expandedPanels.includes('iplNews') ? (
                  <ChevronUp size={20} color="#A259FF" />
                ) : (
                  <ChevronDown size={20} color="#A259FF" />
                )}
              </TouchableOpacity>
              <View style={styles.panelContent}>
                {loading.ipl ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#A259FF" />
                    <Text style={styles.loadingText}>Loading IPL news...</Text>
                  </View>
                ) : error.ipl ? (
                  <Text style={styles.errorText}>{error.ipl}</Text>
                ) : filteredIplNews.length === 0 ? (
                  <Text style={styles.noResultsText}>No news items found</Text>
                ) : (
                  filteredIplNews.map((item, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.panelItem}
                      onPress={() => {
                        if (item.link) {
                          Linking.openURL(item.link);
                        }
                      }}
                    >
                      <Image 
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemContent}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>
                          {formatDate(item.pubDate)}
                        </Text>
                        <Text style={styles.itemDescription}>
                          {extractShortDescription(item.description)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          )}

          {/* NBA RSS Feed News Panel */}
          {(selectedLeague === 'NBA' || selectedLeague === 'all') && (
            <View 
              style={[
                styles.panel,
                expandedPanels.includes('nbaNews') && styles.panelExpanded
              ]}
            >
              <TouchableOpacity 
                style={styles.panelHeader}
                onPress={() => togglePanelExpansion('nbaNews')}
              >
                <View style={styles.panelHeaderLeft}>
                  <Star size={20} color="#A259FF" />
                  <Text style={styles.panelTitle}>NBA News</Text>
                </View>
                {expandedPanels.includes('nbaNews') ? (
                  <ChevronUp size={20} color="#A259FF" />
                ) : (
                  <ChevronDown size={20} color="#A259FF" />
                )}
              </TouchableOpacity>
              <View style={styles.panelContent}>
                {loading.nba ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#A259FF" />
                    <Text style={styles.loadingText}>Loading NBA news...</Text>
                  </View>
                ) : error.nba ? (
                  <Text style={styles.errorText}>{error.nba}</Text>
                ) : filteredNbaNews.length === 0 ? (
                  <Text style={styles.noResultsText}>No news items found</Text>
                ) : (
                  filteredNbaNews.map((item, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.panelItem}
                      onPress={() => {
                        if (item.link) {
                          Linking.openURL(item.link);
                        }
                      }}
                    >
                      <Image 
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemContent}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>
                          {formatDate(item.pubDate)}
                        </Text>
                        <Text style={styles.itemDescription}>
                          {extractShortDescription(item.description)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          )}

          {/* NHL RSS Feed News Panel */}
          {(selectedLeague === 'NHL' || selectedLeague === 'all') && (
            <View 
              style={[
                styles.panel,
                expandedPanels.includes('nhlNews') && styles.panelExpanded
              ]}
            >
              <TouchableOpacity 
                style={styles.panelHeader}
                onPress={() => togglePanelExpansion('nhlNews')}
              >
                <View style={styles.panelHeaderLeft}>
                  <Star size={20} color="#A259FF" />
                  <Text style={styles.panelTitle}>NHL News</Text>
                </View>
                {expandedPanels.includes('nhlNews') ? (
                  <ChevronUp size={20} color="#A259FF" />
                ) : (
                  <ChevronDown size={20} color="#A259FF" />
                )}
              </TouchableOpacity>
              <View style={styles.panelContent}>
                {loading.nhl ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#A259FF" />
                    <Text style={styles.loadingText}>Loading NHL news...</Text>
                  </View>
                ) : error.nhl ? (
                  <Text style={styles.errorText}>{error.nhl}</Text>
                ) : filteredNhlNews.length === 0 ? (
                  <Text style={styles.noResultsText}>No news items found</Text>
                ) : (
                  filteredNhlNews.map((item, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.panelItem}
                      onPress={() => {
                        if (item.link) {
                          Linking.openURL(item.link);
                        }
                      }}
                    >
                      <Image 
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemContent}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>
                          {formatDate(item.pubDate)}
                        </Text>
                        <Text style={styles.itemDescription}>
                          {extractShortDescription(item.description)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          )}

          {/* News Panels Grid */}
          {/* <View style={styles.panelsGrid}>
            {filteredPanels.map((panel) => (
              <View 
                key={panel.id} 
                style={[
                  styles.panel,
                  expandedPanels.includes(panel.id) && styles.panelExpanded
                ]}
              >
                <TouchableOpacity 
                  style={styles.panelHeader}
                  onPress={() => togglePanelExpansion(panel.id)}
                >
                  <View style={styles.panelHeaderLeft}>
                    <panel.icon size={20} color="#A259FF" />
                    <Text style={styles.panelTitle}>{panel.title}</Text>
                  </View>
                  {expandedPanels.includes(panel.id) ? (
                    <ChevronUp size={20} color="#A259FF" />
                  ) : (
                    <ChevronDown size={20} color="#A259FF" />
                  )}
                </TouchableOpacity>
                <View style={styles.panelContent}>
                  {selectedLeague === 'all' ? (
                    Object.entries(panel.data).map(([league, items]) => (
                      <View key={league}>
                        <Text style={styles.leagueHeader}>{league}</Text>
                        {items.map((item, index) => (
                          <TouchableOpacity 
                            key={`${league}-${index}`}
                            style={styles.panelItem}
                          >
                            <Image 
                              source={{ uri: item.image }}
                              style={styles.itemImage}
                            />
                            <View style={styles.itemContent}>
                              <Text style={styles.itemTitle}>{item.title}</Text>
                              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ))
                  ) : (
                    panel.data[selectedLeague].map((item, index) => (
                      <TouchableOpacity 
                        key={index}
                        style={styles.panelItem}
                      >
                        <Image 
                          source={{ uri: item.image }}
                          style={styles.itemImage}
                        />
                        <View style={styles.itemContent}>
                          <Text style={styles.itemTitle}>{item.title}</Text>
                          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>
            ))}
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  comingSoon: {
    fontSize: 24,
    color: '#EAEAEA',
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    padding: 16,
    maxWidth: 1400,
    marginHorizontal: 'auto',
    width: '100%',
    paddingBottom: 80, // Add padding at the bottom for better scrolling
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 24,
  },
  leagueFilters: {
    flexDirection: 'row',
  },
  leagueButton: {
    backgroundColor: '#2E2E3A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  leagueButtonActive: {
    backgroundColor: '#A259FF',
  },
  leagueButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  leagueButtonTextActive: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  panelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  panel: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    height: 300,
    overflow: 'hidden',
    marginBottom: 16,
  },
  panelExpanded: {
    height: 'auto',
    minHeight: 300,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  panelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  panelTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  panelContent: {
    flex: 1,
  },
  leagueHeader: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 8,
  },
  panelItem: {
    flexDirection: 'row',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemTitle: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  itemSubtitle: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  itemDescription: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    opacity: 0.8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#EAEAEA',
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    color: '#FF4D4F',
    padding: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  noResultsText: {
    color: '#EAEAEA',
    padding: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  }
});