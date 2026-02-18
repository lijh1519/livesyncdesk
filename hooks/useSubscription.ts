import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserSubscription, Subscription, FREE_LIMITS, PRO_LIMITS } from '../services/subscription';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>({
    status: 'free',
    plan: null,
    currentPeriodEnd: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (user?.email) {
        setLoading(true);
        const sub = await getUserSubscription(user.email);
        setSubscription(sub);
        setLoading(false);
      } else {
        setSubscription({ status: 'free', plan: null, currentPeriodEnd: null });
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user?.email]);

  const isPro = subscription.status === 'pro';
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;

  return {
    subscription,
    isPro,
    limits,
    loading
  };
}
