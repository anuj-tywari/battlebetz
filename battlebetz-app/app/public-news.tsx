import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Users, User, TrendingUp, Star, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import TopNavigation from '../components/TopNavigation';

type League = 'NCAA' | 'IPL' | 'NBA' | 'NHL';
type NewsSection = 'teams' | 'players' | 'odds' | 'features';

export default function PublicNewsScreen() {
  const [selectedLeague, setSelectedLeague] = useState<League>('NCAA');
  const [selectedSection, setSelectedSection] = useState<NewsSection>('teams');

  const leagues: League[] = ['NCAA', 'IPL', 'NBA', 'NHL'];
  
  const sections = [
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'players', label: 'Players', icon: User },
    { id: 'odds', label: 'Odds', icon: TrendingUp },
    { id: 'features', label: 'Features', icon: Star }
  ];

  // Mock news data
  const newsData = {
    NCAA: {
      teams: [
        {
          id: '1',
          title: 'Houston Dominates Regular Season',
          image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
          description: 'The Cougars finish with impressive 30-4 record',
          readTime: '5 min read'
        },
        {
          id: '2',
          title: 'Purdue Claims Big Ten Title',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
          description: 'Boilermakers secure conference championship',
          readTime: '4 min read'
        }
      ],
      players: [
        {
          id: '1',
          title: 'Zach Edey: Player of the Year Favorite',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
          description: 'Purdue center continues dominant season',
          readTime: '6 min read'
        }
      ],
      odds: [
        {
          id: '1',
          title: 'March Madness Betting Preview',
          image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop',
          description: 'Complete odds breakdown for all 68 teams',
          readTime: '8 min read'
        }
      ],
      features: [
        {
          id: '1',
          title: 'The Evolution of March Madness',
          image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
          description: 'How the tournament has grown into a betting phenomenon',
          readTime: '10 min read'
        }
      ]
    },
    IPL: {
      teams: [
        {
          id: '1',
          title: 'Mumbai Indians Pre-Season Analysis',
          image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop',
          description: 'Complete breakdown of squad and strategies',
          readTime: '7 min read'
        }
      ],
      players: [
        {
          id: '1',
          title: 'Top 10 Players to Watch',
          image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070&auto=format&fit=crop',
          description: 'Rising stars and established veterans',
          readTime: '5 min read'
        }
      ],
      odds: [
        {
          id: '1',
          title: 'IPL 2025 Title Odds',
          image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop',
          description: 'Early betting lines for all teams',
          readTime: '6 min read'
        }
      ],
      features: [
        {
          id: '1',
          title: 'The Global Impact of IPL',
          image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070&auto=format&fit=crop',
          description: 'How IPL changed cricket betting forever',
          readTime: '8 min read'
        }
      ]
    },
    NBA: {
      teams: [
        {
          id: '1',
          title: 'Celtics Lead Eastern Conference',
          image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
          description: 'Boston continues dominant season',
          readTime: '5 min read'
        }
      ],
      players: [
        {
          id: '1',
          title: 'MVP Race Heats Up',
          image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1974&auto=format&fit=crop',
          description: 'Jokic, Giannis lead tight race',
          readTime: '6 min read'
        }
      ],
      odds: [
        {
          id: '1',
          title: 'NBA Championship Odds Update',
          image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
          description: 'Latest lines for title contenders',
          readTime: '7 min read'
        }
      ],
      features: [
        {
          id: '1',
          title: 'In-Season Tournament Impact',
          image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1974&auto=format&fit=crop',
          description: 'How the new format affects betting',
          readTime: '9 min read'
        }
      ]
    },
    NHL: {
      teams: [
        {
          id: '1',
          title: 'Bruins Lead Atlantic Division',
          image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
          description: 'Boston continues strong season',
          readTime: '5 min read'
        }
      ],
      players: [
        {
          id: '1',
          title: 'Top Goal Scorers Analysis',
          image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
          description: 'Breaking down the scoring race',
          readTime: '6 min read'
        }
      ],
      odds: [
        {
          id: '1',
          title: 'Stanley Cup Odds Update',
          image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
          description: 'Latest playoff and cup odds',
          readTime: '7 min read'
        }
      ],
      features: [
        {
          id: '1',
          title: 'NHL Betting Strategies',
          image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
          description: 'Expert tips for NHL betting',
          readTime: '8 min read'
        }
      ]
    }
  };

  return (
    <View style={styles.container}>
      <TopNavigation />
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>Public News</Text>
            <Text style={styles.heroTitle}>Latest Updates</Text>
            <Text style={styles.heroText}>
              Stay informed with the latest news, analysis, and insights across all major sports.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
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
                    {league}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Section Tabs */}
          <View style={styles.sectionTabs}>
            {sections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionTab,
                  selectedSection === section.id && styles.sectionTabActive
                ]}
                onPress={() => setSelectedSection(section.id as NewsSection)}
              >
                <section.icon 
                  size={20} 
                  color={selectedSection === section.id ? 'white' : '#EAEAEA'} 
                />
                <Text style={[
                  styles.sectionTabText,
                  selectedSection === section.id && styles.sectionTabTextActive
                ]}>
                  {section.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* News Grid */}
          <View style={styles.newsGrid}>
            {newsData[selectedLeague][selectedSection].map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.newsCard}
              >
                <Image 
                  source={{ uri: item.image }}
                  style={styles.newsImage}
                />
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsDescription}>{item.description}</Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.readTime}>{item.readTime}</Text>
                    <ChevronRight size={16} color="#A259FF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
  heroSubtitle: {
    color: '#A259FF',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#EAEAEA',
    fontSize: 56,
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
  content: {
    padding: 24,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
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
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 8,
    marginBottom: 24,
  },
  sectionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sectionTabActive: {
    backgroundColor: '#A259FF',
  },
  sectionTabText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  sectionTabTextActive: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  newsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  newsCard: {
    width: 'calc(33.333% - 16px)',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  newsDescription: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    opacity: 0.8,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});