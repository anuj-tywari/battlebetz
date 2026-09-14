import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';

type Score = {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
};

type ScoreTickerProps = {
  scores: Score[];
};

const { width } = Dimensions.get('window');
const DISPLAY_DURATION = 3000; // 3 seconds per score
const TRANSITION_DURATION = 500; // 500ms transition

export default function ScoreTicker({ scores }: ScoreTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Handle empty scores array
    if (!scores || scores.length === 0) {
      return;
    }

    // Reset animation when scores change
    resetAnimation();

    // Start the animation loop
    startAnimationLoop();

    // Cleanup on unmount
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
      if (visibilityRef.current) clearTimeout(visibilityRef.current);
    };
  }, [scores]);

  // Handle visibility changes (window blur/focus)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          pauseAnimation();
        } else {
          resumeAnimation();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  const resetAnimation = () => {
    translateX.setValue(0);
    opacity.setValue(1);
    setCurrentIndex(0);
  };

  const startAnimationLoop = () => {
    if (scores.length <= 1) return;

    const animate = () => {
      // Fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: TRANSITION_DURATION / 2,
        useNativeDriver: true,
      }).start(() => {
        // Update index
        setCurrentIndex((prevIndex) => (prevIndex + 1) % scores.length);
        
        // Reset position
        translateX.setValue(-width);

        // Fade in and slide
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: TRANSITION_DURATION / 2,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: TRANSITION_DURATION,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Schedule next animation
      animationRef.current = setTimeout(animate, DISPLAY_DURATION);
    };

    // Start the loop
    animationRef.current = setTimeout(animate, DISPLAY_DURATION);
  };

  const pauseAnimation = () => {
    if (animationRef.current) clearTimeout(animationRef.current);
    if (visibilityRef.current) clearTimeout(visibilityRef.current);
    setIsVisible(false);
  };

  const resumeAnimation = () => {
    setIsVisible(true);
    startAnimationLoop();
  };

  if (!scores || scores.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No scores available</Text>
      </View>
    );
  }

  const currentScore = scores[currentIndex];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.scoreContainer,
          {
            transform: [{ translateX }],
            opacity,
          },
        ]}
      >
        <View style={styles.scoreContent}>
          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{currentScore.team1}</Text>
            <Text style={styles.score}>{currentScore.score1}</Text>
          </View>
          
          <View style={styles.divider}>
            <Text style={styles.dividerText}>-</Text>
          </View>
          
          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{currentScore.team2}</Text>
            <Text style={styles.score}>{currentScore.score2}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: '#2E2E3A',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scoreContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 16,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  score: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  divider: {
    paddingHorizontal: 12,
  },
  dividerText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
});