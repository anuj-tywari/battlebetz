import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Trophy, ChevronDown } from 'lucide-react-native';

export default function TournamentStats() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [animation] = useState(new Animated.Value(1));

  const toggleCollapse = () => {
    const toValue = isCollapsed ? 1 : 0;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      bounciness: 0,
    }).start();
    setIsCollapsed(!isCollapsed);
  };

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120], // Reduced height for more compact display
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={toggleCollapse}
      >
        <View style={styles.headerLeft}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.title}>Tournament Stats</Text>
        </View>
        <Animated.View style={{
          transform: [{
            rotate: animation.interpolate({
              inputRange: [0, 1],
              outputRange: ['-180deg', '0deg']
            })
          }]
        }}>
          <ChevronDown size={20} color="#A259FF" />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[
        styles.content,
        {
          height: contentHeight,
          opacity: animation
        }
      ]}>
        <View style={styles.zeroState}>
          <Trophy size={24} color="#A259FF" />
          <Text style={styles.zeroStateTitle}>Tournament Not Started</Text>
          <Text style={styles.zeroStateText}>Stats available Mar 27</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  content: {
    overflow: 'hidden',
  },
  zeroState: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  zeroStateTitle: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  zeroStateText: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});