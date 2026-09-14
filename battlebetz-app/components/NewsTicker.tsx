import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const SCROLL_SPEED = 30;

const tickerItems = [
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
  }
];

export default function NewsTicker() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = React.useState(0);

  useEffect(() => {
    if (contentWidth > 0) {
      startScrollAnimation();
    }
  }, [contentWidth]);

  const startScrollAnimation = () => {
    scrollX.setValue(0);

    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -contentWidth,
        duration: contentWidth * SCROLL_SPEED,
        useNativeDriver: true,
        isInteraction: false,
      })
    ).start();
  };

  const renderItem = (item, instanceIndex, itemIndex) => (
    <View key={`${item.id}-${instanceIndex}-${itemIndex}`} style={styles.tickerItem}>
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

  const allItems = [0, 1, 2].map((instanceIndex) => 
    tickerItems.map((item, itemIndex) => 
      renderItem(item, instanceIndex, itemIndex)
    )
  ).flat();

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
    backgroundColor: '#2E2E3A',
    height: 32,
    overflow: 'hidden',
    borderRadius: 16,
  },
  tickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 24,
    paddingHorizontal: 8,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3D246C',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  sportIcon: {
    fontSize: 12,
  },
  sportText: {
    color: '#EAEAEA',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  matchupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  scoreText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  vsText: {
    color: '#A259FF',
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
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
    marginTop: 2,
  },
  oddsText: {
    color: '#A259FF',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
});