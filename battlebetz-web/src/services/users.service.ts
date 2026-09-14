import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Define user types
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
}

export type BetStatus = 'PENDING' | 'WON' | 'LOST' | 'CANCELLED';
export type UserWithoutPassword = User;

interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
}

// Stub implementation for user service
export const userService = {
  // Auth methods
  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    console.warn('User service not fully implemented');
    
    // This is just a stub - implement with Supabase Auth later
    const fakeUser: User = {
      id: 'stub-user-id',
      email,
      username,
      role: 'USER'
    };
    
    const token = 'stub-token';
    
    return { user: fakeUser, token };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    console.warn('User service not fully implemented');
    
    // This is just a stub - implement with Supabase Auth later
    const fakeUser: User = {
      id: 'stub-user-id',
      email,
      username: 'user',
      role: 'USER'
    };
    
    const token = 'stub-token';
    
    return { user: fakeUser, token };
  },

  // User methods
  async getUserById(id: string): Promise<UserWithoutPassword | null> {
    console.warn('User service not fully implemented');
    return null;
  },

  async getUserByEmail(email: string): Promise<UserWithoutPassword | null> {
    console.warn('User service not fully implemented');
    return null;
  },

  async updateUserProfile(userId: string, data: Partial<User>) {
    console.warn('User service not fully implemented');
    return null;
  },

  // User wallet methods
  async getUserWallet(userId: string) {
    console.warn('User service not fully implemented');
    return null;
  },

  // User metrics methods
  async getUserMetrics(userId: string) {
    console.warn('User service not fully implemented');
    return null;
  },

  // User bets methods
  async getUserBets(userId: string, page = 1, limit = 10, status?: BetStatus) {
    console.warn('User service not fully implemented');
    
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        pageCount: 0
      }
    };
  },

  // User tournaments methods
  async getUserTournaments(userId: string, page = 1, limit = 10, status?: string) {
    console.warn('User service not fully implemented');
    
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        pageCount: 0
      }
    };
  }
}; 