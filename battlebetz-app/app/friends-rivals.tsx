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
  Users, 
  UserPlus, 
  ChevronRight,
  Filter,
  Swords
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock data for friends and rivals
const USERS = [
  {
    id: '1',
    name: 'Mike Brown',
    username: '@mike_b',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
    type: 'friend',
    stats: {
      battles: 45,
      wins: 28,
      winRate: '62%',
      streak: 3
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    username: '@sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop',
    type: 'friend',
    stats: {
      battles: 32,
      wins: 19,
      winRate: '59%',
      streak: 0
    }
  },
  {
    id: '3',
    name: 'David Miller',
    username: '@david_m',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2187&auto=format&fit=crop',
    type: 'friend',
    stats: {
      battles: 67,
      wins: 42,
      winRate: '63%',
      streak: 5
    }
  },
  {
    id: '4',
    name: 'Alex King',
    username: '@alex_k',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format&fit=crop',
    type: 'rival',
    stats: {
      battles: 23,
      wins: 14,
      winRate: '61%',
      streak: 2
    }
  },
  {
    id: '5',
    name: 'Jordan Peterson',
    username: '@jordan_p',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2187&auto=format&fit=crop',
    type: 'rival',
    stats: {
      battles: 51,
      wins: 29,
      winRate: '57%',
      streak: 0
    }
  },
  {
    id: '6',
    name: 'Emily Wilson',
    username: '@emily_w',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    type: 'friend',
    stats: {
      battles: 38,
      wins: 22,
      winRate: '58%',
      streak: 1
    }
  },
  {
    id: '7',
    name: 'Chris Taylor',
    username: '@chris_t',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2187&auto=format&fit=crop',
    type: 'rival',
    stats: {
      battles: 42,
      wins: 25,
      winRate: '60%',
      streak: 3
    }
  },
  {
    id: '8',
    name: 'Jessica Adams',
    username: '@jessica_a',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2076&auto=format&fit=crop',
    type: 'friend',
    stats: {
      battles: 29,
      wins: 18,
      winRate: '62%',
      streak: 4
    }
  },
  {
    id: '9',
    name: 'Ryan Cooper',
    username: '@ryan_c',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2187&auto=format&fit=crop',
    type: 'rival',
    stats: {
      battles: 56,
      wins: 31,
      winRate: '55%',
      streak: 0
    }
  },
  {
    id: '10',
    name: 'Olivia Martinez',
    username: '@olivia_m',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=2187&auto=format&fit=crop',
    type: 'friend',
    stats: {
      battles: 33,
      wins: 20,
      winRate: '61%',
      streak: 2
    }
  }
];

export default function FriendsRivalsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'friends', 'rivals'
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfileModalVisible, setUserProfileModalVisible] = useState(false);
  
  // Filter users based on search query and type filter
  const filteredUsers = USERS.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && user.type === filter;
  });
  
  const handleUserPress = (user) => {
    setSelectedUser(user);
    setUserProfileModalVisible(true);
  };
  
  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => handleUserPress(item)}
    >
      <View style={styles.userHeader}>
        <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>{item.username}</Text>
        </View>
        <View style={[
          styles.userTypeBadge,
          item.type === 'rival' ? styles.rivalBadge : styles.friendBadge
        ]}>
          <Text style={styles.userTypeBadgeText}>
            {item.type === 'rival' ? 'RIVAL' : 'FRIEND'}
          </Text>
        </View>
      </View>
      
      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.stats.battles}</Text>
          <Text style={styles.statLabel}>Battles</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.stats.wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.stats.winRate}</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.stats.streak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>
      
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={styles.battleButton}
          onPress={() => router.push('/battle')}
        >
          <Swords size={16} color="white" />
          <Text style={styles.battleButtonText}>Battle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View Profile</Text>
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
        <Text style={styles.headerTitle}>Friends & Rivals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {/* Add friend/rival functionality */}}
        >
          <UserPlus size={24} color="#EAEAEA" />
        </TouchableOpacity>
      </View>
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#A259FF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or username..."
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
      </View>
      
      {/* Filter Indicator */}
      {filter !== 'all' && (
        <View style={styles.filterIndicator}>
          <Text style={styles.filterIndicatorText}>
            Showing: {filter === 'friends' ? 'Friends Only' : 'Rivals Only'}
          </Text>
          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={() => setFilter('all')}
          >
            <X size={16} color="#A259FF" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.userList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Users size={48} color="#4A4A4A" />
            <Text style={styles.emptyText}>
              {searchQuery.length > 0 
                ? `No users found matching "${searchQuery}"`
                : filter !== 'all'
                  ? `No ${filter} found`
                  : "You don't have any friends or rivals yet"}
            </Text>
            <TouchableOpacity style={styles.addFriendButton}>
              <UserPlus size={20} color="white" />
              <Text style={styles.addFriendButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter By</Text>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filter === 'all' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setFilter('all');
                setFilterModalVisible(false);
              }}
            >
              <Users size={20} color={filter === 'all' ? '#A259FF' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                filter === 'all' && styles.filterOptionTextSelected
              ]}>
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filter === 'friends' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setFilter('friends');
                setFilterModalVisible(false);
              }}
            >
              <Users size={20} color={filter === 'friends' ? '#10B981' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                filter === 'friends' && styles.filterOptionTextSelected,
                filter === 'friends' && styles.friendsText
              ]}>
                Friends Only
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filter === 'rivals' && styles.filterOptionSelected
              ]}
              onPress={() => {
                setFilter('rivals');
                setFilterModalVisible(false);
              }}
            >
              <Swords size={20} color={filter === 'rivals' ? '#EF4444' : '#EAEAEA'} />
              <Text style={[
                styles.filterOptionText,
                filter === 'rivals' && styles.filterOptionTextSelected,
                filter === 'rivals' && styles.rivalsText
              ]}>
                Rivals Only
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
      
      {/* User Profile Modal */}
      {selectedUser && (
        <Modal
          visible={userProfileModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setUserProfileModalVisible(false)}
        >
          <View style={styles.profileModalOverlay}>
            <View style={styles.profileModalContent}>
              <View style={styles.profileModalHeader}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setUserProfileModalVisible(false)}
                >
                  <X size={24} color="#EAEAEA" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileModalBody}>
                <Image 
                  source={{ uri: selectedUser.avatar }} 
                  style={styles.profileModalAvatar} 
                />
                <Text style={styles.profileModalName}>{selectedUser.name}</Text>
                <Text style={styles.profileModalUsername}>{selectedUser.username}</Text>
                
                <View style={[
                  styles.profileModalTypeBadge,
                  selectedUser.type === 'rival' ? styles.rivalBadge : styles.friendBadge
                ]}>
                  <Text style={styles.profileModalTypeBadgeText}>
                    {selectedUser.type === 'rival' ? 'RIVAL' : 'FRIEND'}
                  </Text>
                </View>
                
                <View style={styles.profileModalStats}>
                  <View style={styles.profileModalStatItem}>
                    <Text style={styles.profileModalStatValue}>{selectedUser.stats.battles}</Text>
                    <Text style={styles.profileModalStatLabel}>Battles</Text>
                  </View>
                  <View style={styles.profileModalStatItem}>
                    <Text style={styles.profileModalStatValue}>{selectedUser.stats.wins}</Text>
                    <Text style={styles.profileModalStatLabel}>Wins</Text>
                  </View>
                  <View style={styles.profileModalStatItem}>
                    <Text style={styles.profileModalStatValue}>{selectedUser.stats.winRate}</Text>
                    <Text style={styles.profileModalStatLabel}>Win Rate</Text>
                  </View>
                  <View style={styles.profileModalStatItem}>
                    <Text style={styles.profileModalStatValue}>{selectedUser.stats.streak}</Text>
                    <Text style={styles.profileModalStatLabel}>Streak</Text>
                  </View>
                </View>
                
                <View style={styles.profileModalActions}>
                  <TouchableOpacity 
                    style={styles.profileModalBattleButton}
                    onPress={() => {
                      setUserProfileModalVisible(false);
                      router.push('/battle');
                    }}
                  >
                    <Swords size={20} color="white" />
                    <Text style={styles.profileModalBattleButtonText}>Battle</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.profileModalToggleButton,
                      selectedUser.type === 'rival' ? styles.makeAllyButton : styles.makeRivalButton
                    ]}
                  >
                    <Text style={styles.profileModalToggleButtonText}>
                      {selectedUser.type === 'rival' ? 'Make Ally' : 'Make Rival'}
                    </Text>
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
  addButton: {
    padding: 8,
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
  userList: {
    padding: 16,
    paddingBottom: 80,
  },
  userCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  userUsername: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  userTypeBadge: {
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
  userTypeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  battleButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  battleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  viewProfileButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewProfileText: {
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
  addFriendButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addFriendButtonText: {
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
  friendsText: {
    color: '#10B981',
  },
  rivalsText: {
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
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  profileModalContent: {
    backgroundColor: '#1A1A1D',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  profileModalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  closeButton: {
    padding: 4,
  },
  profileModalBody: {
    alignItems: 'center',
    padding: 16,
  },
  profileModalAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileModalName: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  profileModalUsername: {
    color: '#A259FF',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  profileModalTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 24,
  },
  profileModalTypeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  profileModalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  profileModalStatItem: {
    alignItems: 'center',
  },
  profileModalStatValue: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  profileModalStatLabel: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  profileModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  profileModalBattleButton: {
    flex: 1,
    backgroundColor: '#A259FF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  profileModalBattleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  profileModalToggleButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makeRivalButton: {
    backgroundColor: '#EF4444',
  },
  makeAllyButton: {
    backgroundColor: '#10B981',
  },
  profileModalToggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});