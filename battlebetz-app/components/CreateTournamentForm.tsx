import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Switch, ActivityIndicator, Alert } from 'react-native';
import { Plus, Minus, Trophy, DollarSign, Users, Calendar, Clock, Zap } from 'lucide-react-native';
import useTournamentData from '@/hooks/useTournamentData';

type Round = {
  round_number: number;
  round_name: string;
  max_total_bets: number;
  max_parlay_length: number;
  minimum_risk: number;
  survivor_metric: number;
  survivor_type: string;
  start_date: string;
  end_date: string;
  display_start_date: string; // For input field display
  display_end_date: string;   // For input field display
};

type PayoutTier = {
  position: number;
  percentage: number;
  amount: number;
};

type SportType = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'MLS' | 'OTHER';

type CreateTournamentFormProps = {
  onSubmit: (tournamentData: any) => void;
  onCancel: () => void;
};

export default function CreateTournamentForm({ onSubmit, onCancel }: CreateTournamentFormProps) {
  // Use the tournament hook for creating tournaments
  const { createTournament } = useTournamentData("");
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tournament general info
  const [tournamentName, setTournamentName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  
  // Tournament specific fields from database
  const [sport, setSport] = useState<SportType>('NFL');
  const [prizePool, setPrizePool] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roundCount, setRoundCount] = useState('1');
  const [entryDeadline, setEntryDeadline] = useState('');
  const [roundType, setRoundType] = useState('ELIMINATION');
  const [isPublic, setIsPublic] = useState(true);
  const [payoutType, setPayoutType] = useState('PERCENTAGE');
  const [maxParticipantsError, setMaxParticipantsError] = useState<string | null>(null);

  const toEDTIsoString = (dateString: string): string => {
    if (!dateString || !dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return '';
    }

    const parts = dateString.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; 
    const day = parseInt(parts[2]);
    
    const date = new Date(Date.UTC(year, month, day, 4, 0, 0));
    
    return date.toISOString();
  };
  
  // Rounds and payouts
  const [rounds, setRounds] = useState<Round[]>([
    { 
      round_number: 1, 
      round_name: 'Round 1',
      max_total_bets: 10,
      max_parlay_length: 3,
      minimum_risk: 100,
      survivor_metric: 50,
      survivor_type: 'TOP_PERCENTAGE',
      start_date: toEDTIsoString(new Date().toISOString().split('T')[0]),
      end_date: toEDTIsoString(new Date().toISOString().split('T')[0]),
      display_start_date: new Date().toISOString().split('T')[0],
      display_end_date: new Date().toISOString().split('T')[0]
    }
  ]);
  
  const [payoutTiers, setPayoutTiers] = useState<PayoutTier[]>([
    { position: 1, percentage: 50, amount: 0 },
    { position: 2, percentage: 30, amount: 0 },
    { position: 3, percentage: 20, amount: 0 }
  ]);

  // Sport type options
  const sportTypes: SportType[] = ['NFL', 'NBA', 'MLB', 'NHL', 'MLS', 'OTHER'];
  
  // Round type options
  const roundTypeOptions = ['CUMULATIVE ROI', 'ROUND ROI'];
  
  // Survivor metric options
  const survivorMetricOptions = [50, 30, 20];
  
  // Survivor type options
  const survivorTypeOptions = ['ROI', 'TOTAL TOKENS', 'TOTAL WINS'];

  const addRound = () => {
    const newRoundNumber = rounds.length + 1;
    const today = new Date().toISOString().split('T')[0];
    
    const newRound = {
      round_number: newRoundNumber,
      round_name: `Round ${newRoundNumber}`,
      max_total_bets: 10,
      max_parlay_length: 3,
      minimum_risk: 100,
      survivor_metric: 50,
      survivor_type: 'ROI',
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      display_start_date: today,
      display_end_date: today
    };
    setRounds([...rounds, newRound]);
    
    // Update round count
    setRoundCount(newRoundNumber.toString());
  };

  const removeRound = (roundNumber: number) => {
    if (rounds.length > 1) {
      const updatedRounds = rounds.filter(round => round.round_number !== roundNumber);
      // Renumber the rounds
      const renumberedRounds = updatedRounds.map((round, index) => ({
        ...round,
        round_number: index + 1,
        round_name: round.round_name.startsWith('Round ') 
          ? `Round ${index + 1}` 
          : round.round_name
      }));
      
      setRounds(renumberedRounds);
      setRoundCount(renumberedRounds.length.toString());
    }
  };

  const updateRound = (roundNumber: number, field: keyof Round, value: any) => {
    setRounds(rounds.map(round => {
      if (round.round_number === roundNumber) {
        if (field === 'display_start_date') {
          return { 
            ...round, 
            display_start_date: value,
            start_date: toEDTIsoString(value) // Update the actual date too
          };
        } else if (field === 'display_end_date') {
          return { 
            ...round, 
            display_end_date: value,
            end_date: toEDTIsoString(value) // Update the actual date too
          };
        }
        // For other fields, update normally
        return { ...round, [field]: value };
      }
      return round;
    }));
  };

  const addPayoutTier = () => {
    const newPosition = payoutTiers.length + 1;
    const newTier = {
      position: newPosition,
      percentage: 0,
      amount: 0
    };
    setPayoutTiers([...payoutTiers, newTier]);
  };

  const removePayoutTier = (position: number) => {
    if (payoutTiers.length > 1) {
      const updatedTiers = payoutTiers.filter(tier => tier.position !== position);
      // Renumber the positions
      const renumberedTiers = updatedTiers.map((tier, index) => ({
        ...tier,
        position: index + 1
      }));
      
      setPayoutTiers(renumberedTiers);
    }
  };

  const updatePayoutTier = (position: number, field: keyof PayoutTier, value: any) => {
    setPayoutTiers(payoutTiers.map(tier => 
      tier.position === position ? { ...tier, [field]: value } : tier
    ));
    
    // If in percentage mode, update amounts based on prize pool
    if (payoutType === 'PERCENTAGE' && field === 'percentage') {
      const prizePoolValue = parseFloat(prizePool) || 0;
      updatePayoutAmount(position, (parseFloat(value) / 100) * prizePoolValue);
    }
    
    // If in amount mode, update percentages based on prize pool
    if (payoutType === 'AMOUNT' && field === 'amount') {
      const prizePoolValue = parseFloat(prizePool) || 0;
      if (prizePoolValue > 0) {
        updatePayoutPercentage(position, (parseFloat(value) / prizePoolValue) * 100);
      }
    }
  };
  
  const updatePayoutAmount = (position: number, amount: number) => {
    setPayoutTiers(payoutTiers.map(tier => 
      tier.position === position ? { ...tier, amount } : tier
    ));
  };
  
  const updatePayoutPercentage = (position: number, percentage: number) => {
    setPayoutTiers(payoutTiers.map(tier => 
      tier.position === position ? { ...tier, percentage } : tier
    ));
  };

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const getTotalPayout = () => {
    return payoutTiers.reduce((sum, tier) => sum + tier.percentage, 0);
  };
  
  // Update amounts when prize pool changes
  const updatePayoutAmounts = (newPrizePool: string) => {
    const prizePoolValue = parseFloat(newPrizePool) || 0;
    const updatedTiers = payoutTiers.map(tier => ({
      ...tier,
      amount: (tier.percentage / 100) * prizePoolValue
    }));
    setPayoutTiers(updatedTiers);
  };

  // Handle max participants change with validation
  const handleMaxParticipantsChange = (value: string) => {
    setMaxParticipants(value);
    
    // Check if the value is less than 16
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue < 16) {
      setMaxParticipantsError('Minimum tournament size is 16 users');
    } else {
      setMaxParticipantsError(null);
    }
  };

  const handleSubmit = async () => {

    // Reset errors
    setError(null);
  
    // Validate form
    if (!tournamentName || !sport || !prizePool || !maxParticipants || 
        !entryFee || !startDate || !endDate || !entryDeadline) {
      setError('Please fill in all required fields');
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (payoutType === 'PERCENTAGE' && getTotalPayout() !== 100) {
      setError('Total payout percentage must equal 100%');
      Alert.alert('Invalid Payout', 'Total payout percentage must equal 100%');
      return;
    }

    const numParticipants = parseInt(maxParticipants);
    if (isNaN(numParticipants) || numParticipants < 16) {
      setError('Tournament must have at least 16 participants');
      Alert.alert('Invalid Participants', 'Tournament must have at least 16 participants');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare tournament data
      const tournamentData = {
        name: tournamentName,
        description,
        rules,
        type: sport,
        prize_pool: parseFloat(prizePool),
        max_participants: parseInt(maxParticipants),
        entry_fee: parseFloat(entryFee),
        start_date: toEDTIsoString(startDate),
        end_date: toEDTIsoString(endDate),
        entry_deadline: toEDTIsoString(entryDeadline),
        round_count: parseInt(roundCount),
        round_type: roundType,
        is_public: isPublic,
        payout_type: payoutType,
        rounds: rounds.map(round => ({
          round_number: round.round_number,
          round_name: round.round_name,
          start_date: round.start_date,
          end_date: round.end_date,
          rules: {
            max_total_bets: round.max_total_bets,
            max_parlay_length: round.max_parlay_length,
            minimum_risk: round.minimum_risk,
            survivor_metric: round.survivor_metric,
            survivor_type: round.survivor_type
          }
        })),
        prize_distribution: payoutTiers.map(tier => ({
          position: tier.position,
          percentage: tier.percentage,
          amount: tier.amount
        }))
      };

      // Submit tournament to database
      const result = await createTournament(tournamentData);
      
      if (result.success) {
        // Call the parent component's onSubmit to handle UI updates
        onSubmit(result.tournament);
      } else {
        setError(result.error || 'Failed to create tournament');
        Alert.alert('Error', result.error || 'Failed to create tournament');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tournament Details</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tournament Name *</Text>
          <TextInput
            style={styles.input}
            value={tournamentName}
            onChangeText={setTournamentName}
            placeholder="Enter tournament name"
            placeholderTextColor="#6c757d"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter tournament description"
            placeholderTextColor="#6c757d"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rules</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={rules}
            onChangeText={setRules}
            placeholder="Enter tournament rules"
            placeholderTextColor="#6c757d"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Sport Type *</Text>
          <View style={styles.radioGroup}>
            {sportTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.radioButton,
                  sport === type && styles.radioButtonSelected
                ]}
                onPress={() => setSport(type)}
              >
                <Text style={[
                  styles.radioButtonText,
                  sport === type && styles.radioButtonTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Public Tournament</Text>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#4A4A4A', true: '#A259FF40' }}
            thumbColor={isPublic ? '#A259FF' : '#6c757d'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tournament Schedule</Text>
        
        <View style={styles.formRow}>
          <View style={styles.formGroupHalf}>
            <Text style={styles.label}>Start Date (EDT) *</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color="#A259FF" />
              <TextInput
                style={styles.iconInput}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#6c757d"
              />
            </View>
          </View>
          
          <View style={styles.formGroupHalf}>
            <Text style={styles.label}>End Date (EDT) *</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color="#A259FF" />
              <TextInput
                style={styles.iconInput}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#6c757d"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Entry Deadline *</Text>
          <View style={styles.inputWithIcon}>
            <Clock size={20} color="#A259FF" />
            <TextInput
              style={styles.iconInput}
              value={entryDeadline}
              onChangeText={setEntryDeadline}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#6c757d"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tournament Economics</Text>
        
        <View style={styles.formRow}>
          <View style={styles.formGroupHalf}>
            <Text style={styles.label}>Prize Pool ($ Dollars) *</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color="#A259FF" />
              <TextInput
                style={styles.iconInput}
                value={prizePool}
                onChangeText={(value) => {
                  setPrizePool(value);
                  updatePayoutAmounts(value);
                }}
                placeholder="Total prize amount"
                placeholderTextColor="#6c757d"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.formGroupHalf}>
            <Text style={styles.label}>Entry Fee ($ Dollars) *</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color="#A259FF" />
              <TextInput
                style={styles.iconInput}
                value={entryFee}
                onChangeText={setEntryFee}
                placeholder="Fee per participant"
                placeholderTextColor="#6c757d"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Maximum Participants * (Minimum: 16)</Text>
          <View style={styles.inputWithIcon}>
            <Users size={20} color={maxParticipantsError ? "#EF4444" : "#A259FF"} />
            <TextInput
              style={[
                styles.iconInput, 
                maxParticipantsError && styles.inputError
              ]}
              value={maxParticipants}
              onChangeText={handleMaxParticipantsChange}
              placeholder="Enter max participants"
              placeholderTextColor="#6c757d"
              keyboardType="numeric"
            />
          </View>
          {maxParticipantsError && (
            <Text style={styles.errorText}>{maxParticipantsError}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tournament Format</Text>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Round Type</Text>
          <View style={styles.radioGroup}>
            {roundTypeOptions.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.radioButton,
                  roundType === type && styles.radioButtonSelected
                ]}
                onPress={() => setRoundType(type)}
              >
                <Text style={[
                  styles.radioButtonText,
                  roundType === type && styles.radioButtonTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tournament Rounds</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addRound}
          >
            <Plus size={20} color="#EAEAEA" />
            <Text style={styles.addButtonText}>Add Round</Text>
          </TouchableOpacity>
        </View>

        {rounds.map((round) => (
          <View key={round.round_number} style={styles.roundCard}>
            <View style={styles.roundHeader}>
              <Trophy size={20} color="#A259FF" />
              <TextInput
                style={styles.roundNameInput}
                value={round.round_name}
                onChangeText={(value) => updateRound(round.round_number, 'round_name', value)}
                placeholder="Round Name"
                placeholderTextColor="#6c757d"
              />
              {rounds.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeRound(round.round_number)}
                >
                  <Minus size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.roundRulesContainer}>
              <Text style={styles.roundSubtitle}>Round Rules</Text>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Start Date (EDT) *</Text>
                  <View style={styles.inputWithIcon}>
                    <Calendar size={20} color="#A259FF" />
                    <TextInput
                      style={styles.iconInput}
                      value={round.display_start_date}
                      onChangeText={(value) => updateRound(round.round_number, 'display_start_date', value)}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#6c757d"
                    />
                  </View>
                </View>
                
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>End Date (EDT) *</Text>
                  <View style={styles.inputWithIcon}>
                    <Calendar size={20} color="#A259FF" />
                    <TextInput
                      style={styles.iconInput}
                      value={round.display_end_date}
                      onChangeText={(value) => updateRound(round.round_number, 'display_end_date', value)}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#6c757d"
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Max Total Bets</Text>
                  <TextInput
                    style={styles.roundInput}
                    value={round.max_total_bets.toString()}
                    onChangeText={(value) => updateRound(round.round_number, 'max_total_bets', parseInt(value) || 0)}
                    placeholder="10"
                    placeholderTextColor="#6c757d"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Max Parlay Length</Text>
                  <TextInput
                    style={styles.roundInput}
                    value={round.max_parlay_length.toString()}
                    onChangeText={(value) => updateRound(round.round_number, 'max_parlay_length', parseInt(value) || 0)}
                    placeholder="3"
                    placeholderTextColor="#6c757d"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Minimum Round Risk (BBZ)</Text>
                <View style={styles.inputWithIcon}>
                  <DollarSign size={20} color="#A259FF" />
                  <TextInput
                    style={styles.iconInput}
                    value={round.minimum_risk.toString()}
                    onChangeText={(value) => updateRound(round.round_number, 'minimum_risk', parseInt(value) || 0)}
                    placeholder="100"
                    placeholderTextColor="#6c757d"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Survivor Percentage</Text>
                <View style={styles.radioGroup}>
                  {survivorMetricOptions.map((metric) => (
                    <TouchableOpacity
                      key={metric}
                      style={[
                        styles.radioButton,
                        round.survivor_metric === metric && styles.radioButtonSelected
                      ]}
                      onPress={() => updateRound(round.round_number, 'survivor_metric', metric)}
                    >
                      <Text style={[
                        styles.radioButtonText,
                        round.survivor_metric === metric && styles.radioButtonTextSelected
                      ]}>
                        {metric}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Survivor Type</Text>
                <View style={styles.radioGroup}>
                  {survivorTypeOptions.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.radioButton,
                        round.survivor_type === type && styles.radioButtonSelected
                      ]}
                      onPress={() => updateRound(round.round_number, 'survivor_type', type)}
                    >
                      <Text style={[
                        styles.radioButtonText,
                        round.survivor_type === type && styles.radioButtonTextSelected
                      ]}>
                        {type.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Prize Distribution</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addPayoutTier}
          >
            <Plus size={20} color="#EAEAEA" />
            <Text style={styles.addButtonText}>Add Tier</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Payout Type</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                payoutType === 'PERCENTAGE' && styles.radioButtonSelected
              ]}
              onPress={() => setPayoutType('PERCENTAGE')}
            >
              <Text style={[
                styles.radioButtonText,
                payoutType === 'PERCENTAGE' && styles.radioButtonTextSelected
              ]}>
                Percentage
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                payoutType === 'AMOUNT' && styles.radioButtonSelected
              ]}
              onPress={() => setPayoutType('AMOUNT')}
            >
              <Text style={[
                styles.radioButtonText,
                payoutType === 'AMOUNT' && styles.radioButtonTextSelected
              ]}>
                Fixed Amount
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {payoutTiers.map((tier) => (
          <View key={tier.position} style={styles.payoutTierCard}>
            <View style={styles.payoutTierHeader}>
              <Text style={styles.payoutPlace}>
                {tier.position}{getOrdinalSuffix(tier.position)} Place
              </Text>
              {payoutType === 'PERCENTAGE' ? (
                <View style={styles.payoutInputContainer}>
                  <TextInput
                    style={styles.payoutInput}
                    value={tier.percentage.toString()}
                    onChangeText={(value) => updatePayoutTier(tier.position, 'percentage', parseFloat(value) || 0)}
                    placeholder="0"
                    placeholderTextColor="#6c757d"
                    keyboardType="numeric"
                  />
                  <Text style={styles.payoutUnit}>%</Text>
                </View>
              ) : (
                <View style={styles.payoutInputContainer}>
                  <DollarSign size={16} color="#A259FF" />
                  <TextInput
                    style={styles.payoutInput}
                    value={tier.amount.toString()}
                    onChangeText={(value) => updatePayoutTier(tier.position, 'amount', parseFloat(value) || 0)}
                    placeholder="0"
                    placeholderTextColor="#6c757d"
                    keyboardType="numeric"
                  />
                </View>
              )}
              {payoutTiers.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removePayoutTier(tier.position)}
                >
                  <Minus size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Show the calculated amount if in percentage mode */}
            {payoutType === 'PERCENTAGE' && parseFloat(prizePool) > 0 && (
              <Text style={styles.calculatedAmount}>
                ≈ ${((tier.percentage / 100) * parseFloat(prizePool)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Text>
            )}
          </View>
        ))}

        {payoutType === 'PERCENTAGE' && (
          <View style={styles.payoutTotal}>
            <Text style={styles.payoutTotalLabel}>Total:</Text>
            <Text style={[
              styles.payoutTotalValue,
              getTotalPayout() !== 100 && styles.payoutTotalError
            ]}>
              {getTotalPayout()}%
            </Text>
          </View>
        )}
        
        {payoutType === 'AMOUNT' && parseFloat(prizePool) > 0 && (
          <View style={styles.payoutTotal}>
            <Text style={styles.payoutTotalLabel}>Total:</Text>
            <Text style={[
              styles.payoutTotalValue,
              payoutTiers.reduce((sum, tier) => sum + tier.amount, 0) !== parseFloat(prizePool) && styles.payoutTotalError
            ]}>
              ${payoutTiers.reduce((sum, tier) => sum + tier.amount, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
              of ${parseFloat(prizePool).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Create Tournament</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#4A4A4A',
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  iconInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontFamily: 'Poppins-Regular',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A4A4A',
    backgroundColor: '#3D246C20',
  },
  radioButtonSelected: {
    backgroundColor: '#A259FF',
    borderColor: '#A259FF',
  },
  radioButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  radioButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D246C',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  roundCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  roundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  roundNameInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  roundRulesContainer: {
    backgroundColor: '#3D246C20',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  roundSubtitle: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  roundInput: {
    backgroundColor: '#3D246C40',
    borderRadius: 8,
    padding: 10,
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  removeButton: {
    padding: 4,
  },
  payoutTierCard: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  payoutTierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payoutPlace: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    width: 100,
  },
  payoutInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D246C',
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 12,
  },
  payoutInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
  },
  payoutUnit: {
    color: '#A259FF',
    fontSize: 16,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  calculatedAmount: {
    color: '#A259FF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
    marginRight: 50,
    fontFamily: 'Poppins-Regular',
  },
  payoutTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3D246C',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  payoutTotalLabel: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  payoutTotalValue: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  payoutTotalError: {
    color: '#EF4444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#A259FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A259FF80',
  },
  errorContainer: {
    backgroundColor: '#EF444420',
    borderRadius: 8,
    padding: 12,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  inputError: {
    color: '#EF4444',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
})