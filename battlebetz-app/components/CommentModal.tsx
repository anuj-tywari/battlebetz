import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { X, Link, AtSign, Send, ChevronDown } from 'lucide-react-native';

const { height, width } = Dimensions.get('window');

type CommentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (comment: string, gameId?: string, url?: string, mentions?: string[]) => void;
  gameId?: string;
  gameName?: string;
};

export default function CommentModal({ 
  visible, 
  onClose, 
  onSubmit,
  gameId,
  gameName
}: CommentModalProps) {
  const [comment, setComment] = useState('');
  const [url, setUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Mock data for games
  const games = [
    { id: '1', name: 'Lakers vs Warriors', time: 'Today, 7:30 PM', sport: '🏀' },
    { id: '2', name: 'Celtics vs Heat', time: 'Today, 8:00 PM', sport: '🏀' },
    { id: '3', name: 'Chiefs vs Eagles', time: 'Tomorrow, 4:25 PM', sport: '🏈' },
    { id: '4', name: 'Yankees vs Red Sox', time: 'Tomorrow, 1:05 PM', sport: '⚾' },
    { id: '5', name: 'Mumbai Indians vs CSK', time: 'Today, 2:30 PM', sport: '🏏' },
    { id: '6', name: 'Real Madrid vs Man City', time: 'Tomorrow, 3:00 PM', sport: '⚽' }
  ];

  // Filter games based on search query
  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.sport.includes(searchQuery)
  );

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setComment('');
      setUrl('');
      setShowUrlInput(false);
      setShowMentions(false);
      setShowGameSelector(false);
      setSearchQuery('');
      setSelectedGame(null);
    }
  }, [visible]);

  // Mock data for mentions
  const users = [
    { id: '1', username: '@mike_b', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' },
    { id: '2', username: '@sarah_j', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop' },
    { id: '3', username: '@david_m', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2187&auto=format&fit=crop' }
  ];

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment, selectedGame || gameId, url);
      onClose();
      Keyboard.dismiss();
    }
  };

  const handleMention = (username: string) => {
    setComment(comment + username + ' ');
    setShowMentions(false);
    setSearchQuery('');
  };

  const handleGameSelect = (game: typeof games[0]) => {
    setSelectedGame(game.id);
    setShowGameSelector(false);
    setSearchQuery('');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setShowMentions(false);
    setShowGameSelector(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        dismissKeyboard();
        onClose();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                dismissKeyboard();
                onClose();
              }}
            >
              <X size={24} color="#EAEAEA" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Comment</Text>
            <TouchableOpacity 
              style={[
                styles.postButton,
                !comment.trim() && styles.postButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!comment.trim()}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Game Selector */}
            <TouchableOpacity 
              style={styles.gameSelector}
              onPress={() => {
                setShowGameSelector(!showGameSelector);
                setShowMentions(false);
                setSearchQuery('');
              }}
            >
              <View style={styles.gameSelectorContent}>
                <Text style={styles.gameSelectorLabel}>Game:</Text>
                <Text style={styles.gameSelectorText}>
                  {selectedGame 
                    ? games.find(g => g.id === selectedGame)?.name 
                    : gameId 
                      ? gameName 
                      : "Select a game (optional)"}
                </Text>
              </View>
              <ChevronDown size={20} color="#A259FF" />
            </TouchableOpacity>

            {showGameSelector && (
              <View style={styles.dropdownContainer}>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search games or use emoji (🏀, ⚽, 🏈)..."
                    placeholderTextColor="#6c757d"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <ScrollView style={styles.gameList}>
                  {filteredGames.map(game => (
                    <TouchableOpacity
                      key={game.id}
                      style={styles.gameItem}
                      onPress={() => handleGameSelect(game)}
                    >
                      <View style={styles.gameItemContent}>
                        <Text style={styles.sportEmoji}>{game.sport}</Text>
                        <View style={styles.gameItemInfo}>
                          <Text style={styles.gameItemName}>{game.name}</Text>
                          <Text style={styles.gameItemTime}>{game.time}</Text>
                        </View>
                      </View>
                      {selectedGame === game.id && (
                        <View style={styles.selectedIndicator}>
                          <Text style={styles.selectedText}>Selected</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write your comment..."
                placeholderTextColor="#6c757d"
                multiline
                value={comment}
                onChangeText={setComment}
              />
            </View>

            {/* URL Input */}
            {showUrlInput && (
              <View style={styles.urlInputContainer}>
                <TextInput
                  style={styles.urlInput}
                  placeholder="Enter URL..."
                  placeholderTextColor="#6c757d"
                  value={url}
                  onChangeText={setUrl}
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <View style={styles.leftButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setShowUrlInput(!showUrlInput)}
                >
                  <Link size={20} color="#A259FF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    setShowMentions(!showMentions);
                    setShowGameSelector(false);
                    setSearchQuery('');
                  }}
                >
                  <AtSign size={20} color="#A259FF" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1A1A1D',
    marginTop: Platform.OS === 'ios' ? 100 : 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  postButton: {
    backgroundColor: '#A259FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  postButtonDisabled: {
    backgroundColor: '#4A4A4A',
  },
  postButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  modalBody: {
    padding: 16,
  },
  gameSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  gameSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gameSelectorLabel: {
    color: '#A259FF',
    fontSize: 14,
    marginRight: 8,
    fontFamily: 'Poppins-Medium',
  },
  gameSelectorText: {
    color: '#EAEAEA',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  dropdownContainer: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    marginBottom: 16,
    maxHeight: 200,
  },
  searchContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  searchInput: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  gameList: {
    padding: 8,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4A4A4A',
    marginBottom: 8,
  },
  gameItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sportEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  gameItemInfo: {
    flex: 1,
  },
  gameItemName: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
  },
  gameItemTime: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  selectedIndicator: {
    backgroundColor: '#A259FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  commentInputContainer: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  commentInput: {
    color: '#EAEAEA',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Regular',
  },
  urlInputContainer: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  urlInput: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E2E3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});