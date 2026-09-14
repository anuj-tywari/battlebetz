"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, AlertTriangle, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { Tournament } from '@/types/tournament';
import { supabase } from '@/lib/supabase';

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  const tournamentId = searchParams.get('tournament');
  const reason = searchParams.get('reason') || 'unknown';

  useEffect(() => {
    const fetchTournament = async () => {
      if (!tournamentId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single();

        if (!error && data) {
          setTournament(data);
        }
      } catch (error) {
        console.error('Error fetching tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  const getReasonMessage = (reason: string) => {
    switch (reason) {
      case 'payment_declined':
        return 'Your payment was declined by your bank or card issuer.';
      case 'insufficient_funds':
        return 'Insufficient funds in your account.';
      case 'invalid_card':
        return 'The payment method provided is invalid.';
      case 'network_error':
        return 'A network error occurred during payment processing.';
      case 'expired_card':
        return 'Your payment method has expired.';
      default:
        return 'An unexpected error occurred during payment processing.';
    }
  };

  const getSuggestion = (reason: string) => {
    switch (reason) {
      case 'payment_declined':
        return 'Please contact your bank or try a different payment method.';
      case 'insufficient_funds':
        return 'Please add funds to your account or use a different payment method.';
      case 'invalid_card':
        return 'Please check your card details and try again.';
      case 'network_error':
        return 'Please check your internet connection and try again.';
      case 'expired_card':
        return 'Please update your payment method with current card details.';
      default:
        return 'Please try again or contact support if the problem persists.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent border-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="bg-red-900/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <XCircle size={60} className="text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-red-400">Payment Failed</h1>
          <p className="text-xl text-gray-300 mb-6">
            We couldn't process your payment for the tournament
          </p>
        </div>

        {tournament && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-center">Tournament Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Tournament:</span>
                <span className="font-medium">{tournament.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Fee:</span>
                <span className="font-medium">${tournament.entry_fee || 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Prize Pool:</span>
                <span className="font-medium text-yellow-400">${tournament.prize_pool || 1000}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6 mb-8">
          <div className="flex items-start mb-4">
            <AlertTriangle size={20} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-400 font-semibold mb-2">What happened?</h3>
              <p className="text-gray-300 mb-3">{getReasonMessage(reason)}</p>
              <p className="text-gray-400 text-sm">{getSuggestion(reason)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4 text-center">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
              <div className="bg-blue-600/20 rounded-full p-2 mr-3">
                <span className="text-blue-400 text-sm font-bold">1</span>
              </div>
              <p className="text-gray-300 text-sm">
                Check your payment method and account details
              </p>
            </div>
            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
              <div className="bg-blue-600/20 rounded-full p-2 mr-3">
                <span className="text-blue-400 text-sm font-bold">2</span>
              </div>
              <p className="text-gray-300 text-sm">
                Try again with the same or different payment method
              </p>
            </div>
            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
              <div className="bg-blue-600/20 rounded-full p-2 mr-3">
                <span className="text-blue-400 text-sm font-bold">3</span>
              </div>
              <p className="text-gray-300 text-sm">
                Contact support if you continue to experience issues
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {tournament && (
            <Link
              href={`/tournaments/${tournament.id}`}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Link>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/tournaments"
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Browse Tournaments
            </Link>

            <Link
              href="/dashboard"
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Home size={16} className="mr-2" />
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            Need help? Contact our support team
          </p>
          <Link
            href="/support"
            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            support@battlebetz.com
          </Link>
        </div>
      </div>
    </div>
  );
} 