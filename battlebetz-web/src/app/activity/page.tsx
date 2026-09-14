// battlebetz-web/src/app/activity/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Swords, DollarSign, User, Clock, Filter } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { fetchUserActivity, formatRelativeTime, UserActivity } from '@/services/activity';

interface ActivityItem {
  id: string;
  type: 'bet' | 'tournament' | 'battle' | 'account' | 'deposit' | 'transaction';
  action: string;
  target?: string;
  amount?: string;
  result?: string;
  date: string;
  created_at?: string;
}

export default function ActivityPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'bets' | 'tournaments' | 'battles' | 'account'>('all');
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/login?callbackUrl=/activity';
    }
  }, [authLoading, isAuthenticated]);

  // Fetch user activity data
  useEffect(() => {
    const fetchActivities = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          setError(null);
          console.log('Fetching activities for user:', user.id);
          
          // Fetch more activities to allow for better filtering
          const userActivities = await fetchUserActivity(user.id, 50);
          console.log('Fetched activities:', userActivities);
          
          setActivities(userActivities);
        } catch (err) {
          console.error('Error fetching activities:', err);
          setError('Failed to load activities');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user?.id && !authLoading) {
      fetchActivities();
    }
  }, [user?.id, authLoading]);

  // Convert UserActivity to ActivityItem format for compatibility with existing UI
  const convertToActivityItem = (activity: UserActivity): ActivityItem => {
    let result = '';
    let amount = '';
    
    if (activity.amount) {
      amount = `BBZ ${activity.amount}`;
      if (activity.status === 'win') result = `Won BBZ ${activity.amount}`;
      else if (activity.status === 'loss') result = 'Lost';
      else if (activity.status === 'pending') result = 'Pending';
    }

    // Map transaction type to our activity types
    let type: ActivityItem['type'] = activity.type as ActivityItem['type'];
    if (activity.type === 'transaction') {
      type = 'deposit'; // Map transaction to deposit for UI consistency
    }

    return {
      id: activity.id,
      type,
      action: activity.title.replace('Placed a bet on ', 'placed a bet').replace('Joined ', 'Joined ').replace('Deposited BBZ', 'Deposit successful').replace('Withdrew BBZ', 'Withdrawal successful'),
      target: activity.entity_type === 'bet' ? activity.description.split(' on ')[1]?.split(' in tournament')[0] : undefined,
      amount,
      result,
      date: formatRelativeTime(activity.created_at),
      created_at: activity.created_at
    };
  };

  // Filter activities based on active filter
  const filteredActivities = activeFilter === 'all' 
    ? activities.map(convertToActivityItem)
    : activities.filter(activity => {
        switch (activeFilter) {
          case 'bets':
            return activity.type === 'bet';
          case 'tournaments':
            return activity.type === 'tournament';
          case 'account':
            return activity.type === 'transaction';
          case 'battles':
            return false; // No battles data yet
          default:
            return true;
        }
      }).map(convertToActivityItem);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'bet':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'tournament':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'battle':
        return <Swords className="h-5 w-5 text-red-500" />;
      case 'account':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'deposit':
      case 'transaction':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-purple-500" />;
    }
  };

  const getActivityBgColor = (type: ActivityItem['type']): string => {
    switch (type) {
      case 'bet':
        return 'bg-green-500/10';
      case 'tournament':
        return 'bg-yellow-500/10';
      case 'battle':
        return 'bg-red-500/10';
      case 'account':
        return 'bg-blue-500/10';
      case 'deposit':
      case 'transaction':
        return 'bg-green-500/10';
      default:
        return 'bg-purple-500/10';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-purple-400 hover:text-purple-300 transition-colors" />
          </Link>
          <h1 className="text-2xl font-bold">Activity History</h1>
        </div>

        {/* Tabs/Filters */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
          <button 
            className={`px-4 py-2 rounded-full flex items-center ${activeFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setActiveFilter('all')}
          >
            All Activity
          </button>
          <button 
            className={`px-4 py-2 rounded-full flex items-center ${activeFilter === 'bets' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setActiveFilter('bets')}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Bets
          </button>
          <button 
            className={`px-4 py-2 rounded-full flex items-center ${activeFilter === 'tournaments' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setActiveFilter('tournaments')}
          >
            <Trophy className="h-4 w-4 mr-1" />
            Tournaments
          </button>
          <button 
            className={`px-4 py-2 rounded-full flex items-center ${activeFilter === 'battles' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setActiveFilter('battles')}
          >
            <Swords className="h-4 w-4 mr-1" />
            Battles
          </button>
          <button 
            className={`px-4 py-2 rounded-full flex items-center ${activeFilter === 'account' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setActiveFilter('account')}
          >
            <User className="h-4 w-4 mr-1" />
            Account
          </button>
        </div>

        {/* Activity Timeline */}
        <div className="bg-gray-800 rounded-lg shadow-md">
          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-400 mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
              <p className="text-gray-400">
                Your activity history will appear here once you start placing bets, joining tournaments, or making transactions.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredActivities.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-750 transition-colors flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getActivityBgColor(item.type)}`}>
                    {getActivityIcon(item.type)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <h3 className="text-white font-medium">
                        {item.type === 'battle' ? item.action : `You ${item.action}`}
                        {item.target && <span className="font-normal"> on <span className="text-purple-400">{item.target}</span></span>}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1 sm:mt-0">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {item.date}
                      </div>
                    </div>
                    
                    {item.amount && (
                      <p className="text-gray-300 mt-1">
                        Amount: <span className={item.type === 'deposit' || item.type === 'transaction' ? "text-green-400" : "text-purple-400"}>{item.amount}</span>
                      </p>
                    )}
                    
                    {item.result && (
                      <p className={`mt-1 ${
                        item.result.startsWith('Won') ? 'text-green-400' : 
                        item.result === 'Lost' ? 'text-red-400' : 
                        item.result === 'Pending' ? 'text-yellow-400' :
                        'text-gray-300'
                      }`}>
                        {item.result}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Previous
          </button>
          
          <div className="text-gray-400">Page 1 of 1</div>
          
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}