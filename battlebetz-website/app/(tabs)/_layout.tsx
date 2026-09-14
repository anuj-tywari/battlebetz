import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Shield, Landmark, Users, Crown, User } from 'lucide-react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const networkStatus = useNetworkStatus();
  const { user } = useAuth();
  const router = useRouter();
  const isDesktop = Platform.OS === 'web' && window.innerWidth > 768;

  const menuItems = [
    { icon: Shield, label: 'Vault', route: 'vault' },
    { icon: Landmark, label: 'Arena', route: 'arena' },
    { icon: Users, label: 'Battles', route: 'battles' },
    { icon: Crown, label: 'Art of War', route: 'art-of-war' },
    ...(user ? [{ icon: User, label: 'Profile', route: 'profile' }] : []),
  ];

  const handleMenuClick = (route: string) => {
    // Navigate to the route within the tabs
    router.push(`/(tabs)/${route}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu</Text>
        </View>
        <View style={styles.menuItems}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.route}
              style={styles.menuItem}
              onPress={() => handleMenuClick(item.route)}
            >
              <item.icon size={24} color="#A259FF" />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' }
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ size, color }) => null,
            }}
          />
          <Tabs.Screen
            name="vault"
            options={{
              title: 'Vault',
              tabBarIcon: ({ size, color }) => <Shield size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="arena"
            options={{
              title: 'Arena',
              tabBarIcon: ({ size, color }) => <Landmark size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="battles"
            options={{
              title: 'Battles',
              tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="art-of-war"
            options={{
              title: 'ArtofWar',
              tabBarIcon: ({ size, color }) => <Crown size={size} color={color} />,
            }}
          />
          {user && (
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
              }}
            />
          )}
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0D0D0D',
  },
  menuContainer: {
    width: 280,
    backgroundColor: '#1A1A1D',
    borderRightWidth: 1,
    borderRightColor: '#2E2E3A',
    height: '100vh',
  },
  menuHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  menuTitle: {
    color: '#EAEAEA',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2E2E3A',
    borderRadius: 12,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  menuText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    flex: 1,
  },
});