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
import { ArrowLeft, Bell, Volume2, Moon, Globe, Shield, CircleHelp as HelpCircle, ChevronRight } from 'lucide-react-native';
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
  
  // App preferences
  const [appPreferences, setAppPreferences] = useState({
    soundEffects: true,
    darkMode: true,
    language: 'English',
    region: 'United States',
    dataUsage: 'Optimized',
  });
  
  // Handle toggle changes
  const handleToggle = (section, key) => {
    if (section === 'notifications') {
      setNotificationPreferences({
        ...notificationPreferences,
        [key]: !notificationPreferences[key]
      });
      
      // If turning off main notifications, show alert
      if (key === 'pushEnabled' && notificationPreferences.pushEnabled) {
        Alert.alert(
          "Disable Notifications",
          "You will no longer receive important updates about your battles and account. Are you sure?",
          [
            { text: "Cancel", style: "cancel", onPress: () => {
              setNotificationPreferences({
                ...notificationPreferences,
                pushEnabled: true
              });
            }},
            { text: "Disable", style: "destructive" }
          ]
        );
      }
    } else {
      setAppPreferences({
        ...appPreferences,
        [key]: !appPreferences[key]
      });
    }
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
  
  // Show language selector
  const showLanguageSelector = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      [
        { text: "English", onPress: () => setAppPreferences({...appPreferences, language: 'English'}) },
        { text: "Spanish", onPress: () => setAppPreferences({...appPreferences, language: 'Spanish'}) },
        { text: "French", onPress: () => setAppPreferences({...appPreferences, language: 'French'}) },
        { text: "German", onPress: () => setAppPreferences({...appPreferences, language: 'German'}) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };
  
  // Show region selector
  const showRegionSelector = () => {
    Alert.alert(
      "Select Region",
      "Choose your region",
      [
        { text: "United States", onPress: () => setAppPreferences({...appPreferences, region: 'United States'}) },
        { text: "Europe", onPress: () => setAppPreferences({...appPreferences, region: 'Europe'}) },
        { text: "Asia", onPress: () => setAppPreferences({...appPreferences, region: 'Asia'}) },
        { text: "Australia", onPress: () => setAppPreferences({...appPreferences, region: 'Australia'}) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };
  
  // Show data usage selector
  const showDataUsageSelector = () => {
    Alert.alert(
      "Data Usage",
      "Choose your data usage preference",
      [
        { text: "Optimized", onPress: () => setAppPreferences({...appPreferences, dataUsage: 'Optimized'}) },
        { text: "High Quality", onPress: () => setAppPreferences({...appPreferences, dataUsage: 'High Quality'}) },
        { text: "Data Saver", onPress: () => setAppPreferences({...appPreferences, dataUsage: 'Data Saver'}) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
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
              onValueChange={() => handleToggle('notifications', 'pushEnabled')}
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
                  onValueChange={() => handleToggle('notifications', 'battleRequests')}
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
                  onValueChange={() => handleToggle('notifications', 'battleResults')}
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
                  onValueChange={() => handleToggle('notifications', 'friendRequests')}
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
                  onValueChange={() => handleToggle('notifications', 'appUpdates')}
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
                  onValueChange={() => handleToggle('notifications', 'marketing')}
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
        
        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleInfo}>
              <View style={styles.toggleLabelContainer}>
                <Volume2 size={18} color="#EAEAEA" />
                <Text style={styles.toggleLabel}>Sound Effects</Text>
              </View>
              <Text style={styles.toggleDescription}>Enable sound effects in the app</Text>
            </View>
            <Switch
              value={appPreferences.soundEffects}
              onValueChange={() => handleToggle('app', 'soundEffects')}
              trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
              thumbColor={appPreferences.soundEffects ? '#EAEAEA' : '#EAEAEA'}
            />
          </View>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleInfo}>
              <View style={styles.toggleLabelContainer}>
                <Moon size={18} color="#EAEAEA" />
                <Text style={styles.toggleLabel}>Dark Mode</Text>
              </View>
              <Text style={styles.toggleDescription}>Use dark theme throughout the app</Text>
            </View>
            <Switch
              value={appPreferences.darkMode}
              onValueChange={() => handleToggle('app', 'darkMode')}
              trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
              thumbColor={appPreferences.darkMode ? '#EAEAEA' : '#EAEAEA'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={showLanguageSelector}
          >
            <View style={styles.optionInfo}>
              <View style={styles.optionLabelContainer}>
                <Globe size={18} color="#EAEAEA" />
                <Text style={styles.optionLabel}>Language</Text>
              </View>
              <Text style={styles.optionValue}>{appPreferences.language}</Text>
            </View>
            <ChevronRight size={18} color="#A259FF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={showRegionSelector}
          >
            <View style={styles.optionInfo}>
              <View style={styles.optionLabelContainer}>
                <Globe size={18} color="#EAEAEA" />
                <Text style={styles.optionLabel}>Region</Text>
              </View>
              <Text style={styles.optionValue}>{appPreferences.region}</Text>
            </View>
            <ChevronRight size={18} color="#A259FF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={showDataUsageSelector}
          >
            <View style={styles.optionInfo}>
              <View style={styles.optionLabelContainer}>
                <Shield size={18} color="#EAEAEA" />
                <Text style={styles.optionLabel}>Data Usage</Text>
              </View>
              <Text style={styles.optionValue}>{appPreferences.dataUsage}</Text>
            </View>
            <ChevronRight size={18} color="#A259FF" />
          </TouchableOpacity>
        </View>
        
        {/* Help & Support */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color="#A259FF" />
            <Text style={styles.sectionTitle}>Help & Support</Text>
          </View>
          
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>FAQs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Terms of Service</Text>
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
  toggleLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  optionLabel: {
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  optionValue: {
    color: '#A259FF',
    fontSize: 14,
    marginLeft: 26,
    fontFamily: 'Poppins-Regular',
  },
  supportButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  supportButtonText: {
    color: '#EAEAEA',
    fontSize: 16,
    textAlign: 'center',
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