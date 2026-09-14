import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Modal, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, Search, X, Users, Shield, Ban, CircleCheck as CheckCircle, ChevronDown } from 'lucide-react-native';
import { useRouter, Route } from 'expo-router';
import { useProfileData, UserProfile } from '@/hooks/useProfileData';
import { UserRole } from '@/types/roles';
import { supabase } from '@/utils/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

// User type definition for our app
type User = {
  id: string, 
  email: string, 
  username: string, 
  role: string, 
  promo_code: string, 
  created_at: string, 
  updated_at: string,
  is_admin: boolean,
  bbz_balance: number,
  bbzt_balance: number,
  avatar_url: string,
  bio: string,
  phone: string,
  location: string,
  notifications_enabled: boolean,
  private_profile: boolean,
  show_winnings: boolean,
  show_battle_history: boolean
};

// Define ROLES at the top level - NOT inside the component
const ROLES: UserRole[] = ['admin', 'internal', 'promoter', 'comp-owner', 'consumer'];

const generatePromoCode = (username: string) => {
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${username.toUpperCase()}${randomNum}`;
};

// Empty initial users array - will be populated from Supabase
const INITIAL_USERS: User[] = [];

export default function UserManagementScreen() {
  const router = useRouter();
  const { userProfile, loading: profileLoading } = useProfileData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<Error | null>(null);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [bannedUserCount, setBannedUserCount] = useState(0);
  
  // Use useEffect for navigation instead of conditional hook calls
  useEffect(() => {
    // Only redirect if we have loaded the profile and it's not an admin
    if (!profileLoading && userProfile && userProfile.role !== 'admin') {
      router.replace('/');
    }
  }, [profileLoading, userProfile, router]);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError(null);
        
        // Get all users from the users table
        const { data, error } = await supabase
          .from('users')
          .select(`
            id, 
            email, 
            username, 
            role, 
            promo_code, 
            created_at, 
            updated_at,
            is_admin,
            bbz_balance,
            bbzt_balance,
            avatar_url,
            bio,
            phone,
            location,
            notifications_enabled,
            private_profile,
            show_winnings,
            show_battle_history
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match our User type
          const transformedUsers: User[] = data.map(user => {
            return {
              id: user.id,
              username: user.username || '',
              email: user.email || '',
              role: (user.role as UserRole) || 'consumer',
              promo_code: user.promo_code,
              created_at: user.created_at 
                ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
                : 'Unknown',
              updated_at: user.updated_at 
              ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
              : 'Unknown',
              is_admin: user.is_admin,
              bbz_balance: user.bbz_balance,
              bbzt_balance: user.bbzt_balance,
              avatar_url: user.avatar_url,
              bio: user.bio,
              phone: user.phone,
              location: user.location,
              notifications_enabled: user.notifications_enabled,
              private_profile: user.private_profile,
              show_winnings: user.show_winnings,
              show_battle_history: user.show_battle_history
              }
          });
          
          setUsers(transformedUsers);
          
          // Set statistics counts
          setTotalUserCount(data.length);
          setActiveUserCount(data.length);
          setBannedUserCount(0); // You may need to add a banned flag in your schema
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsersError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setUsersLoading(false);
      }
    };

    // Only fetch users if the current user is an admin
    if (!profileLoading && userProfile && userProfile.role === 'admin') {
      fetchUsers();
    }
  }, [profileLoading, userProfile]);

  const fetchPromoCodes = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try  {
      const {data, error} = await supabase
        .from('promo_codes')
        .select('*')
        .eq('username', user.username)

        if (error) {
          throw error
        }

        return data.length
    } catch (err) {
      console.error('Error fetching codes:', err);
      Alert.alert(
        'Error',
        'Failed to fetch promo codes. Please try again.'
      );
    }
  };

  const createPromoCodes = async (userId: string, promoCode: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try  {
      const {data, error} = await supabase
        .from('promo_codes')
        .insert({
          user_id: userId,
          username:user.username,
          promo_code: promoCode,
          avatar_url: user.avatar_url || '',
          referral_count: 0
        })
        .select()

        if (error) {
          throw error
        }

        return "Success"
    } catch (err) {
      console.error('Error fetching codes:', err);
      Alert.alert(
        'Error',
        'Failed to fetch promo codes. Please try again.'
      );
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const promoCount = await fetchPromoCodes(userId)

    const oldRole = user.role;
    let promoCode = user.promo_code;
    
    try {
      // Generate promo code for new promoters if they don't have one already
      if (newRole === 'promoter' && promoCount === 0) {
        promoCode = generatePromoCode(user.username);

        // Update the user's role in Supabase
        const { data, error } = await supabase
        .from('users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

        if (error) {
          throw error;
        }

        await createPromoCodes(userId, promoCode)
      } else {
        const { data, error } = await supabase
        .from('users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      }
      
      
      
      // If successful, update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(u => {
          if (u.id === userId) {
            return { 
              ...u, 
              role: newRole,
              promoCode 
            };
          }
          return u;
        })
      );
      
      // Create notification in the database (notifications table)
      // const { error: notifError } = await supabase
      //   .from('notifications')
      //   .insert({
      //     user_id: userId,
      //     type: 'role_change',
      //     title: 'Role Update',
      //     message: `Your role has been updated from ${oldRole} to ${newRole}`,
      //     read: false,
      //     created_at: new Date().toISOString()
      //   });
      
      // if (notifError) {
      //   console.error('Error creating notification:', notifError);
      // }
      
      // Show success message
      Alert.alert(
        'Role Updated',
        `User role has been changed to ${newRole}${newRole === 'promoter' && promoCode ? `. Promo code: ${promoCode}` : ''}`
      );
    } catch (err) {
      console.error('Error updating role:', err);
      Alert.alert(
        'Error',
        'Failed to update user role. Please try again.'
      );
    } finally {
      setShowRoleModal(false);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  // Filter users based on search query - moved to a variable to keep it out of the render method
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function for role badge styles (moved outside of the StyleSheet)
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { backgroundColor: '#EF4444' };
      case 'internal':
        return { backgroundColor: '#F59E0B' };
      case 'promoter':
        return { backgroundColor: '#10B981' };
      case 'comp-owner':
        return { backgroundColor: '#3B82F6' };
      case 'consumer':
        return { backgroundColor: '#6B7280' };
      default:
        return { backgroundColor: '#6B7280' };
    }
  };

  // Handle loading state
  if (profileLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A259FF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  // Handle no profile state
  if (!userProfile) {
    console.log("No user profile loaded");
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load profile</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.retryButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#A259FF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
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
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={20} color="#A259FF" />
            <Text style={styles.statValue}>{totalUserCount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
            {!usersLoading && <Text style={styles.statGrowth}>Updated now</Text>}
          </View>
          <View style={styles.statCard}>
            <Shield size={20} color="#10B981" />
            <Text style={styles.statValue}>{activeUserCount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Active Users</Text>
            {!usersLoading && (
              <Text style={styles.statGrowth}>
                {totalUserCount > 0 
                  ? `${Math.round((activeUserCount / totalUserCount) * 100)}% retention` 
                  : 'No data'}
              </Text>
            )}
          </View>
          <View style={styles.statCard}>
            <Ban size={20} color="#EF4444" />
            <Text style={styles.statValue}>{bannedUserCount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Banned Users</Text>
            {!usersLoading && <Text style={styles.statTrend}>Updated now</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Users ({filteredUsers.length})</Text>
          
          {usersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#A259FF" />
              <Text style={styles.loadingText}>Loading users...</Text>
            </View>
          ) : usersError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading users</Text>
              <Text style={styles.errorMessage}>{usersError.message}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => router.refresh()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredUsers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No users match your search' : 'No users found'}
              </Text>
            </View>
          ) : (
            <View style={styles.usersList}>
              {filteredUsers.map(user => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.username}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <View style={styles.userMeta}>
                  <TouchableOpacity 
                    style={styles.roleSelector}
                    onPress={() => openRoleModal(user)}
                  >
                    <View style={[styles.roleBadge, getRoleBadgeStyle(user.role as UserRole)]}>
                      <Text style={styles.roleBadgeText}>{user.role.toUpperCase()}</Text>
                    </View>
                    <ChevronDown size={16} color="#A259FF" />
                  </TouchableOpacity>
                  <Text style={styles.userDate}>Joined {user.created_at}</Text>
                </View>
                {/* Will re-add shortly with proper user metrics */}
                {/* <View style={styles.userStats}>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatValue}>{user.stats.battles}</Text>
                    <Text style={styles.userStatLabel}>Battles</Text>
                  </View>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatValue}>{user.stats.wins}</Text>
                    <Text style={styles.userStatLabel}>Wins</Text>
                  </View>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatValue}>{user.stats.winRate}%</Text>
                    <Text style={styles.userStatLabel}>Win Rate</Text>
                  </View>
                </View> */}
                <View style={styles.userActions}>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.banButton}>
                    <Text style={styles.banButtonText}>Ban</Text>
                  </TouchableOpacity>
                </View>
              </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Role Selection Modal */}
      <Modal
        visible={showRoleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change User Role</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowRoleModal(false)}
              >
                <X size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <View style={styles.modalUser}>
                <Text style={styles.modalUserName}>{selectedUser.username}</Text>
                <Text style={styles.modalUserEmail}>{selectedUser.email}</Text>
                <Text style={styles.modalUserCurrentRole}>
                  Current Role: {selectedUser.role.toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.rolesList}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    selectedUser?.role === role && styles.roleOptionSelected
                  ]}
                  onPress={() => selectedUser && handleRoleChange(selectedUser.id, role)}
                >
                  <View style={[styles.roleBadge, getRoleBadgeStyle(role)]}>
                    <Text style={styles.roleBadgeText}>{role.toUpperCase()}</Text>
                  </View>
                  {selectedUser?.role === role && (
                    <CheckCircle size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  errorMessage: {
    color: '#EAEAEA',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
  },
  retryButton: {
    backgroundColor: '#A259FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  statGrowth: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  statTrend: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  usersList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  userEmail: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  userMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  roleBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  userDate: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  userStats: {
    flexDirection: 'row',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  userStat: {
    flex: 1,
    alignItems: 'center',
  },
  userStatValue: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  userStatLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  userActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  banButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  banButtonText: {
    color: 'white',
    fontSize: 14,
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
    backgroundColor: '#2E2E3A',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 4,
  },
  modalUser: {
    marginBottom: 24,
  },
  modalUserName: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  modalUserEmail: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  modalUserCurrentRole: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  rolesList: {
    gap: 12,
  },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  roleOptionSelected: {
    backgroundColor: '#3D246C',
    borderWidth: 2,
    borderColor: '#A259FF',
  },
});