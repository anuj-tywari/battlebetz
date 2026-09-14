'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy, Calendar, Users, DollarSign, Star, Zap, Shield, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { getTournaments, type Tournament } from '@/services/tournaments';
import { getLatestNews, type News } from '@/services/news/index';
import TournamentBanner from '@/components/tournaments/TournamentBanner';
import ImageSlider from '@/components/ui/ImageSlider';

export default function HomePage() {
  const [featuredTournament, setFeaturedTournament] = useState<Tournament | null>(null);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      if (!mounted) return;
      
      try {
        setLoading(true);
        
        // Fetch featured upcoming tournaments
        const { data: tournamentsData } = await getTournaments({
          status: 'UPCOMING',
          sportCategory: undefined
        });
        
        if (tournamentsData && tournamentsData.length > 0) {
          // Just take the first tournament for the featured section
          setFeaturedTournament(tournamentsData[0]);
        }
        
        // Fetch latest news
        const { data: newsData } = await getLatestNews(3);
        if (newsData) {
          setLatestNews(newsData);
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchInitialData();
  }, [mounted]);

  // Slider items for the image carousel - only using the two specified images
  const sliderItems = [
    {
      id: '1',
      image: '/assets/images/FeaturedBet_Basketball Players.jpg',
      overlayText: 'First NBA Playoff Prediction Tournament',
      overlaySubtext: 'Join Worlds First NBA Playoff Prediction Tournament',
      buttonText: 'Join Tournament',
      buttonLink: '/tournaments/nba-playoffs'
    },
    {
      id: '2',
      image: '/assets/images/FeaturedBetPanel_NHL.jpg',
      overlayText: 'NHL Stanley Cup Challenge',
      overlaySubtext: 'Predict playoff matches and win exclusive prizes',
      buttonText: 'Join Challenge',
      buttonLink: '/tournaments/nhl'
    }
  ];

  return (
    <main className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 to-indigo-800 py-16 md:py-24">
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <Image 
              src="/assets/images/battle_your_friends.png" 
              alt="BattleBetz Logo" 
              width={400} 
              height={300}
              className="mx-auto md:mx-0"
              priority
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Join The First Ever Social Gaming Prediction Tournament
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Check out our upcoming tournaments and battles.
            </p>
            <p className="text-lg text-purple-300 mb-10">
              Join thousands of players in tournaments and battles. Compete, strategize, and win big.
            </p>
            <Link 
              href="/tournaments" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-colors inline-flex items-center"
            >
              View Tournaments
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Full Width Image Slider Section */}
      <section className="relative">
        <div className="w-full">
          <ImageSlider items={sliderItems} height="h-[600px]" />
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Battle Your Friends in Prediction Tournaments</h2>
          <p className="text-lg text-gray-300 mb-10">
            BattleBetz brings social competition to sports betting. Create tournaments, invite friends, and compete for bragging rights and prizes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Join Tournaments</h3>
              <p className="text-gray-300">Enter competitive tournaments with players from around the world.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Battle Friends</h3>
              <p className="text-gray-300">Create private competitions and invite your friends to join the fun.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Win Prizes</h3>
              <p className="text-gray-300">Top players win prizes in each tournament based on performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tournament Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Tournament</h2>
            <Link 
              href="/tournaments" 
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
            </div>
          ) : featuredTournament ? (
            <TournamentBanner tournament={featuredTournament} />
          ) : (
            <div className="bg-gray-700 rounded-lg p-8 text-center">
              <Trophy size={48} className="mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Coming Soon!</h3>
              <p className="text-gray-300 mb-6">Our first tournaments are being prepared. Check back soon!</p>
              <Link
                href="/tournaments"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Browse All Tournaments
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Battle Your Friends Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <Image 
                src="/assets/images/FriendsCompeting.jpg" 
                alt="Friends competing" 
                width={600} 
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Create Your Own Battle</h2>
              <p className="text-lg text-gray-300 mb-6">
                Start a competition with your friends and see who has the best prediction skills. Set custom rules, invite participants, and track results in real-time.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-purple-600 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-white" />
                  </div>
                  <span>Customizable entry fees and prize pools</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-600 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-white" />
                  </div>
                  <span>Private or public tournaments</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-600 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-white" />
                  </div>
                  <span>Live leaderboards and statistics</span>
                </li>
              </ul>
              <Link 
                href="/create-tournament" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                Create Tournament <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Latest News</h2>
            <Link 
              href="/news" 
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((newsItem) => (
              <Link 
                key={newsItem.id} 
                href={`/news/${newsItem.id}`}
                className="bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-lg overflow-hidden shadow-lg border border-gray-600 hover:border-purple-500/30"
              >
                <div className="h-48 relative">
                  <Image
                    src={'/assets/images/news-placeholder.jpg'}
                    alt={newsItem.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase font-medium text-purple-400">
                      {newsItem.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(newsItem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2 line-clamp-2">
                    {newsItem.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {newsItem.content.substring(0, 120) + '...'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-800 to-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Competing?</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Join BattleBetz today and experience the thrill of tournament-style prediction battles. 
            Compete with others, show off your knowledge, and win prizes!
          </p>
          <Link 
            href="/signup" 
            className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-3 rounded-md font-bold transition-colors inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </main>
  );
}
