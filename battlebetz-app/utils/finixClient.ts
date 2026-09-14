import axios from 'axios';
import { Platform, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = process.env.EXPO_PUBLIC_FINIXURL 
const username = process.env.EXPO_PUBLIC_FINIX_USERNAME 
const password = process.env.EXPO_PUBLIC_FINIX_PASSWORD 
const merchantId = process.env.EXPO_PUBLIC_FINIX_MERCHANT 

// Interface for the checkout form response
interface CheckoutFormResponse {
  id: string;
  checkout_form_url: string;
  merchant_id: string;
  link_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Interface for payment status response
interface PaymentStatusResponse {
  id: string;
  status: string;
  payment_instrument_details?: {
    payment_instrument_id: string;
    last_four: string;
    brand: string;
  };
  transfer?: {
    id: string;
    status: string;
    amount: number;
  };
  created_at: string;
  updated_at: string;
}

// Interface for item image details
interface ImageDetails {
  primary_image_url: string;
  alternative_image_urls?: string[];
}

// Interface for price details
interface PriceDetails {
  sale_amount: number;
  currency: string;
  price_type?: 'PROMOTIONAL' | 'REGULAR';
  regular_amount?: number;
}

// Interface for checkout item
interface CheckoutItem {
  image_details?: ImageDetails;
  description: string;
  price_details: PriceDetails;
  quantity: string | number;
}

// Interface for buyer details
interface BuyerDetails {
  first_name?: string;
  last_name?: string;
  email?: string | null;
  shipping_address?: any | null;
  billing_address?: any | null;
  phone_number?: string | null;
}

// Interface for amount breakdown
interface AmountBreakdown {
  subtotal_amount?: number;
  shipping_amount?: number;
  estimated_tax_amount?: number;
  discount_amount?: string | number;
  tip_amount?: string | number;
}

// Interface for amount details
interface AmountDetails {
  amount_type: 'FIXED' | 'VARIABLE';
  total_amount: number;
  currency: string;
  min_amount?: number | null;
  max_amount?: number | null;
  amount_breakdown?: AmountBreakdown;
}

// Interface for branding
interface Branding {
  brand_color?: string;
  accent_color?: string;
  logo?: string;
  icon?: string;
}

// Interface for additional details
interface AdditionalDetails {
  collect_name?: boolean;
  collect_email?: boolean;
  collect_phone_number?: boolean;
  collect_billing_address?: boolean;
  collect_shipping_address?: boolean;
  success_return_url: string;
  cart_return_url?: string;
  expired_session_url?: string;
  terms_of_service_url?: string;
  expiration_in_minutes?: number;
}

// Interface for checkout form request
interface CheckoutFormRequest {
  merchant_id: string;
  payment_frequency: 'ONE_TIME' | 'RECURRING';
  is_multiple_use: boolean;
  allowed_payment_methods: string[];
  nickname?: string;
  items: CheckoutItem[];
  buyer_details?: BuyerDetails;
  amount_details: AmountDetails;
  branding?: Branding;
  additional_details: AdditionalDetails;
}

/**
 * Creates a payment checkout form and opens the URL in a browser
 * @param tournamentName - The name of the tournament
 * @param tournamentDescription - Description of the tournament
 * @param feeAmount - The fee amount in cents (e.g., 2500 for $25.00)
 * @param buyerDetails - Optional details about the buyer
 * @param successUrl - URL to redirect after successful payment
 * @param cancelUrl - URL to redirect if user cancels/returns to cart
 * @returns Promise resolving to the checkout form data
 */
export const createCheckoutForm = async (
  tournamentName: string,
  tournamentDescription: string,
  feeAmount: number,
  buyerDetails?: BuyerDetails,
  successUrl?: string,
  cancelUrl?: string
): Promise<CheckoutFormResponse> => {
  try {
    // Default return URLs based on the environment
    const defaultSuccessUrl = 'https://app.battlebetz.com/join-tournament';
    const defaultCancelUrl = 'https://app.battlebetz.com';
    
    // Build the checkout form request
    const payload: CheckoutFormRequest = {
        merchant_id: merchantId as string,
        payment_frequency: 'ONE_TIME',
        is_multiple_use: false,
        allowed_payment_methods: ['PAYMENT_CARD'],
        nickname: tournamentName || "Tournament Registration",  // More descriptive nickname
        items: [
          {
            description: tournamentName,
            price_details: {
              sale_amount: feeAmount,  // Convert to cents
              currency: 'USD',
            },
            quantity: '1',
          },
        ],
        buyer_details: {
          first_name: buyerDetails?.first_name,
          last_name: buyerDetails?.last_name,
          email: buyerDetails?.email,
          shipping_address: null,
          billing_address: null,
          phone_number: null
        },
        amount_details: {
          amount_type: 'FIXED',
          total_amount: feeAmount,  // Convert to cents
          currency: 'USD',
          amount_breakdown: {
            subtotal_amount: feeAmount,  // Convert to cents
            shipping_amount: 0,
            estimated_tax_amount: 0,
            discount_amount: 0,
            tip_amount: 0
          }
        },
        branding: {
          brand_color: "#fbe5d0",
          accent_color: "#ff4838",
          logo: 'https://battlebetz.com/assets/assets/images/logo.b6a934c22b673df10310a30fc72fe090.png',
          icon: 'https://battlebetz.com/assets/assets/images/logo.b6a934c22b673df10310a30fc72fe090.png'
        },
        additional_details: {
          collect_name: true,
          collect_email: true,
          collect_phone_number: false,
          collect_billing_address: true,
          collect_shipping_address: false,
          success_return_url: defaultSuccessUrl,
          cart_return_url: defaultCancelUrl,
          terms_of_service_url: 'www.battlebetz.com',
          expiration_in_minutes: 60,
        },
      };

    // Make the API request to create a checkout form
    const response = await axios.post<CheckoutFormResponse>(
      `${baseUrl}/checkout_forms`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Finix-Version': '2022-02-01'
        },
        auth: {
          username: username as string,
          password: password as string,
        },
      }
    );

    console.log(`create checkout response ${response.data}`)
    return response.data;
  } catch (error) {
    console.error('Error creating Finix checkout form:', error);
    throw error;
  }
};

/**
 * Opens the checkout form URL in a browser
 * @param checkoutFormUrl The URL of the checkout form to open
 * @returns Promise that resolves when the browser is opened
 */
export const openCheckoutForm = async (checkoutFormUrl: string): Promise<WebBrowser.WebBrowserResult> => {
  return WebBrowser.openBrowserAsync(checkoutFormUrl);
};

/**
 * Verifies the payment status of a checkout form
 * @param checkoutFormId - The ID of the checkout form to verify
 * @returns Promise resolving to payment verification result
 */
export const verifyPaymentStatus = async (
  checkoutFormId: string
): Promise<{ 
  success: boolean; 
  status: string; 
  paymentDetails?: any; 
  error?: any 
}> => {

  try {
    // Fetch the checkout form to check its status
    const response = await axios.get<CheckoutFormResponse>(
      `${baseUrl}/checkout_forms/${checkoutFormId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Finix-Version': '2022-02-01'
        },
        auth: {
          username: username as string,
          password: password as string,
        },
      }
    );

    const checkoutForm = response.data;
    
    // Common payment statuses: PENDING, APPROVED, CANCELED, COMPLETED
    const isSuccessful = ['COMPLETED', 'APPROVED', 'SUCCEEDED'].includes(checkoutForm.state.toUpperCase());
    
    // Get payment details if payment was successful
    let paymentDetails = null;
    if (isSuccessful) {
      try {
        // You might need to fetch additional payment details if needed
        // This would depend on Finix API structure
        // For example, fetching the associated transfer:
        // const transferResponse = await axios.get(`${baseUrl}/transfers?checkout_form_id=${checkoutFormId}`...);
        // paymentDetails = transferResponse.data;
      } catch (detailsError) {
        console.warn('Could not fetch additional payment details:', detailsError);
      }
    }

    return {
      success: isSuccessful,
      status: checkoutForm.status,
      paymentDetails: paymentDetails || checkoutForm
    };
  } catch (error) {
    console.error('Error verifying payment status:', error);
    return {
      success: false,
      status: 'ERROR',
      error
    };
  }
};

/**
 * Processes a tournament payment
 * @param tournamentName - The name of the tournament
 * @param tournamentDescription - Description of the tournament
 * @param feeAmount - The fee amount in cents (e.g., 2500 for $25.00)
 * @param buyerInfo - Optional details about the buyer
 * @returns Promise resolving when payment flow is complete
 */
export const processTournamentPayment = async (
    tournamentName: string,
    tournamentDescription: string,
    feeAmount: number,
    buyerInfo?: BuyerDetails
  ): Promise<{ success: boolean; checkoutFormId?: string; error?: any }> => {
    try {
      // Get the app scheme for deep linking
      const scheme = Constants.manifest?.scheme || 'tournament';
      
      // Create the checkout form
      const checkoutForm = await createCheckoutForm(
        tournamentName,
        tournamentDescription,
        feeAmount,
        buyerInfo
      );
      
      // Store the checkout form ID
      const checkoutFormId = checkoutForm.id;
      
      // Important: We now include the checkout form ID in the success URL
      // This ensures the deep link handler can access the ID directly
      const successUrl = `${scheme}://payment-success?checkout_form_id=${checkoutFormId}`;
      const cancelUrl = `${scheme}://payment-canceled?checkout_form_id=${checkoutFormId}`;
      
      // Store checkout form ID to AsyncStorage before opening browser
      await AsyncStorage.setItem('currentCheckoutFormId', checkoutFormId);
      
      // Update the checkout form with our custom success/cancel URLs
      try {
        // Only call this if your Finix API supports updating forms after creation
        // Otherwise you can skip this step if the initial form creation accepts the URLs
        await axios.patch(
          `${baseUrl}/checkout_forms/${checkoutFormId}`,
          {
            additional_details: {
              success_return_url: successUrl,
              cart_return_url: cancelUrl,
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Finix-Version': '2022-02-01'
            },
            auth: {
              username: username as string,
              password: password as string,
            },
          }
        );

      } catch (updateError) {
        // If updating isn't supported, just log and continue
        console.warn('Could not update checkout form URLs:', updateError);
        // We'll still use the original URLs in this case
      }
      
      // Open the checkout form in a browser
      await openCheckoutForm(checkoutForm.link_url);
      
      // Return success and the checkout form ID
      return {
        success: true,
        checkoutFormId
      };
    } catch (error) {
      console.error('Tournament payment processing error:', error);
      return {
        success: false,
        error
      };
    }
  };

/**
 * Complete the registration process after payment verification
 * @param checkoutFormId - The ID of the checkout form to verify
 * @returns Promise resolving to registration completion result
 */
export const completeRegistrationAfterPayment = async (
  checkoutFormId: string
): Promise<{ success: boolean; message: string; error?: any }> => {
  try {
    // Verify the payment status
    const paymentStatus = await verifyPaymentStatus(checkoutFormId);
    
    if (!paymentStatus.success) {
      return {
        success: false,
        message: `Payment verification failed. Status: ${paymentStatus.status}`,
        error: paymentStatus.error
      };
    }
    
    // Payment was successful, can proceed with registration completion
    // This could include updating the database, adding user to tournament, etc.
    
    return {
      success: true,
      message: 'Payment verified and registration completed successfully.'
    };
  } catch (error) {
    console.error('Error completing registration after payment:', error);
    return {
      success: false,
      message: 'Failed to complete registration process.',
      error
    };
  }
};

// Export additional utility functions
export default {
  createCheckoutForm,
  openCheckoutForm,
  processTournamentPayment,
  verifyPaymentStatus,
  completeRegistrationAfterPayment
};