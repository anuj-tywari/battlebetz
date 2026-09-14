"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { userService } from '@/services/users.service';

type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  wallet?: {
    balance: number;
  } | null;
  metrics?: {
    bbzBalance: number;
    battleCount: number;
    battleWonCount: number;
  } | null;
};

export default function ProfileCard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setIsLoading(true);
        
        if (!session?.user?.id) {
          setError('User not found');
          return;
        }
        
        // Get basic user data
        const userData = await fetch(`/api/users/${session.user.id}`);
        const userJson = await userData.json();
        
        if (!userJson.data) {
          setError('User profile not found');
          return;
        }
        
        setProfile(userJson.data);
        setBio(userJson.data.bio || '');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      loadUserProfile();
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsSaving(true);
      
      // Update user bio
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Refresh profile
      const userData = await fetch(`/api/users/${session.user.id}`);
      const userJson = await userData.json();
      setProfile(userJson.data);
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-600 rounded-full"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2 mt-4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/4 mt-2"></div>
          <div className="h-20 bg-gray-600 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  if (error || !profile || !session) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center text-red-500">
          {error || 'Profile not found'}
        </div>
      </div>
    );
  }

  const userName = profile.username || 'User';
  const userEmail = profile.email || '';
  const firstInitial = userName.charAt(0).toUpperCase();
  const walletBalance = profile.wallet?.balance || 0;
  
  // User stats
  const totalBattles = profile.metrics?.battleCount || 0;
  const battleWins = profile.metrics?.battleWonCount || 0;
  const winRate = totalBattles > 0 ? Math.round((battleWins / totalBattles) * 100) : 0;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-500">
          {profile.avatarUrl ? (
            <Image 
              src={profile.avatarUrl} 
              alt={userName} 
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600 text-white text-xl">
              {firstInitial}
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-white">{userName}</h2>
        <p className="text-gray-400 mb-4">{userEmail}</p>
        
        {isEditing ? (
          <div className="w-full">
            <textarea
              className="w-full p-3 bg-gray-700 text-white rounded-md"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />
            
            <div className="flex justify-end mt-2 space-x-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 ${isSaving ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
                onClick={handleUpdateProfile}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="p-4 bg-gray-700 rounded-md">
              <p className="text-white">
                {profile.bio || 'No bio yet. Tell us about yourself!'}
              </p>
            </div>
            
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                onClick={() => setIsEditing(true)}
              >
                Edit Bio
              </button>
            </div>
          </div>
        )}
        
        {/* Wallet balance */}
        <div className="w-full mt-6 p-4 bg-blue-900 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-white">Balance</h3>
              <p className="text-2xl font-bold text-green-400">${walletBalance.toFixed(2)}</p>
            </div>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
              Add Funds
            </button>
          </div>
        </div>
        
        {/* User statistics */}
        <div className="w-full mt-4 p-4 bg-gray-700 rounded-md">
          <h3 className="text-lg font-medium text-white mb-2">Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Battles</p>
              <p className="text-xl font-bold text-white">{totalBattles}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Wins</p>
              <p className="text-xl font-bold text-white">{battleWins}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Win Rate</p>
              <p className="text-xl font-bold text-white">{winRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 