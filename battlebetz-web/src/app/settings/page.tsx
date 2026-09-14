"use client";

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Shield, User, Globe, Moon, Volume2, Mail, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

// Metadata cannot be used in client components
// export const metadata: Metadata = {
//   title: 'Account Settings | BattleBetz',
//   description: 'Manage your BattleBetz account settings and preferences',
// };

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading and error states
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(null);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?callbackUrl=/settings');
    }
    
    // Initialize form values with user data when available
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [loading, isAuthenticated, router, user]);

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      // Call our API to mark the account as inactive
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }
      
      // Sign out the user and redirect to home page
      router.push('/login?message=account-deactivated');
    } catch (error) {
      console.error('Error deleting account:', error);
      // Show error to the user
      alert(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateLoading(true);
    setProfileUpdateError(null);
    setProfileUpdateSuccess(false);
    
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          phone,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      setProfileUpdateSuccess(true);
      
      // Update local auth state if needed
      if (window.location) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileUpdateError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setProfileUpdateLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordUpdateError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordUpdateError('New password must be at least 8 characters long');
      return;
    }
    
    setPasswordUpdateLoading(true);
    setPasswordUpdateError(null);
    setPasswordUpdateSuccess(false);
    
    try {
      const response = await fetch('/api/user/update-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }
      
      // Clear form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setPasswordUpdateSuccess(true);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordUpdateError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setPasswordUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href={user?.username ? `/profile/${user.username}` : "/"}
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Profile
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              <a href="#account" className="flex items-center px-3 py-2 text-white bg-gray-800 rounded-md">
                <User className="mr-3 h-5 w-5 text-purple-400" />
                <span>Account</span>
              </a>
              <a href="#notifications" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">
                <Bell className="mr-3 h-5 w-5 text-purple-400" />
                <span>Notifications</span>
              </a>
              <a href="#security" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">
                <Shield className="mr-3 h-5 w-5 text-purple-400" />
                <span>Security</span>
              </a>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Account Settings */}
            <section id="account" className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <User className="mr-2 h-5 w-5 text-purple-400" />
                Account Information
              </h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {profileUpdateError && (
                  <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-md text-white">
                    {profileUpdateError}
                  </div>
                )}
                
                {profileUpdateSuccess && (
                  <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-md text-white">
                    Profile updated successfully!
                  </div>
                )}
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Username"
                    disabled={profileUpdateLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Email"
                    disabled={profileUpdateLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Phone Number (optional)"
                    disabled={profileUpdateLoading}
                  />
                </div>
                
                <div>
                  <button 
                    type="submit"
                    disabled={profileUpdateLoading}
                    className={`px-4 py-2 ${
                      profileUpdateLoading ? 'bg-purple-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                    } text-white rounded-md transition-colors`}
                  >
                    {profileUpdateLoading ? 'Updating...' : 'Update Information'}
                  </button>
                </div>
              </form>
            </section>
            
            {/* Notification Settings */}
            <section id="notifications" className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-purple-400" />
                Notification Preferences
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-opacity-50 bg-gray-700 border-gray-600" />
                  <span className="ml-2 text-white">Battle Requests</span>
                  <span className="ml-2 text-xs text-gray-400">Get notified when someone challenges you to a battle</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-opacity-50 bg-gray-700 border-gray-600" />
                  <span className="ml-2 text-white">Battle Results</span>
                  <span className="ml-2 text-xs text-gray-400">Get notified when your battles are completed</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-opacity-50 bg-gray-700 border-gray-600" />
                  <span className="ml-2 text-white">Tournament Updates</span>
                  <span className="ml-2 text-xs text-gray-400">Get notified about changes in tournaments you're participating in</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-opacity-50 bg-gray-700 border-gray-600" />
                  <span className="ml-2 text-white">Marketing Emails</span>
                  <span className="ml-2 text-xs text-gray-400">Receive promotional offers and updates</span>
                </label>
                
                <div className="mt-4">
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            </section>
            
            {/* Security Settings */}
            <section id="security" className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-purple-400" />
                Security Settings
              </h2>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                {passwordUpdateError && (
                  <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-md text-white">
                    {passwordUpdateError}
                  </div>
                )}
                
                {passwordUpdateSuccess && (
                  <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-md text-white">
                    Password updated successfully!
                  </div>
                )}
                
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                    disabled={passwordUpdateLoading}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                    disabled={passwordUpdateLoading}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                    disabled={passwordUpdateLoading}
                    required
                  />
                </div>
                
                <div>
                  <button 
                    type="submit"
                    disabled={passwordUpdateLoading}
                    className={`px-4 py-2 ${
                      passwordUpdateLoading ? 'bg-purple-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                    } text-white rounded-md transition-colors`}
                  >
                    {passwordUpdateLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </section>
            
            {/* Danger Zone */}
            <section className="bg-red-900/20 border border-red-500/30 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-400" />
                Danger Zone
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-300">
                  Deleting your account will mark it as inactive and hide all your data from other users. Your data will be permanently deleted after 90 days unless you recover your account by logging in.
                </p>
                
                {!showDeleteConfirmation ? (
                  <button 
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-4 mt-4">
                    <div className="flex items-center mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                      <h3 className="text-lg font-semibold text-white">Are you sure?</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      This action will mark your account as inactive and schedule it for deletion in 90 days. All your data will be hidden from other users immediately. You can recover your account by logging in before the 90-day period ends.
                    </p>
                    <div className="flex space-x-3">
                      <button 
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                      >
                        Yes, Delete My Account
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirmation(false)} 
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                      >
                        No, Keep My Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 