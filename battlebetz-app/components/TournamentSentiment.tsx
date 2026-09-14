import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

type TeamTrend = {
  id: string;
  name: string;
  hourlyData: number[];
  odds: {
    low: number;
    current: number;
    high: number;
  };
  trend: 'up' | 'down';
  percentageChange: number;
};

const trendingTeams: TeamTrend[] = [
  {
    id: '1',
    name: 'Houston',
    hourlyData: [250, 255, 260, 265, 270, 280, 285, 290, 295, 300, 310, 320],
    odds: {
      low: 250,
      current: 320,
      high: 320
    },
    trend: 'up',
    percentageChange: 28
  },
  {
    id: '2',
    name: 'Purdue',
    hourlyData: [300, 295, 290, 285, 280, 275, 270, 265, 260, 255, 250, 245],
    odds: {
      low: 245,
      current: 245,
      high: 300
    },
    trend: 'down',
    percentageChange: -18.3
  },
  {
    id: '3',
    name: 'UConn',
    hourlyData: [400, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460],
    odds: {
      low: 400,
      current: 460,
      high: 460
    },
    trend: 'up',
    percentageChange: 15
  },
  {
    id: '4',
    name: 'Tennessee',
    hourlyData: [600, 590, 580, 570, 560, 550, 540, 530, 520, 510, 500, 490],
    odds: {
      low: 490,
      current: 490,
      high: 600
    },
    trend: 'down',
    percentageChange: -18.3
  },
  {
    id: '5',
    name: 'Arizona',
    hourlyData: [500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610],
    odds: {
      low: 500,
      current: 610,
      high: 610
    },
    trend: 'up',
    percentageChange: 22
  }
];

export default function TournamentSentiment() {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  const toggleExpand = (teamId: string) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const renderTrendIcon = (trend: 'up' | 'down', size = 16) => {
    if (trend === 'up') {
      return <TrendingUp size={size} color="#10B981" />;
    }
    return <TrendingDown size={size} color="#EF4444" />;
  };

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  const renderChart = (team: TeamTrend) => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webChartContainer}>
          <View style={styles.webChartLine}>
            {team.hourlyData.map((value, index) => (
              <View 
                key={index}
                style={[
                  styles.webChartPoint,
                  { 
                    height: `${(value / Math.max(...team.hourlyData)) * 100}%`,
                    backgroundColor: team.trend === 'up' ? '#10B981' : '#EF4444'
                  }
                ]}
              />
            ))}
          </View>
          <View style={styles.webChartLabels}>
            {['12h', '10h', '8h', '6h', '4h', '2h', 'Now'].map((label, index) => (
              <Text key={index} style={styles.webChartLabel}>{label}</Text>
            ))}
          </View>
        </View>
      );
    }

    return (
      <LineChart
        data={{
          labels: ['12h', '10h', '8h', '6h', '4h', '2h', 'Now'],
          datasets: [{
            data: team.hourlyData
          }]
        }}
        width={280}
        height={180}
        chartConfig={{
          backgroundColor: '#2E2E3A',
          backgroundGradientFrom: '#2E2E3A',
          backgroundGradientTo: '#2E2E3A',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(162, 89, 255, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        bezier
        style={styles.chart}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Public Sentiment - Biggest Volatility</Text>
        <Text style={styles.subtitle}>12-hour movement</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.teamsContainer}
      >
        {trendingTeams.map((team) => (
          <View key={team.id} style={styles.teamCard}>
            <TouchableOpacity 
              style={styles.teamHeader}
              onPress={() => toggleExpand(team.id)}
            >
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{team.name}</Text>
                <View style={styles.trendContainer}>
                  {renderTrendIcon(team.trend)}
                  <Text style={[
                    styles.percentageChange,
                    team.trend === 'up' ? styles.positiveChange : styles.negativeChange
                  ]}>
                    {team.trend === 'up' ? '+' : ''}{team.percentageChange}%
                  </Text>
                </View>
              </View>

              <View style={styles.oddsContainer}>
                <View style={styles.oddsColumn}>
                  <Text style={styles.oddsLabel}>Lo</Text>
                  <Text style={styles.oddsValue}>{formatOdds(team.odds.low)}</Text>
                </View>
                <View style={[styles.oddsColumn, styles.currentOdds]}>
                  <Text style={styles.oddsLabel}>Current</Text>
                  <Text style={[styles.oddsValue, styles.currentOddsValue]}>
                    {formatOdds(team.odds.current)}
                  </Text>
                </View>
                <View style={styles.oddsColumn}>
                  <Text style={styles.oddsLabel}>Hi</Text>
                  <Text style={styles.oddsValue}>{formatOdds(team.odds.high)}</Text>
                </View>
              </View>

              {expandedTeam === team.id ? (
                <ChevronUp size={20} color="#A259FF" />
              ) : (
                <ChevronDown size={20} color="#A259FF" />
              )}
            </TouchableOpacity>

            {expandedTeam === team.id && (
              <View style={styles.chartContainer}>
                {renderChart(team)}
                <Text style={styles.chartLabel}>Hourly Trend</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  webChartContainer: {
    width: 280,
    height: 180,
    padding: 16,
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
  },
  webChartLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  webChartPoint: {
    width: 4,
    minHeight: 4,
    borderRadius: 2,
  },
  webChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  webChartLabel: {
    color: '#A259FF',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    transform: [{ rotate: '-45deg' }],
  },
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  subtitle: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  teamsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 12,
  },
  teamCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    overflow: 'hidden',
    width: 300,
  },
  teamHeader: {
    padding: 12,
    flexDirection: 'column',
    gap: 12,
  },
  teamInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  percentageChange: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  oddsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 8,
  },
  oddsColumn: {
    alignItems: 'center',
    flex: 1,
  },
  currentOdds: {
    backgroundColor: '#3D246C',
    paddingVertical: 4,
    borderRadius: 4,
  },
  oddsLabel: {
    color: '#A259FF',
    fontSize: 10,
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  oddsValue: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  currentOddsValue: {
    color: '#EAEAEA',
    fontFamily: 'Poppins-SemiBold',
  },
  chartContainer: {
    padding: 12,
    backgroundColor: '#2E2E3A',
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  chartLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});