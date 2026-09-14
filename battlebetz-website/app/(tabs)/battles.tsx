import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Modal,
  Platform,
  TextInput,
  FlatList,
  Dimensions,
  Animated
} from 'react-native';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Users, 
  Filter,
  ChevronRight,
  ChevronDown,
  Trophy,
  TrendingUp,
  DollarSign,
  Plus,
  Shield,
  Swords,
  ChartBar as BarChart
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { FEATURED_BET_WIDTH } from '@/constants/layout';

import BattleCard from '../../components/BattleCard';
import FeaturedBet from '../../components/FeaturedBet';

export default function BattlesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfileModalVisible, setUserProfileModalVisible] = useState(false);

  // Featured bets data
  const featuredBets = [
    {
      id: '1',
      teams: "Warriors vs Lakers",
      headline: "The Ultimate NBA Finals Showdown",
      likes: 245,
      comments: 89,
      team1Image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1974&auto=format&fit=crop",
      team2Image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop",
      sportIcon: "🏀"
    },
    {
      id: '2',
      teams: "Real Madrid vs Man City",
      headline: "Champions League Final Clash",
      likes: 189,
      comments: 67,
      team1Image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070&auto=format&fit=crop",
      team2Image: "https://images.unsplash.com/photo-1590552515252-3a5a1bce7bed?q=80&w=1974&auto=format&fit=crop",
      sportIcon: "⚽"
    },
    {
      id: '4',
      teams: "Mumbai Indians vs Chennai Super Kings",
      headline: "IPL 2025 Opening Clash",
      likes: 278,
      comments: 92,
      team1Image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop",
      team2Image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070&auto=format&fit=crop",
      sportIcon: "🏏"
    }
  ];

  // Battle requests data
  const battleRequests = [
    {
      id: '1',
      challenger: {
        name: '@mike_b',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
      },
      game: 'Lakers vs Warriors',
      bet: 'Lakers -3.5',
      odds: 'ML: -110',
      amount: 'BBZ 100',
      likes: 24,
      comments: 5
    },
    {
      id: '2',
      challenger: {
        name: '@sarah_j',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop',
      },
      game: 'Celtics vs Heat',
      bet: 'Over 218.5',
      odds: 'ML: +120',
      amount: 'BBZ 50',
      likes: 18,
      comments: 3
    },
    {
      id: '3',
      challenger: {
        name: '@david_m',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2187&auto=format&fit=crop',
      },
      game: 'Chiefs vs Eagles',
      bet: 'Chiefs ML',
      odds: 'ML: -125',
      amount: 'BBZ 75',
      likes: 32,
      comments: 7
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Battles</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#A259FF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search battles..."
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
      </View>

      <ScrollView style={styles.content}>
        {/* Let's Battle Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Let's Battle</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.addBattleButton]}
                onPress={() => router.push('/battle')}
              >
                <Plus size={18} color="#EAEAEA" />
                <Text style={styles.addBattleText}>Battle</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.battleCardsContainer}
          >
            {battleRequests.map(battle => (
              <View key={battle.id} style={styles.battleCardWrapper}>
                <BattleCard {...battle} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Featured Bets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Bets</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredBetsContainer}
            snapToInterval={FEATURED_BET_WIDTH + 16}
            decelerationRate="fast"
          >
            {featuredBets.map(bet => (
              <View key={bet.id} style={[styles.featuredBetWrapper, { width: FEATURED_BET_WIDTH }]}>
                <FeaturedBet {...bet} />
              </View>
            ))}
          </ScrollView>
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
  searchSection: {
    backgroundColor: '#1A1A1D',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
  },
  content: {
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
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#3D246C',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBattleButton: {
    width: 'auto',
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 6,
  },
  addBattleText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  featuredBetsContainer: {
    paddingRight: 16,
    gap: 16,
  },
  featuredBetWrapper: {
    marginRight: 16,
  },
  battleCardsContainer: {
    gap: 16,
    paddingRight: 16,
  },
  battleCardWrapper: {
    marginBottom: 8,
  },
});