"use client";

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const stepsRef = useRef<HTMLDivElement>(null);
  
  const scrollToSteps = () => {
    stepsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How BattleBetz Works</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            BattleBetz makes sports betting tournaments social, exciting, and easy to understand. Learn how you can join the action in just a few simple steps.
          </p>
          <button 
            onClick={scrollToSteps}
            className="bg-white text-purple-900 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
          >
            Get Started
          </button>
        </div>
        
        <div className="hidden md:block absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      {/* Steps Section */}
      <div ref={stepsRef} className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-16">Four Simple Steps to Join the Action</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-20">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Create Your Account</h3>
              <p className="text-gray-300 mb-4">
                Sign up for a free BattleBetz account in less than a minute. All you need is your email address to get started. We'll securely store your profile and betting history.
              </p>
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
                Register Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Find a Tournament</h3>
              <p className="text-gray-300 mb-4">
                Browse our wide selection of tournaments across different sports. Filter by entry fee, prize pool, start date, and skill level to find the perfect match for your interests.
              </p>
              <Link href="/tournaments" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
                Browse Tournaments <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Place Your Bets</h3>
              <p className="text-gray-300 mb-4">
                Make informed predictions on match outcomes using our intuitive betting interface. Research teams, check historical data, and use your sports knowledge to outsmart other players.
              </p>
              <Link href="/help/betting-guide" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
                Betting Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Win and Collect</h3>
              <p className="text-gray-300 mb-4">
                Track your progress on our real-time leaderboards. If your predictions are spot on, you'll climb the ranks and win prizes. Winnings are instantly credited to your account.
              </p>
              <Link href="/help/payouts" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
                Payout Information <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose BattleBetz</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-700 p-8 rounded-xl text-center">
              <div className="bg-purple-700 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Secure Platform</h3>
              <p className="text-gray-300">
                Your personal information and funds are protected with bank-level security. We use state-of-the-art encryption technology.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-700 p-8 rounded-xl text-center">
              <div className="bg-purple-700 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Community Experience</h3>
              <p className="text-gray-300">
                Compete against friends and sports fans worldwide. Share strategies, discuss matches, and make new connections.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-700 p-8 rounded-xl text-center">
              <div className="bg-purple-700 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Fair Gameplay</h3>
              <p className="text-gray-300">
                All tournaments follow transparent rules with equal opportunities for everyone. Our odds are competitive and clearly displayed.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto divide-y divide-gray-700">
          <div className="py-6">
            <h3 className="text-xl font-bold mb-3">Is BattleBetz legal?</h3>
            <p className="text-gray-300">
              Yes, BattleBetz operates in full compliance with regulations. We are a skill-based prediction platform that offers tournaments in jurisdictions where such contests are permitted.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-bold mb-3">How do I deposit and withdraw funds?</h3>
            <p className="text-gray-300">
              We offer multiple secure payment methods including credit cards, PayPal, and cryptocurrency. Withdrawals are processed within 24-48 hours, depending on your preferred method.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-bold mb-3">What happens if a match is canceled?</h3>
            <p className="text-gray-300">
              If a match is canceled or postponed beyond the tournament window, all bets on that match are refunded. Our system automatically handles these situations to ensure fairness.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-bold mb-3">Can I create my own tournaments?</h3>
            <p className="text-gray-300">
              Yes! Premium members can create private tournaments and invite friends to join. You can customize the entry fee, prize structure, and pick the matches included in your tournament.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/faq" className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center">
            View All FAQs <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-purple-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Action?</h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-8">
            Create your account today and start competing in exciting sports prediction tournaments!
          </p>
          <Link 
            href="/signup" 
            className="bg-white text-purple-900 font-bold py-3 px-8 rounded-full inline-flex items-center hover:bg-gray-200 transition-colors"
          >
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
} 