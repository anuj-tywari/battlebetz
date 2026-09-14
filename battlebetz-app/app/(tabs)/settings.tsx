import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Platform,
  Alert
} from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PreferencesScreen() {
  const router = useRouter();
  
  // Notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    pushEnabled: true,
    battleRequests: true,
    battleResults: true,
    friendRequests: true,
    appUpdates: false,
    marketing: false,
  });
  
  // Handle toggle changes
  const handleToggle = (key: string) => {
    setNotificationPreferences(prev => {
      const newPrefs = {
        ...prev,
        [key]: !prev[key]
      };
      
      // If turning off main notifications, show alert
      if (key === 'pushEnabled' && prev.pushEnabled) {
        Alert.alert(
          "Disable Notifications",
          "You will no longer receive important updates about your battles and account. Are you sure?",
          [
            { 
              text: "Cancel", 
              style: "cancel", 
              onPress: () => {
                setNotificationPreferences(prev);
              }
            },
            { text: "Disable", style: "destructive" }
          ]
        );
      }
      
      return newPrefs;
    });
  };
  
  // Open system settings
  const openSystemSettings = () => {
    Alert.alert(
      "Open Settings",
      "This would open your device's notification settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Notification Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#A259FF" />
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
          </View>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Text style={styles.toggleDescription}>Enable all push notifications</Text>
            </View>
            <Switch
              value={notificationPreferences.pushEnabled}
              onValueChange={() => handleToggle('pushEnabled')}
              trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
              thumbColor={notificationPreferences.pushEnabled ? '#EAEAEA' : '#EAEAEA'}
            />
          </View>
          
          {notificationPreferences.pushEnabled && (
            <>
              <View style={styles.toggleGroup}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Battle Requests</Text>
                  <Text style={styles.toggleDescription}>Notifications for new battle requests</Text>
                </View>
                <Switch
                  value={notificationPreferences.battleRequests}
                  onValueChange={() => handleToggle('battleRequests')}
                  trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
                  thumbColor={notificationPreferences.battleRequests ? '#EAEAEA' : '#EAEAEA'}
                />
              </View>
              
              <View style={styles.toggleGroup}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Battle Results</Text>
                  <Text style={styles.toggleDescription}>Notifications for battle outcomes</Text>
                </View>
                <Switch
                  value={notificationPreferences.battleResults}
                  onValueChange={() => handleToggle('battleResults')}
                  trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
                  thumbColor={notificationPreferences.battleResults ? '#EAEAEA' : '#EAEAEA'}
                />
              </View>
              
              <View style={styles.toggleGroup}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Friend Requests</Text>
                  <Text style={styles.toggleDescription}>Notifications for new friend requests</Text>
                </View>
                <Switch
                  value={notificationPreferences.friendRequests}
                  onValueChange={() => handleToggle('friendRequests')}
                  trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
                  thumbColor={notificationPreferences.friendRequests ? '#EAEAEA' : '#EAEAEA'}
                />
              </View>
              
              <View style={styles.toggleGroup}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>App Updates</Text>
                  <Text style={styles.toggleDescription}>Notifications about app updates</Text>
                </View>
                <Switch
                  value={notificationPreferences.appUpdates}
                  onValueChange={() => handleToggle('appUpdates')}
                  trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
                  thumbColor={notificationPreferences.appUpdates ? '#EAEAEA' : '#EAEAEA'}
                />
              </View>
              
              <View style={styles.toggleGroup}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Marketing</Text>
                  <Text style={styles.toggleDescription}>Promotional notifications and offers</Text>
                </View>
                <Switch
                  value={notificationPreferences.marketing}
                  onValueChange={() => handleToggle('marketing')}
                  trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
                  thumbColor={notificationPreferences.marketing ? '#EAEAEA' : '#EAEAEA'}
                />
              </View>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.systemSettingsButton}
            onPress={openSystemSettings}
          >
            <Text style={styles.systemSettingsButtonText}>Open System Notification Settings</Text>
          </TouchableOpacity>
        </View>
        
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Battle Betz v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 Battle Betz Inc.</Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  toggleGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  toggleDescription: {
    color: '#A259FF',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  systemSettingsButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  systemSettingsButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appVersion: {
    color: '#A259FF',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  appCopyright: {
    color: '#EAEAEA',
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
});