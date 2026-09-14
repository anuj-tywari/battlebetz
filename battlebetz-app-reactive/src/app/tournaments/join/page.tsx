// battlebetz-web/src/app/tournaments/join/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trophy, 
  Calendar, 
  Users, 
  ChevronLeft,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Clock,
  User,
  Mail,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTournaments } from '@/hooks/useTournaments';

export default function JoinTournamentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournamentId = searchParams?.get('id');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { fetchTournamentById, joinTournament } = useTournaments();
  
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      // You can add more user fields here if available
    }
  }, [user]);
  
  // Load tournament data
  useEffect(() => {
    const loadTournament = async () => {
      if (!tournamentId) {
        setError('No tournament selected');
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await fetchTournamentById(tournamentId);
        if (error || !data) {
          setError(error ? String(error) : 'Tournament not found');
          setLoading(false);
          return;
        }
        setTournament(data);
      } catch (err) {
        console.error('Error loading tournament:', err);
        setError('Failed to load tournament data');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && !authLoading) {
      loadTournament();
    }
  }, [tournamentId, fetchTournamentById, isAuthenticated, authLoading]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?callbackUrl=/tournaments/join?id=${tournamentId}`);
    }
  }, [authLoading, isAuthenticated, router, tournamentId]);
  
  // Handle promo code application
  const handleApplyPromo = () => {
    if (!promoCode) return;
    
    // Simulate promo validation - in real app would check with API
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(10);
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === 'NEWUSER20') {
      setDiscount(20);
      setPromoApplied(true);
    } else {
      setError('Invalid promo code');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Handle form submission
  const handleSubmitRegistration = async () => {
    // Validate form fields
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!tournament || !user) {
      setError('Missing tournament or user data');
      return;
    }
    
    // For free tournaments, join directly
    if (entryFee <= 0) {
      setProcessingPayment(true);
      try {
        const result = await joinTournament(tournament.id, user?.id);
        if (result.success) {
          setPaymentSuccess(true);
        } else {
          setError(result.error?.message || 'Failed to join tournament');
        }
      } catch (err) {
        setError('Failed to join tournament');
      } finally {
        setProcessingPayment(false);
      }
      return;
    }
    
    // For paid tournaments, show payment modal
    setShowPaymentModal(true);
  };
  
  // Handle dummy payment
  const handlePayment = async (success: boolean) => {
    setProcessingPayment(true);
    setShowPaymentModal(false);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (success) {
      try {
        const result = await joinTournament(tournament.id, user?.id);
        if (result.success) {
          setPaymentSuccess(true);
        } else {
          setError(result.error?.message || 'Failed to join tournament after payment');
        }
      } catch (err) {
        setError('Failed to complete registration after payment');
      }
    } else {
      setError('Payment failed. Please try again.');
    }
    
    setProcessingPayment(false);
  };
  
  // Calculate amounts
  const entryFee = tournament?.entry_fee || 0;
  const discountAmount = (entryFee * discount) / 100;
  const totalAmount = entryFee - discountAmount;
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error && !tournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <Link 
              href="/tournaments"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center font-medium transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Success screen
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
            <div className="mb-6">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to {tournament?.name || 'Test Tournament - Anuj User Story'}!</h1>
            <p className="text-gray-300 mb-6">
              Your tournament balance has been credited with BBZ.T 1,000. Good luck in the tournament!
            </p>
            
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 mb-1">Tournament Balance</div>
              <div className="text-2xl font-bold text-purple-400">BBZ.T 1,000</div>
            </div>
            
            <Link 
              href={`/tournaments/${tournament?.id}`}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg inline-flex items-center justify-center font-medium transition-colors"
            >
              Continue to Tournament
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/tournaments/${tournamentId}`}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Tournament
          </Link>
          <h1 className="text-3xl font-bold">Join Tournament</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tournament Card */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
              {/* Tournament Image */}
              <div className="relative h-48 bg-gradient-to-r from-purple-900 to-blue-900">
                <Image
                  src="/api/placeholder/400/200"
                  alt={tournament?.name || "Tournament"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {tournament?.status || 'UPCOMING'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-gray-900/80 text-white px-3 py-1 rounded-lg text-sm">
                    Today
                  </span>
                </div>
              </div>
              
              {/* Tournament Details */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{tournament?.name || 'Test Tournament - Anuj User Story'}</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                      <span>${tournament?.entry_fee || 15}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                      <span>${tournament?.prize_pool || 100}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                      <span>{tournament?.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'May 17, 2025'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Registration Form */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-6">Payment Details</h3>
              <p className="text-gray-400 mb-6">Add your details to complete registration</p>
              
              {/* Promo Code Section */}
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    placeholder="Enter promo code"
                    className="flex-grow px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode || promoApplied}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div className="mt-2 text-green-400 text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {discount}% discount applied!
                  </div>
                )}
              </div>
              
              {/* User Details Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Zachary"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Linares"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Zacharylinares@gmail.com"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
              
              {/* Total Amount */}
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-green-400">USD ${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mb-6 p-3 bg-red-900/30 border border-red-600 rounded-lg text-red-400">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {/* Submit button */}
              <button
                onClick={handleSubmitRegistration}
                disabled={processingPayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {processingPayment ? (
                  <>
                    <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Complete Registration
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                Payments are securely processed by Finix
              </p>
            </div>
          </div>
        </div>
        
        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Payment Simulation</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-gray-300 mb-6">
                This is a demo payment system. Choose the outcome:
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handlePayment(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Simulate Successful Payment
                </button>
                
                <button
                  onClick={() => handlePayment(false)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Simulate Failed Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}