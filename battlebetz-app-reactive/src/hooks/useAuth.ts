import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser, 
  type AuthUser 
} from '@/services/auth';

export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Define isAuthenticated derived from user state
  const isAuthenticated = !!user;

  useEffect(() => {
    async function loadUser() {
      try {
        const { user, error } = await getCurrentUser();
        
        if (error) {
          console.error('Error loading user:', error);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (err) {
        console.error('Unexpected error loading user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

const login = async (email: string, password: string) => {
  setLoading(true);
  setError(null);
  
  try {
    const { user, error } = await signIn({ email, password });
    
    if (error) {
      setError(error);
      setUser(null);
    } else {
      setUser(user);
      
      // Add a short delay to ensure session is set properly
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push('/dashboard'); // Redirect to dashboard instead of home
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('An unexpected error occurred during login');
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, error } = await signUp({ email, password, name });
      
      if (error) {
        setError(error);
        setUser(null);
      } else {
        setUser(user);
        router.push('/'); // Redirect to home page after registration
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred during registration');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      const { error } = await signOut();
      
      if (error) {
        setError(error);
      } else {
        setUser(null);
        router.push('/login'); // Redirect to login page
      }
    } catch (err) {
      console.error('Logout error:', err);
      setError('An unexpected error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  };
} 