import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleAlert as AlertCircle } from 'lucide-react-native';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.errorContainer}>
      <AlertCircle size={40} color="#FF4D4F" />
      <Text style={styles.errorText}>Failed to load games</Text>
      <Text style={styles.errorDescription}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    fontFamily: 'Poppins-Bold',
  },
  errorDescription: {
    color: '#EAEAEA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
  },
  retryButton: {
    backgroundColor: '#A259FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ErrorState;