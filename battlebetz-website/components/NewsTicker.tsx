import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

type TickerItem = {
  id: string;
  sport: string;
  icon: string;
  team1: string;
  team2: string;
  score1?: string;
  score2?: string;
  status?: string;
  odds?: {
    spread: string;
    moneyline: string;
  };
};

const tickerItems: TickerItem[] = [
  {
    id: '1',
    sport: 'NCAA',
    icon: '🏀',
    team1: '(1) Houston',
    team2: '(16) Longwood',
    status: 'LIVE',
    score1: '45',
    score2: '32',
    odds: { spread: '-21.5', moneyline: '-3000' }
  },
  {
    id: '2',
    sport: 'NCAA',
    icon: '🏀',
    team1: '(8) Nebraska',
    team2: '(9) Texas A&M',
    status: 'FINAL',
    score1: '78',
    score2: '72',
    odds: { spread: '+1.5', moneyline: '-110' }
  },
  {
    id: '3',
    sport: 'NCAA',
    icon: '🏀',
    team1: '(5) San Diego St',
    team2: '(12) UAB',
    status: 'UPCOMING',
    odds: { spread: '-4.5', moneyline: '-175' }
  },
  {
    id: '4',
    sport: 'NCAA',
    icon: '🏀',
    team1: '(4) Auburn',
    team2: '(13) Yale',
    status: 'LIVE',
    score1: '56',
    score2: '48',
    odds: { spread: '-9.5', moneyline: '-450' }
  },
  {
    id: '5',
    sport: 'NCAA',
    icon: '🏀',
    team1: '(6) Clemson',
    team2: '(11) New Mexico',
    status: 'UPCOMING',
    odds: { spread: '-2.5', moneyline: '-130' }
  },
  {
    id: '6',
    sport: 'NCAA',
    icon: '🏀',
    team1: '(3) Creighton',
    team2: '(14) Akron',
    status: 'UPCOMING',
    odds: { spread: '-13.5', moneyline: '-900' }
  },
  {
    id: '7',
    sport: 'NCAA',
    icon: '🏀',
    team1: '(7) Texas',
    team2: '(10) Colorado St',
    status: 'UPCOMING',
    odds: { spread: '-3.5', moneyline: '-165' }
  }
];

const { width } = Dimensions.get('window');
const SCROLL_SPEED = 30; // Lower number = faster scroll

export default function NewsTicker() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = React.useState(0);

  useEffect(() => {
    if (contentWidth > 0) {
      startScrollAnimation();
    }
  }, [contentWidth]);

  const startScrollAnimation = () => {
    // Reset to start position
    scrollX.setValue(0);

    // Create the scrolling animation
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -contentWidth,
        duration: contentWidth * SCROLL_SPEED,
        useNativeDriver: true,
        isInteraction: false,
      })
    ).start();
  };

  const renderItem = (item: TickerItem, index: number) => (
    <View key={`${item.id}-${index}`} style={styles.tickerItem}>
      <View style={styles.sportBadge}>
        <Text style={styles.sportIcon}>{item.icon}</Text>
        <Text style={styles.sportText}>{item.sport}</Text>
      </View>
      
      <View style={styles.matchupContainer}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{item.team1}</Text>
          {item.score1 && <Text style={styles.scoreText}>{item.score1}</Text>}
        </View>
        <Text style={styles.vsText}>vs</Text>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{item.team2}</Text>
          {item.score2 && <Text style={styles.scoreText}>{item.score2}</Text>}
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusText,
          item.status === 'LIVE' && styles.liveStatus,
          item.status === 'FINAL' && styles.finalStatus,
          item.status === 'UPCOMING' && styles.upcomingStatus
        ]}>
          {item.status}
        </Text>
        {item.odds && (
          <View style={styles.oddsContainer}>
            <Text style={styles.oddsText}>
              {item.odds.spread} ({item.odds.moneyline})
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // Create three sets of items for seamless looping
  const allItems = [...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => 
    renderItem(item, index)
  );

  return (
    <View style={styles.ticker}>
      <Animated.View
        style={[
          styles.tickerContent,
          { transform: [{ translateX: scrollX }] }
        ]}
        onLayout={(event) => {
          setContentWidth(event.nativeEvent.layout.width / 3);
        }}
      >
        {allItems}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ticker: {
    backgroundColor: '#1A1A1D',
    paddingVertical: 12,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  tickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 32,
    backgroundColor: '#2E2E3A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3D246C',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  sportIcon: {
    fontSize: 14,
  },
  sportText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  matchupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  scoreText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  vsText: {
    color: '#A259FF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    fontFamily: 'Poppins-SemiBold',
  },
  liveStatus: {
    backgroundColor: '#EF4444',
    color: 'white',
  },
  finalStatus: {
    backgroundColor: '#6B7280',
    color: 'white',
  },
  upcomingStatus: {
    backgroundColor: '#10B981',
    color: 'white',
  },
  oddsContainer: {
    marginTop: 4,
  },
  oddsText: {
    color: '#A259FF',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
});