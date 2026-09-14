import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TriangleAlert as AlertTriangle, ChevronDown } from 'lucide-react-native';

type Upset = {
  id: string;
  match: string;
  winner: string;
  loser: string;
  odds: number;
  line: number;
  amount: number;
  date: string;
};

const upsets: Upset[] = [
  {
    id: '1',
    match: '(16) Fairleigh Dickinson vs (1) Purdue',
    winner: 'Fairleigh Dickinson',
    loser: 'Purdue',
    odds: +2300,
    line: 23.5,
    amount: 1500,
    date: 'Mar 17'
  },
  {
    id: '2',
    match: "(15) Saint Peter's vs (2) Kentucky",
    winner: "Saint Peter's",
    loser: 'Kentucky',
    odds: +1800,
    line: 18.5,
    amount: 2000,
    date: 'Mar 17'
  },
  {
    id: '3',
    match: '(13) Furman vs (4) Virginia',
    winner: 'Furman',
    loser: 'Virginia',
    odds: +750,
    line: 12.5,
    amount: 1200,
    date: 'Mar 16'
  }
];

type Filter = 'all' | 'odds' | 'line';

export default function TopUpsets() {
  const [filter, setFilter] = useState<Filter>('all');
  const [showAll, setShowAll] = useState(false);

  const sortedUpsets = [...upsets].sort((a, b) => {
    if (filter === 'odds') return b.odds - a.odds;
    if (filter === 'line') return b.line - a.line;
    return b.odds - a.odds;
  });

  const displayedUpsets = showAll ? sortedUpsets : sortedUpsets.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AlertTriangle size={16} color="#EF4444" />
          <Text style={styles.title}>Top Upsets</Text>
        </View>

        <View style={styles.filters}>
          {['all', 'odds', 'line'].map((f) => (
            <TouchableOpacity 
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f as Filter)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.upsetsList}>
        {displayedUpsets.map((upset, index) => (
          <View key={upset.id} style={styles.upsetCard}>
            {/* Row 1: Match and Date */}
            <View style={styles.row}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <Text style={styles.matchText} numberOfLines={1}>{upset.match}</Text>
              <Text style={styles.dateText}>{upset.date}</Text>
            </View>

            {/* Row 2: Winner and Odds */}
            <View style={styles.row}>
              <Text style={styles.winnerText}>{upset.winner}</Text>
              <Text style={styles.oddsText}>+{upset.odds}</Text>
            </View>

            {/* Row 3: Line and Amount */}
            <View style={styles.row}>
              <Text style={styles.lineText}>Line: +{upset.line}</Text>
              <Text style={styles.amountText}>${upset.amount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {upsets.length > 3 && (
        <TouchableOpacity 
          style={styles.showMoreButton}
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={styles.showMoreText}>
            {showAll ? 'Show Less' : 'Show More'}
          </Text>
          <ChevronDown 
            size={14} 
            color="#A259FF" 
            style={{ transform: [{ rotate: showAll ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    flex: 1,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  filters: {
    flexDirection: 'row',
    gap: 6,
  },
  filterButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#4A4A4A',
  },
  filterButtonActive: {
    backgroundColor: '#A259FF',
  },
  filterText: {
    color: '#EAEAEA',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  filterTextActive: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  upsetsList: {
    flex: 1,
  },
  upsetCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankBadge: {
    backgroundColor: '#3D246C',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#A259FF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  matchText: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  dateText: {
    color: '#A259FF',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  winnerText: {
    flex: 1,
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  oddsText: {
    color: '#EF4444',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  lineText: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  amountText: {
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    marginTop: 6,
  },
  showMoreText: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});