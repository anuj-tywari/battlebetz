import { useState } from 'react';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  type Notification 
} from '@/services/notifications';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (userId: string, onlyUnread?: boolean) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: (userId: string) => Promise<boolean>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async (userId: string, onlyUnread: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getUserNotifications(userId, onlyUnread);
      
      if (error) {
        setError(error);
        setNotifications([]);
      } else {
        setNotifications(data || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await markNotificationAsRead(notificationId);
      
      if (error) {
        setError(error);
        return false;
      }
      
      // Update local state
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true } 
              : notification
          )
        );
      }
      
      return success;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to update notification');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await markAllNotificationsAsRead(userId);
      
      if (error) {
        setError(error);
        return false;
      }
      
      // Update local state
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, read: true }))
        );
      }
      
      return success;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to update notifications');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
