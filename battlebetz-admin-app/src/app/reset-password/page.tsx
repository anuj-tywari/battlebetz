'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we have the necessary params from Supabase auth
    if (!searchParams.has('access_token')) {
      setError('Invalid or expired reset link. Please request a new password reset link.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsResetting(true);

    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsResetting(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsResetting(false);
      return;
    }

    try {
      const accessToken = searchParams.get('access_token');
      
      // Use the session from the access token to update the password
      const { data: { session } } = await supabase.auth.getSession();
      
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        setIsResetting(false);
        return;
      }

      // Success
      setIsSuccess(true);
      toast.success('Password has been reset successfully');
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsResetting(false);
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
          {!isSuccess ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Reset Your Password</CardTitle>
                <CardDescription className="text-center">
                  Create a new password for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="px-4 py-3 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full"
                      disabled={isResetting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full"
                      disabled={isResetting}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isResetting || !searchParams.has('access_token')}
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Password Reset Complete</CardTitle>
                <CardDescription className="text-center">
                  Your password has been updated successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4 flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <p className="mb-4">
                  You will be redirected to the login page in a few seconds...
                </p>
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