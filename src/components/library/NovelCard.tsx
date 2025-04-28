import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';

export interface Novel {
  _id: string;
  title: string;
  author?: string;
  cover_image_url?: string;
  read_chapters: number;
  total_chapters: number;
  downloaded_chapters: number;
  type: 'novel' | 'manhwa';
  last_updated?: string;
  status?: string;
}

interface NovelCardProps {
  item: Novel;
  index: number;
  onPress: () => void;
}

export const NovelCard: React.FC<NovelCardProps> = ({ item, index, onPress }) => {
  const theme = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.95);
  
  useEffect(() => {
    const delay = index * 70;
    
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
    scale.value = withDelay(delay, withSpring(1, {
      damping: 8,
      stiffness: 40,
    }));
  }, [index]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));
  
  const progress = item.total_chapters ? Math.round((item.read_chapters / item.total_chapters) * 100) : 0;
  
  return (
    <Animated.View style={[animatedStyle, styles.cardContainer]}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={onPress}
      >
        <View style={styles.cardContent}>
          <ImageBackground
            source={{ uri: item.cover_image_url || 'https://via.placeholder.com/150' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
            />
            
            <View style={styles.typeIndicator}>
              <View 
                style={[
                  styles.typeIndicatorDot, 
                  item.type === 'novel' ? styles.novelIndicator : styles.manhwaIndicator
                ]} 
              />
            </View>
            
            {item.downloaded_chapters > 0 && (
              <View style={styles.downloadIndicator}>
                <View style={styles.downloadBadge}>
                  <Text style={styles.downloadBadgeText}>{item.downloaded_chapters}</Text>
                </View>
              </View>
            )}
          </ImageBackground>
          
          <View style={styles.cardDetails}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <View style={styles.authorContainer}>
              <Text variant="bodyMedium" style={styles.author} numberOfLines={1}>
                {item.author || 'Unknown Author'}
              </Text>
              <Text variant="bodyMedium" style={styles.author} numberOfLines={1}>
                {item.total_chapters}
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '50%',
    padding: 6,
  },
  cardTouchable: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  cardImage: {
    height: 200,
    width: '100%',
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  typeIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  typeIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  novelIndicator: {
    backgroundColor: '#9575cd',
  },
  manhwaIndicator: {
    backgroundColor: '#42a5f5',
  },
  downloadIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  downloadBadge: {
    backgroundColor: 'rgba(33, 33, 33, 0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  downloadBadgeText: {
    color: '#ff9800',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardDetails: {
    padding: 12,
    backgroundColor: '#2d2d2d',
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
  },
  author: {
    color: '#9e9e9e',
    marginBottom: 8,
    fontSize: 12,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#424242',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9575cd',
    borderRadius: 1.5,
  },
}); 