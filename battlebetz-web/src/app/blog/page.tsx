import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, ChevronRight, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | BattleBetz',
  description: 'Latest news, tips, and updates from the BattleBetz team',
};

// Mock blog posts data - in a real application, this would come from a database or API
const blogPosts = [
  {
    id: 1,
    title: 'How to Pick Winning Bets: A Statistical Approach',
    slug: 'how-to-pick-winning-bets',
    excerpt: 'Learn how to use statistical analysis to improve your betting strategy and increase your chances of winning.',
    image: '/assets/images/battle_your_friends.png',
    author: 'Alex Johnson',
    date: 'June 15, 2023',
    readTime: '8 min read',
    category: 'Betting Tips'
  },
  {
    id: 2,
    title: 'Top 5 Tournaments to Join This Summer',
    slug: 'top-5-tournaments-summer',
    excerpt: 'Check out our selection of the most exciting betting tournaments happening this summer on BattleBetz.',
    image: '/assets/images/best_of_best.png',
    author: 'Maria Garcia',
    date: 'June 10, 2023',
    readTime: '6 min read',
    category: 'Tournaments'
  },
  {
    id: 3,
    title: 'Understanding Odds: A Beginner\'s Guide',
    slug: 'understanding-odds-beginners-guide',
    excerpt: 'New to betting? Learn the basics of understanding odds and how they work in different betting formats.',
    image: '/assets/images/bracket-mayhem.png',
    author: 'Ryan Brown',
    date: 'June 5, 2023',
    readTime: '10 min read',
    category: 'Beginner Guides'
  },
  {
    id: 4,
    title: 'The Psychology of Betting: Avoiding Common Traps',
    slug: 'psychology-of-betting',
    excerpt: 'Discover the psychological factors that affect betting decisions and learn how to avoid common mental traps.',
    image: '/assets/images/celebrity.png',
    author: 'Emma Wilson',
    date: 'May 28, 2023',
    readTime: '9 min read',
    category: 'Strategy'
  },
  {
    id: 5,
    title: 'New Features Coming to BattleBetz This Fall',
    slug: 'new-features-fall',
    excerpt: 'Get a sneak peek at the exciting new features and improvements coming to BattleBetz in the upcoming months.',
    image: '/assets/images/fantasy.png',
    author: 'David Chen',
    date: 'May 20, 2023',
    readTime: '5 min read',
    category: 'Platform Updates'
  },
  {
    id: 6,
    title: 'Interview with a Champion: Meet Last Month\'s Tournament Winner',
    slug: 'interview-tournament-winner',
    excerpt: 'We sit down with last month\'s major tournament winner to discuss their strategy, experience, and tips for success.',
    image: '/assets/images/celebrity_high_stakes.png',
    author: 'James Wilson',
    date: 'May 15, 2023',
    readTime: '12 min read',
    category: 'Interviews'
  }
];

// Categories for the filter
const categories = [
  'All Categories',
  'Betting Tips',
  'Tournaments',
  'Beginner Guides',
  'Strategy',
  'Platform Updates',
  'Interviews'
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            The BattleBetz Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay updated with the latest news, betting strategies, and insights from the world of competitive betting
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2 relative">
            <input 
              type="text"
              placeholder="Search articles..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <select className="bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              {categories.map((category, index) => (
                <option key={index} value={category === 'All Categories' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Featured Post */}
        <div className="mb-16">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image
              src="/assets/images/FeaturedBet_Basketball Players.jpg"
              alt="Featured Post"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="bg-purple-600 text-white text-sm py-1 px-3 rounded-full mb-3 inline-block">
                Featured
              </span>
              <h2 className="text-3xl font-bold text-white mb-3">
                The Art of War: Strategic Thinking in Tournament Betting
              </h2>
              <p className="text-gray-300 mb-4 max-w-3xl">
                Learn how to apply Sun Tzu's principles to your betting strategy and dominate the competition.
              </p>
              <div className="flex items-center text-gray-400 mb-4">
                <span className="flex items-center mr-4">
                  <CalendarDays size={16} className="mr-1" />
                  June 20, 2023
                </span>
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  15 min read
                </span>
              </div>
              <Link 
                href="/blog/art-of-war-betting"
                className="text-white bg-purple-600 hover:bg-purple-700 py-2 px-5 rounded-lg font-medium inline-flex items-center transition-colors"
              >
                Read Article <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-sm text-purple-400 mb-2 inline-block">{post.category}</span>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-purple-400 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span>{post.date}</span> · <span>{post.readTime}</span>
                  </div>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium inline-flex items-center transition-colors"
                  >
                    Read More <ChevronRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get the latest betting tips, tournament announcements, and platform updates delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-purple-900 hover:bg-gray-100 font-bold px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 