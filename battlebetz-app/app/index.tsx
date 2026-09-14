import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
// import { useAuth } from '@/hooks/AuthProvider';

export default function Index() {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Otherwise redirect to tabs
  return <Redirect href="/(tabs)" />;
}