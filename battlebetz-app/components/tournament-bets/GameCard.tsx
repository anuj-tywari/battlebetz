import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Clock, Trophy } from 'lucide-react-native';
import { Game } from '@/hooks/useGameData';
import { BetType, TeamType } from '@/types/betting';
import OddsButton from './OddsButton';

interface GameCardProps {
  game: Game;
  onOddsSelect: (matchId: string, team: TeamType, betType: BetType, oddsDisplay: string, subName?: string) => void;
  isBetActive: (matchId: string, team: TeamType, betType: BetType) => boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onOddsSelect, isBetActive }) => {
  // Extract seeds from team names if available
  const team1Seed = game.teams.team1.name.match(/\((\d+)\)/) 
    ? game.teams.team1.name.match(/\((\d+)\)/)[1] 
    : '';
  const team2Seed = game.teams.team2.name.match(/\((\d+)\)/) 
    ? game.teams.team2.name.match(/\((\d+)\)/)[1] 
    : '';
  
  const team1Name = game.teams.team1.name.replace(/\(\d+\)\s*/, '');
  const team2Name = game.teams.team2.name.replace(/\(\d+\)\s*/, '');

  return (
    <View style={[styles.gameCard, game.featured && styles.featuredCard]}>
      {/* Game Status Header */}
      <View style={styles.gameHeader}>
        <View style={styles.timeContainer}>
          <Clock size={12} color="#EAEAEA" />
          <Text style={styles.timeText}>{game.time}</Text>
        </View>
        
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
            {team1Seed ? (
              <View style={styles.seedBadge}>
                <Text style={styles.seedText}>{team1Seed}</Text>
              </View>
            ) : (
              <Image source={{ uri: game.teams.team1.image }} style={styles.teamLogo} />
            )}
            <Text style={styles.teamName} numberOfLines={1}>{team1Name}</Text>
          </View>
          
          <View style={styles.oddsRow}>
            <OddsButton
              matchId={game.id}
              team="team1"
              betType="spread"
              oddsDisplay={game.team1Odds.spread}
              isNegative={parseInt(game.team1Odds.spread) < 0}
              isSelected={isBetActive(game.id, 'team1', 'spread')}
              onSelect={onOddsSelect}
            />
            <OddsButton
              matchId={game.id}
              team="team1"
              betType="moneyline"
              oddsDisplay={game.team1Odds.moneyline}
              isNegative={game.team1Odds.moneylineOdds < 0}
              isSelected={isBetActive(game.id, 'team1', 'moneyline')}
              onSelect={onOddsSelect}
            />
            <OddsButton
              matchId={game.id}
              team="team1"
              betType="total"
              oddsDisplay={`O ${game.team1Odds.total.split(' ').length > 1 ? game.team1Odds.total.split(' ')[1] : '220'}`}
              isSelected={isBetActive(game.id, 'team1', 'total')}
              onSelect={(matchId, team, betType, oddsDisplay) => 
                onOddsSelect(matchId, team, betType, oddsDisplay, 'Over')
              }
            />
          </View>
        </View>
        
        {/* Team 2 Row */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            {team2Seed ? (
              <View style={styles.seedBadge}>
                <Text style={styles.seedText}>{team2Seed}</Text>
              </View>
            ) : (
              <Image source={{ uri: game.teams.team2.image }} style={styles.teamLogo} />
            )}
            <Text style={styles.teamName} numberOfLines={1}>{team2Name}</Text>
          </View>
          
          <View style={styles.oddsRow}>
            <OddsButton
              matchId={game.id}
              team="team2"
              betType="spread"
              oddsDisplay={game.team2Odds.spread}
              isNegative={parseInt(game.team2Odds.spread) < 0}
              isSelected={isBetActive(game.id, 'team2', 'spread')}
              onSelect={onOddsSelect}
            />
            <OddsButton
              matchId={game.id}
              team="team2"
              betType="moneyline"
              oddsDisplay={game.team2Odds.moneyline}
              isNegative={game.team2Odds.moneylineOdds < 0}
              isSelected={isBetActive(game.id, 'team2', 'moneyline')}
              onSelect={onOddsSelect}
            />
            <OddsButton
              matchId={game.id}
              team="team2"
              betType="total"
              oddsDisplay={`U ${game.team2Odds.total.split(' ').length > 1 ? game.team2Odds.total.split(' ')[1] : '220'}`}
              isSelected={isBetActive(game.id, 'team2', 'total')}
              onSelect={(matchId, team, betType, oddsDisplay) => 
                onOddsSelect(matchId, team, betType, oddsDisplay, 'Under')
              }
            />
          </View>
        </View>
        
        {/* Odds Labels */}
        <View style={styles.oddsLabels}>
          <Text style={styles.oddsLabel}>Spread</Text>
          <Text style={styles.oddsLabel}>ML</Text>
          <Text style={styles.oddsLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameCard: {
    backgroundColor: '#3A3A47',
    borderRadius: 8,
    padding: 12,
    width: '48.5%', // Two columns with small gap
    marginBottom: 12,
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
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
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
  seedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A259FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  oddsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
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
    width: 72,
    textAlign: 'center',
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

export default GameCard;