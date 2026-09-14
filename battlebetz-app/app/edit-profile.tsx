import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  ScrollView,
  Platform,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, Camera, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from '@/hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';

// Profile data state with proper type
interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  privateProfile: boolean;
  notificationsEnabled: boolean;
  showWinnings: boolean;
  showBattleHistory: boolean;
  [key: string]: string | boolean;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userProfile, loading: profileLoading, updateUserProfile, refreshProfileData, uploadAvatar } = useProfileData();
  
  const [saveLoading, setSaveLoading] = useState(false);

  // Initialize with empty values
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: '',
    username: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    profileImage: '',
    privateProfile: false,
    notificationsEnabled: true,
    showWinnings: true,
    showBattleHistory: true
  });
  
  // Populate form with user data when it loads
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.username || '',  // Using username as name for now
        username: '@' + (userProfile.username || '').toLowerCase(),
        bio: userProfile.bio || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        profileImage: userProfile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
        privateProfile: false, // Default values for settings that aren't in the database yet
        notificationsEnabled: true,
        showWinnings: true,
        showBattleHistory: true
      });
    }
  }, [userProfile]);
  
  // Handle text input changes
  const handleChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };
  
  // Handle toggle switches
  const handleToggle = (field: string) => {
    setProfileData({
      ...profileData,
      [field]: !profileData[field]
    });
  };
  
  // Save profile and go back
  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to update your profile");
      return;
    }
    
    try {
      setSaveLoading(true);
      
      // Format username (remove @ if present)
      const formattedUsername = profileData.username.startsWith('@') 
        ? profileData.username.substring(1) 
        : profileData.username;
      
      // Prepare data for update
      const updateData = {
        username: formattedUsername,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        avatar_url: profileData.profileImage
      };
      
      // Update profile using the hook function
      const { success, error } = await updateUserProfile(updateData);
      
      if (!success) {
        console.error('Error updating profile:', error);
        Alert.alert("Error", "There was a problem updating your profile. Please try again.");
        return;
      }
      
      // Refresh profile data to ensure UI is updated
      await refreshProfileData();
      
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully!",
        [
          { text: "OK", onPress: () => router.push('/profile') }
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert("Error", "There was a problem updating your profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Handle profile image change with Minio upload
  const handleChangeProfileImage = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to update your profile image");
      return;
    }
    
    Alert.alert(
      "Change Profile Photo",
      "Choose how you want to update your profile photo",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Select from Gallery", 
          onPress: async () => {
            try {
              // Request permission
              if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert("Permission Denied", "We need permission to access your photos.");
                  return;
                }
              }
              
              // Pick image
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              
              if (!result.canceled && result.assets && result.assets.length > 0) {
                // Convert the picked image to a File object
                const uri = result.assets[0].uri;
                const response = await fetch(uri);
                const blob = await response.blob();
                const filename = uri.split('/').pop() || 'avatar.jpg';
                const file = new File([blob], filename, { type: blob.type });
                
                // Show loading indicator
                setSaveLoading(true);
                
                // Upload the image using our profile data hook
                const { url, error } = await uploadAvatar(file);
                
                if (error) {
                  throw error;
                }
                
                if (url) {
                  // Update local state
                  setProfileData(prev => ({
                    ...prev,
                    profileImage: url
                  }));
                  
                  // Refresh profile data to ensure UI is updated
                  await refreshProfileData();
                  
                  Alert.alert("Success", "Your profile image has been updated!");
                }
              }
            } catch (error) {
              console.error('Error updating profile image:', error);
              Alert.alert("Error", "There was a problem updating your profile image. Please try again.");
            } finally {
              setSaveLoading(false);
            }
          } 
        },
        { 
          text: "Take Photo", 
          onPress: async () => {
            try {
              // Request camera permission
              if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert("Permission Denied", "We need permission to access your camera.");
                  return;
                }
              }
              
              // Launch camera
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              
              if (!result.canceled && result.assets && result.assets.length > 0) {
                // Convert the camera image to a File object
                const uri = result.assets[0].uri;
                const response = await fetch(uri);
                const blob = await response.blob();
                const filename = 'camera_avatar.jpg';
                const file = new File([blob], filename, { type: 'image/jpeg' });
                
                // Show loading indicator
                setSaveLoading(true);
                
                // Upload the image
                const { url, error } = await uploadAvatar(file);
                
                if (error) {
                  throw error;
                }
                
                if (url) {
                  // Update local state
                  setProfileData(prev => ({
                    ...prev,
                    profileImage: url
                  }));
                  
                  // Refresh profile data
                  await refreshProfileData();
                  
                  Alert.alert("Success", "Your profile image has been updated!");
                }
              }
            } catch (error) {
              console.error('Error updating profile image with camera:', error);
              Alert.alert("Error", "There was a problem updating your profile image. Please try again.");
            } finally {
              setSaveLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            
            try {
              setSaveLoading(true);
              
              // In a real implementation, this would:
              // 1. Delete all user-related data from other tables
              // 2. Delete the user from the users table
              // 3. Delete the user from auth
              
              // For now, we'll just show a demo alert
              Alert.alert(
                "Demo Feature",
                "In a production app, this would delete your account from all systems.",
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert("Error", "There was a problem deleting your account. Please try again.");
            } finally {
              setSaveLoading(false);
            }
          }
        }
      ]
    );
  };
  
  if (profileLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#A259FF" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/tournaments')}
        >
          <ArrowLeft size={24} color="#EAEAEA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, saveLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saveLoading}
        >
          {saveLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Image */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileData.profileImage }}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleChangeProfileImage}
            >
              <Camera size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangeProfileImage}>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>
        
        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Your full name"
              placeholderTextColor="#6c757d"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.username}
              onChangeText={(text) => handleChange('username', text)}
              placeholder="@username"
              placeholderTextColor="#6c757d"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.textAreaInput]}
              value={profileData.bio}
              onChangeText={(text) => handleChange('bio', text)}
              placeholder="Tell us about yourself"
              placeholderTextColor="#6c757d"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
        
        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.textInput, styles.disabledInput]}
              value={profileData.email}
              placeholder="your.email@example.com"
              placeholderTextColor="#6c757d"
              editable={false}
            />
            <Text style={styles.helperText}>Email address cannot be changed</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Your phone number"
              placeholderTextColor="#6c757d"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.location}
              onChangeText={(text) => handleChange('location', text)}
              placeholder="City, State"
              placeholderTextColor="#6c757d"
            />
          </View>
        </View>
        
        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Private Profile</Text>
              <Text style={styles.toggleDescription}>Only friends can see your profile</Text>
            </View>
            <Switch
              value={profileData.privateProfile}
              onValueChange={() => handleToggle('privateProfile')}
              trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
              thumbColor={profileData.privateProfile ? '#EAEAEA' : '#EAEAEA'}
            />
          </View>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Enable Notifications</Text>
              <Text style={styles.toggleDescription}>Receive notifications about battles and updates</Text>
            </View>
            <Switch
              value={profileData.notificationsEnabled}
              onValueChange={() => handleToggle('notificationsEnabled')}
              trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
              thumbColor={profileData.notificationsEnabled ? '#EAEAEA' : '#EAEAEA'}
            />
          </View>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Show Winnings</Text>
              <Text style={styles.toggleDescription}>Display your winnings on your profile</Text>
            </View>
            <Switch
              value={profileData.showWinnings}
              onValueChange={() => handleToggle('showWinnings')}
              trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
              thumbColor={profileData.showWinnings ? '#EAEAEA' : '#EAEAEA'}
            />
          </View>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Show Battle History</Text>
              <Text style={styles.toggleDescription}>Display your battle history on your profile</Text>
            </View>
            <Switch
              value={profileData.showBattleHistory}
              onValueChange={() => handleToggle('showBattleHistory')}
              trackColor={{ false: '#4A4A4A', true: '#A259FF' }}
              thumbColor={profileData.showBattleHistory ? '#EAEAEA' : '#EAEAEA'}
            />
          </View>
        </View>
        
        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerSectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#EAEAEA',
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
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
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#A259FF',
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#A259FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0D0D0D',
  },
  changePhotoText: {
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  section: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#EAEAEA',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  textInput: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    color: '#EAEAEA',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  disabledInput: {
    backgroundColor: '#3A3A3A',
    color: '#9E9E9E',
  },
  helperText: {
    color: '#9E9E9E',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: 'top',
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
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
  },
  toggleDescription: {
    color: '#A259FF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  dangerSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  dangerSectionTitle: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});