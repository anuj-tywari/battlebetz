import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Trophy, Clock } from 'lucide-react-native';

// Updated mock data for NCAA teams
const teams = [
  {
    id: '1',
    name: '(1) Duke',
    logo: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
    odds: {
      moneyline: +240
    },
    rank: 1
  },
  {
    id: '2',
    name: '(1) Florida',
    logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
    odds: {
      moneyline: +390
    },
    rank: 2
  },
  {
    id: '3',
    name: '(1) Houston',
    logo: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop',
    odds: {
      moneyline: +550,
      spread: -2.5,
      total: 147.5
    },
    rank: 3
  },
  {
    id: '4',
    name: '(1) Auburn',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +550
    },
    rank: 4
  },
  {
    id: '5',
    name: '(2) Alabama',
    logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
    odds: {
      moneyline: +1400
    },
    rank: 5
  },
  {
    id: '6',
    name: '(2) Tennessee',
    logo: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
    odds: {
      moneyline: +1500
    },
    rank: 6
  },
  {
    id: '7',
    name: '(3) Texas Tech',
    logo: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop',
    odds: {
      moneyline: +1900
    },
    rank: 7
  },
  {
    id: '8',
    name: '(2) Michigan State',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +2200
    },
    rank: 8
  },
  {
    id: '9',
    name: '(4) Maryland',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +3100
    },
    rank: 9
  },
  {
    id: '10',
    name: '(4) Arizona',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +4200
    },
    rank: 10
  },
  {
    id: '11',
    name: '(3) Kentucky',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +5500
    },
    rank: 11
  },
  {
    id: '12',
    name: '(4) Purdue',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +6500
    },
    rank: 12
  },
  {
    id: '13',
    name: '(5) Michigan',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +7000
    },
    rank: 13
  },
  {
    id: '14',
    name: '(6) BYU',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +8500
    },
    rank: 14
  },
  {
    id: '15',
    name: '(6) Ole Miss',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +9000
    },
    rank: 15
  },
  {
    id: '16',
    name: '(10) Arkansas',
    logo: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
    odds: {
      moneyline: +11000
    },
    rank: 16
  }
];

export default function Sweet16Odds() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.title}>Sweet 16 Odds</Text>
        </View>
        <View style={styles.timeContainer}>
          <Clock size={14} color="#A259FF" />
          <Text style={styles.timeText}>Games start Mar 27</Text>
        </View>
      </View>

      <View style={styles.teamsContainer}>
        {teams.map((team, index) => (
          <View key={team.id} style={styles.teamCard}>
            <View style={styles.teamInfo}>
              <Text style={styles.rank}>#{team.rank}</Text>
              <Image source={{ uri: team.logo }} style={styles.teamLogo} />
              <Text style={styles.teamName}>{team.name}</Text>
            </View>

            <View style={styles.oddsContainer}>
              <View style={styles.oddsItem}>
                <Text style={styles.oddsLabel}>Champions</Text>
                <Text style={[
                  styles.oddsValue,
                  team.odds.moneyline > 0 ? styles.positiveOdds : styles.negativeOdds
                ]}>
                  {team.odds.moneyline > 0 ? '+' : ''}{team.odds.moneyline}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
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
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  teamsContainer: {
    gap: 8,
  },
  teamCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rank: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    width: 32,
    fontFamily: 'Poppins-SemiBold',
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    fontFamily: 'Poppins-Medium',
  },
  oddsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  oddsItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  oddsLabel: {
    color: '#A259FF',
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  oddsValue: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  positiveOdds: {
    color: '#10B981',
  },
  negativeOdds: {
    color: '#EF4444',
  },
});