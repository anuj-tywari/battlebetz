import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { CreditCard as Edit, Share2, LogOut, CreditCard, Settings, Users, ChevronRight, TrendingUp, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { UserRole } from '@/types/roles';

import Header from '../../components/Header';
import ProfileBalanceCard from '../../components/ProfileBalanceCard';
import RoleBadge from '../../components/RoleBadge';
import QRCodeModal from '../../components/QRCodeModal';
import PromoterCard from '../../components/PromoterCard';
import PromoterMetrics from '../../components/PromoterMetrics';
import { supabase } from '@/utils/supabaseClient';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { userProfile, userMetrics } = useProfileData();
  const [showQRModal, setShowQRModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [promoDetails, setPromoDetails] = useState<{
    username: string;
    promoCode: string;
    referralCount: number;
    avatar_url?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    winnings: 0,
    tournamentsJoined: 0,
    betsPlaced: 0,
    hitRate: 0
  });
  
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        // Fetch tournaments the user has joined
        const { data: tournaments, error: tournamentsError } = await supabase
          .from('tournament_round_participants')
          .select('tournament_id')
          .eq('user_id', user.id);
          
        if (tournamentsError) throw tournamentsError;
        
        // Get unique tournament IDs
        const uniqueTournaments = new Set(tournaments?.map(t => t.tournament_id) || []);
        
        // Fetch all bets by the user
        const { data: bets, error: betsError } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id);
          
        if (betsError) throw betsError;
        
        // Calculate winnings and hit rate
        let totalWinnings = 0;
        let wonBets = 0;
        
        bets?.forEach(bet => {
          if (bet.status === 'won') {
            totalWinnings += bet.net_amount;
            wonBets++;
          } else if (bet.status === 'lost') {
            totalWinnings -= bet.risk;
          }
        });
        
        const settledBets = bets?.filter(bet => bet.status === 'won' || bet.status === 'lost') || [];
        const hitRate = settledBets.length > 0 ? (wonBets / settledBets.length) * 100 : 0;
        
        setUserStats({
          winnings: totalWinnings,
          tournamentsJoined: uniqueTournaments.size,
          betsPlaced: bets?.length || 0,
          hitRate: hitRate
        });
        
        // Once we have the data, set loading to false
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setLoading(false);
      }
    };
    
    fetchUserStats();
  }, [user]);

  useEffect(() => {
      const fetchPromoDetails = async () => {
        try {
          setLoading(true);
          setError(null);
  
          // Fetch promoter details
          const { data: promoter, error: promoterError } = await supabase
            .from('promo_codes')
            .select('username, promo_code, referral_count, avatar_url')
            .eq('user_id', user?.id)
            .single();
          
          const code = promoter?.promo_code
          
          if (promoterError) {
            throw new Error('Invalid promo code');
          }
  
          if (!promoter) {
            throw new Error('Promoter not found');
          }
  
          setPromoDetails({
            username: promoter.username,
            promoCode: promoter.promo_code, 
            referralCount: promoter.referral_count,
            avatar_url: promoter.avatar_url
          });
        } catch (err) {
          console.error('Error occurred:', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
  
      if (userProfile?.role === 'promoter') {
        fetchPromoDetails();
      } else {
        setLoading(false);
        setError('No promo code provided');
      }
    }, [userProfile?.role]);

  // Activity items - can be updated to fetch from a real activity feed later
  const activityItems = [
    {
      id: '1',
      icon: '🏆',
      title: 'vs @mike_b',
      odds: 'ML: -110',
      winnings: '+BBZ 90',
      time: '10 mins ago'
    },
    {
      id: '2',
      icon: '📈',
      title: 'Your Battle ranking has changed',
      time: '25 mins ago'
    },
    {
      id: '3',
      icon: '💰',
      title: 'Deposit successful',
      winnings: '+USD 100',
      time: '1 hour ago'
    },
    {
      id: '4',
      icon: '🎮',
      title: 'Joined March Madness',
      time: '3 hours ago'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      if (Platform.OS === 'web') {
        window.location.href = '/login'; // Force a clean page load
      } else {
        router.push('/login');
      }
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAdmin = async() => {
    if (userProfile?.role === 'admin'){
      router.push('/admin-panel')
    } else {
      router.push('/')
    }
  }

  // Calculate win rate
  const getWinRate = () => {
    if (!userMetrics) return '0%';
    
    const { battle_count, battle_won_count } = userMetrics;
    if (battle_count === 0) return '0%';
    
    const winRate = (battle_won_count / battle_count) * 100;
    return `${Math.round(winRate)}%`;
  };

  // Calculate hit rate
  const getHitRate = () => {
    if (userStats.hitRate === 0) return '0%';
    return `${Math.round(userStats.hitRate)}%`;
  };

  // Display placeholder or actual avatar
  const getAvatarSource = () => {
    if (userProfile?.avatar_url) {
      return { uri: userProfile.avatar_url };
    }
    return { uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' };
  };

  // Format winnings with proper sign
  const formatWinnings = () => {
    if (!userMetrics) return 'BBZ 0';
    
    const winnings = userMetrics.bbz_balance || 0;
    if (winnings === 0) return 'BBZ 0';
    
    return `BBZ ${winnings > 0 ? '+' : ''}${Math.abs(winnings)}`;
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Loading profile...</Text>
        ) : (
          <View style={styles.section}>
            <View style={styles.profileHeader}>
              <Image
                source={getAvatarSource()}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile?.username || user?.user_metadata?.username || 'User'}</Text>
                <View style={styles.usernameRow}>
                  <Text style={styles.profileUsername}>@{userProfile?.username?.toLowerCase() || 'user'}</Text>
                  {userProfile?.role && <RoleBadge role={userProfile.role as UserRole} size="large" />}
                </View>
                <View style={styles.profileActions}>
                  <TouchableOpacity 
                    style={styles.profileActionButton}
                    onPress={() => router.push('/edit-profile')}
                  >
                    <Edit size={16} color="#EAEAEA" />
                    <Text style={styles.profileActionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileActionButton}>
                    <Share2 size={16} color="#EAEAEA" />
                    <Text style={styles.profileActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatWinnings()}</Text>
                <Text style={styles.statLabel}>Winnings</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userMetrics?.battle_count || 0}</Text>
                <Text style={styles.statLabel}>Tournaments</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userMetrics?.battle_won_count || 0}</Text>
                <Text style={styles.statLabel}>Bets Placed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getWinRate()}</Text>
                <Text style={styles.statLabel}>Hit Rate</Text>
              </View>
            </View>
            
            <ProfileBalanceCard />
            
            {userProfile?.role === 'promoter' && (
              <>
                <PromoterCard 
                  promoCode={promoDetails?.promoCode || 'BATTLEBETZ'}
                  onShowQR={() => setShowQRModal(true)}
                />
                <PromoterMetrics
                  signups={promoDetails?.referralCount || 0}
                  tournaments={Math.round((promoDetails?.referralCount || 0) * 0.75)} // 75% join rate
                  conversionRate={75} // Example conversion rate
                  earnings={0} // Default value since referral_earnings is not in the UserProfile type
                />
              </>
            )}
            
            <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.activityContainer}
              >
                {activityItems.map(item => (
                  <View key={item.id} style={styles.activityCard}>
                    {item.icon && (
                      <View style={styles.activityHeader}>
                        <Text style={styles.activityIcon}>{item.icon}</Text>
                        <Text style={styles.activityTitle} numberOfLines={1}>{item.title}</Text>
                      </View>
                    )}
                    {!item.icon && (
                      <Text style={styles.activityTitle} numberOfLines={1}>{item.title}</Text>
                    )}
                    {(item.odds || item.winnings) && (
                      <View style={styles.activityDetails}>
                        {item.odds && <Text style={styles.activityOdds} numberOfLines={1}>{item.odds}</Text>}
                        {item.winnings && <Text style={styles.activityWinnings} numberOfLines={1}>{item.winnings}</Text>}
                      </View>
                    )}
                    <Text style={styles.activityTime} numberOfLines={1}>{item.time}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Account</Text>
              </View>
              <View style={styles.accountOptions}>
                {(userProfile?.role === 'admin') && (
                  <TouchableOpacity 
                    style={styles.accountOption}
                    onPress={handleAdmin}
                  >
                    <Shield size={20} color="#A259FF" />
                    <Text style={styles.accountOptionText}>Admin Panel</Text>
                    <ChevronRight size={18} color="#A259FF" style={styles.accountOptionIcon} />
                  </TouchableOpacity>
                )}

                {userProfile?.role === 'internal' && (
                  <TouchableOpacity 
                    style={styles.accountOption}
                    onPress={() => router.push('/metrics')}
                  >
                    <TrendingUp size={20} color="#A259FF" />
                    <Text style={styles.accountOptionText}>Metrics</Text>
                    <ChevronRight size={18} color="#A259FF" style={styles.accountOptionIcon} />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.accountOption}
                  onPress={() => router.push('/friends-rivals')}
                >
                  <Users size={20} color="#A259FF" />
                  <Text style={styles.accountOptionText}>Friends & Rivals</Text>
                  <ChevronRight size={18} color="#A259FF" style={styles.accountOptionIcon} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.accountOption}
                  onPress={handleLogout}
                >
                  <LogOut size={20} color="#EF4444" />
                  <Text style={[styles.accountOptionText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <QRCodeModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        promoCode={promoDetails?.promoCode || "BATTLEBETZ"}
      />
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
    padding: 16,
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Poppins-Regular',
  },
  section: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileUsername: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2E2E3A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  profileActionText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    color: '#A259FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  activitySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  activityContainer: {
    gap: 16,
    paddingRight: 16,
  },
  activityCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    width: 160,
    height: 100,
    justifyContent: 'space-between',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityIcon: {
    fontSize: 16,
  },
  activityTitle: {
    color: '#EAEAEA',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityOdds: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  activityWinnings: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  activityTime: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  card: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  accountOptions: {
    gap: 16,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountOptionText: {
    color: '#EAEAEA',
    fontSize: 16,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  accountOptionIcon: {
    marginLeft: 'auto',
  },
  logoutText: {
    color: '#EF4444',
  },
});