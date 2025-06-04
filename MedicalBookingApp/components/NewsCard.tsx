import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    summary: string;
    category: string;
    publishedAt: string;
    source: string;
    imageUrl: string;
  };
  onPress: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onPress }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return `${Math.floor(diffInHours / 24)} ngày trước`;
  };

  return (
    <TouchableOpacity style={styles.newsCard} onPress={onPress}>
      <View style={styles.newsHeader}>
        <View style={styles.newsInfo}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{news.category}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {news.title}
          </Text>
          <Text style={styles.summary} numberOfLines={2}>
            {news.summary}
          </Text>
          <View style={styles.sourceContainer}>
            <Text style={styles.source}>{news.source}</Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(news.publishedAt)}</Text>
          </View>
        </View>
        <Image source={{ uri: news.imageUrl }} style={styles.newsImage} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsHeader: {
    flexDirection: 'row',
  },
  newsInfo: {
    flex: 1,
    marginRight: 12,
  },
  categoryContainer: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  sourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    color: '#888',
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default NewsCard; 