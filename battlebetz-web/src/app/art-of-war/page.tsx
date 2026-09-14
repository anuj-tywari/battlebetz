import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, BookOpen, Brain, Sword, Eye, Shield, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Art of War | BattleBetz',
  description: 'Learn how to apply Sun Tzu\'s principles to your betting strategy and dominate the competition',
};

// Define strategy sections based on Sun Tzu's principles
const strategies = [
  {
    id: 'know-yourself',
    title: 'Know Yourself',
    principle: '"If you know the enemy and know yourself, you need not fear the result of a hundred battles."',
    icon: <Brain className="h-8 w-8 text-purple-400" />,
    description: 'Understanding your own betting habits, risk tolerance, and tendencies is the foundation of successful betting. Before challenging others, analyze your strengths and weaknesses as a bettor.',
    tips: [
      'Track all your bets and analyze your win-loss patterns',
      'Identify which sports or markets you perform best in',
      'Be honest about your emotional triggers when betting',
      'Set realistic expectations based on your experience level'
    ]
  },
  {
    id: 'study-opponents',
    title: 'Study Your Opponents',
    principle: '"Know your enemy and know yourself and you can fight a hundred battles without disaster."',
    icon: <Eye className="h-8 w-8 text-purple-400" />,
    description: 'In head-to-head betting battles, understanding your opponent\'s strategy gives you a significant edge. Look for patterns in their betting history and use that knowledge to your advantage.',
    tips: [
      'Review your opponent\'s public betting history and win rate',
      'Notice if they favor certain teams, players, or bet types',
      'Identify if they bet with logic or emotion',
      'Determine if they are risk-averse or aggressive bettors'
    ]
  },
  {
    id: 'preparation',
    title: 'The Battle is Won Before it is Fought',
    principle: '"Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win."',
    icon: <BookOpen className="h-8 w-8 text-purple-400" />,
    description: 'Success in betting is largely determined by your preparation before placing bets. Research, analysis, and planning set the foundation for winning strategies.',
    tips: [
      'Conduct thorough research on teams, players, and relevant statistics',
      'Develop a systematic approach to evaluating betting opportunities',
      'Create a betting strategy with clear criteria for placing bets',
      'Establish a bankroll management plan before entering tournaments'
    ]
  },
  {
    id: 'deception',
    title: 'The Art of Deception',
    principle: '"All warfare is based on deception."',
    icon: <Sword className="h-8 w-8 text-purple-400" />,
    description: 'In competitive betting, particularly in head-to-head battles, strategic deception can lead your opponents to make mistakes. This doesn\'t mean cheating, but rather using strategy to gain an edge.',
    tips: [
      'Don\'t reveal your best betting strategies to competitors',
      'Consider making decoy bets to mislead opponents about your strategy',
      'Vary your approach to prevent becoming predictable',
      'Sometimes the best move is the one others don\'t expect'
    ]
  },
  {
    id: 'adaptability',
    title: 'Be Fluid and Adaptable',
    principle: '"Water shapes its course according to the nature of the ground over which it flows; the soldier works out his victory in relation to the foe whom he is facing."',
    icon: <Shield className="h-8 w-8 text-purple-400" />,
    description: 'The betting landscape changes constantly. Successful bettors adapt their strategy based on new information, changing conditions, and the evolving strategies of opponents.',
    tips: [
      'Adjust your strategy when new information becomes available',
      'Don\'t stick rigidly to pre-game plans if circumstances change',
      'Develop multiple betting approaches for different situations',
      'Be willing to pivot quickly when odds or conditions shift'
    ]
  }
];

export default function ArtOfWarPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
        
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/assets/images/TheArena.jpg"
              alt="The Art of War"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/30"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col items-start">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Art of War: <span className="text-purple-400">Betting Edition</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-8">
              Ancient wisdom meets modern betting. Learn how to apply Sun Tzu's military principles to dominate in competitive betting.
            </p>
            <div className="flex items-center justify-start text-sm text-gray-400 mb-8">
              <div className="flex items-center mr-6">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>5 Core Principles</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>10 min read</span>
              </div>
            </div>
            <a 
              href="#strategies"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center"
            >
              Explore Strategies
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
        
        {/* Introduction */}
        <div className="bg-gray-800 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Sun Tzu's Wisdom in Betting</h2>
          <div className="text-gray-300 space-y-4">
            <p>
              Written over 2,500 years ago, Sun Tzu's "The Art of War" contains timeless strategic wisdom that extends far beyond the battlefield. These ancient principles apply remarkably well to the modern world of competitive betting.
            </p>
            <p>
              Just as military commanders must make strategic decisions under pressure, bettors must analyze information, manage resources, and outmaneuver opponents to succeed. By understanding and applying these principles, you can transform your approach to betting and gain a significant edge over the competition.
            </p>
            <p>
              In this guide, we've adapted key concepts from "The Art of War" specifically for betting scenarios. Whether you're participating in tournaments or engaging in head-to-head battles on BattleBetz, these strategies will help you make better decisions and increase your chances of victory.
            </p>
            <blockquote className="border-l-4 border-purple-500 pl-4 italic">
              "Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat."
              <footer className="text-gray-400 mt-1">— Sun Tzu</footer>
            </blockquote>
          </div>
        </div>
        
        {/* Strategy Sections */}
        <div id="strategies" className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Betting Strategies</h2>
          
          {strategies.map((strategy, index) => (
            <div 
              key={strategy.id}
              className={`bg-gray-800 rounded-xl overflow-hidden border border-purple-500/10 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} md:flex`}
            >
              <div className="md:w-1/3 bg-gradient-to-br from-purple-900 to-indigo-900 p-8 flex flex-col justify-center items-center text-center">
                <div className="bg-gray-800/30 p-4 rounded-full mb-4">
                  {strategy.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{strategy.title}</h3>
                <p className="text-gray-300 italic">{strategy.principle}</p>
              </div>
              
              <div className="md:w-2/3 p-8">
                <p className="text-gray-300 mb-6">{strategy.description}</p>
                <h4 className="text-lg font-medium text-white mb-3">Practical Application:</h4>
                <ul className="list-disc pl-5 text-gray-300 space-y-2">
                  {strategy.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* Conclusion and CTA */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Master the Art of War</h2>
          <p className="text-gray-200 max-w-3xl mx-auto mb-8">
            Ready to put these principles into practice? Join a tournament or challenge another user to a head-to-head betting battle and apply the wisdom of Sun Tzu to your betting strategy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tournaments"
              className="bg-white text-purple-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Join a Tournament
            </Link>
            <Link
              href="/battles"
              className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Battle Another User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 