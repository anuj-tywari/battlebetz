import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { Bell, MessageSquare, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

import CommentModal from './CommentModal';

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [showCommentModal, setShowCommentModal] = useState(false);
  
  const handleCommentSubmit = (comment: string, gameId?: string, url?: string) => {
    console.log('Comment submitted:', { comment, gameId, url });
    setShowCommentModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://raw.githubusercontent.com/stackblitz/assets/main/projects/bb-logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Battle Betz</Text>
        </View>
        
        <View style={styles.iconContainer}>
          {!user ? (
            <>
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.activityButton}
                onPress={() => router.push('/my-activity')}
              >
                <Activity size={16} color="#EAEAEA" />
                <Text style={styles.activityButtonText}>Activity</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => router.push('/notifications')}
              >
                <Bell size={20} color="#EAEAEA" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setShowCommentModal(true)}
              >
                <MessageSquare size={20} color="#EAEAEA" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <CommentModal
        visible={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSubmit={handleCommentSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0D0D0D',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D0D0D',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
  },
  logoText: {
    color: '#EAEAEA',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  signInButton: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A259FF',
  },
  signInButtonText: {
    color: '#A259FF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  signUpButton: {
    backgroundColor: '#A259FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 4,
  },
  activityButtonText: {
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  iconButton: {
    padding: 4,
  },
});