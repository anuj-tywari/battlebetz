import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  TextInput,
  Platform,
  Modal
} from 'react-native';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Filter, 
  Calendar, 
  ChevronDown,
  Trophy,
  Clock,
  Swords,
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock data for battle history
const BATTLES = [
  {
    id: '1',
    opponent: {
      name: 'Mike Brown',
      username: '@mike_b',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
    },
    game: 'Lakers vs Warriors',
    bet: 'Lakers -3.5',
    amount: 'BBZ 100',
    result: 'win',
    winnings: '+BBZ 90',
    date: '2025-03-15',
    time: '2 days ago',
  },
  {
    id: '2',
    opponent: {
      name: 'Sarah Johnson',
      username: '@sarah_j',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop',
    },
    game: 'Celtics vs Heat',
    bet: 'Over 218.5',
    amount: 'BBZ 50',
    result: 'loss',
    winnings: '-BBZ 50',
    date: '2025-03-14',
    time: '3 days ago',
  },
  {
    id: '3',
    opponent: {
      name: 'David Miller',
      username: '@david_m',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2187&auto=format&fit=crop',
    },
    game: 'Chiefs vs Eagles',
    bet: 'Chiefs ML',
    amount: 'BBZ 75',
    result: 'win',
    winnings: '+BBZ 68',
    date: '2025-03-10',
    time: '1 week ago',
  },
  {
    id: '4',
    opponent: {
      name: 'Alex King',
      username: '@alex_k',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format&fit=crop',
    },
    game: 'Nuggets vs Suns',
    bet: 'Nuggets -4.5',
    amount: 'BBZ 120',
    result: 'win',
    winnings: '+BBZ 109',
    date: '2025-03-08',
    time: '9 days ago',
  },
  {
    id: '5',
    opponent: {
      name: 'Jordan Peterson',
      username: '@jordan_p',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2187&auto=format&fit=crop',
    },
    game: 'Bucks vs 76ers',
    bet: 'Under 220.5',
    amount: 'BBZ 150',
    result: 'loss',
    winnings: '-BBZ 150',
    date: '2025-03-05',
    time: '12 days ago',
  },
  {
    id: '6',
    opponent: {
      name: 'Emily Wilson',
      username: '@emily_w',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    },
    game: 'Yankees vs Red Sox',
    bet: 'Yankees ML',
    amount: 'BBZ 80',
    result: 'win',
    winnings: '+BBZ 72',
    date: '2025-03-01',
    time: '2 weeks ago',
  },
  {
    id: '7',
    opponent: {
      name: 'Chris Taylor',
      username: '@chris_t',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2187&auto=format&fit=crop',
    },
    game: 'Real Madrid vs Man City',
    bet: 'Over 2.5 Goals',
    amount: 'BBZ 100',
    result: 'win',
    winnings: '+BBZ 90',
    date: '2025-02-25',
    time: '3 weeks ago',
  },
  {
    id: '8',
    opponent: {
      name: 'Jessica Adams',
      username: '@jessica_a',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2076&auto=format&fit=crop',
    },
    game: 'Raptors vs Pistons',
    bet: 'Raptors -6.5',
    amount: 'BBZ 60',
    result: 'loss',
    winnings: '-BBZ 60',
    date: '2025-02-20',
    time: '1 month ago',
  },
  {
    id: '9',
    opponent: {
      name: 'Ryan Cooper',
      username: '@ryan_c',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2187&auto=format&fit=crop',
    },
    game: 'UFC 300: Jones vs Miocic',
    bet: 'Jones by KO/TKO',
    amount: 'BBZ 200',
    result: 'win',
    winnings: '+BBZ 360',
    date: '2025-02-15',
    time: '1 month ago',
  },
  {
    id: '10',
    opponent: {
      name: 'Olivia Martinez',
      username: '@olivia_m',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=2187&auto=format&fit=crop',
    },
    game: 'Knicks vs Bulls',
    bet: 'Bulls +4.5',
    amount: 'BBZ 70',
    result: 'loss',
    winnings: '-BBZ 70',
    date: '2025-02-10',
    time: '1 month ago',
  }
];

export default function BattlesHistoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dateFilterModalVisible, setDateFilterModalVisible] = useState(false);
  const [resultFilter, setResultFilter] = useState('all'); // 'all', 'wins', 'losses'
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'week', 'month', 'year'
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [battleDetailsModalVisible, setBattleDetailsModalVisible] = useState(false);
  
  // Filter battles based on search query, result filter, and date filter
  const filteredBattles = BATTLES.filter(battle => {
    const matchesSearch = 
      battle.opponent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      battle.opponent.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      battle.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      battle.bet.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesResult = 
      resultFilter === 'all' || 
      (resultFilter === 'wins' && battle.result === 'win') ||
      (resultFilter === 'losses' && battle.result === 'loss');
    
    let matchesDate = true;
    const battleDate = new Date(battle.date);
    const now = new Date();
    
    if (dateFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      matchesDate = battleDate >= oneWeekAgo;
    } else if (dateFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      matchesDate = battleDate >= oneMonthAgo;
    } else if (dateFilter === 'year') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      matchesDate = battleDate >= oneYearAgo;
    }
    
    return matchesSearch && matchesResult && matchesDate;
  });
  
  const handleBattlePress = (battle) => {
    setSelectedBattle(battle);
    setBattleDetailsModalVisible(true);
  };
  
  // Calculate stats
  const totalBattles = filteredBattles.length;
  const wins = filteredBattles.filter(battle => battle.result === 'win').length;
  const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;
  
  const totalWinnings = filteredBattles.reduce((total, battle) => {
    const amount = parseInt(battle.winnings.replace(/[^0-9-]/g, ''));
    return total + amount;
  }, 0);
  
  const renderBattleItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.battleCard}
      onPress={() => handleBattlePress(item)}
    >
      <View style={styles.battleHeader}>
        <Image source={{ uri: item.opponent.avatar }} style={styles.opponentAvatar} />
        <View style={styles.battleInfo}>
          <Text style={styles.opponentName}>{item.opponent.username}</Text>
          <Text style={styles.battleTime}>{item.time}</Text>
        </View>
        <View style={[
          styles.resultBadge,
          item.result === 'win' ? styles.winBadge : styles.lossBadge
        ]}>
          <Text style={styles.resultBadgeText}>
            {item.result === 'win' ? 'WIN' : 'LOSS'}
          </Text>
        </View>
      </View>
      
      <View style={styles.battleDetails}>
        <Text style={styles.battleGame}>{item.game}</Text>
        <Text style={styles.battleBet}>{item.bet}</Text>
        <View style={styles.battleAmounts}>
          <Text style={styles.battleAmount}>{item.amount}</Text>
          <Text style={[
            styles.battleWinnings,
            item.result === 'win' ? styles.winText : styles.lossText
          ]}>
            {item.winnings}
          </Text>
        </View>
      </View>
      
      <View style={styles.battleFooter}>
        <TouchableOpacity 
          style={styles.rematchButton}
          onPress={() => router.push('/battle')}
        >
          <Swords size={16} color="white" />
          <Text style={styles.rematchButtonText}>Rematch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Details</Text>
          <ChevronRight size={16} color="#A259FF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Battle History</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalBattles}</Text>
          <Text style={styles.statLabel}>Battles</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{winRate}%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[
            styles.statValue,
            totalWinnings >= 0 ? styles.winText : styles.lossText
          ]}>
            {totalWinnings >= 0 ? '+' : ''}{totalWinnings} BBZ
          </Text>
          <Text style={styles.statLabel}>Net</Text>
        </View>
      </View>
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
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
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
            >
              <X size={16} color="#EAEAEA" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color="#EAEAEA" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dateFilterButton}
          onPress={() => setDateFilterModalVisible(true)}
        >
          <Calendar size={20} color="#EAEAEA" />
        </TouchableOpacity>
      </View>
      
      {/* Filter Indicators */}
      {(resultFilter !== 'all' || dateFilter !== 'all') && (
        <View style={styles.filterIndicator}>
          <Text style={styles.filterIndicatorText}>
            {resultFilter !== 'all' && (
              resultFilter === 'wins' ? 'Wins Only' : 'Losses Only'
            )}
            {resultFilter !== 'all' && dateFilter !== 'all' && ' • '}
            {dateFilter !== 'all' && (
              dateFilter === 'week' ? 'Last Week' : 
              dateFilter === 'month' ? 'Last Month' : 'Last Year'
            )}
          </Text>
          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={() => {
              setResultFilter('all');
              setDateFilter('all');
            }}
          >
            <X size={16} color="#A259FF" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Battle List */}
      <FlatList
        data={filteredBattles}
        renderItem={renderBattleItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.battleList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Swords size={48} color="#4A4A4A" />
            <Text style={styles.emptyText}>
              {searchQuery.length > 0 
                ? `No battles found matching "${searchQuery}"`
                : resultFilter !== 'all' || dateFilter !== 'all'
                  ? "No battles match your filters"
                  : "You haven't battled anyone yet"}
            </Text>
            <TouchableOpacity 
              style={styles.startBattleButton}
              onPress={() => router.push('/battle')}
            >
              <Swords size={20} color="white" />
              <Text style={styles.startBattleButtonText}>Start a Battle</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      {/* Result Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter By Result</Text>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                resultFilter === 'all' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setResultFilter('all');
                setFilterModalVisible(false);
              }}
            >
              <Swords size={20} color={resultFilter === 'all' ? '#A259FF' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                resultFilter === 'all' && styles.filterOptionTextSelected
              ]}>
                All Battles
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                resultFilter === 'wins' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setResultFilter('wins');
                setFilterModalVisible(false);
              }}
            >
              <Trophy size={20} color={resultFilter === 'wins' ? '#10B981' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                resultFilter === 'wins' && styles.filterOptionTextSelected,
                resultFilter === 'wins' && styles.winsText
              ]}>
                Wins Only
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                resultFilter === 'losses' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setResultFilter('losses');
                setFilterModalVisible(false);
              }}
            >
              <X size={20} color={resultFilter === 'losses' ? '#EF4444' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                resultFilter === 'losses' && styles.filterOptionTextSelected,
                resultFilter === 'losses' && styles.lossesText
              ]}>
                Losses Only
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Date Filter Modal */}
      <Modal
        visible={dateFilterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDateFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter By Date</Text>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                dateFilter === 'all' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setDateFilter('all');
                setDateFilterModalVisible(false);
              }}
            >
              <Calendar size={20} color={dateFilter === 'all' ? '#A259FF' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                dateFilter === 'all' && styles.filterOptionTextSelected
              ]}>
                All Time
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                dateFilter === 'week' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setDateFilter('week');
                setDateFilterModalVisible(false);
              }}
            >
              <Calendar size={20} color={dateFilter === 'week' ? '#A259FF' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                dateFilter === 'week' && styles.filterOptionTextSelected
              ]}>
                Last Week
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                dateFilter === 'month' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setDateFilter('month');
                setDateFilterModalVisible(false);
              }}
            >
              <Calendar size={20} color={dateFilter === 'month' ? '#A259FF' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                dateFilter === 'month' && styles.filterOptionTextSelected
              ]}>
                Last Month
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                dateFilter === 'year' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setDateFilter('year');
                setDateFilterModalVisible(false);
              }}
            >
              <Calendar size={20} color={dateFilter === 'year' ? '#A259FF' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                dateFilter === 'year' && styles.filterOptionTextSelected
              ]}>
                Last Year
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setDateFilterModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Battle Details Modal */}
      {selectedBattle && (
        <Modal
          visible={battleDetailsModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setBattleDetailsModalVisible(false)}
        >
          <View style={styles.detailsModalOverlay}>
            <View style={styles.detailsModalContent}>
              <View style={styles.detailsModalHeader}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setBattleDetailsModalVisible(false)}
                >
                  <X size={24} color="#EAEAEA" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.detailsModalBody}>
                <View style={[
                  styles.detailsResultBanner,
                  selectedBattle.result === 'win' ? styles.detailsWinBanner : styles.detailsLossBanner
                ]}>
                  <Text style={styles.detailsResultText}>
                    {selectedBattle.result === 'win' ? 'YOU WON!' : 'YOU LOST'}
                  </Text>
                  <Text style={styles.detailsWinningsText}>
                    {selectedBattle.winnings}
                  </Text>
                </View>
                
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Battle Info</Text>
                  
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Opponent:</Text>
                    <View style={styles.detailsOpponent}>
                      <Image 
                        source={{ uri: selectedBattle.opponent.avatar }} 
                        style={styles.detailsOpponentAvatar} 
                      />
                      <Text style={styles.detailsOpponentName}>
                        {selectedBattle.opponent.username}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Game:</Text>
                    <Text style={styles.detailsValue}>{selectedBattle.game}</Text>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Your Bet:</Text>
                    <Text style={styles.detailsValue}>{selectedBattle.bet}</Text>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Amount:</Text>
                    <Text style={styles.detailsValue}>{selectedBattle.amount}</Text>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Date:</Text>
                    <Text style={styles.detailsValue}>{selectedBattle.time}</Text>
                  </View>
                </View>
                
                <View style={styles.detailsActions}>
                  <TouchableOpacity 
                    style={styles.detailsRematchButton}
                    onPress={() => {
                      setBattleDetailsModalVisible(false);
                      router.push('/battle');
                    }}
                  >
                    <Swords size={20} color="white" />
                    <Text style={styles.detailsRematchButtonText}>Rematch</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.detailsShareButton}
                    onPress={() => {/* Share functionality */}}
                  >
                    <Text style={styles.detailsShareButtonText}>Share Result</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2E2E3A',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  winText: {
    color: '#10B981',
  },
  lossText: {
    color: '#EF4444',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A1D',
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
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontFamily: 'Poppins-Regular',
  },
  clearSearchButton: {
    padding: 4,
  },
  filterButton: {
    backgroundColor: '#2E2E3A',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateFilterButton: {
    backgroundColor: '#2E2E3A',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E2E3A',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterIndicatorText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  clearFilterButton: {
    padding: 4,
  },
  battleList: {
    padding: 16,
    paddingBottom: 80,
  },
  battleCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  battleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  opponentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  battleInfo: {
    flex: 1,
  },
  opponentName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  battleTime: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  winBadge: {
    backgroundColor: '#10B981',
  },
  lossBadge: {
    backgroundColor: '#EF4444',
  },
  resultBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  battleDetails: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  battleGame: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  battleBet: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  battleAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  battleAmount: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  battleWinnings: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  battleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rematchButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rematchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  detailsButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
  },
  startBattleButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startBattleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  filterOptionSelected: {
    borderWidth: 2,
    borderColor: '#A259FF',
  },
  filterOptionText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  filterOptionTextSelected: {
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  winsText: {
    color: '#10B981',
  },
  lossesText: {
    color: '#EF4444',
  },
  cancelButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  detailsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  detailsModalContent: {
    backgroundColor: '#1A1A1D',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  detailsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  closeButton: {
    padding: 4,
  },
  detailsModalBody: {
    flex: 1,
  },
  detailsResultBanner: {
    padding: 24,
    alignItems: 'center',
  },
  detailsWinBanner: {
    backgroundColor: '#10B981',
  },
  detailsLossBanner: {
    backgroundColor: '#EF4444',
  },
  detailsResultText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  detailsWinningsText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  detailsSection: {
    padding: 16,
  },
  detailsSectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
  },
  detailsLabel: {
    color: '#A259FF',
    fontSize: 14,
    width: 80,
    fontFamily: 'Poppins-Regular',
  },
  detailsValue: {
    color: '#EAEAEA',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  detailsOpponent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailsOpponentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  detailsOpponentName: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  detailsActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  detailsRematchButton: {
    flex: 1,
    backgroundColor: '#A259FF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  detailsRematchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  detailsShareButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsShareButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});