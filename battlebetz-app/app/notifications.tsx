import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image,
  Modal,
  Platform
} from 'react-native';
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  Clock, 
  ChevronRight,
  X,
  MessageSquare,
  Trophy,
  TrendingUp,
  DollarSign,
  UserPlus,
  Shield
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

type NotificationType = 'bet' | 'win' | 'loss' | 'message' | 'follow' | 'ranking' | 'deposit' | 'role_change';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  expanded?: boolean;
  avatar?: string;
  amount?: string;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'bet',
      title: 'New Battle Request',
      description: '@mike_b wants to battle you on Lakers vs Warriors with BBZ 100 on Lakers -3.5',
      time: '10 minutes ago',
      read: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop'
    },
    {
      id: '2',
      type: 'win',
      title: 'You Won!',
      description: 'Your bet on Warriors ML has won. BBZ 250 has been added to your account.',
      time: '2 hours ago',
      read: false,
      amount: 'BBZ 250'
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      description: '@sarah_j sent you a message: "Ready for our rematch tonight?"',
      time: '3 hours ago',
      read: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop'
    }
  ]);

  const [snoozeModalVisible, setSnoozeModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleSnooze = (id: string) => {
    setSelectedNotification(id);
    setSnoozeModalVisible(true);
  };

  const handleToggleExpand = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, expanded: !notification.expanded } 
        : notification
    ));
  };

  const snoozeNotification = (duration: string) => {
    setNotifications(notifications.filter(notification => notification.id !== selectedNotification));
    setSnoozeModalVisible(false);
    setSelectedNotification(null);
  };

  const renderNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'role_change':
        return <Shield size={20} color="#A259FF" />;
      case 'bet':
        return <Bell size={20} color="#A259FF" />;
      case 'win':
        return <Trophy size={20} color="#10B981" />;
      case 'loss':
        return <X size={20} color="#EF4444" />;
      case 'message':
        return <MessageSquare size={20} color="#A259FF" />;
      case 'follow':
        return <UserPlus size={20} color="#A259FF" />;
      case 'ranking':
        return <TrendingUp size={20} color="#A259FF" />;
      case 'deposit':
        return <DollarSign size={20} color="#10B981" />;
      default:
        return <Bell size={20} color="#A259FF" />;
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View style={[styles.notificationCard, !item.read && styles.unreadNotification]}>
      <TouchableOpacity 
        style={styles.notificationHeader}
        onPress={() => handleToggleExpand(item.id)}
      >
        <View style={styles.notificationIconContainer}>
          {renderNotificationIcon(item.type)}
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
          
          <Text 
            style={styles.notificationDescription}
            numberOfLines={item.expanded ? undefined : 2}
          >
            {item.description}
          </Text>
          
          {item.avatar && (
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: item.avatar }} 
                style={styles.avatar} 
              />
            </View>
          )}
          
          {item.amount && (
            <Text style={[
              styles.amountText,
              item.type === 'win' || item.type === 'deposit' 
                ? styles.positiveAmount 
                : styles.negativeAmount
            ]}>
              {item.amount}
            </Text>
          )}
        </View>
        
        <ChevronRight 
          size={16} 
          color="#A259FF" 
          style={[
            styles.expandIcon,
            item.expanded && styles.expandIconRotated
          ]} 
        />
      </TouchableOpacity>
      
      {item.expanded && (
        <View style={styles.notificationActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <X size={16} color="white" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.snoozeButton]}
            onPress={() => handleSnooze(item.id)}
          >
            <Clock size={16} color="white" />
            <Text style={styles.actionButtonText}>Snooze</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.notificationsList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Bell size={48} color="#4A4A4A" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        )}
      />

      <Modal
        visible={snoozeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSnoozeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Snooze Notification</Text>
            <Text style={styles.modalSubtitle}>Choose how long to snooze this notification</Text>
            
            <TouchableOpacity 
              style={styles.snoozeOption}
              onPress={() => snoozeNotification('1 hour')}
            >
              <Clock size={20} color="#A259FF" />
              <Text style={styles.snoozeOptionText}>1 Hour</Text>
              <ChevronRight size={16} color="#A259FF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.snoozeOption}
              onPress={() => snoozeNotification('3 hours')}
            >
              <Clock size={20} color="#A259FF" />
              <Text style={styles.snoozeOptionText}>3 Hours</Text>
              <ChevronRight size={16} color="#A259FF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.snoozeOption}
              onPress={() => snoozeNotification('1 day')}
            >
              <Clock size={20} color="#A259FF" />
              <Text style={styles.snoozeOptionText}>1 Day</Text>
              <ChevronRight size={16} color="#A259FF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.snoozeOption}
              onPress={() => snoozeNotification('1 week')}
            >
              <Clock size={20} color="#A259FF" />
              <Text style={styles.snoozeOptionText}>1 Week</Text>
              <ChevronRight size={16} color="#A259FF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setSnoozeModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#1A1A1D',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  placeholder: {
    width: 40,
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#A259FF',
  },
  notificationHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(162, 89, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  notificationTime: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  notificationDescription: {
    color: '#EAEAEA',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  avatarContainer: {
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  amountText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  positiveAmount: {
    color: '#10B981',
  },
  negativeAmount: {
    color: '#EF4444',
  },
  expandIcon: {
    marginLeft: 8,
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  notificationActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#4A4A4A',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#EF4444',
    gap: 8,
  },
  snoozeButton: {
    backgroundColor: '#A259FF',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtext: {
    color: '#A259FF',
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  modalSubtitle: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  snoozeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  snoozeOptionText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Medium',
  },
  cancelButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});