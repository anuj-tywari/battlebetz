// User Role Types
export type UserRole = 'admin' | 'internal' | 'promoter' | 'comp-owner' | 'consumer' | 'fantasy-manager';

// Permission Types
export type Permission = 
  // Admin Permissions
  | 'manage:users'
  | 'manage:bets'
  | 'manage:tournaments'
  | 'manage:leaderboards'
  | 'manage:insights'
  | 'manage:payments'
  | 'manage:settings'
  | 'view:analytics'
  | 'moderate:content'
  
  // Promoter Permissions
  | 'generate:referrals'
  | 'view:referral-stats'
  | 'access:marketing'
  
  // Comp Owner Permissions
  | 'manage:competitions'
  | 'view:comp-analytics'
  | 'manage:comp-settings'
  | 'manage:comp-users'
  
  // Fantasy Manager Permissions
  | 'manage:fantasy-leagues'
  | 'view:fantasy-analytics'
  | 'manage:fantasy-settings'
  | 'manage:fantasy-users'
  
  // Consumer Permissions
  | 'place:bets'
  | 'join:tournaments'
  | 'view:leaderboards'
  | 'view:stats'
  | 'interact:social';

// Role Definitions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'manage:users',
    'manage:bets',
    'manage:tournaments',
    'manage:leaderboards',
    'manage:insights',
    'manage:payments',
    'manage:settings',
    'view:analytics',
    'moderate:content',
    'generate:referrals',
    'view:referral-stats',
    'access:marketing',
    'manage:competitions',
    'view:comp-analytics',
    'manage:comp-settings',
    'manage:comp-users',
    'manage:fantasy-leagues',
    'view:fantasy-analytics',
    'manage:fantasy-settings',
    'manage:fantasy-users',
    'place:bets',
    'join:tournaments',
    'view:leaderboards',
    'view:stats',
    'interact:social'
  ],
  internal: [
    'manage:users',
    'manage:bets',
    'manage:tournaments',
    'manage:leaderboards',
    'view:analytics',
    'moderate:content',
    'place:bets',
    'join:tournaments',
    'view:leaderboards',
    'view:stats',
    'interact:social'
  ],
  promoter: [
    'generate:referrals',
    'view:referral-stats',
    'access:marketing',
    'place:bets',
    'join:tournaments',
    'view:leaderboards',
    'view:stats',
    'interact:social'
  ],
  'comp-owner': [
    'manage:competitions',
    'view:comp-analytics',
    'manage:comp-settings',
    'manage:comp-users',
    'place:bets',
    'join:tournaments',
    'view:leaderboards',
    'view:stats',
    'interact:social'
  ],
  'fantasy-manager': [
    'manage:fantasy-leagues',
    'view:fantasy-analytics',
    'manage:fantasy-settings',
    'manage:fantasy-users',
    'place:bets',
    'join:tournaments',
    'view:leaderboards',
    'view:stats',
    'interact:social'
  ],
  consumer: [
    'place:bets',
    'join:tournaments',
    'view:leaderboards',
    'view:stats',
    'interact:social'
  ]
};

// User Type
export interface User {
  id: string;
  role: UserRole;
  email: string;
  username: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  isBanned: boolean;
  referralCode?: string;
  referredBy?: string;
  isFantasyManager?: boolean;
}