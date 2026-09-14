import { UserRole } from "./auth";

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar_url?: string | null;
  avatarUrl?: string | null;
  is_admin?: boolean;
  isAdmin?: boolean;
  phone?: string | null;
  status?: 'active' | 'inactive';
  balance?: number;
  role?: UserRole;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}
