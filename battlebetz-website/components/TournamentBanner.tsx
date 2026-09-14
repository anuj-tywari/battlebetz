import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, Animated, Dimensions } from 'react-native';
import { Trophy, X, CreditCard, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CAROUSEL_INTERVAL = 2000;

export default function TournamentBanner() {
  const router = useRouter();
  const [rulesModalVisible, setRulesModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef(null);

  const carouselItems = [
    {
      id: '1',
      type: 'cover',
      image: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?q=80&w=2574&auto=format&fit=crop',
      overlayText: 'Madness of March Tournament',
      overlaySubtext: 'Starts March 19'
    },
    {
      id: '2',
      type: 'bracket',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop',
      overlayText: 'Tournaments with high returns',
      overlaySubtext: 'Create competition with friends'
    },
    {
      id: '3',
      type: 'ipl',
      image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=2070&auto=format&fit=crop',
      overlayText: 'Indian Premier League',
      overlaySubtext: 'Starts March 22'
    },
    {
      id: '4',
      type: 'prize',
      image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2090&auto=format&fit=crop',
      overlayText: 'Bet $15 to win $5,000',
      overlaySubtext: 'A fun way to gamble'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % carouselItems.length;
      setActiveIndex(nextIndex);
      carouselRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true
      });
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderCarouselItem = (item) => (
    <View key={item.id} style={styles.carouselItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
      <View style={styles.overlayTextContainer}>
        <Text style={styles.overlayText}>{item.overlayText}</Text>
        <Text style={styles.overlaySubtext}>{item.overlaySubtext}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {carouselItems.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex && styles.paginationDotActive
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(newIndex);
        }}
        scrollEventThrottle={16}
      >
        {carouselItems.map(renderCarouselItem)}
      </ScrollView>

      {renderPagination()}

      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Stake</Text>
          <Text style={styles.tableValue}>USD 15</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Prize Pot</Text>
          <View style={styles.prizeValueContainer}>
            <Text style={styles.tableValue}>USD 5,000</Text>
            <Text style={styles.prizeGrowth}>(+33,233)</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.buttonText}>Join Now</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonOutline]}
          onPress={() => setRulesModalVisible(true)}
        >
          <Text style={[styles.buttonText, styles.buttonTextOutline]}>Learn More</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={rulesModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRulesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tournament Rules</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setRulesModalVisible(false)}
              >
                <X size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.fullBracketContainer}>
                <Image
                  source={{ uri: carouselItems[1].image }}
                  style={styles.fullBracketImage}
                  resizeMode="contain"
                />
                <View style={styles.bracketCaption}>
                  <Text style={styles.bracketCaptionText}>Tournament Bracket</Text>
                  <Text style={styles.bracketCaptionSubtext}>64 Teams • 6 Rounds • Single Elimination</Text>
                </View>
              </View>

              <View style={styles.ruleSection}>
                <Text style={styles.ruleSectionTitle}>How It Works</Text>
                <Text style={styles.ruleText}>
                  Your $15 stake will get you BBZT 1,000 to use exclusively in this tournament.
                </Text>
              </View>
              
              <View style={styles.ruleSection}>
                <Text style={styles.ruleSectionTitle}>Tournament Format</Text>
                <Text style={styles.ruleText}>
                  Just like March Madness, there will be eliminations each round. Only the top 50% of performers will advance to the next round.
                </Text>
              </View>
              
              <View style={styles.ruleSection}>
                <Text style={styles.ruleSectionTitle}>Prize Distribution</Text>
                <View style={styles.prizeDistribution}>
                  <View style={styles.prizeRow}>
                    <Text style={styles.prizePosition}>1st Place</Text>
                    <Text style={styles.prizeAmount}>USD 2,500</Text>
                  </View>
                  <View style={styles.prizeRow}>
                    <Text style={styles.prizePosition}>2nd Place</Text>
                    <Text style={styles.prizeAmount}>USD 1,250</Text>
                  </View>
                  <View style={styles.prizeRow}>
                    <Text style={styles.prizePosition}>3rd Place</Text>
                    <Text style={styles.prizeAmount}>USD 750</Text>
                  </View>
                  <View style={styles.prizeRow}>
                    <Text style={styles.prizePosition}>4th-10th Place</Text>
                    <Text style={styles.prizeAmount}>USD 500 (split)</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.ruleSection}>
                <Text style={styles.ruleSectionTitle}>Important Dates</Text>
                <Text style={styles.ruleText}>
                  • Registration Deadline: March 18, 2025{'\n'}
                  • Tournament Start: March 19, 2025{'\n'}
                  • Final Round: April 8, 2025
                </Text>
              </View>
              
              <View style={styles.signupSection}>
                <Text style={styles.signupTitle}>Sign Up Now</Text>
                <Text style={styles.signupText}>
                  Add your payment method to secure your spot in the tournament.
                </Text>
                
                <View style={styles.paymentOptions}>
                  <TouchableOpacity style={styles.paymentOption}>
                    <CreditCard size={20} color="#EAEAEA" />
                    <Text style={styles.paymentOptionText}>Credit Card</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.paymentOption}>
                    <DollarSign size={20} color="#EAEAEA" />
                    <Text style={styles.paymentOptionText}>PayPal</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={styles.signupButton}
                  onPress={() => {
                    setRulesModalVisible(false);
                    router.push('/signup');
                  }}
                >
                  <Text style={styles.signupButtonText}>Sign Up for USD 15</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  carouselItem: {
    width: width,
    height: 180,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  overlayTextContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  overlaySubtext: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationDotActive: {
    backgroundColor: '#A259FF',
    width: 12,
  },
  tableContainer: {
    padding: 12,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tableLabel: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    width: '30%',
    fontFamily: 'Poppins-Medium',
  },
  tableValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  prizeValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizeGrowth: {
    color: '#10B981',
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#A259FF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#A259FF',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  buttonTextOutline: {
    color: '#A259FF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  fullBracketContainer: {
    marginBottom: 24,
  },
  fullBracketImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  bracketCaption: {
    marginTop: 8,
    alignItems: 'center',
  },
  bracketCaptionText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  bracketCaptionSubtext: {
    color: '#A259FF',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  ruleSection: {
    marginBottom: 20,
  },
  ruleSectionTitle: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  ruleText: {
    color: '#EAEAEA',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  prizeDistribution: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  prizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  prizePosition: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  prizeAmount: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  signupSection: {
    backgroundColor: '#3D246C',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  signupTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  signupText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  paymentOptionText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  signupButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});