"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Alert } from '@/components/ui/alert';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  // Extract errors from URL if they exist
  useEffect(() => {
    const errorType = searchParams.get('error');
    const errorMessage = searchParams.get('message');
    
    if (errorType === 'CredentialsSignin') {
      setError('Invalid login credentials. Please try again.');
    } else if (errorType) {
      setError(errorMessage || 'An error occurred during sign in.');
    } else if (errorMessage === 'account-deactivated') {
      setError('Your account has been deactivated. All your data will be permanently deleted after 90 days. If this was a mistake, you may contact support to restore your account.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Attempting to sign in with email: ${email}`);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      console.log('Sign in result:', result);
      
      if (result?.error) {
        // Handle specific error cases
        if (result.error.includes('deactivated') || result.error.includes('banned')) {
          throw new Error('Your account has been deactivated or banned. Please contact support.');
        } else if (result.error.includes('status') || result.error.includes('inactive')) {
          throw new Error('Your account is inactive. Please contact support to reactivate your account.');
        } else if (result.error === 'CredentialsSignin') {
          throw new Error('Invalid email or password. Please try again.');
        } else {
          throw new Error(typeof result.error === 'string' ? result.error : 'Authentication failed');
        }
      }

      // Redirect to callbackUrl on success
      console.log(`Login successful, redirecting to: ${callbackUrl}`);
      router.push(callbackUrl);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800/40 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <Link href="/">
            <Image 
              src="/assets/images/logo.png" 
              alt="BattleBetz" 
              width={200} 
              height={40}
              priority
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link href="/signup" className="font-medium text-purple-500 hover:text-purple-400 transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 border border-red-500/50 bg-red-500/10">
            {error}
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-purple-500 hover:text-purple-400 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-150 ${
                isLoading
                  ? 'bg-purple-700 opacity-70 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
} 