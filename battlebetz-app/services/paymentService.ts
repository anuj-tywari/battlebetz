import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  processTournamentPayment as processPayment, 
  completeRegistrationAfterPayment,
} from '@/utils/finixClient';

export interface BuyerInfo {
  first_name: string;
  last_name: string;
  email: string;
}

export interface PaymentResult {
  success: boolean;
  checkoutFormId?: string;
  message?: string;
}

/**
 * Handle tournament payment processing
 */
export const processTournamentPayment = async (
  tournamentName: string,
  tournamentDescription: string,
  amountInCents: number,
  buyerInfo: BuyerInfo
): Promise<PaymentResult> => {
  try {
    // Process the payment through Finix
    const paymentResult = await processPayment(
      tournamentName,
      tournamentDescription,
      amountInCents,
      buyerInfo
    );
    
    if (!paymentResult.success) {
      throw new Error('Failed to initiate payment process');
    }
    
    // Store the checkout form ID for later verification
    if (paymentResult.checkoutFormId) {
      await AsyncStorage.setItem('currentCheckoutFormId', paymentResult.checkoutFormId);
    }
    
    return paymentResult;
  } catch (error) {
    console.error('Error processing tournament payment:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown payment error' 
    };
  }
};

/**
 * Verify payment status with retry mechanism
 */
export const verifyPayment = async (
  formId: string, 
  maxAttempts: number = 20,
  onSuccess: () => Promise<void>
): Promise<PaymentResult> => {
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt < maxAttempts) {
    attempt++;
    try {
      // Call the API to verify payment
      const result = await completeRegistrationAfterPayment(formId);
      
      if (result.success) {
        // Payment verified successfully
        await onSuccess();
        return { success: true };
      } else {
        // Payment not yet confirmed, retry with backoff
        const backoffTime = Math.min(2000 * Math.pow(1.5, attempt - 1), 10000);
        console.log(`Verification attempt ${attempt} failed. Retrying in ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    } catch (error) {
      console.error(`Error in verification attempt ${attempt}:`, error);
      lastError = error instanceof Error ? error : new Error('Payment verification failed');
      
      // Calculate backoff time and wait before retrying
      const backoffTime = Math.min(2000 * Math.pow(1.5, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  // If we've exhausted all attempts, return failure
  return { 
    success: false, 
    message: lastError ? lastError.message : 'Payment verification failed after maximum attempts'
  };
};

/**
 * Set up deep link handling for payment callbacks
 */
export const setupPaymentDeepLinkHandling = (
  checkoutFormId: string | null,
  handleVerification: (formId: string) => Promise<void>,
  isPaymentInitiated: boolean,
  Linking: any
): (() => void) => {
  // Only set up deep link handling if payment initiated
  if (!isPaymentInitiated) {
    return () => {}; // Return empty cleanup function
  }
  
  // Function to handle URL when app opens from a link
  const handleDeepLink = async (event: any) => {
    // Extract URL from event
    let url = null;
    if (typeof event === 'object') {
      url = event.url || null;
    } else if (typeof event === 'string') {
      url = event;
    }
    
    if (!url) {
      console.error('No valid URL found in deep link event');
      return;
    }
    
    // Try to extract checkout form ID from URL
    let urlCheckoutFormId = null;
    try {
      const urlObj = new URL(url);
      urlCheckoutFormId = urlObj.searchParams.get('checkout_form_id');
    } catch (e) {
      // URL parsing failed, try basic string parsing
      const idMatch = url.match(/[?&]checkout_form_id=([^&]+)/);
      if (idMatch && idMatch[1]) {
        urlCheckoutFormId = idMatch[1];
      }
    }
    
    // Use the ID from URL or fall back to stored ID
    const formIdToVerify = urlCheckoutFormId || checkoutFormId;
    
    if (formIdToVerify) {
      await handleVerification(formIdToVerify);
    } else {
      // If we still don't have an ID, check AsyncStorage as last resort
      console.log('No checkout form ID in URL or state, checking AsyncStorage');
      const storedId = await AsyncStorage.getItem('currentCheckoutFormId');
      if (storedId) {
        await handleVerification(storedId);
      } else {
        console.error('Cannot verify payment: No checkout form ID available');
      }
    }
  };

  // Add the event listener
  const subscription = Linking.addEventListener('url', handleDeepLink);

  // Check if the app was opened from a URL
  Linking.getInitialURL().then((url: string | null) => {
    if (url) {
      handleDeepLink(url);
    }
  });

  // Return cleanup function
  return () => {
    subscription.remove();
  };
};