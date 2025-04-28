import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

interface LibrarySearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onClose: () => void;
}

export const LibrarySearchBar: React.FC<LibrarySearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClose,
}) => {
  return (
    <View style={styles.searchContainer}>
      <Searchbar
        placeholder="Search titles or authors..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor="#9575cd"
        placeholderTextColor="#757575"
        onIconPress={() => {
          if (searchQuery === '') {
            onClose();
          } else {
            onSearchChange('');
          }
        }}
        icon={searchQuery === '' ? 'arrow-left' : 'close'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    backgroundColor: '#2a2a2a',
    elevation: 0,
  },
  searchInput: {
    color: 'white',
  },
}); 