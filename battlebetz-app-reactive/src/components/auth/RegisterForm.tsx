"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await signUp({ email, password, name });
      
      // Show success message or redirect
      setSuccessMessage('Registration successful! Please check your email to confirm your account.');
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else {
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl border border-purple-500/20 px-8 pt-8 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
          Create Your Account
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Join BattleBetz and start your prediction journey
        </p>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/90 text-white rounded-lg border border-red-600 text-sm">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-3 bg-green-500/90 text-white rounded-lg border border-green-600 text-sm">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              className="block text-gray-300 text-sm font-medium mb-2" 
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              className="shadow appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              className="block text-gray-300 text-sm font-medium mb-2" 
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              className="block text-gray-300 text-sm font-medium mb-2" 
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-2 px-3 text-gray-100 mb-1 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div className="mb-6">
            <label 
              className="block text-gray-300 text-sm font-medium mb-2" 
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <button
              className={`w-full flex justify-center items-center rounded-lg py-2.5 font-medium transition-colors ${
                isLoading 
                  ? 'bg-gray-600 text-gray-200 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4 text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-purple-400 hover:text-purple-300 transition">
            Sign In
          </Link>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 text-center">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition">Terms of Service</Link>{' '}and{' '}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
} 