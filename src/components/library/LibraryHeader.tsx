import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { Search, Settings } from 'lucide-react-native';
import { Images } from '@assets/images';

interface LibraryHeaderProps {
  onSearchPress: () => void;
  onSettingsPress: () => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  onSearchPress,
  onSettingsPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
      <Image
          source={Images.logo}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.headerActions}>
          <FAB
            icon={() => <Search size={24} color="white" />}
            style={styles.fab}
            onPress={onSearchPress}
            color="white"
            size="small"
          />
          <FAB
            icon={() => <Settings size={24} color="white" />}
            style={styles.fab}
            onPress={onSettingsPress}
            color="white"
            size="small"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  fab: {
    backgroundColor: '#2a2a2a',
    marginLeft: 8,
  },
  image: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
}); 