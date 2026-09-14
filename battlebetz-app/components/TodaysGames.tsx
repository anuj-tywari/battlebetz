import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Trophy, Clock, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useGamesData } from '../hooks/useGameData';

export default function TodaysGames() {
  const [expanded, setExpanded] = useState(false);
  const { games, loading, error } = useGamesData();
   // Show a loading state if data is still loading
   if (loading) {
    return <View style={styles.container}>
      <Text style={styles.title}>Loading games...</Text>
    </View>;
  }

  console.log(games)

  // Show an error message if there was an error
  if (error) {
    return <View style={styles.container}>
      <Text style={styles.title}>Error loading games: {error}</Text>
    </View>;
  }

  // No games available
  if (games.length === 0) {
    return <View style={styles.container}>
      <Text style={styles.title}>No games scheduled for today</Text>
    </View>;
  }

  const displayedGames = expanded ? games : games.slice(0, 8);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Games</Text>
      </View>

      <View style={styles.gamesContainer}>
        {displayedGames.map((game) => (
          <View key={game.id} style={[styles.gameCard, game.featured && styles.featuredCard]}>
            {/* Game Status Header */}
            <View style={styles.gameHeader}>
              {game.status === 'UPCOMING' ? (
                <View style={styles.timeContainer}>
                  <Clock size={12} color="#EAEAEA" />
                  <Text style={styles.timeText}>{game.time}</Text>
                </View>
              ) : (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{game.status}</Text>
                </View>
              )}
              
              {game.featured && (
                <View style={styles.featuredBadge}>
                  <Trophy size={10} color="white" />
                  <Text style={styles.featuredText}>Featured</Text>
                </View>
              )}
            </View>

            {/* Content Area */}
            <View style={styles.gameContent}>
              {/* Team 1 Row */}
              <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                  <Image source={{ uri: game.teams.team1.image }} style={styles.teamLogo} />
                  <Text style={styles.teamName} numberOfLines={1}>{game.teams.team1.name}</Text>
                </View>
                
                <View style={styles.oddsRow}>
                  <View style={styles.oddsItem}>
                    <Text style={[styles.oddsValue, parseInt(game.team1Odds.spread) < 0 ? styles.negativeOdds : styles.positiveOdds]}>
                      {game.team1Odds.spread}
                    </Text>
                  </View>
                  <View style={styles.oddsItem}>
                    <Text style={styles.oddsValue}>O {game.team1Odds.total.split(' ')[1]}</Text>
                  </View>
                  <View style={styles.oddsItem}>
                    <Text style={[styles.oddsValue, parseInt(game.team1Odds.moneyline) < 0 ? styles.negativeOdds : styles.positiveOdds]}>
                      {game.team1Odds.moneyline}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Team 2 Row */}
              <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                  <Image source={{ uri: game.teams.team2.image }} style={styles.teamLogo} />
                  <Text style={styles.teamName} numberOfLines={1}>{game.teams.team2.name}</Text>
                </View>
                
                <View style={styles.oddsRow}>
                  <View style={styles.oddsItem}>
                    <Text style={[styles.oddsValue, parseInt(game.team2Odds.spread) > 0 ? styles.negativeOdds : styles.positiveOdds]}>
                      {game.team2Odds.spread}
                    </Text>
                  </View>
                  <View style={styles.oddsItem}>
                    <Text style={styles.oddsValue}>U {game.team2Odds.total.split(' ')[1]}</Text>
                  </View>
                  <View style={styles.oddsItem}>
                    <Text style={[styles.oddsValue, parseInt(game.team2Odds.moneyline) > 0 ? styles.negativeOdds : styles.positiveOdds]}>
                      {game.team2Odds.moneyline}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Odds Labels */}
              <View style={styles.oddsLabels}>
                <Text style={styles.oddsLabel}>Spread</Text>
                <Text style={styles.oddsLabel}>Total</Text>
                <Text style={styles.oddsLabel}>ML</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {games.length > 8 && (
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.expandButtonText}>
            {expanded ? 'Show Less' : 'Show More Games'}
          </Text>
          {expanded ? (
            <ChevronUp size={20} color="#A259FF" />
          ) : (
            <ChevronDown size={20} color="#A259FF" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    backgroundColor: '#3A3A47',
    borderRadius: 8,
    padding: 10,
    width: '32.5%',
    marginBottom: 8,
  },
  featuredCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#A259FF',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#6B7280',
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(162, 89, 255, 0.8)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  gameContent: {
    gap: 12,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    flex: 1,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  score: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
  },
  scoreHighlight: {
    color: '#10B981',
  },
  oddsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  oddsItem: {
    width: 45,
    alignItems: 'center',
  },
  oddsValue: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  positiveOdds: {
    color: '#10B981', // green
  },
  negativeOdds: {
    color: '#EF4444', // red
  },
  emptyScore: {
    width: 24,
    marginLeft: 8,
  },
  oddsLabels: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  oddsLabel: {
    width: 45,
    textAlign: 'center',
    color: '#A259FF',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A259FF',
    width: '100%',
  },
  expandButtonText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});