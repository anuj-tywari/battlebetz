import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentOptions {
  tournamentId: string;
  amount: number;
  discount?: number;
  metadata?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Process a payment using Stripe
 * @param options Payment options
 * @returns Result of the payment process
 */
export async function processPayment(options: PaymentOptions) {
  try {
    // Create payment intent
    const response = await fetch('/api/payments/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournamentId: options.tournamentId,
        amount: options.amount,
        discount: options.discount,
        metadata: options.metadata,
        successUrl: options.successUrl,
        cancelUrl: options.cancelUrl,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment failed');
    }
    
    const { sessionId } = await response.json();
    
    // Get Stripe instance
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }
    
    // Redirect to Stripe Checkout using sessionId
    return stripe.redirectToCheckout({
      sessionId,
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Check status of a payment
 * @param paymentIntentId The payment intent ID from Stripe
 * @returns Payment status
 */
export async function verifyPayment(paymentIntentId: string) {
  try {
    const response = await fetch(`/api/payments/stripe?payment_intent_id=${paymentIntentId}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify payment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Calculate the total amount to pay after applying discount
 * @param originalAmount Original payment amount
 * @param discountPercent Discount percentage (0-100)
 * @returns Final amount to pay
 */
export function calculatePaymentAmount(originalAmount: number, discountPercent: number = 0) {
  if (!originalAmount || originalAmount <= 0) return 0;
  
  const discountAmount = (originalAmount * discountPercent) / 100;
  return Math.max(0, originalAmount - discountAmount);
}

const paymentUtils = {
  processPayment,
  verifyPayment,
  calculatePaymentAmount,
};

export default paymentUtils; 