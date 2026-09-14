import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Platform,
  Modal
} from 'react-native';
import { 
  ArrowLeft, 
  Clock, 
  CircleAlert as AlertCircle, 
  Search, 
  X, 
  ChevronDown, 
  Check, 
  Plus, 
  DollarSign 
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
  },
  matchCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  matchHeader: {
    marginBottom: 12,
  },
  regionText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  matchTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  teamButtonSelected: {
    backgroundColor: '#3D246C',
    borderWidth: 2,
    borderColor: '#A259FF',
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  teamOdds: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  vsText: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  spreadText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 4,
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
  selectedMatchInfo: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectedMatchup: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  selectedTeam: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  bbztText: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '23%',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  quickAmountButtonSelected: {
    backgroundColor: '#3D246C',
    borderWidth: 2,
    borderColor: '#A259FF',
  },
  quickAmountText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  quickAmountTextSelected: {
    color: '#A259FF',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  confirmButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#4A4A4A',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default function PlaceTournamentBetsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<{
    id: string;
    team: 'team1' | 'team2';
    teamName: string;
    matchup: string;
    odds: number;
  } | null>(null);
  const [pendingBets, setPendingBets] = useState<Array<{
    matchId: string;
    team: 'team1' | 'team2';
    amount: number;
    odds: number;
    teamName: string;
    matchup: string;
  }>>([]);
  const [tempAmount, setTempAmount] = useState('100');

  // Available BBZ.T amounts for betting
  const bbztAmounts = [100, 250, 500, 1000];

  // Mock tournament matches data for Round 1
  const matches = [
    {
      id: '1',
      round: 1,
      region: 'South',
      team1: '(1) Houston',
      team2: '(16) Longwood',
      odds: {
        team1: -3000,
        team2: +1500,
        spread: -21.5
      }
    },
    {
      id: '2',
      round: 1,
      region: 'South',
      team1: '(8) Nebraska',
      team2: '(9) Texas A&M',
      odds: {
        team1: -110,
        team2: -110,
        spread: 1.5
      }
    },
    {
      id: '3',
      round: 1,
      region: 'East',
      team1: '(5) San Diego St',
      team2: '(12) UAB',
      odds: {
        team1: -175,
        team2: +145,
        spread: -4.5
      }
    }
  ];

  // Filter matches based on search query
  const filteredMatches = matches.filter(match => {
    const searchLower = searchQuery.toLowerCase();
    return (
      match.team1.toLowerCase().includes(searchLower) ||
      match.team2.toLowerCase().includes(searchLower) ||
      match.region.toLowerCase().includes(searchLower)
    );
  });

  const handleTeamSelect = (matchId: string, team: 'team1' | 'team2') => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    setSelectedMatch({
      id: matchId,
      team,
      teamName: team === 'team1' ? match.team1 : match.team2,
      matchup: `${match.team1} vs ${match.team2}`,
      odds: team === 'team1' ? match.odds.team1 : match.odds.team2
    });
    setShowAmountModal(true);
  };

  const handleAmountSelect = () => {
    if (!selectedMatch) return;

    const amount = parseInt(tempAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newBet = {
      matchId: selectedMatch.id,
      team: selectedMatch.team,
      amount,
      odds: selectedMatch.odds,
      teamName: selectedMatch.teamName,
      matchup: selectedMatch.matchup
    };

    setPendingBets(prev => [...prev.filter(bet => bet.matchId !== selectedMatch.id), newBet]);
    setShowAmountModal(false);
    setSelectedMatch(null);
    setTempAmount('100');
  };

  const removePendingBet = (matchId: string) => {
    setPendingBets(prev => prev.filter(bet => bet.matchId !== matchId));
  };

  const handleSubmit = () => {
    // In a real app, this would submit the bets to the backend
    router.back();
  };

  const deadline = new Date('2025-03-20T18:00:00-04:00');
  const now = new Date();
  const timeLeft = deadline.getTime() - now.getTime();
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Place Tournament Bets</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Click on team to place bet</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#A259FF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search teams or regions..."
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

          {/* Match List */}
          {filteredMatches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <View style={styles.matchHeader}>
                <Text style={styles.regionText}>{match.region} Region</Text>
              </View>

              <View style={styles.matchTeams}>
                <TouchableOpacity 
                  style={[
                    styles.teamButton,
                    pendingBets.some(bet => bet.matchId === match.id && bet.team === 'team1') && 
                    styles.teamButtonSelected
                  ]}
                  onPress={() => handleTeamSelect(match.id, 'team1')}
                >
                  <Text style={styles.teamName}>{match.team1}</Text>
                  <Text style={styles.teamOdds}>
                    {match.odds.team1 > 0 ? `+${match.odds.team1}` : match.odds.team1}
                  </Text>
                  {pendingBets.some(bet => bet.matchId === match.id && bet.team === 'team1') && (
                    <View style={styles.checkmark}>
                      <Check size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.vsContainer}>
                  <Text style={styles.vsText}>vs</Text>
                  <Text style={styles.spreadText}>
                    {match.odds.spread > 0 ? `+${match.odds.spread}` : match.odds.spread}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.teamButton,
                    pendingBets.some(bet => bet.matchId === match.id && bet.team === 'team2') && 
                    styles.teamButtonSelected
                  ]}
                  onPress={() => handleTeamSelect(match.id, 'team2')}
                >
                  <Text style={styles.teamName}>{match.team2}</Text>
                  <Text style={styles.teamOdds}>
                    {match.odds.team2 > 0 ? `+${match.odds.team2}` : match.odds.team2}
                  </Text>
                  {pendingBets.some(bet => bet.matchId === match.id && bet.team === 'team2') && (
                    <View style={styles.checkmark}>
                      <Check size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            pendingBets.length === 0 && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={pendingBets.length === 0}
        >
          <Text style={styles.submitButtonText}>
            Submit Round 1 Bets ({pendingBets.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Selection Modal */}
      <Modal
        visible={showAmountModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowAmountModal(false);
          setSelectedMatch(null);
          setTempAmount('100');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select BBZ.T Amount</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowAmountModal(false);
                  setSelectedMatch(null);
                  setTempAmount('100');
                }}
              >
                <X size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>

            {selectedMatch && (
              <View style={styles.selectedMatchInfo}>
                <Text style={styles.selectedMatchup}>{selectedMatch.matchup}</Text>
                <Text style={styles.selectedTeam}>
                  {selectedMatch.teamName} ({selectedMatch.odds > 0 ? `+${selectedMatch.odds}` : selectedMatch.odds})
                </Text>
              </View>
            )}

            <View style={styles.amountInputContainer}>
              <DollarSign size={20} color="#A259FF" />
              <TextInput
                style={styles.amountInput}
                value={tempAmount}
                onChangeText={setTempAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="#6c757d"
              />
              <Text style={styles.bbztText}>BBZ.T</Text>
            </View>

            <View style={styles.quickAmounts}>
              {bbztAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickAmountButton,
                    parseInt(tempAmount) === amount && styles.quickAmountButtonSelected
                  ]}
                  onPress={() => setTempAmount(amount.toString())}
                >
                  <Text style={[
                    styles.quickAmountText,
                    parseInt(tempAmount) === amount && styles.quickAmountTextSelected
                  ]}>
                    {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[
                styles.confirmButton,
                !tempAmount && styles.confirmButtonDisabled
              ]}
              onPress={handleAmountSelect}
              disabled={!tempAmount}
            >
              <Text style={styles.confirmButtonText}>Confirm Amount</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}