import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const fetchPaymentSheetParams = async (amount: number) => {
  try {
    const { data, error } = await supabase.functions.invoke('payment-sheet', {
      body: { amount },
    });

    if (error) {
      console.error('Error fetching payment sheet params:', error);
      throw new Error('Failed to fetch payment sheet parameters');
    }

    return data;
  } catch (error) {
    console.error('Error in fetchPaymentSheetParams:', error);
    throw error;
  }
};

export const processPayment = async (amount: number) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // For now, we'll just simulate a successful payment
    // In a real implementation, you would:
    // 1. Create a payment intent on your backend
    // 2. Use stripe.confirmPayment() to process the payment
    // 3. Handle the result

    console.log('Processing payment for amount:', amount);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful payment
    return { success: true };
  } catch (error) {
    console.error('Payment processing error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Payment failed' };
  }
};

// Web-compatible payment processing
export const initiateWebPayment = async (amount: number) => {
  try {
    const params = await fetchPaymentSheetParams(amount);
    return params;
  } catch (error) {
    throw new Error('Failed to initiate payment');
  }
};

export default {
  processPayment,
  initiateWebPayment,
  fetchPaymentSheetParams,
};