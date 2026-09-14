'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot-password' | 'reset-success'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for signout parameter
  useEffect(() => {
    if (searchParams.get('signout') === 'true') {
      setSuccess('You have been successfully signed out.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Successfully logged in, redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSendingReset(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        setIsSendingReset(false);
        return;
      }

      setView('reset-success');
      toast.success('Password reset link sent successfully');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image 
            src="/assets/images/logo.png" 
            alt="BattleBetz Logo" 
            width={180} 
            height={180} 
            className="rounded-full"
          />
        </div>
        
        <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
          {view === 'login' && (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="px-4 py-3 mb-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md text-sm flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full"
                      disabled={isLoading}
                    />
                    <div className="text-right">
                      <button 
                        type="button" 
                        onClick={() => setView('forgot-password')}
                        className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {view === 'forgot-password' && (
            <>
              <CardHeader className="space-y-1">
                <div className="flex items-center mb-2">
                  <button 
                    type="button" 
                    onClick={() => setView('login')}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <CardTitle className="text-2xl">Reset Password</CardTitle>
                </div>
                <CardDescription>
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full"
                      disabled={isSendingReset}
                    />
                  </div>
                  
                  {error && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSendingReset}
                  >
                    {isSendingReset ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {view === 'reset-success' && (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
                <CardDescription className="text-center">
                  We've sent a password reset link to your email
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4 flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <p className="mb-4">
                  Please check your email and click the link to reset your password.
                </p>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setView('login')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-center border-t border-gray-200 dark:border-gray-800 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Admin access only. Unauthorized access is prohibited.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 