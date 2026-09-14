import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Info, ChevronRight } from 'lucide-react-native';
import Header from '../../components/Header';
import SportFilters, { Sport } from '../../components/SportFilters';

type GameResult = {
  id: string;
  league: Sport;
  date: string;
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
  league: Sport;
  time: string;
  readTime: string;
};

// Last 10 days of results
const results: GameResult[] = [
  {
    id: '1',
    league: 'NCAA',
    date: 'March 19, 2025',
    teams: {
      team1: {
        name: '(1) Houston',
        score: 82,
        image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop'
      },
      team2: {
        name: '(16) Longwood',
        score: 65,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  },
  {
    id: '2',
    league: 'NCAA',
    date: 'March 19, 2025',
    teams: {
      team1: {
        name: '(8) Nebraska',
        score: 78,
        image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop'
      },
      team2: {
        name: '(9) Texas A&M',
        score: 72,
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop'
      }
    },
    status: 'FINAL'
  },
  {
    id: '3',
    league: 'IPL',
    date: 'March 18, 2025',
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
  // Add more historical results...
];

// Related news
const news: NewsItem[] = [
  {
    id: '1',
    title: 'Houston Dominates Longwood in Tournament Opener',
    excerpt: "Top-seeded Cougars show why they're championship favorites with commanding victory",
    image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
    league: 'NCAA',
    time: '2 hours ago',
    readTime: '3 min'
  },
  {
    id: '2',
    title: 'Nebraska Survives Texas A&M Scare',
    excerpt: 'Cornhuskers advance after thrilling finish against Aggies',
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop',
    league: 'NCAA',
    time: '3 hours ago',
    readTime: '4 min'
  },
  {
    id: '3',
    title: 'CSK Edge Past MI in Last-Ball Thriller',
    excerpt: "Dhoni's men chase down 187 in dramatic fashion",
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop',
    league: 'IPL',
    time: '5 hours ago',
    readTime: '5 min'
  }
];

export default function ScoresScreen() {
  const [selectedSport, setSelectedSport] = useState<Sport>('NCAA');
  const [showPhotoInfo, setShowPhotoInfo] = useState(false);

  const photoOfTheDay = {
    url: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
    caption: 'March Madness Intensity',
    location: 'Houston, TX',
    photographer: '@mike_b',
    date: 'March 19, 2025'
  };

  // Group results by date and league
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.date]) {
      acc[result.date] = {};
    }
    if (!acc[result.date][result.league]) {
      acc[result.date][result.league] = [];
    }
    acc[result.date][result.league].push(result);
    return acc;
  }, {} as Record<string, Record<Sport, GameResult[]>>);

  // Filter news by selected sport
  const filteredNews = news.filter(item => 
    selectedSport === 'all' ? true : item.league === selectedSport
  );

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

            {/* Sport Filters */}
            <View style={styles.filtersContainer}>
              <SportFilters
                selectedSport={selectedSport}
                onSelectSport={setSelectedSport}
              />
            </View>

            {/* Results by Date */}
            <View style={styles.resultsContainer}>
              {Object.entries(groupedResults).map(([date, leagues]) => (
                <View key={date} style={styles.dateSection}>
                  <Text style={styles.dateHeader}>{date}</Text>
                  
                  {Object.entries(leagues).map(([league, games]) => (
                    <View key={league} style={styles.leagueSection}>
                      <Text style={styles.leagueHeader}>{league}</Text>
                      
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
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Right Column - One Third */}
        <View style={styles.rightColumn}>
          <View style={styles.newsHeader}>
            <Text style={styles.newsTitle}>Related News</Text>
          </View>
          <ScrollView style={styles.newsScroll}>
            {filteredNews.map(item => (
              <TouchableOpacity key={item.id} style={styles.newsCard}>
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={styles.newsHeadline} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.newsExcerpt} numberOfLines={2}>{item.excerpt}</Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.newsTime}>{item.time}</Text>
                    <View style={styles.readTimeContainer}>
                      <Text style={styles.readTime}>{item.readTime}</Text>
                      <ChevronRight size={14} color="#A259FF" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
  columnScroll: {
    flex: 1,
  },
  photoSection: {
    padding: 16,
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    padding: 16,
  },
  photoCaption: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  photoMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  photoLocation: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  photoCredit: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  photoDate: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
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
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
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
    width: 'calc(20% - 8px)', // 5 cards per row
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
  },
  liveBadge: {
    backgroundColor: '#EF4444',
  },
  finalBadge: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  newsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  newsTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  newsScroll: {
    flex: 1,
    padding: 16,
  },
  newsCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    height: 'calc(12.5% - 10.5px)', // 8 cards vertically
  },
  newsImage: {
    width: '100%',
    height: 80,
  },
  newsContent: {
    padding: 8,
  },
  newsHeadline: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  newsExcerpt: {
    color: '#A259FF',
    fontSize: 11,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsTime: {
    color: '#6B7280',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTime: {
    color: '#A259FF',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
});