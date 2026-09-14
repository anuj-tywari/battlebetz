import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

// Skip actual Minio implementation for now to avoid errors
// We'll use a mock implementation instead

// Pick image from gallery
export const pickImage = async (): Promise<ImagePicker.ImagePickerResult> => {
  // Request permission
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }
  }
  
  // Pick image
  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
};

// Mock upload function for development
export const uploadAvatarToMinio = async (
  userId: string,
  imageUri: string
): Promise<{ url: string }> => {
  try {
    console.log('Using mock Minio upload (development mode)');
    const timestamp = new Date().getTime();
    
    // If we have an imageUri, just return it, otherwise use a placeholder
    if (imageUri) {
      return { url: imageUri };
    }
    
    // Generate a placeholder URL
    return { 
      url: `https://placeholder.com/avatar_${userId}_${timestamp}.jpg` 
    };
  } catch (error) {
    console.error('Error in mock avatar upload:', error);
    // Return a fallback URL
    return { url: `https://placeholder.com/avatar_fallback_${Date.now()}.jpg` };
  }
};

// Mock delete function
export const deleteAvatarFromMinio = async (avatarUrl: string): Promise<void> => {
  try {
    console.log('Skipping avatar deletion (development mode)');
    // Just log and return in development mode
    return;
  } catch (error) {
    console.error('Error in mock avatar deletion:', error);
  }
}; 