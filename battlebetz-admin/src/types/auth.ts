export type UserRole = 'admin' | 'internal' | 'promoter' | 'comp-owner' | 'consumer' | 'fantasy-manager';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar_url?: string;
  created_at?: string;
}

// Extend the next-auth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    }
    accessToken?: string;
  }
  
  interface User {
    id: string;
    role: UserRole;
    name?: string;
    email: string;
    accessToken?: string;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    email?: string | null;
    accessToken?: string;
  }
} 