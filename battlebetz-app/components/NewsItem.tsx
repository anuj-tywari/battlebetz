import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Linking } from 'react-native';
import { Swords, ExternalLink } from 'lucide-react-native';

type NewsItemProps = {
  title: string;
  time: string;
  imageUrl: string;
  whyBet?: string;
  link?: string;
};

export default function NewsItem({ title, time, imageUrl, whyBet, link }: NewsItemProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showComingSoon) {
      timeout = setTimeout(() => {
        setShowComingSoon(false);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [showComingSoon]);

  const handleBattlePress = () => {
    setShowComingSoon(true);
  };
  
  const handleSourcePress = () => {
    if (link) {
      Linking.openURL(link).catch(err => 
        console.error("Couldn't open link: ", err)
      );
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={handleSourcePress}
        >
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
        
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.battleButton}
            onPress={handleBattlePress}
          >
            <Swords size={12} color="white" />
            
            <Text style={styles.battleButtonText}>Battle</Text>
          </TouchableOpacity>
          
          {link && (
            <TouchableOpacity 
              style={styles.sourceButton}
              onPress={handleSourcePress}
            >
              <ExternalLink size={12} color="white" />
              <Text style={styles.sourceButtonText}>Read</Text>
            </TouchableOpacity>
          )}
          
          {whyBet && <Text style={styles.whyBet} numberOfLines={1}>{whyBet}</Text>}
        </View>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity 
          onPress={handleSourcePress}
        >
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.time}>{time}</Text>
      </View>

      {/* Coming Soon Modal */}
      <Modal
        visible={showComingSoon}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Coming Soon</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
    height: 64,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  battleButton: {
    backgroundColor: '#A259FF',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
  },
  battleButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  sourceButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
  },
  sourceButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  whyBet: {
    color: '#A259FF',
    fontSize: 10,
    fontStyle: 'italic',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  imageContainer: {
    width: 48,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginBottom: 2,
  },
  time: {
    color: '#A259FF',
    fontSize: 9,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  modalText: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
});