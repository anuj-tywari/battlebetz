import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Trophy, ChevronDown, ArrowLeft } from 'lucide-react-native';

type TournamentRankingsProps = {
  onBack?: () => void;
  expanded?: boolean;
};

export default function TournamentRankings({ onBack, expanded = false }: TournamentRankingsProps) {
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
    <View style={[styles.container, expanded && styles.expandedContainer]}>
      <TouchableOpacity 
        style={styles.header}
        onPress={toggleCollapse}
      >
        {expanded && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <ArrowLeft size={20} color="#EAEAEA" />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.title}>Tournament Rankings</Text>
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
          <Text style={styles.zeroStateTitle}>Rankings Not Available</Text>
          <Text style={styles.zeroStateText}>Rankings start Mar 27</Text>
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
  expandedContainer: {
    flex: 1,
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  backButton: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
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