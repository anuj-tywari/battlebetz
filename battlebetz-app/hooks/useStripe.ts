import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function useStripe() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (amount: number, currency: string = 'usd') => {
    try {
      setIsLoading(true);
      setError(null);

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
      
      if (confirmError) {
        throw new Error(confirmError.message);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processPayment,
    isLoading,
    error,
  };
}