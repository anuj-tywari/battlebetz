import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Trophy, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const TARGET_DATE = new Date('2025-03-22T00:00:00-04:00');

export default function SweetSixteenCountdown() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallMobile = width < 480;
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = TARGET_DATE.getTime() - now.getTime();
      
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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextColumn}>
              <Text style={[styles.headerText, 
              isMobile && styles.headerTextMobile,
              isSmallMobile && styles.headerTextSmallMobile]}>
                Join the waiting list for the world's first Sweet Sixteen betting tournament
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.content, isMobile && styles.contentMobile]}>
        {/* Only show image here if NOT on any mobile device */}
        {!isMobile && (
          <View style={styles.imageColumn}>
            <Image 
              source={require('../assets/images/bracket-mayhem.png')}
              style={styles.image}
            />
            <View style={styles.imageOverlay} />
            <Trophy size={48} color="#A259FF" style={styles.trophyIcon} />
          </View>
        )}

        <View style={[styles.countdownColumn, isMobile && styles.countdownColumnMobile]}>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Countdown to our Launch
          </Text>
          <Text style={styles.subtitle}>March 22, 2025</Text>
          
          <View style={[
            styles.countdownContainer, 
            isMobile && styles.countdownContainerMobile,
            isSmallMobile && styles.countdownContainerSmallMobile
          ]}>
            <View style={[styles.timeBlock, isSmallMobile && styles.timeBlockSmall]}>
              <Text style={[styles.timeValue, isSmallMobile && styles.timeValueSmall]}>
                {timeLeft.days}
              </Text>
              <Text style={[styles.timeLabel, isSmallMobile && styles.timeLabelSmall]}>days</Text>
            </View>
            <Text style={[styles.timeSeparator, isSmallMobile && styles.timeSeparatorSmall]}>:</Text>
            <View style={[styles.timeBlock, isSmallMobile && styles.timeBlockSmall]}>
              <Text style={[styles.timeValue, isSmallMobile && styles.timeValueSmall]}>
                {timeLeft.hours.toString().padStart(2, '0')}
              </Text>
              <Text style={[styles.timeLabel, isSmallMobile && styles.timeLabelSmall]}>hrs</Text>
            </View>
            <Text style={[styles.timeSeparator, isSmallMobile && styles.timeSeparatorSmall]}>:</Text>
            <View style={[styles.timeBlock, isSmallMobile && styles.timeBlockSmall]}>
              <Text style={[styles.timeValue, isSmallMobile && styles.timeValueSmall]}>
                {timeLeft.minutes.toString().padStart(2, '0')}
              </Text>
              <Text style={[styles.timeLabel, isSmallMobile && styles.timeLabelSmall]}>min</Text>
            </View>
            <Text style={[styles.timeSeparator, isSmallMobile && styles.timeSeparatorSmall]}>:</Text>
            <View style={[styles.timeBlock, isSmallMobile && styles.timeBlockSmall]}>
              <Text style={[styles.timeValue, isSmallMobile && styles.timeValueSmall]}>
                {timeLeft.seconds.toString().padStart(2, '0')}
              </Text>
              <Text style={[styles.timeLabel, isSmallMobile && styles.timeLabelSmall]}>sec</Text>
            </View>
          </View>
        </View>
        
        
      </View>
      {/* Always show image AFTER countdown on mobile */}
      {isMobile && (
          <View style={[styles.imageColumn, styles.imageColumnMobile]}>
            <Image 
              source={require('../assets/images/bracket-mayhem.png')}
              style={styles.image}
            />
            <View style={styles.imageOverlay} />
            <Trophy size={36} color="#A259FF" style={styles.trophyIcon} />
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D0D',
    marginBottom: 48,
    height:'auto'
  },
  header: {
    backgroundColor: '#000000',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  headerContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTextColumn: {
    flex: 1,
    paddingRight: 30,
    width: '50%',
  },
  headerImageColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  headerImage: {
    width: '100%',
    height: 'auto',
    aspectRatio: 3,
    maxWidth: 1200, // Increased from 300 to be 4x larger on web
  },
  headerImageColumnMobile: {
    width: '100%',
    paddingTop: 16,
  },
  headerImageMobile: {
    maxWidth: 300,
    aspectRatio: 3,
  },
  headerText: {
    color: '#EAEAEA',
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    maxWidth: 800,
    textAlign: 'center',
    marginHorizontal: 'auto'
  },
  headerTextMobile: {
    fontSize: 28,
    maxWidth: '100%',
    paddingHorizontal: 8,
    textAlign: 'center'
  },
  headerTextSmallMobile: {
    fontSize: 22,
    textAlign: 'center'
  },
  content: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    height: 200,
    padding: 16,
  },
  contentMobile: {
    flexDirection: 'column',
    height: 'auto',
    gap: 24,
    paddingVertical: 24,
  },
  imageColumn: {
    flex: 1,
    height: '100%',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageColumnMobile: {
    flex: 1,
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 13, 13, 0.7)',
  },
  trophyIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  countdownColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  countdownColumnMobile: {
    flex: 0,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#A259FF',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  titleMobile: {
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A259FF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    opacity: 0.8,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countdownContainerMobile: {
    justifyContent: 'center',
    gap: 8,
  },
  countdownContainerSmallMobile: {
    gap: 4,
  },
  timeBlock: {
    alignItems: 'center',
    minWidth: 60,
  },
  timeBlockSmall: {
    minWidth: 40,
  },
  timeValue: {
    color: '#A259FF',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  timeValueSmall: {
    fontSize: 24,
  },
  timeLabel: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  timeLabelSmall: {
    fontSize: 10,
  },
  timeSeparator: {
    color: '#A259FF',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginTop: -8,
    opacity: 0.5,
  },
  timeSeparatorSmall: {
    fontSize: 24,
    marginTop: -4,
  },
});