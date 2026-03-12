import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Subscription = {
  id: string;
  user_id: string;
  plan: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  current_period_end?: string;
  razorpay_subscription_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
};

type SubscriptionContextValue = {
  subscription: Subscription | null;
  isPro: boolean;
  isLoading: boolean;
  canAddClient: boolean;
  clientLimit: number;
  remainingClients: number;
  upgradeToPro: () => Promise<void>;
  checkSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const FREE_CLIENT_LIMIT = 3;

export function SubscriptionProvider({ children }: Props) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active';
  const clientLimit = isPro ? Infinity : FREE_CLIENT_LIMIT;
  const canAddClient = isPro || (subscription ? false : true); // Will be updated based on actual client count

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching subscription:', error);
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToPro = async () => {
    // This will be implemented with payment providers
    console.log('Initiating Pro upgrade...');
  };

  const remainingClients = Math.max(0, clientLimit - (subscription ? 0 : FREE_CLIENT_LIMIT));

  useEffect(() => {
    checkSubscription();
  }, []);

  const value: SubscriptionContextValue = {
    subscription,
    isPro,
    isLoading,
    canAddClient,
    clientLimit,
    remainingClients,
    upgradeToPro,
    checkSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return ctx;
}
