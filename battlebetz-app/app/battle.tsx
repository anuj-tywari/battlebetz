import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Modal,
  Image,
  FlatList,
  Dimensions,
  Platform
} from 'react-native';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Users, 
  User, 
  ChevronDown, 
  ChevronRight,
  Minus,
  Plus,
  DollarSign
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

import ProfileBalanceCard from '../components/ProfileBalanceCard';

const { width } = Dimensions.get('window');

// Mock data for games
const games = [
  {
    id: '1',
    league: 'NBA',
    teams: 'Lakers vs Warriors',
    time: 'Today, 7:30 PM',
    icon: '🏀',
    odds: {
      moneyLine: {
        home: -150,
        away: +130
      },
      spread: {
        home: -3.5,
        away: +3.5
      },
      total: 219.5
    }
  },
  {
    id: '2',
    league: 'NBA',
    teams: 'Celtics vs Heat',
    time: 'Today, 8:00 PM',
    icon: '🏀',
    odds: {
      moneyLine: {
        home: -200,
        away: +175
      },
      spread: {
        home: -5.5,
        away: +5.5
      },
      total: 210.5
    }
  },
  {
    id: '3',
    league: 'NFL',
    teams: 'Chiefs vs Eagles',
    time: 'Tomorrow, 4:25 PM',
    icon: '🏈',
    odds: {
      moneyLine: {
        home: -120,
        away: +110
      },
      spread: {
        home: -2.5,
        away: +2.5
      },
      total: 48.5
    }
  },
  {
    id: '4',
    league: 'MLB',
    teams: 'Yankees vs Red Sox',
    time: 'Tomorrow, 1:05 PM',
    icon: '⚾',
    odds: {
      moneyLine: {
        home: -140,
        away: +120
      },
      spread: {
        home: -1.5,
        away: +1.5
      },
      total: 8.5
    }
  },
  {
    id: '5',
    league: 'NHL',
    teams: 'Maple Leafs vs Bruins',
    time: 'Today, 7:00 PM',
    icon: '🏒',
    odds: {
      moneyLine: {
        home: -110,
        away: -110
      },
      spread: {
        home: -1.5,
        away: +1.5
      },
      total: 5.5
    }
  },
  {
    id: '6',
    league: 'Soccer',
    teams: 'Real Madrid vs Man City',
    time: 'Tomorrow, 3:00 PM',
    icon: '⚽',
    odds: {
      moneyLine: {
        home: +120,
        away: +150,
        draw: +230
      },
      spread: {
        home: -0.5,
        away: +0.5
      },
      total: 2.5
    }
  },
  {
    id: '7',
    league: 'UFC',
    teams: 'Jones vs Miocic',
    time: 'Saturday, 10:00 PM',
    icon: '🥊',
    odds: {
      moneyLine: {
        home: -280,
        away: +240
      }
    }
  },
  {
    id: '8',
    league: 'Golf',
    teams: 'Masters Tournament',
    time: 'Thursday, 8:00 AM',
    icon: '⛳',
    odds: {
      moneyLine: {
        home: +800,
        away: +1200
      }
    }
  }
];

// Mock data for friends and rivals
const friends = [
  {
    id: '1',
    name: '@mike_b',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
    type: 'friend'
  },
  {
    id: '2',
    name: '@sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop',
    type: 'friend'
  },
  {
    id: '3',
    name: '@david_m',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2187&auto=format&fit=crop',
    type: 'friend'
  },
  {
    id: '4',
    name: '@alex_k',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format&fit=crop',
    type: 'rival'
  },
  {
    id: '5',
    name: '@jordan_p',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2187&auto=format&fit=crop',
    type: 'rival'
  }
];

export default function BattleScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameSearchModalVisible, setGameSearchModalVisible] = useState(false);
  const [battleType, setBattleType] = useState('community');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const [wagerAmount, setWagerAmount] = useState('50');
  const [selectedTeam, setSelectedTeam] = useState('home');
  const [selectedBetType, setSelectedBetType] = useState('moneyLine');
  
  // For odds slider
  const sliderPosition = useSharedValue(0);
  const [customOdds, setCustomOdds] = useState(null);
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  
  // Filter games based on search query
  const filteredGames = games.filter(game => 
    game.teams.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.league.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate potential winnings based on wager amount and odds
  useEffect(() => {
    if (!selectedGame) return;
    
    let odds;
    if (customOdds) {
      odds = customOdds;
    } else if (selectedBetType === 'moneyLine') {
      odds = selectedTeam === 'home' 
        ? selectedGame.odds.moneyLine.home 
        : selectedGame.odds.moneyLine.away;
    } else if (selectedBetType === 'spread') {
      // For spread bets, odds are typically -110 on both sides
      odds = -110;
    }
    
    const amount = parseFloat(wagerAmount) || 0;
    
    // Calculate potential winnings
    if (odds > 0) {
      // Positive odds (e.g. +150) means you win $150 on a $100 bet
      setPotentialWinnings((amount * odds) / 100);
    } else if (odds < 0) {
      // Negative odds (e.g. -150) means you need to bet $150 to win $100
      setPotentialWinnings((amount * 100) / Math.abs(odds));
    } else {
      setPotentialWinnings(0);
    }
  }, [wagerAmount, selectedGame, selectedTeam, selectedBetType, customOdds]);

  // Animated styles for the odds slider
  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sliderPosition.value }]
    };
  });
  
  const leftValueStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      sliderPosition.value,
      [0, width * 0.3],
      [0.5, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity
    };
  });
  
  const rightValueStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      sliderPosition.value,
      [width * 0.3, 0],
      [0.5, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity
    };
  });

  // Handle slider movement and update custom odds
  const handleSliderMove = (value) => {
    sliderPosition.value = withSpring(value, { damping: 20 });
    
    // Calculate custom odds based on slider position
    if (!selectedGame) return;
    
    const baseOdds = selectedBetType === 'moneyLine'
      ? (selectedTeam === 'home' ? selectedGame.odds.moneyLine.home : selectedGame.odds.moneyLine.away)
      : -110;
    
    // Adjust odds based on slider position
    // This is a simplified calculation - in a real app, you'd have more complex logic
    const normalizedPosition = value / (width * 0.3); // 0 to 1
    const oddsAdjustment = Math.round(normalizedPosition * 50) * (baseOdds < 0 ? -1 : 1);
    
    setCustomOdds(baseOdds + oddsAdjustment);
  };

  // Increment/decrement wager amount
  const adjustWagerAmount = (increment) => {
    const currentAmount = parseInt(wagerAmount) || 0;
    const newAmount = increment 
      ? Math.min(currentAmount + 10, 1000) // Max bet of 1000
      : Math.max(currentAmount - 10, 10);  // Min bet of 10
    setWagerAmount(newAmount.toString());
  };

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
        <Text style={styles.headerTitle}>Create Battle</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Game Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pick a Game</Text>
          <TouchableOpacity 
            style={styles.gameSelector}
            onPress={() => setGameSearchModalVisible(true)}
          >
            {selectedGame ? (
              <View style={styles.selectedGameContainer}>
                <Text style={styles.gameIcon}>{selectedGame.icon}</Text>
                <View style={styles.selectedGameInfo}>
                  <Text style={styles.selectedGameTeams}>{selectedGame.teams}</Text>
                  <Text style={styles.selectedGameTime}>{selectedGame.time}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.gameSelectorPlaceholder}>Search and select a game</Text>
            )}
            <ChevronRight size={20} color="#A259FF" />
          </TouchableOpacity>
        </View>
        
        {/* Battle Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Battle Type</Text>
          <View style={styles.battleTypeContainer}>
            <TouchableOpacity 
              style={[
                styles.battleTypeButton,
                battleType === 'community' && styles.battleTypeButtonActive
              ]}
              onPress={() => setBattleType('community')}
            >
              <Users size={20} color={battleType === 'community' ? 'white' : '#EAEAEA'} />
              <Text style={[
                styles.battleTypeText,
                battleType === 'community' && styles.battleTypeTextActive
              ]}>Community</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.battleTypeButton,
                battleType === 'personal' && styles.battleTypeButtonActive
              ]}
              onPress={() => setBattleType('personal')}
            >
              <User size={20} color={battleType === 'personal' ? 'white' : '#EAEAEA'} />
              <Text style={[
                styles.battleTypeText,
                battleType === 'personal' && styles.battleTypeTextActive
              ]}>Personal</Text>
            </TouchableOpacity>
          </View>
          
          {battleType === 'personal' && (
            <TouchableOpacity 
              style={styles.friendSelector}
              onPress={() => setFriendsModalVisible(true)}
            >
              {selectedFriend ? (
                <View style={styles.selectedFriendContainer}>
                  <Image 
                    source={{ uri: selectedFriend.avatar }} 
                    style={styles.selectedFriendAvatar} 
                  />
                  <Text style={styles.selectedFriendName}>{selectedFriend.name}</Text>
                  <View style={[
                    styles.friendTypeBadge,
                    selectedFriend.type === 'rival' ? styles.rivalBadge : styles.friendBadge
                  ]}>
                    <Text style={styles.friendTypeBadgeText}>
                      {selectedFriend.type === 'rival' ? 'RIVAL' : 'FRIEND'}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.friendSelectorPlaceholder}>
                  Select someone from your friends or rivals
                </Text>
              )}
              <ChevronRight size={20} color="#A259FF" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Wager Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wager Amount</Text>
          <View style={styles.wagerContainer}>
            <TouchableOpacity 
              style={styles.wagerAdjustButton}
              onPress={() => adjustWagerAmount(false)}
            >
              <Minus size={20} color="#EAEAEA" />
            </TouchableOpacity>
            
            <View style={styles.wagerInputContainer}>
              <Text style={styles.wagerCurrency}>BBZ</Text>
              <TextInput
                style={styles.wagerInput}
                value={wagerAmount}
                onChangeText={setWagerAmount}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.wagerAdjustButton}
              onPress={() => adjustWagerAmount(true)}
            >
              <Plus size={20} color="#EAEAEA" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickAmounts}>
            {[10, 25, 50, 100, 250].map(amount => (
              <TouchableOpacity 
                key={amount}
                style={[
                  styles.quickAmountButton,
                  parseInt(wagerAmount) === amount && styles.quickAmountButtonActive
                ]}
                onPress={() => setWagerAmount(amount.toString())}
              >
                <Text style={[
                  styles.quickAmountText,
                  parseInt(wagerAmount) === amount && styles.quickAmountTextActive
                ]}>
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Bet Type and Odds */}
        {selectedGame && (
          <View style={styles.section}>
            <View style={styles.betTypeHeader}>
              <Text style={styles.sectionTitle}>Bet Type</Text>
              <View style={styles.betTypeSelector}>
                <TouchableOpacity 
                  style={[
                    styles.betTypeButton,
                    selectedBetType === 'moneyLine' && styles.betTypeButtonActive
                  ]}
                  onPress={() => setSelectedBetType('moneyLine')}
                >
                  <Text style={[
                    styles.betTypeText,
                    selectedBetType === 'moneyLine' && styles.betTypeTextActive
                  ]}>
                    Money Line
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.betTypeButton,
                    selectedBetType === 'spread' && styles.betTypeButtonActive
                  ]}
                  onPress={() => setSelectedBetType('spread')}
                >
                  <Text style={[
                    styles.betTypeText,
                    selectedBetType === 'spread' && styles.betTypeTextActive
                  ]}>
                    Spread
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.teamSelector}>
              <TouchableOpacity 
                style={[
                  styles.teamButton,
                  selectedTeam === 'home' && styles.teamButtonActive
                ]}
                onPress={() => setSelectedTeam('home')}
              >
                <Text style={[
                  styles.teamButtonText,
                  selectedTeam === 'home' && styles.teamButtonTextActive
                ]}>
                  {selectedGame.teams.split(' vs ')[0]}
                </Text>
                <Text style={[
                  styles.teamButtonOdds,
                  selectedTeam === 'home' && styles.teamButtonOddsActive
                ]}>
                  {selectedBetType === 'moneyLine' 
                    ? (selectedGame.odds.moneyLine.home > 0 ? `+${selectedGame.odds.moneyLine.home}` : selectedGame.odds.moneyLine.home)
                    : `${selectedGame.odds.spread.home > 0 ? '+' : ''}${selectedGame.odds.spread.home}`
                  }
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.teamButton,
                  selectedTeam === 'away' && styles.teamButtonActive
                ]}
                onPress={() => setSelectedTeam('away')}
              >
                <Text style={[
                  styles.teamButtonText,
                  selectedTeam === 'away' && styles.teamButtonTextActive
                ]}>
                  {selectedGame.teams.split(' vs ')[1]}
                </Text>
                <Text style={[
                  styles.teamButtonOdds,
                  selectedTeam === 'away' && styles.teamButtonOddsActive
                ]}>
                  {selectedBetType === 'moneyLine' 
                    ? (selectedGame.odds.moneyLine.away > 0 ? `+${selectedGame.odds.moneyLine.away}` : selectedGame.odds.moneyLine.away)
                    : `${selectedGame.odds.spread.away > 0 ? '+' : ''}${selectedGame.odds.spread.away}`
                  }
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Odds Slider */}
            <View style={styles.oddsSliderSection}>
              <Text style={styles.oddsSliderTitle}>Adjust Odds</Text>
              <Text style={styles.oddsSliderSubtitle}>
                Move the slider to change the odds and potential payout
              </Text>
              
              <View style={styles.oddsSliderContainer}>
                <Animated.View style={[styles.oddsValue, leftValueStyle]}>
                  <Text style={styles.oddsValueText}>
                    {customOdds ? (customOdds > 0 ? `+${customOdds}` : customOdds) : 'Better Odds'}
                  </Text>
                </Animated.View>
                
                <View style={styles.sliderTrack}>
                  <Animated.View 
                    style={[styles.sliderThumb, sliderStyle]}
                    {...{ onMoveShouldSetResponder: () => true }}
                    onResponderMove={(event) => {
                      const { locationX } = event.nativeEvent;
                      // Limit the slider movement to a reasonable range
                      const limitedX = Math.max(0, Math.min(locationX, width * 0.3));
                      handleSliderMove(limitedX);
                    }}
                  />
                </View>
                
                <Animated.View style={[styles.oddsValue, rightValueStyle]}>
                  <Text style={styles.oddsValueText}>Better Payout</Text>
                </Animated.View>
              </View>
            </View>
            
            {/* Potential Winnings */}
            <View style={styles.winningsContainer}>
              <Text style={styles.winningsLabel}>Potential Winnings:</Text>
              <Text style={styles.winningsAmount}>
                BBZ {potentialWinnings.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        
        {/* Balance Card */}
        <ProfileBalanceCard />
        
        {/* Create Battle Button */}
        <TouchableOpacity 
          style={[
            styles.createBattleButton,
            (!selectedGame || (battleType === 'personal' && !selectedFriend)) && styles.createBattleButtonDisabled
          ]}
          disabled={!selectedGame || (battleType === 'personal' && !selectedFriend)}
        >
          <Text style={styles.createBattleButtonText}>Create Battle</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Game Search Modal */}
      <Modal
        visible={gameSearchModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setGameSearchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Game</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setGameSearchModalVisible(false)}
              >
                <X size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Search size={20} color="#A259FF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search games..."
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
            
            <FlatList
              data={filteredGames}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.gameItem}
                  onPress={() => {
                    setSelectedGame(item);
                    setGameSearchModalVisible(false);
                    // Reset custom odds when selecting a new game
                    setCustomOdds(null);
                    sliderPosition.value = withSpring(0);
                  }}
                >
                  <Text style={styles.gameItemIcon}>{item.icon}</Text>
                  <View style={styles.gameItemInfo}>
                    <Text style={styles.gameItemLeague}>{item.league}</Text>
                    <Text style={styles.gameItemTeams}>{item.teams}</Text>
                    <Text style={styles.gameItemTime}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>No games found</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {/* Friends Modal */}
      <Modal
        visible={friendsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFriendsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Friend or Rival</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setFriendsModalVisible(false)}
              >
                <X size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={friends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.friendItem}
                  onPress={() => {
                    setSelectedFriend(item);
                    setFriendsModalVisible(false);
                  }}
                >
                  <Image 
                    source={{ uri: item.avatar }} 
                    style={styles.friendAvatar} 
                  />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{item.name}</Text>
                    <View style={[
                      styles.friendTypeBadge,
                      item.type === 'rival' ? styles.rivalBadge : styles.friendBadge
                    ]}>
                      <Text style={styles.friendTypeBadgeText}>
                        {item.type === 'rival' ? 'RIVAL' : 'FRIEND'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  gameSelector: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameSelectorPlaceholder: {
    color: '#A259FF',
    fontSize: 16,
  },
  selectedGameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gameIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  selectedGameInfo: {
    flex: 1,
  },
  selectedGameTeams: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedGameTime: {
    color: '#A259FF',
    fontSize: 14,
  },
  battleTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  battleTypeButton: {
    flex: 1,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  battleTypeButtonActive: {
    backgroundColor: '#A259FF',
  },
  battleTypeText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
  },
  battleTypeTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  friendSelector: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendSelectorPlaceholder: {
    color: '#A259FF',
    fontSize: 16,
  },
  selectedFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedFriendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  selectedFriendName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  friendTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  friendBadge: {
    backgroundColor: '#10B981',
  },
  rivalBadge: {
    backgroundColor: '#EF4444',
  },
  friendTypeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  wagerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  wagerAdjustButton: {
    backgroundColor: '#2E2E3A',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wagerInputContainer: {
    flex: 1,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  wagerCurrency: {
    color: '#A259FF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  wagerInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  quickAmountButtonActive: {
    backgroundColor: '#A259FF',
  },
  quickAmountText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
  },
  quickAmountTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  betTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  betTypeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  betTypeButton: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  betTypeButtonActive: {
    backgroundColor: '#A259FF',
  },
  betTypeText: {
    color: '#EAEAEA',
    fontSize: 14,
  },
  betTypeTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  teamSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  teamButton: {
    flex: 1,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  teamButtonActive: {
    backgroundColor: '#3D246C',
    borderWidth: 2,
    borderColor: '#A259FF',
  },
  teamButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  teamButtonTextActive: {
    color: 'white',
  },
  teamButtonOdds: {
    color: '#A259FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamButtonOddsActive: {
    color: '#A259FF',
  },
  oddsSliderSection: {
    marginBottom: 24,
  },
  oddsSliderTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  oddsSliderSubtitle: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 16,
  },
  oddsSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oddsValue: {
    width: 100,
  },
  oddsValueText: {
    color: '#EAEAEA',
    fontSize: 14,
    textAlign: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#2E2E3A',
    borderRadius: 4,
    marginHorizontal: 12,
    position: 'relative',
  },
  sliderThumb: {
    width: 24,
    height: 24,
    backgroundColor: '#A259FF',
    borderRadius: 12,
    position: 'absolute',
    top: -8,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  winningsContainer: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  winningsLabel: {
    color: '#EAEAEA',
    fontSize: 16,
  },
  winningsAmount: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createBattleButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  createBattleButtonDisabled: {
    backgroundColor: '#4A4A4A',
  },
  createBattleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1D',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  clearSearchButton: {
    padding: 8,
  },
  gameItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  gameItemIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  gameItemInfo: {
    flex: 1,
  },
  gameItemLeague: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 4,
  },
  gameItemTeams: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gameItemTime: {
    color: '#EAEAEA',
    fontSize: 14,
    opacity: 0.7,
  },
  separator: {
    height: 1,
    backgroundColor: '#2E2E3A',
    marginLeft: 56,
  },
  emptyListContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyListText: {
    color: '#EAEAEA',
    fontSize: 16,
    opacity: 0.7,
  },
  friendItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
  },
});