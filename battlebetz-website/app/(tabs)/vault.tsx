import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { CircleAlert as AlertCircle, TrendingUp, Search, X } from 'lucide-react-native';

import Header from '../../components/Header';

export default function VaultScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');

  // Mock data for top NCAA tournament players
  const players = [
    {
      id: '1',
      name: 'Jamal Shead',
      team: '(1) Houston',
      position: 'G',
      stats: {
        ppg: 13.2,
        apg: 6.3,
        rpg: 3.8,
        spg: 2.1,
        fgPercent: 41.8
      },
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'L.J. Cryer',
      team: '(1) Houston',
      position: 'G',
      stats: {
        ppg: 15.3,
        apg: 2.4,
        rpg: 2.1,
        spg: 1.2,
        fgPercent: 44.2
      },
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Rienk Mast',
      team: '(8) Nebraska',
      position: 'F',
      stats: {
        ppg: 12.8,
        apg: 3.2,
        rpg: 7.6,
        spg: 0.8,
        fgPercent: 47.5
      },
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
    },
    {
      id: '4',
      name: 'Wade Taylor IV',
      team: '(9) Texas A&M',
      position: 'G',
      stats: {
        ppg: 18.9,
        apg: 4.1,
        rpg: 3.4,
        spg: 2.3,
        fgPercent: 38.9
      },
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
    },
    {
      id: '5',
      name: 'Jaedon LeDee',
      team: '(5) San Diego St',
      position: 'F',
      stats: {
        ppg: 21.1,
        apg: 1.8,
        rpg: 8.4,
        spg: 1.0,
        fgPercent: 55.8
      },
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop'
    }
  ];

  // Filter players based on search query
  const filteredPlayers = playerSearchQuery
    ? players.filter(player => 
        player.name.toLowerCase().includes(playerSearchQuery.toLowerCase()) ||
        player.team.toLowerCase().includes(playerSearchQuery.toLowerCase())
      )
    : players;

  // Updated mock data for NCAA teams
  const matchupStats = {
    team1: {
      name: '(1) Houston',
      logo: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
      winLoss: {
        overallRecord: '30-4',
        last10: '8-2',
        away: '12-2',
        favorite: '25-3'
      },
      ats: {
        overallRecord: '20-14',
        last10: '6-4',
        away: '8-6',
        favorite: '18-10'
      },
      overUnder: {
        overallRecord: '18-16',
        last10: '6-4',
        home: '10-8',
        favorite: '15-13'
      }
    },
    team2: {
      name: '(16) Longwood',
      logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
      winLoss: {
        overallRecord: '21-13',
        last10: '7-3',
        home: '13-2',
        underdog: '3-8'
      },
      ats: {
        overallRecord: '18-16',
        last10: '7-3',
        home: '12-3',
        underdog: '5-6'
      },
      overUnder: {
        overallRecord: '19-15',
        last10: '6-4',
        away: '8-10',
        underdog: '4-7'
      }
    }
  };

  // Updated injuries for NCAA teams
  const injuries = [
    {
      player: "Jamal Shead (HOU)",
      status: "Questionable",
      injury: "Ankle",
      impact: "Starting Point Guard - 13.2 PPG"
    },
    {
      player: "Terrance Arceneaux (HOU)",
      status: "Out",
      injury: "Achilles",
      impact: "Key Reserve - 6.4 PPG"
    },
    {
      player: "Ja'Heim Hudson (LONG)",
      status: "Probable",
      injury: "Knee",
      impact: "Starting Forward - 11.5 PPG"
    },
    {
      player: "Walyn Napper (LONG)",
      status: "Day-to-Day",
      injury: "Shoulder",
      impact: "Starting Guard - 14.8 PPG"
    }
  ];

  // Updated trending picks for NCAA tournament
  const trendingPicks = [
    {
      game: "(1) Houston vs (16) Longwood",
      pick: "Houston -21.5",
      percentage: 82,
      consensus: "10,450 bets"
    },
    {
      game: "(8) Nebraska vs (9) Texas A&M",
      pick: "Texas A&M +1.5",
      percentage: 68,
      consensus: "8,275 bets"
    },
    {
      game: "(5) San Diego St vs (12) UAB",
      pick: "Under 142.5",
      percentage: 75,
      consensus: "7,890 bets"
    }
  ];

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>The Vault</Text>
            <Text style={styles.sectionDescription}>
              Your live action center with all the information you need
            </Text>
          </View>

          {/* Match-up Section */}
          <View style={styles.matchupCard}>
            <Text style={styles.matchupSectionTitle}>Match-up Section</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search size={20} color="#A259FF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search teams..."
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

            {/* Teams and Time */}
            <View style={styles.teamsContainer}>
              <View style={styles.teamColumn}>
                <Image 
                  source={{ uri: matchupStats.team1.logo }}
                  style={styles.teamLogo}
                />
                <Text style={styles.teamName}>{matchupStats.team1.name}</Text>
              </View>
              
              <View style={styles.timeColumn}>
                <Text style={styles.gameDate}>Mar 19</Text>
                <Text style={styles.gameTime}>7:30p</Text>
              </View>
              
              <View style={styles.teamColumn}>
                <Image 
                  source={{ uri: matchupStats.team2.logo }}
                  style={styles.teamLogo}
                />
                <Text style={[styles.teamName, styles.rightAlign]}>{matchupStats.team2.name}</Text>
              </View>
            </View>

            {/* Win/Loss Section */}
            <View style={styles.statSection}>
              <Text style={styles.statSectionTitle}>Win | Loss</Text>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.winLoss.overallRecord}</Text>
                <Text style={styles.statLabel}>Overall Record</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.winLoss.overallRecord}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.winLoss.last10}</Text>
                <Text style={styles.statLabel}>Last 10</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.winLoss.last10}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.winLoss.away}</Text>
                <Text style={styles.statLabel}>Away/Home</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.winLoss.home}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.winLoss.favorite}</Text>
                <Text style={styles.statLabel}>Fav/Dog</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.winLoss.underdog}</Text>
              </View>
            </View>

            {/* ATS Section */}
            <View style={styles.statSection}>
              <Text style={styles.statSectionTitle}>Against The Spread</Text>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.ats.overallRecord}</Text>
                <Text style={styles.statLabel}>O/U Record</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.ats.overallRecord}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.ats.last10}</Text>
                <Text style={styles.statLabel}>O/U Last 10</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.ats.last10}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.ats.away}</Text>
                <Text style={styles.statLabel}>O/U Away/Home</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.ats.home}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.ats.favorite}</Text>
                <Text style={styles.statLabel}>Fav/Dog</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.ats.underdog}</Text>
              </View>
            </View>

            {/* Over/Under Section */}
            <View style={styles.statSection}>
              <Text style={styles.statSectionTitle}>Over | Under</Text>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.overUnder.overallRecord}</Text>
                <Text style={styles.statLabel}>Overall Record</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.overUnder.overallRecord}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.overUnder.last10}</Text>
                <Text style={styles.statLabel}>Last 10</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.overUnder.last10}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.overUnder.home}</Text>
                <Text style={styles.statLabel}>Home/Away</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.overUnder.away}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.leftStatValue}>{matchupStats.team1.overUnder.favorite}</Text>
                <Text style={styles.statLabel}>Fav/Dog</Text>
                <Text style={styles.rightStatValue}>{matchupStats.team2.overUnder.underdog}</Text>
              </View>
            </View>
          </View>

          {/* Player Stats Section - Moved up */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Player Stats</Text>
              <View style={styles.searchContainer}>
                <Search size={16} color="#A259FF" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search players..."
                  placeholderTextColor="#6c757d"
                  value={playerSearchQuery}
                  onChangeText={setPlayerSearchQuery}
                />
                {playerSearchQuery.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setPlayerSearchQuery('')}
                  >
                    <X size={14} color="#EAEAEA" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.playersContainer}>
              {filteredPlayers.map((player) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={styles.playerHeader}>
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <Text style={styles.playerTeam}>{player.team}</Text>
                    </View>
                    <View style={styles.positionBadge}>
                      <Text style={styles.positionText}>{player.position}</Text>
                    </View>
                  </View>

                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{player.stats.ppg}</Text>
                      <Text style={styles.statLabel}>PPG</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{player.stats.rpg}</Text>
                      <Text style={styles.statLabel}>RPG</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{player.stats.apg}</Text>
                      <Text style={styles.statLabel}>APG</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{player.stats.spg}</Text>
                      <Text style={styles.statLabel}>SPG</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{player.stats.fgPercent}%</Text>
                      <Text style={styles.statLabel}>FG%</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Key Injuries Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AlertCircle size={20} color="#A259FF" />
              <Text style={styles.cardTitle}>Key Injuries</Text>
            </View>
            <View style={styles.injuriesContainer}>
              {injuries.map((injury, index) => (
                <View key={index} style={styles.injuryItem}>
                  <Text style={styles.injuryPlayer}>{injury.player}</Text>
                  <View style={styles.injuryDetails}>
                    <View style={[
                      styles.statusBadge,
                      injury.status === 'Out' && styles.statusOut,
                      injury.status === 'Questionable' && styles.statusQuestionable,
                      injury.status === 'Probable' && styles.statusProbable,
                      injury.status === 'Day-to-Day' && styles.statusDayToDay
                    ]}>
                      <Text style={styles.statusText}>{injury.status}</Text>
                    </View>
                    <Text style={styles.injuryType}>{injury.injury}</Text>
                  </View>
                  <Text style={styles.injuryImpact}>{injury.impact}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Trending Picks Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingUp size={20} color="#A259FF" />
              <Text style={styles.cardTitle}>Trending Picks</Text>
            </View>
            <View style={styles.trendsContainer}>
              {trendingPicks.map((trend, index) => (
                <View key={index} style={styles.trendItem}>
                  <View style={styles.trendHeader}>
                    <Text style={styles.trendGame}>{trend.game}</Text>
                    <Text style={styles.trendPercentage}>{trend.percentage}%</Text>
                  </View>
                  <Text style={styles.trendPick}>{trend.pick}</Text>
                  <View style={styles.trendConsensus}>
                    <Text style={styles.consensusText}>{trend.consensus}</Text>
                  </View>
                  <View style={styles.trendBar}>
                    <View style={[styles.trendBarFill, { width: `${trend.percentage}%` }]} />
                  </View>
                </View>
              ))}
            </View>
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
  section: {
    padding: 16,
    paddingBottom: 80,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
    fontFamily: 'Poppins-Bold',
  },
  sectionDescription: {
    color: '#A259FF',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  matchupCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  matchupSectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  teamColumn: {
    flex: 2,
    alignItems: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  gameDate: {
    color: '#A259FF',
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'Poppins-Medium',
  },
  gameTime: {
    color: '#EAEAEA',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  rightAlign: {
    textAlign: 'center',
  },
  statSection: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statSectionTitle: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  leftStatValue: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
    width: 80,
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
  },
  rightStatValue: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
    width: 80,
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
  },
  statLabel: {
    color: '#EAEAEA',
    fontSize: 12,
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 8,
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
  injuriesContainer: {
    gap: 12,
  },
  injuryItem: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  injuryPlayer: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
  },
  injuryStatus: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  trendsContainer: {
    gap: 16,
  },
  trendItem: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  trendGame: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  trendPercentage: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  trendPick: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  trendBar: {
    height: 6,
    backgroundColor: '#2E2E3A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  injuryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusOut: {
    backgroundColor: '#EF4444',
  },
  statusQuestionable: {
    backgroundColor: '#F59E0B',
  },
  statusProbable: {
    backgroundColor: '#10B981',
  },
  statusDayToDay: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  injuryType: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  injuryImpact: {
    color: '#EAEAEA',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: 'Poppins-Regular',
  },
  trendConsensus: {
    marginTop: 4,
    marginBottom: 8,
  },
  consensusText: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  playersContainer: {
    gap: 12,
  },
  playerCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  playerTeam: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  positionBadge: {
    backgroundColor: '#3D246C',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  positionText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3D246C',
    borderRadius: 6,
    padding: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  statLabel: {
    color: '#A259FF',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
});