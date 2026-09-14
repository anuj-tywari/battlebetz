import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Swords, Users, Trophy, Sparkles, ChevronRight, Filter, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Battles | BattleBetz',
  description: 'Challenge friends and other users to head-to-head betting battles on BattleBetz',
};

// Mock battles data for the page
const featuredBattles = [
  {
    id: 'battle-1',
    title: 'NBA Finals Showdown',
    user1: {
      name: 'MJ_GOAT',
      avatar: '/assets/images/logo.png',
      wins: 28,
      losses: 12
    },
    user2: {
      name: 'LeBronFan23',
      avatar: '/assets/images/logo.png',
      wins: 32,
      losses: 15
    },
    sport: 'Basketball',
    prize: '$500',
    startTime: 'June 25, 2023 - 8:00 PM',
    matchCount: 7,
    status: 'UPCOMING'
  },
  {
    id: 'battle-2',
    title: 'Soccer Champions Cup',
    user1: {
      name: 'MessiMagic',
      avatar: '/assets/images/logo.png',
      wins: 45,
      losses: 8
    },
    user2: {
      name: 'CR7Forever',
      avatar: '/assets/images/logo.png',
      wins: 42,
      losses: 10
    },
    sport: 'Soccer',
    prize: '$1,000',
    startTime: 'June 28, 2023 - 2:00 PM',
    matchCount: 5,
    status: 'UPCOMING'
  }
];

const upcomingBattles = [
  {
    id: 'battle-3',
    title: 'MLB Home Run Derby',
    user1: {
      name: 'YankeesFan99',
      avatar: '/assets/images/logo.png',
      wins: 17,
      losses: 8
    },
    user2: {
      name: 'RedSoxNation',
      avatar: '/assets/images/logo.png',
      wins: 15,
      losses: 9
    },
    sport: 'Baseball',
    prize: '$250',
    startTime: 'July 2, 2023 - 7:00 PM',
    matchCount: 3,
    status: 'UPCOMING'
  },
  {
    id: 'battle-4',
    title: 'NFL Preseason Clash',
    user1: {
      name: 'ChiefsKingdom',
      avatar: '/assets/images/logo.png',
      wins: 22,
      losses: 11
    },
    user2: {
      name: 'BillsMafia',
      avatar: '/assets/images/logo.png',
      wins: 20,
      losses: 12
    },
    sport: 'Football',
    prize: '$300',
    startTime: 'July 15, 2023 - 4:30 PM',
    matchCount: 4,
    status: 'UPCOMING'
  },
  {
    id: 'battle-5',
    title: 'Wimbledon Finals Prediction',
    user1: {
      name: 'FedererFan',
      avatar: '/assets/images/logo.png',
      wins: 36,
      losses: 14
    },
    user2: {
      name: 'NadalKing',
      avatar: '/assets/images/logo.png',
      wins: 39,
      losses: 11
    },
    sport: 'Tennis',
    prize: '$450',
    startTime: 'July 10, 2023 - 10:00 AM',
    matchCount: 1,
    status: 'UPCOMING'
  }
];

const activeBattles = [
  {
    id: 'battle-6',
    title: 'Stanley Cup Finals',
    user1: {
      name: 'HockeyLegend',
      avatar: '/assets/images/logo.png',
      wins: 26,
      losses: 13
    },
    user2: {
      name: 'IceWarrior',
      avatar: '/assets/images/logo.png',
      wins: 24,
      losses: 15
    },
    sport: 'Hockey',
    prize: '$350',
    progress: 60, // percentage complete
    user1Score: 3,
    user2Score: 1,
    status: 'ACTIVE'
  },
  {
    id: 'battle-7',
    title: 'UFC Fight Night',
    user1: {
      name: 'KOKing',
      avatar: '/assets/images/logo.png',
      wins: 19,
      losses: 5
    },
    user2: {
      name: 'SubmissionMaster',
      avatar: '/assets/images/logo.png',
      wins: 17,
      losses: 7
    },
    sport: 'MMA',
    prize: '$275',
    progress: 40, // percentage complete
    user1Score: 2,
    user2Score: 3,
    status: 'ACTIVE'
  }
];

export default function BattlesPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Battles
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Challenge friends or other users to head-to-head betting competitions
          </p>
        </div>
        
        {/* Hero CTA */}
        <div className="mb-16 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/assets/images/FriendsCompeting.jpg"
              alt="Friends competing"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-black/70"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prove Your Skills in Head-to-Head Battles
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Challenge friends or other bettors to private betting battles. 
                Set your own rules, choose your matches, and compete for bragging rights or real money.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/battles/create"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
                >
                  <Swords className="mr-2 h-5 w-5" />
                  Create a Battle
                </Link>
                <Link
                  href="/battles/join"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join a Battle
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Battles */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              <span className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                Featured Battles
              </span>
            </h2>
            <Link
              href="/battles/featured"
              className="text-purple-400 hover:text-purple-300 inline-flex items-center text-sm font-medium transition-colors"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredBattles.map(battle => (
              <div key={battle.id} className="bg-gray-800 rounded-xl overflow-hidden border border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{battle.title}</h3>
                    <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded uppercase">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 mb-2">
                        <Image
                          src={battle.user1.avatar}
                          alt={battle.user1.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-white">{battle.user1.name}</span>
                      <span className="text-xs text-gray-400">{battle.user1.wins}W - {battle.user1.losses}L</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-red-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mb-1">
                        VS
                      </div>
                      <span className="text-sm text-gray-400">{battle.sport}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 mb-2">
                        <Image
                          src={battle.user2.avatar}
                          alt={battle.user2.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-white">{battle.user2.name}</span>
                      <span className="text-xs text-gray-400">{battle.user2.wins}W - {battle.user2.losses}L</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <Trophy className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                      <span className="block text-white font-bold">{battle.prize}</span>
                      <span className="text-xs text-gray-400">Prize Pool</span>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-3">
                      <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <span className="block text-white font-bold">{battle.matchCount}</span>
                      <span className="text-xs text-gray-400">Matches</span>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-3">
                      <Calendar className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <span className="block text-white text-sm font-medium">
                        {new Date(battle.startTime).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">Start Date</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/battles/${battle.id}`}
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg text-center transition-colors"
                  >
                    View Battle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Active Battles */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              <span className="flex items-center">
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Live Battles
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBattles.map(battle => (
              <div key={battle.id} className="bg-gray-800 rounded-xl overflow-hidden border border-green-500/20 hover:shadow-lg hover:shadow-green-500/5 transition-all">
                <div className="bg-gradient-to-r from-green-900 to-green-700 p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{battle.title}</h3>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase flex items-center">
                      <span className="relative flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Live
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 mb-2">
                        <Image
                          src={battle.user1.avatar}
                          alt={battle.user1.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-white">{battle.user1.name}</span>
                      <span className="text-lg font-bold text-white">{battle.user1Score}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-green-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mb-1">
                        VS
                      </div>
                      <span className="text-sm text-gray-400">{battle.sport}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 mb-2">
                        <Image
                          src={battle.user2.avatar}
                          alt={battle.user2.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-white">{battle.user2.name}</span>
                      <span className="text-lg font-bold text-white">{battle.user2Score}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-400">{battle.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${battle.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-gray-700 rounded-lg text-center">
                    <p className="text-white mb-1">
                      <span className="font-bold">{battle.user1Score > battle.user2Score ? battle.user1.name : battle.user2.name}</span> is currently leading
                    </p>
                    <p className="text-sm text-gray-400">Battle in progress</p>
                  </div>
                  
                  <Link
                    href={`/battles/${battle.id}`}
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg text-center transition-colors"
                  >
                    Watch Live
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upcoming Battles */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              <span className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-400" />
                Upcoming Battles
              </span>
            </h2>
            <div className="flex items-center gap-3">
              <button className="bg-gray-700 hover:bg-gray-600 text-sm py-1.5 px-3 rounded-lg flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </button>
              <Link
                href="/battles/upcoming"
                className="text-purple-400 hover:text-purple-300 inline-flex items-center text-sm font-medium transition-colors"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingBattles.map(battle => (
              <div key={battle.id} className="bg-gray-800 rounded-xl overflow-hidden border border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">{battle.title}</h3>
                    <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                      {battle.sport}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 mr-2">
                        <Image
                          src={battle.user1.avatar}
                          alt={battle.user1.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{battle.user1.name}</p>
                        <p className="text-xs text-gray-400">{battle.user1.wins}W - {battle.user1.losses}L</p>
                      </div>
                    </div>
                    
                    <div className="text-gray-500">vs</div>
                    
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium text-white text-right">{battle.user2.name}</p>
                        <p className="text-xs text-gray-400 text-right">{battle.user2.wins}W - {battle.user2.losses}L</p>
                      </div>
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 ml-2">
                        <Image
                          src={battle.user2.avatar}
                          alt={battle.user2.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-4">
                    <div className="text-gray-400">
                      <Clock className="inline h-4 w-4 mr-1" /> 
                      {battle.startTime}
                    </div>
                    <div className="text-green-400">
                      <Trophy className="inline h-4 w-4 mr-1" />
                      {battle.prize}
                    </div>
                  </div>
                  
                  <Link
                    href={`/battles/${battle.id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Test Your Skills?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Create your own battle, set your rules, and challenge friends or the BattleBetz community to see who has the better betting skills.
          </p>
          <Link
            href="/battles/create"
            className="bg-white text-purple-900 hover:bg-gray-100 font-bold px-6 py-3 rounded-lg transition-colors inline-flex items-center"
          >
            <Swords className="mr-2 h-5 w-5" />
            Create a Battle Now
          </Link>
        </div>
      </div>
    </div>
  );
} 