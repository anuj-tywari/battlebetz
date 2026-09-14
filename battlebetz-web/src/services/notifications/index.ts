// battlebetz-web/src/services/notifications/index.ts
import { supabase } from '@/lib/supabase';

// This is a mock type that would be in your Database type
export interface Notification {
  id: string;
  user_id: string;
  type: 'battle_request' | 'bet_result' | 'message' | 'tournament' | 'deposit' | 'follower' | 'like';
  content: string;
  metadata: {
    sender_id?: string;
    bet_id?: string;
    tournament_id?: string;
    amount?: number;
    count?: number;
    match_id?: string;
  };
  read: boolean;
  created_at: string;
}

export async function getUserNotifications(
  userId: string,
  onlyUnread: boolean = false
): Promise<{ data: Notification[] | null; error: string | null }> {
  try {
    // This is a mock implementation since notifications table doesn't exist yet
    // In a real app, you would query from your notifications table
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        user_id: userId,
        type: 'battle_request',
        content: '@mike_b wants to battle you on Lakers vs Warriors with BBZT 100 on Lakers -3.5',
        metadata: {
          sender_id: 'user123',
          match_id: 'match123'
        },
        read: false,
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
      },
      {
        id: '2',
        user_id: userId,
        type: 'bet_result',
        content: 'Your bet on Warriors ML has won. BBZT 250 has been added to your account.',
        metadata: {
          bet_id: 'bet123',
          amount: 250
        },
        read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        id: '3',
        user_id: userId,
        type: 'message',
        content: '@sarah_j sent you a message: "Ready for our rematch tonight?"',
        metadata: {
          sender_id: 'user456'
        },
        read: true,
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
      }
    ];
    
    if (onlyUnread) {
      return { data: mockNotifications.filter(n => !n.read), error: null };
    }
    
    return { data: mockNotifications, error: null };
  } catch (err) {
    console.error('Get user notifications error:', err);
    return { data: null, error: 'An unexpected error occurred while fetching notifications' };
  }
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true, error: null };
  } catch (err) {
    console.error('Mark notification as read error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, error: null };
  } catch (err) {
    console.error('Mark all notifications as read error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}