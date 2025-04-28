import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Surface } from 'react-native-paper';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading your novels...' }) => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color="#9575cd" />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <View style={styles.centered}>
    <Text style={styles.errorText}>Error loading novels</Text>
    <Text style={styles.errorSubtext}>{error.message}</Text>
    <Surface style={styles.retrySurface}>
      <Text style={styles.retryText} onPress={onRetry}>
        Tap to retry
      </Text>
    </Surface>
  </View>
);

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No novels found' }) => (
  <View style={styles.centered}>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#b0b0b0',
    marginBottom: 16,
  },
  retrySurface: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
  },
  retryText: {
    color: '#9575cd',
    fontSize: 16,
  },
  emptyText: {
    color: '#b0b0b0',
    fontSize: 16,
  },
}); 