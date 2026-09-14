import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Users, Shield, Coins, ThumbsUp, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | BattleBetz',
  description: 'Learn about BattleBetz - our mission, team, and the story behind the leading esports betting platform.',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-900 to-gray-900">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About BattleBetz</h1>
          <p className="text-xl text-gray-300 mb-8">
            The revolutionary platform where gaming passion meets betting excitement.
          </p>
          <div className="w-20 h-1 bg-purple-500 mx-auto"></div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-300 mb-6">
                Founded in 2022, BattleBetz emerged from a simple idea: to create a platform where esports enthusiasts could engage more deeply with the games they love. What started as a passion project by a group of gamers and tech innovators has evolved into the premier destination for esports betting.
              </p>
              <p className="text-gray-300">
                Our journey began when our founders, avid gamers themselves, recognized a gap in the market for a trustworthy, user-friendly platform dedicated exclusively to esports betting. With backgrounds spanning competitive gaming, software development, and fintech, our team combined their expertise to build BattleBetz from the ground up.
              </p>
            </div>
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500">Company Timeline Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-12">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-300">
                We're constantly pushing the boundaries of what's possible in esports betting, developing new features and experiences that keep our platform at the cutting edge.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Security & Trust</h3>
              <p className="text-gray-300">
                We prioritize the security of our users' data and funds above all else. Our platform is built with state-of-the-art security measures and we maintain complete transparency in all our operations.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Community</h3>
              <p className="text-gray-300">
                We believe in fostering a vibrant, inclusive community where all esports fans can come together to share their passion, knowledge, and experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="h-60 bg-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Team Member Photo</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Alex Johnson</h3>
                <p className="text-purple-400 mb-4">CEO & Co-Founder</p>
                <p className="text-gray-300 text-sm">
                  Former professional Dota 2 player with a background in fintech. Alex brings his deep understanding of both gaming and business to lead BattleBetz.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="h-60 bg-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Team Member Photo</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Sophia Chen</h3>
                <p className="text-purple-400 mb-4">CTO & Co-Founder</p>
                <p className="text-gray-300 text-sm">
                  With 15+ years in software development, Sophia has built tech for major gaming platforms. She leads our engineering team to create a seamless betting experience.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="h-60 bg-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Team Member Photo</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Marcus Williams</h3>
                <p className="text-purple-400 mb-4">Head of Partnerships</p>
                <p className="text-gray-300 text-sm">
                  A veteran of the esports industry, Marcus has established relationships with tournament organizers, teams, and players worldwide to bring exclusive content to BattleBetz.
                </p>
              </div>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="h-60 bg-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Team Member Photo</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Olivia Rodriguez</h3>
                <p className="text-purple-400 mb-4">User Experience Director</p>
                <p className="text-gray-300 text-sm">
                  With a keen eye for design and user psychology, Olivia ensures that every interaction on BattleBetz is intuitive, engaging, and accessible for all users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">500K+</p>
              <p className="text-xl text-gray-300">Active Users</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">$10M+</p>
              <p className="text-xl text-gray-300">Winnings Paid</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">25+</p>
              <p className="text-xl text-gray-300">Game Titles</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">100+</p>
              <p className="text-xl text-gray-300">Tournaments Monthly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 p-8 rounded-lg relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6">
                "BattleBetz has completely transformed how I engage with esports. The platform is incredibly user-friendly, and the variety of betting options keeps me coming back for every major tournament."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">David K.</p>
                  <p className="text-sm text-gray-400">CS:GO Enthusiast</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-800 p-8 rounded-lg relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6">
                "The real-time odds updates and detailed stats make BattleBetz the best platform for making informed bets. I've tried others, but nothing compares to the depth of information available here."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">Sarah T.</p>
                  <p className="text-sm text-gray-400">League of Legends Player</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-800 p-8 rounded-lg relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6">
                "What sets BattleBetz apart is their customer service. When I had an issue with a bet, their support team resolved it within minutes. That level of care is rare in the betting world."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">Miguel R.</p>
                  <p className="text-sm text-gray-400">Valorant Fan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join the BattleBetz Community</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Ready to take your esports experience to the next level? Join thousands of players who are already part of the BattleBetz revolution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/register" className="py-3 px-8 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-300">
              Create an Account
            </a>
            <a href="/tournaments" className="py-3 px-8 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-300">
              Browse Tournaments
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 