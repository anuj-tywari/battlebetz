import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  FlatList,
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Users,
  Trophy,
  Calendar,
  ChevronRight,
  Filter,
  X,
  Trash2
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import CreateTournamentForm from '../components/CreateTournamentForm';
import useTournamentData, { Tournament, TournamentRoundParticipant } from '@/hooks/useTournamentData';

export default function CompetitionManagementScreen() {
  const router = useRouter();
  
  // Use the tournament data hook for all tournament-related functionality
  // Pass empty string as tournamentId initially as we'll be working with multiple tournaments
  const {
    getAllTournaments,
    getTournamentDetails,
    updateTournament,
    deleteTournament
  } = useTournamentData("");
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTournament, setEditedTournament] = useState<Tournament | null>(null);
  
  // Data fetching state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [participants, setParticipants] = useState<TournamentRoundParticipant[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch tournaments on component mount
  useEffect(() => {
    fetchTournaments();
  }, []);
  
  // Fetch tournament details when a tournament is selected
  useEffect(() => {
    if (selectedTournament && selectedTournament.id) {
      fetchTournamentDetails(selectedTournament.id);
    }
  }, [selectedTournament?.id]);
  
  // Fetch all tournaments
  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getAllTournaments();
      
      if (result.success) {
        setTournaments(result.tournaments);
        
        // Select the first tournament by default if available
        if (result.tournaments && result.tournaments.length > 0 && !selectedTournament) {
          setSelectedTournament(result.tournaments[0]);
        }
      } else {
        setError(result.error || 'Failed to fetch tournaments');
        Alert.alert('Error', result.error || 'Failed to fetch tournaments');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch details for a specific tournament
  const fetchTournamentDetails = async (tournamentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getTournamentDetails(tournamentId);
      
      if (result.success) {
        // Update the full tournament data in the selected tournament state
        setSelectedTournament(result.tournament);
        
        // Set participants if available
        if (result.tournament.participants) {
          setParticipants(result.tournament.participants);
        }
      } else {
        setError(result.error || 'Failed to fetch tournament details');
        Alert.alert('Error', result.error || 'Failed to fetch tournament details');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tournaments based on search query and selected filter
  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || tournament.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Handle tournament selection
  const handleSelectTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsEditMode(false);
    setEditedTournament(null);
  };

  // Toggle edit mode
  const toggleEditMode = async () => {
    if (isEditMode && editedTournament) {
      try {
        setIsSubmitting(true);
        
        // Save changes to database
        const result = await updateTournament(editedTournament.id, editedTournament);
        
        if (result.success) {
          // Update the tournament in the local state
          setSelectedTournament(result.tournament);
          
          // Also update it in the tournaments list
          setTournaments(tournaments.map(t => 
            t.id === result.tournament.id ? result.tournament : t
          ));
          
          // Exit edit mode
          setIsEditMode(false);
          setEditedTournament(null);
          
          Alert.alert('Success', 'Tournament updated successfully');
        } else {
          setError(result.error || 'Failed to update tournament');
          Alert.alert('Error', result.error || 'Failed to update tournament');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
        Alert.alert('Error', err.message || 'An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Enter edit mode
      setEditedTournament({...selectedTournament!});
      setIsEditMode(true);
    }
  };

  // Handle tournament field change
  const handleTournamentChange = (field: keyof Tournament, value: any) => {
    if (editedTournament) {
      setEditedTournament({...editedTournament, [field]: value});
    }
  };
  
  // Delete tournament
  const handleDeleteTournament = async () => {
    if (!selectedTournament) return;
    
    // Confirm deletion
    Alert.alert(
      'Delete Tournament',
      `Are you sure you want to delete "${selectedTournament.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              
              const result = await deleteTournament(selectedTournament.id);
              
              if (result.success) {
                // Remove from tournaments list
                setTournaments(tournaments.filter(t => t.id !== selectedTournament.id));
                
                // Clear selection
                setSelectedTournament(tournaments.length > 1 ? 
                  tournaments.find(t => t.id !== selectedTournament.id) || null : null);
                
                Alert.alert('Success', 'Tournament deleted successfully');
              } else {
                setError(result.error || 'Failed to delete tournament');
                Alert.alert('Error', result.error || 'Failed to delete tournament');
              }
            } catch (err) {
              setError(err.message || 'An unexpected error occurred');
              Alert.alert('Error', err.message || 'An unexpected error occurred');
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };

  // Get status color
  const getStatusColor = (status: 'upcoming' | 'active' | 'completed') => {
    switch (status) {
      case 'upcoming': return '#10B981';
      case 'active': return '#3B82F6';
      case 'completed': return '#6B7280';
    }
  };

  // Get participant status color
  const getParticipantStatusColor = (status: 'active' | 'eliminated' | 'winner') => {
    switch (status) {
      case 'active': return '#10B981';
      case 'eliminated': return '#EF4444';
      case 'winner': return '#A259FF';
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Render tournament status badge
  const renderStatusBadge = (status: 'upcoming' | 'active' | 'completed') => {
    return (
      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(status)}20` }]}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
        <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Competition Management</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading && !tournaments.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A259FF" />
          <Text style={styles.loadingText}>Loading tournaments...</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {/* Left panel (1/3) - Tournament list */}
          <View style={styles.leftPanel}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#A259FF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tournaments..."
                placeholderTextColor="#6c757d"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.filterContainer}>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('all')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.filterButtonTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'upcoming' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('upcoming')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'upcoming' && styles.filterButtonTextActive]}>Upcoming</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'active' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('active')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'active' && styles.filterButtonTextActive]}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'completed' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('completed')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'completed' && styles.filterButtonTextActive]}>Completed</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setIsCreateModalVisible(true)}
            >
              <Plus size={20} color="#EAEAEA" />
              <Text style={styles.createButtonText}>Create Tournament</Text>
            </TouchableOpacity>

            {filteredTournaments.length === 0 && !isLoading ? (
              <View style={styles.emptyStateContainer}>
                <Trophy size={40} color="#6c757d" opacity={0.5} />
                <Text style={styles.emptyStateText}>
                  {searchQuery ? 'No tournaments match your search' : 'No tournaments found'}
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => setIsCreateModalVisible(true)}
                >
                  <Text style={styles.emptyStateButtonText}>Create Tournament</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredTournaments}
                keyExtractor={(item) => item.id}
                style={styles.tournamentList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.tournamentItem,
                      selectedTournament?.id === item.id && styles.tournamentItemSelected
                    ]}
                    onPress={() => handleSelectTournament(item)}
                  >
                    <View style={styles.tournamentItemContent}>
                      <View style={styles.tournamentIconContainer}>
                        <Trophy size={20} color="#A259FF" />
                      </View>
                      <View style={styles.tournamentItemInfo}>
                        <Text style={styles.tournamentItemName}>{item.name}</Text>
                        <View style={styles.tournamentItemMeta}>
                          {renderStatusBadge(item.status as 'upcoming' | 'active' | 'completed')}
                          <Text style={styles.tournamentItemDate}>
                            {formatDate(item.start_date)}
                          </Text>
                        </View>
                      </View>
                      <ChevronRight size={16} color="#6c757d" />
                    </View>
                  </TouchableOpacity>
                )}
                refreshing={isLoading}
                onRefresh={fetchTournaments}
              />
            )}
          </View>

          {/* Right panel (2/3) - Tournament details */}
          <View style={styles.rightPanel}>
            {isLoading && selectedTournament ? (
              <View style={styles.loadingContainerRight}>
                <ActivityIndicator size="large" color="#A259FF" />
                <Text style={styles.loadingText}>Loading tournament details...</Text>
              </View>
            ) : selectedTournament ? (
              <>
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsTitle}>
                    {isEditMode ? 'Edit Tournament' : 'Tournament Details'}
                  </Text>
                  <View style={styles.headerButtonsContainer}>
                    {!isEditMode && (
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={handleDeleteTournament}
                        disabled={isSubmitting}
                      >
                        <Trash2 size={16} color="#EF4444" />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={[
                        styles.editButton, 
                        isEditMode && styles.saveButton,
                        isSubmitting && styles.disabledButton
                      ]}
                      onPress={toggleEditMode}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : isEditMode ? (
                        <Text style={styles.editButtonText}>Save Changes</Text>
                      ) : (
                        <>
                          <Edit size={16} color="#A259FF" />
                          <Text style={styles.editButtonText}>Edit</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView style={styles.detailsContent}>
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Tournament Information</Text>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Name</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.name}
                          onChangeText={(value) => handleTournamentChange('name', value)}
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.name}</Text>
                      )}
                    </View>

                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Status</Text>
                      {isEditMode ? (
                        <View style={styles.statusSelector}>
                          <TouchableOpacity 
                            style={[
                              styles.statusOption,
                              editedTournament?.status === 'upcoming' && 
                              { backgroundColor: `${getStatusColor('upcoming')}20` }
                            ]}
                            onPress={() => handleTournamentChange('status', 'upcoming')}
                          >
                            <Text style={{ color: getStatusColor('upcoming') }}>Upcoming</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[
                              styles.statusOption,
                              editedTournament?.status === 'active' && 
                              { backgroundColor: `${getStatusColor('active')}20` }
                            ]}
                            onPress={() => handleTournamentChange('status', 'active')}
                          >
                            <Text style={{ color: getStatusColor('active') }}>Active</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[
                              styles.statusOption,
                              editedTournament?.status === 'completed' && 
                              { backgroundColor: `${getStatusColor('completed')}20` }
                            ]}
                            onPress={() => handleTournamentChange('status', 'completed')}
                          >
                            <Text style={{ color: getStatusColor('completed') }}>Completed</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        renderStatusBadge(selectedTournament.status as 'upcoming' | 'active' | 'completed')
                      )}
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Sport Type</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.type}
                          onChangeText={(value) => handleTournamentChange('type', value)}
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.type}</Text>
                      )}
                    </View>

                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Description</Text>
                      {isEditMode ? (
                        <TextInput
                          style={[styles.editInput, styles.textArea]}
                          value={editedTournament?.description}
                          onChangeText={(value) => handleTournamentChange('description', value)}
                          multiline
                          numberOfLines={4}
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.description}</Text>
                      )}
                    </View>
                    
                    <View style={styles.detailsSubtitle}>
                      <Text style={styles.detailsSubtitleText}>Schedule</Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Start Date</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.start_date}
                          onChangeText={(value) => handleTournamentChange('start_date', value)}
                          placeholder="YYYY-MM-DD"
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{formatDate(selectedTournament.start_date)}</Text>
                      )}
                    </View>

                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>End Date</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.end_date}
                          onChangeText={(value) => handleTournamentChange('end_date', value)}
                          placeholder="YYYY-MM-DD"
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{formatDate(selectedTournament.end_date)}</Text>
                      )}
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Entry Deadline</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.entry_deadline}
                          onChangeText={(value) => handleTournamentChange('entry_deadline', value)}
                          placeholder="YYYY-MM-DD"
                        />
                      ) : (
                        <Text style={styles.detailsValue}>
                          {selectedTournament.entry_deadline ? formatDate(selectedTournament.entry_deadline) : 'N/A'}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.detailsSubtitle}>
                      <Text style={styles.detailsSubtitleText}>Tournament Economics</Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Prize Pool ($ Dollars)</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.prize_pool.toString()}
                          onChangeText={(value) => handleTournamentChange('prize_pool', parseFloat(value) || 0)}
                          keyboardType="numeric"
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.prize_pool.toLocaleString()}</Text>
                      )}
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Entry Fee ($ Dollars)</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.entry_fee.toString()}
                          onChangeText={(value) => handleTournamentChange('entry_fee', parseFloat(value) || 0)}
                          keyboardType="numeric"
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.entry_fee.toLocaleString()}</Text>
                      )}
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Participants</Text>
                      <Text style={styles.detailsValue}>
                        {selectedTournament.current_participants || participants.length} / {selectedTournament.max_participants || 'Unlimited'}
                      </Text>
                    </View>
                    
                    <View style={styles.detailsSubtitle}>
                      <Text style={styles.detailsSubtitleText}>Tournament Structure</Text>
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Round Count</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.round_count?.toString()}
                          onChangeText={(value) => handleTournamentChange('round_count', parseInt(value) || 0)}
                          keyboardType="numeric"
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.round_count || 'N/A'}</Text>
                      )}
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Round Type</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.round_type}
                          onChangeText={(value) => handleTournamentChange('round_type', value)}
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.round_type || 'N/A'}</Text>
                      )}
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Payout Type</Text>
                      {isEditMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={editedTournament?.payout_type}
                          onChangeText={(value) => handleTournamentChange('payout_type', value)}
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.payout_type || 'N/A'}</Text>
                      )}
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Public Tournament</Text>
                      {isEditMode ? (
                        <Switch
                          value={editedTournament?.is_public}
                          onValueChange={(value) => handleTournamentChange('is_public', value)}
                          trackColor={{ false: '#4A4A4A', true: '#A259FF40' }}
                          thumbColor={editedTournament?.is_public ? '#A259FF' : '#6c757d'}
                        />
                      ) : (
                        <Text style={styles.detailsValue}>{selectedTournament.is_public ? 'Yes' : 'No'}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.detailsSection}>
                    <View style={styles.participantsHeader}>
                      <Text style={styles.sectionTitle}>Participants ({participants.length})</Text>
                      <TouchableOpacity style={styles.addParticipantButton}>
                        <Plus size={16} color="#EAEAEA" />
                        <Text style={styles.addParticipantText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {participants.length === 0 ? (
                      <View style={styles.noParticipantsContainer}>
                        <Users size={30} color="#6c757d" opacity={0.5} />
                        <Text style={styles.noParticipantsText}>No participants yet</Text>
                      </View>
                    ) : participants.map((participant) => (
                      <View key={participant.id} style={styles.participantItem}>
                        <View style={styles.participantDetails}>
                          <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                              {participant.users.username.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View style={styles.participantInfo}>
                            <Text style={styles.participantName}>
                              {participant.users.username}
                            </Text>
                            <View style={styles.participantStatus}>
                              <View 
                                style={[
                                  styles.statusDot, 
                                  { backgroundColor: getParticipantStatusColor(participant.status as 'active' | 'eliminated' | 'winner') }
                                ]} 
                              />
                              <Text 
                                style={[
                                  styles.participantStatusText,
                                  { color: getParticipantStatusColor(participant.status as 'active' | 'eliminated' | 'winner') }
                                ]}
                              >
                                {participant.status ? participant.status.charAt(0).toUpperCase() + participant.status.slice(1) : 'Active'}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.participantStats}>
                          <Text style={styles.participantScore}>
                            Tokens: <Text style={styles.scoreValue}>{participant.token_balance}</Text>
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  
                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}
                </ScrollView>
              </>
            ) : (
              <View style={styles.noSelectionContainer}>
                <Trophy size={80} color="#A259FF" opacity={0.5} />
                <Text style={styles.noSelectionText}>Select a tournament to view details</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Tournament creation modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Tournament</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsCreateModalVisible(false)}
              >
                <X size={24} color="#EAEAEA" />
              </TouchableOpacity>
            </View>
            
            <CreateTournamentForm 
              onSubmit={(tournament) => {
                // Add the new tournament to our local state
                if (tournament) {
                  setTournaments([tournament, ...tournaments]);
                  
                  // If this is the first tournament, select it
                  if (!selectedTournament) {
                    setSelectedTournament(tournament);
                  }
                  
                  Alert.alert('Success', 'Tournament created successfully');
                }
                
                setIsCreateModalVisible(false);
              }}
              onCancel={() => setIsCreateModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#1A1A1D',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  placeholder: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#2E2E3A',
    backgroundColor: '#1A1A1D',
  },
  rightPanel: {
    flex: 2,
    backgroundColor: '#0D0D0D',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 14,
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#2E2E3A',
  },
  filterButtonActive: {
    backgroundColor: '#A259FF',
  },
  filterButtonText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D246C',
    margin: 12,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  tournamentList: {
    flex: 1,
  },
  tournamentItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  tournamentItemSelected: {
    backgroundColor: '#2E2E3A',
  },
  tournamentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tournamentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3D246C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tournamentItemInfo: {
    flex: 1,
  },
  tournamentItemName: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  tournamentItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tournamentItemDate: {
    color: '#6c757d',
    fontSize: 12,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  detailsTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#A259FF',
  },
  editButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  detailsContent: {
    flex: 1,
    padding: 16,
  },
  detailsSection: {
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  detailsRow: {
    marginBottom: 16,
  },
  detailsLabel: {
    color: '#6c757d',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
  },
  detailsValue: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  detailsSubtitle: {
    backgroundColor: '#2E2E3A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  detailsSubtitleText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  editInput: {
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainerRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#A259FF',
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'Poppins-Medium',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#6c757d',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  emptyStateButton: {
    backgroundColor: '#A259FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  noParticipantsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  noParticipantsText: {
    color: '#6c757d',
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'Poppins-Medium',
  },
  errorContainer: {
    backgroundColor: '#EF444420',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444420',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  disabledButton: {
    opacity: 0.7,
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2E2E3A',
  },
  participantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addParticipantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D246C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  addParticipantText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  participantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3D246C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantStatusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  participantStats: {
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#4A4A4A',
  },
  participantScore: {
    color: '#6c757d',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  scoreValue: {
    color: '#10B981',
    fontFamily: 'Poppins-Medium',
  },
  participantPosition: {
    color: '#6c757d',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  positionValue: {
    color: '#A259FF',
    fontFamily: 'Poppins-Medium',
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noSelectionText: {
    color: '#6c757d',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    overflow: 'hidden',
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
  placeholderText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Poppins-Regular',
  }
});