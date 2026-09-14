"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import Image from 'next/image';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the subscription
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/assets/images/logo.png"
          alt="BattleBetz"
          width={80}
          height={80}
          priority
          className="animate-pulse"
        />
      </div>

      {/* Main Content */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Coming Soon
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          We're working hard to bring you something amazing. Stay tuned for updates!
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-purple-500 text-xl font-semibold mb-2">
              Tournament Battles
            </h3>
            <p className="text-gray-400">
              Compete in exciting tournaments with players from around the world.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-purple-500 text-xl font-semibold mb-2">
              Crypto Rewards
            </h3>
            <p className="text-gray-400">
              Win cryptocurrency rewards and exclusive prizes.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-purple-500 text-xl font-semibold mb-2">
              Global Rankings
            </h3>
            <p className="text-gray-400">
              Climb the global leaderboards and establish your dominance.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-purple-500 text-xl font-semibold mb-2">
              Community Events
            </h3>
            <p className="text-gray-400">
              Join special events and earn exclusive rewards.
            </p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12">
          <h3 className="text-white text-xl font-semibold mb-4">
            Get Notified When We Launch
          </h3>
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              Notify Me
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS or tailwind.config.js
// @keyframes gradient {
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// } 