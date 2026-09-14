import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabaseClient';
import { useGamesData } from '@/hooks/useGameData';
import { useAuth } from '@/hooks/useAuth';

// Import components
import Header from '@/components/tournament-bets/Header';
import LoadingState from '@/components/tournament-bets/LoadingState';
import ErrorState from '@/components/tournament-bets/ErrorState';
import SearchBar from '@/components/tournament-bets/SearchBar';
import GameCard from '@/components/tournament-bets/GameCard';
import PendingBets from '@/components/tournament-bets/PendingBets';
import AmountSelectionModal from '@/components/tournament-bets/AmountSelectionModal';
import { DollarSign } from 'lucide-react-native';

// Types
import { BetSelection, PendingBet } from '@/types/betting';

export default function PlaceTournamentBetsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { tournamentId, roundId } = params;
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [participantId, setParticipantId] = useState(0);
  const [sportType, setSportType] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<BetSelection | null>(null);
  const [pendingBets, setPendingBets] = useState<PendingBet[]>([]);
  const [tempAmount, setTempAmount] = useState('100');

  // Available BBZ.T amounts for betting
  const bbztAmounts = [100, 250, 500, 1000];

  // Get games data using the hook with futureOnly=true to get only future games
  const { games, loading, error } = useGamesData({ futureOnly: true });

  // Fetch user's tournament tokens
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!user?.id || !tournamentId || !roundId) return;

      try {
        const { data, error } = await supabase
          .from('tournament_round_participants')
          .select(`id, 
            token_balance,
            tournament:tournaments (
            type,
            name)`)
          .eq('user_id', user.id)
          .eq('tournament_id', tournamentId)
          .eq('round_id', roundId)
          .single();

        if (error) throw error;
        if (data) {
          setUserTokens(data.token_balance);
          setParticipantId(data.id);
          setSportType(data.tournament.type.toString());
        }
      } catch (error) {
        console.error('Error fetching user tokens:', error);
      }
    };

    fetchUserTokens();
  }, [user?.id, tournamentId, roundId]);
  
  const tournamentMatches = games.filter(game => 
    game.sport === sportType && game.status === 'UPCOMING'
  );

  // Filter matches based on search query
  const filteredMatches = tournamentMatches.filter(match => {
    const searchLower = searchQuery.toLowerCase();
    return (
      match.teams.team1.name.toLowerCase().includes(searchLower) ||
      match.teams.team2.name.toLowerCase().includes(searchLower)
    );
  });

  const handleOddsSelect = (
    matchId: string, 
    team: 'team1' | 'team2', 
    betType: 'spread' | 'total' | 'moneyline',
    oddsDisplay: string,
    subName?: string
  ) => {
    const match = games.find(m => m.id === matchId);
    if (!match) return;
  
    // Determine odds value based on bet type and team
    let oddsValue = 0;
    if (betType === 'moneyline') {
      // Use the actual moneyline odds from the updated odds structure
      oddsValue = team === 'team1' 
        ? match.team1Odds.moneylineOdds 
        : match.team2Odds.moneylineOdds;
    } else if (betType === 'spread') {
      // Use the actual spread odds from the updated odds structure
      oddsValue = team === 'team1'
        ? match.team1Odds.spreadOdds
        : match.team2Odds.spreadOdds;
    } else if (betType === 'total') {
      // Use the actual total odds from the updated odds structure
      oddsValue = team === 'team1'
        ? match.team1Odds.totalOdds // Over odds for team1
        : match.team2Odds.totalOdds; // Under odds for team2
    }
  
    const teamName = team === 'team1' 
      ? match.teams.team1.name 
      : match.teams.team2.name;
    
    // If it's a total bet and subName is provided, use that as the team name
    const displayName = betType === 'total' && subName 
      ? subName.charAt(0).toUpperCase() + subName.slice(1) // Capitalize first letter
      : teamName;
      
    setSelectedMatch({
      id: matchId,
      team,
      teamName: displayName, // Using the adjusted name
      matchup: `${match.teams.team1.name} vs ${match.teams.team2.name}`,
      odds: oddsValue,
      betType,
      oddsDisplay,
      subName: subName || undefined,
      sport: match.sport // Add the sport from the match
    });
    
    setShowAmountModal(true);
  };

  const handleAmountSelect = () => {
    let totalPendingAmount = 0;
    if (!selectedMatch) return;

    const amount = parseInt(tempAmount);

    if (isNaN(amount) || amount <= 0) return;
    
    // Check if user has enough tokens
    if (pendingBets.length > 0) {
      totalPendingAmount = pendingBets.reduce((sum, bet) => sum + bet.amount, 0);
    }
    if (totalPendingAmount + amount > userTokens) {
      Alert.alert(
        "Insufficient Tokens",
        `You only have ${userTokens} BBZ.T tokens available. Your pending bets already use ${totalPendingAmount} tokens.`,
        [{ text: "OK" }]
      );
      return;
    }

    const newBet: PendingBet = {
      matchId: selectedMatch.id,
      team: selectedMatch.team,
      amount,
      odds: selectedMatch.odds,
      teamName: selectedMatch.teamName,
      matchup: selectedMatch.matchup,
      betType: selectedMatch.betType,
      oddsDisplay: selectedMatch.oddsDisplay,
      subName: selectedMatch.subName
    };

    console.log(newBet)

    // Check if this bet already exists (same matchId, team, and betType)
    const existingBetIndex = pendingBets.findIndex(
      bet => bet.matchId === selectedMatch.id && 
             bet.team === selectedMatch.team && 
             bet.betType === selectedMatch.betType
    );

    // If bet exists, replace it; otherwise add a new one
    if (existingBetIndex >= 0) {
      const updatedBets = [...pendingBets];
      updatedBets[existingBetIndex] = newBet;
      setPendingBets(updatedBets);
    } else {
      setPendingBets(prev => [...prev, newBet]);
    }

    setShowAmountModal(false);
    setSelectedMatch(null);
    setTempAmount('100');
  };

  const removePendingBet = (matchId: string, team: 'team1' | 'team2', betType: 'spread' | 'total' | 'moneyline') => {
    setPendingBets(prev => prev.filter(
      bet => !(bet.matchId === matchId && bet.team === team && bet.betType === betType)
    ));
  };

  const handleSubmit = async () => {
    if (!user?.id || pendingBets.length === 0 || !tournamentId || !roundId) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate total amount of tokens being used
      const totalAmount = pendingBets.reduce((sum, bet) => sum + bet.amount, 0);
      
      // Check if user has enough tokens
      if (totalAmount > userTokens) {
        throw new Error(`Insufficient tokens. You need ${totalAmount} BBZ.T but only have ${userTokens} available.`);
      }
      
      // For each bet, create a sub-bet
      const subBetPromises = pendingBets.map(async (bet) => {
        
        // Calculate potential payout based on odds
        let potentialPayout = bet.amount;
        if (bet.odds < 0) {
          potentialPayout += (bet.amount / Math.abs(bet.odds)) * 100;
        } else {
          potentialPayout += (bet.amount * bet.odds) / 100;
        }
        
        // Create the main bet
        const { data: data, error: mainBetError } = await supabase
          .from('bets')
          .insert({
            user_id: user.id,
            tournament_id: tournamentId,
            tournament_round: roundId,
            risk: bet.amount,
            odds: bet.odds,
            potential_payout: potentialPayout,
            status: 'pending',
            net_amount: 0, // Will be updated when bet is settled
            bet_type_id: getBetTypeId(bet.betType)
          })
          .select();
          
        if (mainBetError) throw mainBetError;
        
        // Create the sub-bet
        const { error: subBetError } = await supabase
          .from('subbets')
          .insert({
            user_id: user.id,
            bet_id: data[0].id,
            event_id: bet.matchId,
            odds_id: `${bet.matchId}_${bet.team}_${bet.betType}`, // Create a unique identifier
            type: bet.betType,
            name: bet.betType === 'total' && bet.subName ? bet.subName : bet.teamName,
            description: `${bet.matchup} - ${bet.oddsDisplay}`,
            odds: bet.odds,
            points: bet.betType === 'spread' || bet.betType === 'total' 
              ? parseFloat(bet.oddsDisplay.replace(/[^\d.-]/g, '')) 
              : 0,
            status: 'pending',
            sport: bet.sport || sportType.toString() // Use bet.sport if available, or fallback to sportType
          });
          
        if (subBetError) throw subBetError;
      });
      
      // Wait for all sub-bets to be created
      await Promise.all(subBetPromises);
      const f_amount = userTokens - totalAmount;
      
      // Update user's token balance
      const { data: udata, error: tokenError } = await supabase
        .from('tournament_round_participants')
        .update({ token_balance: f_amount })
        .eq('id', participantId)
        .select();
  
      if (tokenError) throw tokenError;
      
      // Success! Update local state
      setUserTokens(prevTokens => prevTokens - totalAmount);
      setPendingBets([]);
      
      Alert.alert(
        "Bets Placed Successfully",
        `You've placed ${pendingBets.length} bets using ${totalAmount} BBZ.T tokens.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error submitting bets:', error);
      Alert.alert(
        "Error Placing Bets",
        error instanceof Error ? error.message : "An unknown error occurred",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to get bet type ID
  const getBetTypeId = (betType: 'spread' | 'total' | 'moneyline'): number => {
    switch (betType) {
      case 'spread':
        return 1;
      case 'total':
        return 2;
      case 'moneyline':
        return 3;
      default:
        return 0;
    }
  };

  // Check if a bet is active for a given match, team, and bet type
  const isBetActive = (matchId: string, team: 'team1' | 'team2', betType: 'spread' | 'total' | 'moneyline') => {
    return pendingBets.some(
      bet => bet.matchId === matchId && bet.team === team && bet.betType === betType
    );
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => router.reload()} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Tournament Bets" onBack={() => router.back()} />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.tokenBalanceContainer}>
            <DollarSign size={16} color="#A259FF" />
            <Text style={styles.tokenBalanceText}>
              Available: {userTokens} BBZ.T
            </Text>
          </View>

          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />

          {filteredMatches.length === 0 ? (
            <View style={styles.noMatchesContainer}>
              <Text style={styles.noMatchesText}>
                {searchQuery ? "No matches found for your search" : "No upcoming tournament games available"}
              </Text>
            </View>
          ) : (
            <View style={styles.gamesContainer}>
              {filteredMatches.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onOddsSelect={handleOddsSelect}
                  isBetActive={isBetActive}
                />
              ))}
            </View>
          )}
        </View>

        {pendingBets.length > 0 && (
          <PendingBets
            bets={pendingBets}
            onRemoveBet={removePendingBet}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (pendingBets.length === 0 || isSubmitting) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={pendingBets.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Submit Tournament Bets ({pendingBets.length})
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <AmountSelectionModal
        visible={showAmountModal}
        match={selectedMatch}
        amount={tempAmount}
        onAmountChange={setTempAmount}
        onClose={() => {
          setShowAmountModal(false);
          setSelectedMatch(null);
          setTempAmount('100');
        }}
        onConfirm={handleAmountSelect}
        quickAmounts={bbztAmounts}
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
  section: {
    marginBottom: 24,
  },
  tokenBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D246C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  tokenBalanceText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  noMatchesContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMatchesText: {
    color: '#6c757d',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  footer: {
    backgroundColor: '#1A1A1D',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2E2E3A',
  },
  submitButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#4A4A4A',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});