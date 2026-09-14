import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { Search, X, Filter, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import TopNavigation from '../components/TopNavigation';

type NewsCategory = 'all' | 'tournaments' | 'fantasy' | 'battles' | 'analysis';

export default function NewsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');

  const categories: { id: NewsCategory; label: string }[] = [
    { id: 'all', label: 'All News' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'fantasy', label: 'Fantasy League' },
    { id: 'battles', label: 'Battles' },
    { id: 'analysis', label: 'Analysis' }
  ];

  const newsItems = [
    {
      id: '1',
      category: 'tournaments',
      title: 'March Madness Tournament Announced',
      excerpt: 'Get ready for the biggest betting tournament of the year with a $5,000 prize pool.',
      image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
      date: '2 hours ago',
      readTime: '3 min read'
    },
    {
      id: '2',
      category: 'fantasy',
      title: 'New Fantasy League Features Released',
      excerpt: 'Introducing custom league creation and enhanced scoring systems.',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2068&auto=format&fit=crop',
      date: '4 hours ago',
      readTime: '5 min read'
    },
    {
      id: '3',
      category: 'battles',
      title: 'Top Battle Strategies Revealed',
      excerpt: 'Learn from the pros: winning strategies for peer-to-peer betting.',
      image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop',
      date: '6 hours ago',
      readTime: '4 min read'
    },
    {
      id: '4',
      category: 'analysis',
      title: 'Market Analysis: March Madness Odds',
      excerpt: 'Deep dive into the odds and potential upsets for March Madness.',
      image: 'https://images.unsplash.com/photo-1590552515252-3a5a1bce7bed?q=80&w=1974&auto=format&fit=crop',
      date: '8 hours ago',
      readTime: '6 min read'
    }
  ];

  const filteredNews = newsItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <TopNavigation />
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>Latest Updates</Text>
            <Text style={styles.heroTitle}>Battle Betz News</Text>
            <Text style={styles.heroText}>
              Stay informed with the latest updates, strategies, and insights from the Battle Betz community.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Search and Filter */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#A259FF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search news..."
                placeholderTextColor="#6c757d"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <X size={16} color="#EAEAEA" />
                </TouchableOpacity>
              )}
            </View>
          </View>
kkk
          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={
                  selectedCategory === category.id 
                    ? styles.categoryButtonTextActive 
                    : styles.categoryButtonText
                }>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* News Grid */}
          <View style={styles.newsGrid}>
            {filteredNews.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.newsCard}
                onPress={() => {/* Navigate to news detail */}}
              >
                <Image 
                  source={{ uri: item.image }}
                  style={styles.newsImage}
                />
                <View style={styles.newsContent}>
                  <View style={styles.newsHeader}>
                    <Text style={styles.newsCategory}>
                      {categories.find(c => c.id === item.category)?.label}
                    </Text>
                    <Text style={styles.newsDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsExcerpt}>{item.excerpt}</Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.readTime}>{item.readTime}</Text>
                    <ChevronRight size={16} color="#A259FF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            
            {filteredNews.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No news articles found matching your search.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  hero: {
    backgroundColor: '#2E2E3A',
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  heroContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  heroSubtitle: {
    color: '#A259FF',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#EAEAEA',
    fontSize: 56,
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  heroText: {
    color: '#A259FF',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 32,
  },
  content: {
    padding: 24,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryButton: {
    backgroundColor: '#2E2E3A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#A259FF',
  },
  categoryButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  newsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  newsCard: {
    width: '30%',
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: '1.5%',
    marginBottom: 24,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsCategory: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  newsDate: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  newsTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  newsExcerpt: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    opacity: 0.8,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  noResultsContainer: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
});



