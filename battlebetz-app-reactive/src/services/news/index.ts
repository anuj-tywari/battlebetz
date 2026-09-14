import { supabase } from '@/lib/supabase';

// Define a News type for our mock data
export type News = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  category: string;
  slug: string;
  featured: boolean;
};

// Mock news data
const mockNewsData: News[] = [
  {
    id: '1',
    title: 'March Madness Bracket Challenge Announced',
    content: 'Join our biggest tournament of the year with a $10,000 prize pool. Predict the perfect bracket and win big!',
    excerpt: 'Join our biggest tournament of the year with a $10,000 prize pool.',
    author: 'BattleBetz Team',
    image_url: '/assets/images/bracket-mayhem.png',
    created_at: '2023-03-01T08:00:00Z',
    updated_at: '2023-03-01T08:00:00Z',
    published: true,
    category: 'Tournaments',
    slug: 'march-madness-bracket-challenge',
    featured: true
  },
  {
    id: '2',
    title: 'NBA Playoffs Prediction Contest Opens Next Week',
    content: 'Get ready for the NBA playoffs with our exclusive prediction tournament. Entry opens Monday!',
    excerpt: 'Get ready for the NBA playoffs with our exclusive prediction tournament.',
    author: 'Michael Johnson',
    image_url: '/assets/images/Basketball Players.jpg',
    created_at: '2023-04-08T10:30:00Z',
    updated_at: '2023-04-08T10:30:00Z',
    published: true,
    category: 'Basketball',
    slug: 'nba-playoffs-prediction-contest',
    featured: true
  },
  {
    id: '3',
    title: 'New Features Added to BattleBetz Platform',
    content: 'We\'ve added new features to enhance your experience including live score updates and friend challenges.',
    excerpt: 'We\'ve added new features to enhance your experience.',
    author: 'BattleBetz Team',
    image_url: '/assets/images/battle_your_friends.png',
    created_at: '2023-02-15T14:15:00Z',
    updated_at: '2023-02-15T14:15:00Z',
    published: true,
    category: 'Platform Updates',
    slug: 'new-features-added',
    featured: false
  },
  {
    id: '4',
    title: 'NFL Season Preview: Teams to Watch',
    content: 'Our experts break down the top contenders for the upcoming NFL season and which teams might surprise.',
    excerpt: 'Our experts break down the top contenders for the upcoming NFL season.',
    author: 'Chris Thompson',
    image_url: '/assets/images/best_of_best.png',
    created_at: '2023-08-20T09:45:00Z',
    updated_at: '2023-08-20T09:45:00Z',
    published: true,
    category: 'Football',
    slug: 'nfl-season-preview',
    featured: false
  },
  {
    id: '5',
    title: 'Celebrity Tournament Raises $50,000 for Charity',
    content: 'Celebrities competed in our special charity tournament raising funds for youth sports programs.',
    excerpt: 'Celebrities competed in our special charity tournament.',
    author: 'Sarah Williams',
    image_url: '/assets/images/celebrity.png',
    created_at: '2023-07-12T16:20:00Z',
    updated_at: '2023-07-12T16:20:00Z',
    published: true,
    category: 'Events',
    slug: 'celebrity-tournament-charity',
    featured: false
  }
];

export async function getNews(
  filters?: {
    category?: string;
    limit?: number;
    publishedOnly?: boolean;
  }
): Promise<{ data: News[] | null; error: string | null }> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    let filteredNews = [...mockNewsData];
    
    if (filters?.category && filters.category !== 'All') {
      filteredNews = filteredNews.filter(news => news.category === filters.category);
    }
    
    if (filters?.publishedOnly) {
      filteredNews = filteredNews.filter(news => news.published);
    }
    
    // Sort by most recent
    filteredNews = filteredNews.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    if (filters?.limit) {
      filteredNews = filteredNews.slice(0, filters.limit);
    }
    
    return { data: filteredNews, error: null };
  } catch (err) {
    console.error('Get news error:', err);
    return { data: null, error: 'An unexpected error occurred while fetching news' };
  }
}

export async function getNewsById(id: string): Promise<{ data: News | null; error: string | null }> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newsItem = mockNewsData.find(news => news.id === id);
    
    if (!newsItem) {
      return { data: null, error: 'News item not found' };
    }
    
    return { data: newsItem, error: null };
  } catch (err) {
    console.error('Get news item error:', err);
    return { data: null, error: 'An unexpected error occurred while fetching news item' };
  }
}

export async function getLatestNews(limit: number = 5): Promise<{ data: News[] | null; error: string | null }> {
  return getNews({ limit, publishedOnly: true });
}

export async function getNewsByCategory(
  category: string,
  limit?: number
): Promise<{ data: News[] | null; error: string | null }> {
  return getNews({ category, limit, publishedOnly: true });
} 