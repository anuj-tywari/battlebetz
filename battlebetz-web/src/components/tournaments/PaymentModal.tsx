"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { X, CreditCard, CheckCircle, XCircle, Trophy, AlertTriangle } from 'lucide-react';
import { Tournament } from '@/types/tournament';
import { supabase } from '@/lib/supabase';

interface PaymentModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ tournament, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handlePaymentSimulation = async (success: boolean) => {
    if (!session?.user?.id) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      if (success) {
        // Simulate successful payment
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

        console.log('Creating transaction record...');
        
        // 1. Create successful transaction record - working with existing schema
        const { data: transaction, error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: session.user.id,
            amount: tournament.entry_fee || 10,
            type: 'deposit', // Using 'deposit' as it represents money coming into the system
            status: 'completed',
            reference_id: null, // Setting to null since it's UUID type and we don't have a specific reference UUID
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (transactionError) {
          console.error('Transaction error:', transactionError);
          throw new Error(`Failed to create transaction record: ${transactionError.message}`);
        }

        console.log('Transaction created:', transaction);

        // 2. Check if user is already in the tournament
        const { data: existingParticipant, error: checkError } = await supabase
          .from('tournament_round_participants')
          .select('id')
          .eq('tournament_id', tournament.id)
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing participant:', checkError);
          throw new Error('Failed to check tournament participation');
        }

        if (existingParticipant) {
          console.log('User already in tournament');
          // User already in tournament, just update transaction and continue
        } else {
          // 3. Join the tournament
          console.log('Adding user to tournament...');
          const { error: joinError } = await supabase
            .from('tournament_round_participants')
            .insert({
              tournament_id: tournament.id,
              user_id: session.user.id,
              token_balance: 1000, // Award 1000 BBZT tokens
              status: 'active',
              joined_at: new Date().toISOString()
            });

          if (joinError) {
            console.error('Join error:', joinError);
            // If joining fails, update transaction to failed
            await supabase
              .from('transactions')
              .update({ 
                status: 'failed',
                updated_at: new Date().toISOString()
              })
              .eq('id', transaction.id);
            
            throw new Error(`Failed to join tournament: ${joinError.message}`);
          }

          console.log('User added to tournament successfully');
        }

        // Tournament tokens are already awarded in the tournament_round_participants table
        // No need to update global BBZT balance as tokens are tournament-specific

        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess();
          onClose();
          // Redirect to tournament details with success message
          router.push(`/tournaments/${tournament.id}?joined=true`);
        }, 3000);

      } else {
        // Simulate failed payment
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Creating failed transaction record...');
        
        // Create failed transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: session.user.id,
            amount: tournament.entry_fee || 10,
            type: 'deposit', // Using 'deposit' type even for failed payments
            status: 'failed',
            reference_id: null, // Setting to null since it's UUID type
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (transactionError) {
          console.error('Failed transaction record error:', transactionError);
          // Don't fail for failed transaction record creation
        }

        setPaymentStatus('failed');
        setTimeout(() => {
          // Redirect to payment failure page
          router.push(`/payment/failed?tournament=${tournament.id}&reason=payment_declined`);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setPaymentStatus('pending');
    setErrorMessage('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <div className="text-center">
            <div className="bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={50} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-400">Payment Successful!</h2>
            <p className="mb-4 text-gray-300">
              Welcome to {tournament.name}! You have successfully joined the tournament.
            </p>
            
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 mb-1">Tournament Tokens Awarded</div>
              <div className="text-2xl font-bold text-purple-400">1,000 BBZT</div>
              <div className="text-xs text-gray-500 mt-1">Use these tokens to place bets in the tournament</div>
            </div>

            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 mb-4">
              <div className="flex items-start">
                <Trophy size={16} className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-blue-400 text-sm font-medium">Tournament Details</p>
                  <p className="text-gray-300 text-xs">
                    You can now place bets using your BBZT tokens. Good luck!
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Redirecting to tournament details...
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <div className="bg-red-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <XCircle size={50} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-400">Payment Failed</h2>
            <p className="mb-4 text-gray-300">
              Unfortunately, your payment could not be processed. You have not been charged.
            </p>
            
            {errorMessage && (
              <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertTriangle size={16} className="text-red-400 mr-2 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-400">
              Redirecting to error page...
            </div>
          </div>
        );

      default:
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Join Tournament</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">{tournament.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Fee:</span>
                  <span className="font-medium">${tournament.entry_fee || 10}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prize Pool:</span>
                  <span className="font-medium text-yellow-400">${tournament.prize_pool || 1000}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tokens Received:</span>
                  <span className="font-medium text-purple-400">1,000 BBZT</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-400">${tournament.entry_fee || 10}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <CreditCard size={16} className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-400 text-sm font-medium">Payment Simulation</p>
                  <p className="text-gray-300 text-xs">
                    This is a demo environment. Choose your preferred payment outcome:
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handlePaymentSimulation(true)}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Simulate Successful Payment
                  </>
                )}
              </button>

              <button
                onClick={() => handlePaymentSimulation(false)}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <XCircle size={16} className="mr-2" />
                Simulate Failed Payment
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative border border-gray-700">
        {renderContent()}
      </div>
    </div>
  );
} 