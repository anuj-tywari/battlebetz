"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      
      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/tournaments');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl px-8 pt-8 pb-10 border border-purple-500/20">
        {error && (
          <div className="mb-6 p-3 bg-red-500/90 text-white rounded-lg text-center text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label 
            className="block text-gray-300 text-sm font-medium mb-2" 
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label 
              className="text-gray-300 text-sm font-medium" 
              htmlFor="password"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <button
          className={`w-full ${
            isLoading ? 'bg-purple-600/50' : 'bg-purple-600 hover:bg-purple-700'
          } text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <div className="text-center mt-8 text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
} 