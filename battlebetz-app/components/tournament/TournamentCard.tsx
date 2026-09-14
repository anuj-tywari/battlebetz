import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { Tournament } from '@/services/tournamentService';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  // Format date to a more readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle missing image URL by providing a default based on tournament type
  const getDefaultImage = (tournamentType: string) => {
    const defaultImages = {
      'basketball_ncaa': 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
      'cricket_ipl': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2187&auto=format&fit=crop',
      'NBA': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2187&auto=format&fit=crop',
      'NHL': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=2187&auto=format&fit=crop',
      'default': 'https://images.unsplash.com/photo-1457131760772-7017c6180f05?q=80&w=2187&auto=format&fit=crop'
    };
    
    return defaultImages[tournamentType] || defaultImages.default;
  };

  return (
    <View style={styles.tournamentCard}>
      <Image 
        source={{ uri: tournament.image_url || getDefaultImage(tournament.type) }}
        style={styles.tournamentImage}
      />
      <View style={styles.tournamentContent}>
        <View style={styles.tournamentHeader}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.tournamentName}>{tournament.name}</Text>
        </View>
        <View style={styles.tournamentDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Entry Fee</Text>
            <Text style={styles.detailValue}>${tournament.entry_fee}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tournament Tokens</Text>
            <Text style={styles.detailValue}>1,000</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>{formatDate(tournament.start_date)}</Text>
          </View>
          {tournament.entry_deadline && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Registration Deadline</Text>
              <Text style={styles.detailValue}>{formatDate(tournament.entry_deadline)}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Prize Pool</Text>
            <Text style={styles.detailValue}>${tournament.prize_pool.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tournamentCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tournamentImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  tournamentContent: {
    padding: 16,
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tournamentName: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  tournamentDetails: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  detailValue: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default TournamentCard;