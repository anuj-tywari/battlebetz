import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type Sport = 'all' | 'NCAA' | 'IPL' | 'NBA' | 'NHL';

type SportFiltersProps = {
  selectedSport: Sport;
  onSelectSport: (sport: Sport) => void;
};

export default function SportFilters({ selectedSport, onSelectSport }: SportFiltersProps) {
  const sports: Sport[] = ['all', 'NCAA', 'IPL', 'NBA', 'NHL'];

  return (
    <View style={styles.container}>
      {sports.map((sport) => (
        <TouchableOpacity
          key={sport}
          style={[
            styles.filterButton,
            selectedSport === sport && styles.filterButtonActive
          ]}
          onPress={() => onSelectSport(sport)}
        >
          <Text style={[
            styles.filterText,
            selectedSport === sport && styles.filterTextActive
          ]}>
            {sport === 'all' ? 'All' : sport}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#2E2E3A',
  },
  filterButtonActive: {
    backgroundColor: '#A259FF',
  },
  filterText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  filterTextActive: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
});