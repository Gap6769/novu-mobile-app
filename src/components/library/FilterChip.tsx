import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface FilterChipProps {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, active, icon, onPress }) => (
  <TouchableOpacity 
    style={[styles.filterChip, active && styles.activeFilterChip]} 
    onPress={onPress}
  >
    {icon}
    <Text style={[styles.filterChipText, active && styles.activeFilterChipText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#9575cd',
  },
  filterChipText: {
    color: '#b0b0b0',
    marginLeft: 4,
    fontSize: 14,
  },
  activeFilterChipText: {
    color: 'white',
  },
}); 