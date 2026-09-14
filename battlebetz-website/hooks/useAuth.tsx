import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Permission, ROLE_PERMISSIONS } from '@/types/roles';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, username: string, isFantasyManager?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = {
  'chase@battlebetz.com': {
    id: '1',
    role: 'admin',
    email: 'chase@battlebetz.com',
    username: 'chase',
    createdAt: new Date(),
    isActive: true,
    isBanned: false
  },
  'john.smith@example.com': {
    id: '2',
    role: 'consumer',
    email: 'john.smith@example.com',
    username: 'johnsmith',
    createdAt: new Date(),
    isActive: true,
    isBanned: false
  },
  'frank@example.com': {
    id: '3',
    role: 'promoter',
    email: 'frank@example.com',
    username: 'frank',
    createdAt: new Date(),
    isActive: true,
    isBanned: false
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = localStorage.getItem('session');
      if (session) {
        const userData = JSON.parse(session);
        setUser(userData);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check if user exists in mock data
      const mockUser = MOCK_USERS[email.toLowerCase()];
      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      setUser(mockUser);
      localStorage.setItem('session', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem('session');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string, isFantasyManager = false) => {
    try {
      setIsLoading(true);
      const mockUser: User = {
        id: Math.random().toString(),
        role: isFantasyManager ? 'fantasy-manager' : 'consumer',
        email,
        username,
        createdAt: new Date(),
        isActive: true,
        isBanned: false,
        referralCode: Math.random().toString(36).substring(7),
        isFantasyManager
      };
      setUser(mockUser);
      localStorage.setItem('session', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      hasPermission,
      login,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}