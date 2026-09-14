"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';

// Mock news data
const newsArticles = [
  {
    id: 1,
    title: "March Madness Bracket Challenge Announced",
    excerpt: "Join our biggest tournament of the year with a $10,000 prize pool. Predict the perfect bracket and win big!",
    category: "Tournaments",
    image: "/assets/images/bracket-mayhem.png",
    author: "BattleBetz Team",
    date: "March 1, 2023",
    featured: true
  },
  {
    id: 2,
    title: "NBA Playoffs Prediction Contest Opens Next Week",
    excerpt: "Get ready for the NBA playoffs with our exclusive prediction tournament. Entry opens Monday!",
    category: "Basketball",
    image: "/assets/images/Basketball Players.jpg",
    author: "Michael Johnson",
    date: "April 8, 2023",
    featured: true
  },
  {
    id: 3,
    title: "New Features Added to BattleBetz Platform",
    excerpt: "We've added new features to enhance your experience including live score updates and friend challenges.",
    category: "Platform Updates",
    image: "/assets/images/battle_your_friends.png",
    author: "BattleBetz Team",
    date: "February 15, 2023",
    featured: false
  },
  {
    id: 4,
    title: "NFL Season Preview: Teams to Watch",
    excerpt: "Our experts break down the top contenders for the upcoming NFL season and which teams might surprise.",
    category: "Football",
    image: "/assets/images/best_of_best.png",
    author: "Chris Thompson",
    date: "August 20, 2023",
    featured: false
  },
  {
    id: 5,
    title: "Celebrity Tournament Raises $50,000 for Charity",
    excerpt: "Celebrities competed in our special charity tournament raising funds for youth sports programs.",
    category: "Events",
    image: "/assets/images/celebrity.png",
    author: "Sarah Williams",
    date: "July 12, 2023",
    featured: false
  },
  {
    id: 6,
    title: "Fantasy Sports Integration Coming Soon",
    excerpt: "We're excited to announce upcoming integration with major fantasy sports platforms for a seamless experience.",
    category: "Platform Updates",
    image: "/assets/images/fantasy.png",
    author: "BattleBetz Team",
    date: "May 3, 2023",
    featured: false
  }
];

const categories = [
  "All Categories",
  "Tournaments",
  "Basketball",
  "Football",
  "Baseball",
  "Hockey",
  "Soccer",
  "Esports",
  "Platform Updates",
  "Events"
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Filter articles based on search query and selected category
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get featured articles
  const featuredArticles = newsArticles.filter(article => article.featured);
  
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">BattleBetz News</h1>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Featured Articles */}
        {searchQuery === '' && selectedCategory === 'All Categories' && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <div key={article.id} className="bg-gray-800 rounded-xl overflow-hidden transition-transform hover:transform hover:scale-[1.02]">
                  <div className="relative h-64">
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{article.date}</span>
                      <span className="mx-2">•</span>
                      <User className="h-4 w-4 mr-1" />
                      <span>{article.author}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                    <p className="text-gray-300 mb-4">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                        <Tag className="h-3 w-3 mr-1" />
                        {article.category}
                      </span>
                      <Link 
                        href={`/news/${article.id}`} 
                        className="text-purple-400 hover:text-purple-300 inline-flex items-center"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* All Articles or Filtered Results */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {searchQuery !== '' || selectedCategory !== 'All Categories' 
              ? 'Search Results' 
              : 'Latest News'}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl">
              <p className="text-gray-300 text-lg">No articles found matching your criteria.</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('All Categories');}} 
                className="mt-4 text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <div key={article.id} className="bg-gray-800 rounded-xl overflow-hidden h-full flex flex-col transition-transform hover:transform hover:scale-[1.02]">
                  <div className="relative h-48">
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{article.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{article.title}</h3>
                    <p className="text-gray-300 mb-4 flex-grow">{article.excerpt}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                        {article.category}
                      </span>
                      <Link 
                        href={`/news/${article.id}`} 
                        className="text-purple-400 hover:text-purple-300 inline-flex items-center"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-20 bg-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest news, tournament announcements, and special offers directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 