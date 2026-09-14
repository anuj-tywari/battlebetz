import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Clock } from 'lucide-react-native';

type CountdownBarProps = {
  targetDate: Date;
  title: string;
};

export default function CountdownBar({ targetDate, title }: CountdownBarProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const progressAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      const totalDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      const progress = 1 - (difference / totalDuration);

      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Clock size={16} color="#F59E0B" />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.timeContainer}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{timeLeft.days}</Text>
            <Text style={styles.timeLabel}>days</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{timeLeft.hours.toString().padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>hours</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{timeLeft.minutes.toString().padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>mins</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{timeLeft.seconds.toString().padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>secs</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground} />
          <Animated.View 
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timeBlock: {
    alignItems: 'center',
    minWidth: 50,
  },
  timeValue: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  timeLabel: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  timeSeparator: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginTop: -8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#4A4A4A',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A4A4A',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },
});