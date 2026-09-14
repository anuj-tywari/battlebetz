import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Swords } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type NewsItemProps = {
  title: string;
  time: string;
  imageUrl: string;
  whyBet?: string;
};

export default function NewsItem({ title, time, imageUrl, whyBet }: NewsItemProps) {
  const router = useRouter();
  
  const handleBattlePress = () => {
    router.push('/battle');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.battleButton}
            onPress={handleBattlePress}
          >
            <Swords size={14} color="white" />
            <Text style={styles.battleButtonText}>Battle</Text>
          </TouchableOpacity>
          
          {whyBet && <Text style={styles.whyBet} numberOfLines={2}>{whyBet}</Text>}
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A4A4A',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  battleButton: {
    backgroundColor: '#A259FF',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  battleButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  whyBet: {
    color: '#A259FF',
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  imageContainer: {
    width: 70,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 4,
  },
  time: {
    color: '#A259FF',
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});