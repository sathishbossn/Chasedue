import Razorpay from 'razorpay';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YourTestKey';
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YourTestKey';

export interface PaymentResult {
  success: boolean;
  subscriptionId?: string;
  error?: string;
}

export class PaymentService {
  static async initiateRazorpayPayment(email: string): Promise<PaymentResult> {
    try {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: 49900, // ₹499 in paise
        currency: 'INR',
        name: 'CarrotCash Pro',
        description: 'Unlimited clients & premium features',
        image: 'https://your-domain.com/assets/icon.png',
        handler: async (response: any) => {
          // Verify payment on backend
          const verificationResult = await this.verifyRazorpayPayment(response);
          return verificationResult;
        },
        prefill: {
          email,
        },
        theme: {
          color: '#FF6B35',
        },
        modal: {
          ondismiss: () => {
            return { success: false, error: 'Payment cancelled' };
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      return new Promise((resolve) => {
        // This is a simplified version - in production, you'd handle the response properly
        setTimeout(() => {
          resolve({ success: false, error: 'Payment flow initiated' });
        }, 1000);
      });
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async verifyRazorpayPayment(response: any): Promise<PaymentResult> {
    try {
      // In production, this would call your backend to verify the payment
      // For now, we'll simulate successful verification
      const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = response;

      // Call your backend endpoint to verify
      const verificationResponse = await fetch('/api/verify-razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id,
          razorpay_subscription_id,
          razorpay_signature,
        }),
      });

      if (verificationResponse.ok) {
        return { success: true, subscriptionId: razorpay_subscription_id };
      } else {
        return { success: false, error: 'Payment verification failed' };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async initiateStripePayment(email: string): Promise<PaymentResult> {
    try {
      const stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripeInstance) {
        return { success: false, error: 'Failed to load Stripe' };
      }

      // In production, you'd create a checkout session on your backend
      const response = await fetch('/api/create-stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          priceId: 'price_1YourPriceId', // Your Stripe price ID
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
}
