"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Trophy, Users, Calendar, ChevronRight } from 'lucide-react';

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState('featured');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <Image
            src="/assets/images/TheArena.jpg"
            alt="The Arena"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent flex items-center">
            <div className="ml-12 max-w-lg">
              <h1 className="text-5xl font-bold text-white mb-4">The Arena</h1>
              <p className="text-xl text-gray-200 mb-8">
                Jump into high-stakes competition, challenge friends, and put your prediction skills to the test.
              </p>
              <Link href="/tournaments" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition-colors">
                Find Tournaments <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex mb-8 border-b border-gray-800 overflow-x-auto">
          <button
            className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
              activeTab === 'featured' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('featured')}
          >
            Featured Battles
          </button>
          <button
            className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
              activeTab === 'upcoming' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
              activeTab === 'live' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('live')}
          >
            Live Now
          </button>
          <button
            className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
              activeTab === 'friends' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('friends')}
          >
            Friend Battles
          </button>
        </div>

        {/* Featured Battles Content */}
        {activeTab === 'featured' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Battle Card 1 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-purple-500/20 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="relative h-48">
                <Image 
                  src="/assets/images/bracket-mayhem.png" 
                  alt="March Madness" 
                  layout="fill" 
                  objectFit="cover"
                />
                <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">March Madness Bracket Challenge</h3>
                <p className="text-gray-400 mb-4">Predict the perfect bracket and win big! Join with friends or compete globally.</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-400">
                    <Trophy size={16} className="mr-2" />
                    <span>$5,000 Prize Pool</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users size={16} className="mr-2" />
                    <span>1.2k Participants</span>
                  </div>
                </div>
                <Link href="/tournaments/march-madness" className="flex justify-between items-center text-purple-400 hover:text-purple-300 font-medium">
                  Join Tournament <ChevronRight size={20} />
                </Link>
              </div>
            </div>

            {/* Battle Card 2 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-purple-500/20 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="relative h-48">
                <Image 
                  src="/assets/images/best_of_best.png" 
                  alt="NBA Playoffs" 
                  layout="fill" 
                  objectFit="cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  Hot
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">NBA Playoffs Prediction Battle</h3>
                <p className="text-gray-400 mb-4">Predict the winners of each round and compete against basketball experts.</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-400">
                    <Trophy size={16} className="mr-2" />
                    <span>$2,500 Prize Pool</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users size={16} className="mr-2" />
                    <span>876 Participants</span>
                  </div>
                </div>
                <Link href="/tournaments/nba-playoffs" className="flex justify-between items-center text-purple-400 hover:text-purple-300 font-medium">
                  Join Tournament <ChevronRight size={20} />
                </Link>
              </div>
            </div>

            {/* Battle Card 3 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-purple-500/20 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="relative h-48">
                <Image 
                  src="/assets/images/battle_your_friends.png" 
                  alt="Friend Battle" 
                  layout="fill" 
                  objectFit="cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  New
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Weekly Football Showdown</h3>
                <p className="text-gray-400 mb-4">Challenge your friends in a weekly NFL prediction contest with dynamic odds.</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-400">
                    <Trophy size={16} className="mr-2" />
                    <span>$1,000 Prize Pool</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users size={16} className="mr-2" />
                    <span>425 Participants</span>
                  </div>
                </div>
                <Link href="/tournaments/football-showdown" className="flex justify-between items-center text-purple-400 hover:text-purple-300 font-medium">
                  Join Tournament <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Events Content */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {/* Event 1 */}
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-32 h-32 relative rounded-lg overflow-hidden">
                <Image 
                  src="/assets/images/FeaturedBet_Basketball Players.jpg" 
                  alt="NBA Summer League" 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center text-green-400 text-sm mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Starting in 3 days</span>
                </div>
                <h3 className="text-xl font-bold mb-2">NBA Summer League Tournament</h3>
                <p className="text-gray-400 mb-4">Bet on the future stars of the NBA as they showcase their talents.</p>
                <div className="flex items-center justify-between">
                  <span className="text-white bg-purple-600 px-3 py-1 rounded-full text-sm">$5 Entry</span>
                  <Link href="/tournaments/nba-summer" className="text-purple-400 hover:text-purple-300 flex items-center">
                    Details <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Event 2 */}
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-32 h-32 relative rounded-lg overflow-hidden">
                <Image 
                  src="/assets/images/FeaturedBetPanel_NHL.jpg" 
                  alt="Stanley Cup" 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center text-green-400 text-sm mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Starting in 5 days</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Stanley Cup Finals Prediction</h3>
                <p className="text-gray-400 mb-4">Predict the winner, MVP, and total goals in this year's NHL finals.</p>
                <div className="flex items-center justify-between">
                  <span className="text-white bg-purple-600 px-3 py-1 rounded-full text-sm">$10 Entry</span>
                  <Link href="/tournaments/stanley-cup" className="text-purple-400 hover:text-purple-300 flex items-center">
                    Details <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Other Tabs Can Be Added Similarly */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 gap-6 mb-16">
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-400">No live events currently in progress</h3>
              <p className="mt-2 text-gray-500">Check back during scheduled event times or browse upcoming events.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'friends' && (
          <div className="relative rounded-xl overflow-hidden mb-16">
            <Image
              src="/assets/images/FriendsCompeting.jpg"
              alt="Friends Competing"
              width={1200}
              height={500}
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-gray-900/80 flex flex-col justify-center p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Challenge Your Friends</h2>
              <p className="text-xl text-gray-200 mb-8 max-w-xl">
                Create a private tournament and invite your friends to compete against each other.
              </p>
              <div>
                <Link href="/create-tournament" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition-colors">
                  Create a Tournament <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 