"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Here we would implement actual password reset logic with Supabase
      // For now, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset password email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl px-8 pt-8 pb-10 border border-purple-500/20">
          <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Email Sent</h3>
          <p className="text-gray-300 mb-6 text-center">
            If an account exists with that email, we've sent instructions to reset your password.
          </p>
          <Link 
            href="/auth/login"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex justify-center"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl px-8 pt-8 pb-10 border border-purple-500/20">
        <h2 className="text-2xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
          Reset Password
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter your email to receive reset instructions
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/90 text-white rounded-lg text-center text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-purple-600/50' : 'bg-purple-600 hover:bg-purple-700'
            } text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Send Reset Instructions'
            )}
          </button>

          <div className="text-center text-gray-400 text-sm">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 