import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book, BookOpen, Filter } from 'lucide-react-native';

import { useNovels } from '../api/services/content';
import { NovelCard, Novel } from '../components/library/NovelCard';
import { FilterChip } from '../components/library/FilterChip';
import { LibrarySearchBar } from '../components/library/LibrarySearchBar';
import { LibraryHeader } from '../components/library/LibraryHeader';
import { LoadingState, ErrorState, EmptyState } from '../components/library/LibraryStates';

const LibraryScreen = ({ navigation }: { navigation: any }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'novel', 'manhwa'
  const { data: novels, isLoading, error, refetch } = useNovels();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  // Filter and search novels
  const filteredNovels = useMemo(() => {
    if (!novels) return [];
    
    return novels.filter((novel: Novel) => {
      // Apply type filter
      const typeMatch = filter === 'all' || novel.type === filter;
      
      // Apply search filter if search query exists
      const searchMatch = !searchQuery || 
        novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (novel.author && novel.author.toLowerCase().includes(searchQuery.toLowerCase()));
        
      return typeMatch && searchMatch;
    });
  }, [novels, filter, searchQuery]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: '#1a1a1a', 
          paddingTop: insets.top,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      {showSearch ? (
        <LibrarySearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => setShowSearch(false)}
        />
      ) : (
        <LibraryHeader
          onSearchPress={() => setShowSearch(true)}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
      )}

      <View style={styles.filterContainer}>
        <FilterChip
          label="All"
          active={filter === 'all'}
          icon={<Book size={16} color={filter === 'all' ? 'white' : '#b0b0b0'} />}
          onPress={() => setFilter('all')}
        />
        <FilterChip
          label="Novels"
          active={filter === 'novel'}
          icon={<Book size={16} color={filter === 'novel' ? 'white' : '#b0b0b0'} />}
          onPress={() => setFilter('novel')}
        />
        <FilterChip
          label="Manhwa"
          active={filter === 'manhwa'}
          icon={<BookOpen size={16} color={filter === 'manhwa' ? 'white' : '#b0b0b0'} />}
          onPress={() => setFilter('manhwa')}
        />
      </View>

      {filteredNovels.length === 0 ? (
        <EmptyState message={searchQuery ? "No novels match your search" : "No novels found"} />
      ) : (
        <FlatList
          data={filteredNovels}
          renderItem={({ item, index }) => (
            <NovelCard
              item={item}
              index={index}
              onPress={() => navigation.navigate('NovelDetails', { novelId: item._id })}
            />
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#9575cd"
            />
          }
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContent: {
    padding: 8,
    paddingBottom: 16,
  },
});

export default LibraryScreen;