import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Platform,
  Alert
} from 'react-native';
import { ArrowLeft, Plus, X, Send, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type Friend = {
  id: string;
  name: string;
  email: string;
};

export default function InviteFriendsScreen() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: '', email: '' }
  ]);

  const addFriend = () => {
    setFriends([
      ...friends,
      { id: Date.now().toString(), name: '', email: '' }
    ]);
  };

  const removeFriend = (id: string) => {
    if (friends.length === 1) {
      return; // Keep at least one form
    }
    setFriends(friends.filter(friend => friend.id !== id));
  };

  const updateFriend = (id: string, field: 'name' | 'email', value: string) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, [field]: value } : friend
    ));
  };

  const handleSubmit = () => {
    // Validate inputs
    const invalidFriends = friends.filter(friend => !friend.name || !friend.email);
    if (invalidFriends.length > 0) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = friends.filter(friend => !emailRegex.test(friend.email));
    if (invalidEmails.length > 0) {
      Alert.alert('Error', 'Please enter valid email addresses');
      return;
    }

    // In a real app, this would send invites to the server
    Alert.alert(
      'Invites Sent!',
      `Invitations have been sent to ${friends.length} friend${friends.length > 1 ? 's' : ''}.`,
      [{ text: 'OK', onPress: () => router.back() }]
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
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.introSection}>
          <View style={styles.iconContainer}>
            <Users size={32} color="#A259FF" />
          </View>
          <Text style={styles.title}>Invite Friends</Text>
          <Text style={styles.subtitle}>
            Join March Madness together and compete as a team
          </Text>
        </View>

        <ScrollView style={styles.formScroll}>
          <View style={styles.formContainer}>
            {friends.map((friend, index) => (
              <View key={friend.id} style={styles.friendForm}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Friend {index + 1}</Text>
                  {friends.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeFriend(friend.id)}
                    >
                      <X size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.formFields}>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="Name"
                      placeholderTextColor="#6c757d"
                      value={friend.name}
                      onChangeText={(value) => updateFriend(friend.id, 'name', value)}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#6c757d"
                      value={friend.email}
                      onChangeText={(value) => updateFriend(friend.id, 'email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.addButton}
              onPress={addFriend}
            >
              <Plus size={20} color="#A259FF" />
              <Text style={styles.addButtonText}>Add Another Friend</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Send size={20} color="white" />
          <Text style={styles.submitButtonText}>
            Send {friends.length} Invitation{friends.length > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      </View>
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
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  introSection: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(162, 89, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    color: '#A259FF',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
    fontFamily: 'Poppins-Regular',
  },
  formScroll: {
    flex: 1,
  },
  formContainer: {
    padding: 24,
    paddingTop: 0,
    gap: 16,
  },
  friendForm: {
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formTitle: {
    color: '#EAEAEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  removeButton: {
    padding: 4,
  },
  formFields: {
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    padding: 12,
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A259FF',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#A259FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    backgroundColor: '#1A1A1D',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2E2E3A',
  },
  submitButton: {
    backgroundColor: '#A259FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});