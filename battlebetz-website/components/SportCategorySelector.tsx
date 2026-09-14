import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export type League = 'all' | 'march-madness' | 'ipl' | 'nba' | 'nhl';

type SportCategorySelectorProps = {
  onLeagueSelect: (league: League) => void;
  selectedLeague: League;
};

export default function SportCategorySelector({ onLeagueSelect, selectedLeague }: SportCategorySelectorProps) {
  const leagues = [
    { 
      id: 'all', 
      name: 'All\nLeagues', 
      icon: '🎯',
      color: '#A259FF'
    },
    { 
      id: 'march-madness', 
      name: 'March\nMadness', 
      icon: '🏀',
      color: '#FF6B6B'
    },
    { 
      id: 'ipl', 
      name: 'IPL\nLeague', 
      icon: '🏏',
      color: '#4CAF50'
    },
    { 
      id: 'nba', 
      name: 'NBA\nLeague', 
      icon: '🏀',
      color: '#E03A3E'
    },
    { 
      id: 'nhl', 
      name: 'NHL\nLeague', 
      icon: '🏒',
      color: '#00205B'
    }
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {leagues.map((league) => (
        <TouchableOpacity 
          key={league.id} 
          style={[
            styles.category,
            { backgroundColor: selectedLeague === league.id ? `${league.color}20` : 'transparent' }
          ]}
          onPress={() => onLeagueSelect(league.id as League)}
        >
          <View style={[
            styles.iconContainer, 
            { 
              backgroundColor: selectedLeague === league.id ? `${league.color}30` : 'rgba(74, 74, 74, 0.5)',
              borderWidth: selectedLeague === league.id ? 2 : 0,
              borderColor: league.color
            }
          ]}>
            <Text style={[
              styles.sportEmoji, 
              { color: selectedLeague === league.id ? league.color : 'rgba(234, 234, 234, 0.6)' }
            ]}>
              {league.icon}
            </Text>
          </View>
          <Text
            style={[
              styles.categoryText,
              { color: selectedLeague === league.id ? league.color : 'rgba(234, 234, 234, 0.6)' },
            ]}
            numberOfLines={2}
            textAlign="center"
          >
            {league.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8, // Reduced from 12
    paddingBottom: 8,
    marginBottom: 16,
  },
  category: {
    alignItems: 'center',
    gap: 4,
    minWidth: 65, // Reduced from 80
    padding: 6, // Reduced from 8
    borderRadius: 8,
  },
  iconContainer: {
    width: 40, // Reduced from 44
    height: 40, // Reduced from 44
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportEmoji: {
    fontSize: 20, // Reduced from 24
  },
  categoryText: {
    fontSize: 11, // Reduced from 12
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    lineHeight: 14, // Added for better text spacing
  },
});