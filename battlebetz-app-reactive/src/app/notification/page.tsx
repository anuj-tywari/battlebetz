// battlebetz-web/src/app/notification/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, MessageSquare, Trophy, DollarSign, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    notifications, 
    loading: notificationsLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?callbackUrl=/notification');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id, activeTab === 'unread');
    }
  }, [user, activeTab, fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (user?.id) {
      const success = await markAsRead(notificationId);
      if (success) {
        // No need to refetch as our hook updates the state already
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user?.id) {
      const success = await markAllAsRead(user.id);
      if (success) {
        // No need to refetch as our hook updates the state already
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'battle_request':
        return <Bell className="h-6 w-6 text-purple-400" />;
      case 'bet_result':
        return <Trophy className="h-6 w-6 text-green-400" />;
      case 'message':
        return <MessageSquare className="h-6 w-6 text-blue-400" />;
      case 'tournament':
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 'deposit':
        return <DollarSign className="h-6 w-6 text-green-400" />;
      case 'follower':
        return <User className="h-6 w-6 text-purple-400" />;
      case 'like':
        return <Heart className="h-6 w-6 text-red-400" />;
      default:
        return <Bell className="h-6 w-6 text-gray-400" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'battle_request':
        return 'New Battle Request';
      case 'bet_result':
        return 'Bet Result';
      case 'message':
        return 'New Message';
      case 'tournament':
        return 'Tournament Update';
      case 'deposit':
        return 'Deposit Successful';
      case 'follower':
        return 'New Follower';
      case 'like':
        return 'Your Bet Got Likes';
      default:
        return 'Notification';
    }
  };

  if (authLoading || notificationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-purple-400 hover:text-purple-300 transition-colors" />
          </Link>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-full ${activeTab === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded-full ${activeTab === 'unread' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
            </button>
          </div>
          
          {notifications.some(n => !n.read) && (
            <button 
              className="text-purple-400 hover:text-purple-300 text-sm"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-400">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`${notification.read ? 'bg-gray-800' : 'bg-gray-750 border-l-4 border-purple-500'} rounded-lg p-4 transition-all hover:bg-gray-750`}
              >
                <div className="flex" onClick={() => !notification.read && handleMarkAsRead(notification.id)}>
                  <div className="mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">
                        {getNotificationTitle(notification.type)}
                      </h3>
                      <span className="text-sm text-purple-400">
                        {new Date(notification.created_at).toLocaleDateString()} {new Date(notification.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-2">
                      {notification.content}
                    </p>
                    
                    {notification.type === 'tournament' && notification.metadata.tournament_id && (
                      <Link 
                        href={`/tournaments/${notification.metadata.tournament_id}`}
                        className="inline-block mt-2 text-purple-400 hover:text-purple-300 text-sm"
                      >
                        View Tournament
                      </Link>
                    )}
                    
                    {notification.type === 'battle_request' && notification.metadata.sender_id && (
                      <div className="mt-3 flex space-x-3">
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-colors">
                          Accept Challenge
                        </button>
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-medium transition-colors">
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}