import Constants from 'expo-constants';
import { DOMParser } from '@xmldom/xmldom';

export type RssItem = {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  image: string;
  league?: string;
};

// Type definition for xmldom Document to fix type issues
type XMLDocument = Document & {
  getElementsByTagName(tagName: string): NodeListOf<Element>;
};

// Helper functions for XML parsing since xmldom doesn't support querySelectorAll
export const getAllElements = (node: XMLDocument | Element, tagName: string): Element[] => {
  const result: Element[] = [];
  const elements = node.getElementsByTagName(tagName);
  for (let i = 0; i < elements.length; i++) {
    result.push(elements[i]);
  }
  return result;
};

export const getFirstElement = (node: XMLDocument | Element, tagName: string): Element | null => {
  const elements = node.getElementsByTagName(tagName);
  return elements.length > 0 ? elements[0] : null;
};

export const getElementText = (node: Element, tagName: string): string | null => {
  const element = getFirstElement(node, tagName);
  return element ? element.textContent : null;
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 24) {
      return diffHrs === 0 ? 'Just now' : `${diffHrs}h ago`;
    } else {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      return `${day} ${month}`;
    }
  } catch (e) {
    return dateString;
  }
};

// Helper function to extract read time from description length
export const getReadTime = (description: string): string => {
  if (!description) return '1 min read';
  
  // Average reading speed is about 200 words per minute
  const wordCount = description.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  
  return `${minutes} min read`;
};

/**
 * Fetches RSS feed from the specified URL
 * @param feedUrl The URL of the RSS feed
 * @param league The league identifier (NCAA, IPL, NBA, NHL)
 * @returns Promise with array of RssItem objects
 */
export const fetchRssFeed = async (feedUrl: string, league: string): Promise<RssItem[]> => {
  try {
    const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'https://battle-betz-api.impute.pro/api/v1/';
    const rssUrl = `${apiUrl}proxy/rss?url=${encodeURIComponent(feedUrl)}`;
    
    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${league} RSS feed`);
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml') as unknown as XMLDocument;
    
    const itemElements = getAllElements(xmlDoc, 'item');
    const parsedItems: RssItem[] = [];
    
    // Take only the first 10 items
    const items = itemElements.slice(0, 10);
    
    items.forEach(item => {
      const title = getElementText(item, 'title') || '';
      const description = getElementText(item, 'description') || '';
      const link = getElementText(item, 'link') || '';
      const pubDate = getElementText(item, 'pubDate') || '';
      
      // Try to extract image from description or media:content
      let image = '';
      const mediaContent = getFirstElement(item, 'media:content') || getFirstElement(item, 'content');
      if (mediaContent && mediaContent.getAttribute('url')) {
        image = mediaContent.getAttribute('url') || '';
      } else if (description) {
        // Try to extract image from HTML description
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          image = imgMatch[1];
        }
      }
      
      // If no image found, use a placeholder based on league
      if (!image) {
        const placeholders = {
          ncaa: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=2187&auto=format&fit=crop',
          ipl: 'https://images.unsplash.com/photo-1624526267942-ab0c0e53d0e3?q=80&w=2070&auto=format&fit=crop',
          nba: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop',
          nhl: 'https://images.unsplash.com/photo-1580692475446-c2fabbbbf835?q=80&w=2070&auto=format&fit=crop'
        };
        image = placeholders[league.toLowerCase() as keyof typeof placeholders] || 'https://via.placeholder.com/800x400';
      }
      
      parsedItems.push({
        title,
        description,
        link,
        pubDate,
        image,
        league: league.toUpperCase()
      });
    });
    
    return parsedItems;
  } catch (error) {
    console.error(`Error fetching ${league} RSS feed:`, error);
    throw error;
  }
};

// Feed URLs for different leagues
export const RSS_FEEDS = {
  NCAA: 'https://www.ncaa.com/news/basketball-men/d1/rss.xml',
  IPL: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml',
  NBA: 'https://www.rotowire.com/rss/news.php?sport=NBA',
  NHL: 'https://thehockeywriters.com/feed/'
};