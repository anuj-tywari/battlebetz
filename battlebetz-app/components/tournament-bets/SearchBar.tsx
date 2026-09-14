import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClear }) => {
  return (
    <View style={styles.searchContainer}>
      <Search size={20} color="#A259FF" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search teams..."
        placeholderTextColor="#6c757d"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={onClear}
        >
          <X size={16} color="#EAEAEA" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;