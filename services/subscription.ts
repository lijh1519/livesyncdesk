import { supabase } from '../lib/supabase';

export type SubscriptionStatus = 'free' | 'pro';
export type SubscriptionPlan = 'pro-monthly' | 'pro-yearly' | null;

export interface Subscription {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currentPeriodEnd: string | null;
}

// 获取用户订阅状态（查询所有订阅，只要有一个有效就算 Pro）
export async function getUserSubscription(email: string): Promise<Subscription> {
  const defaultSubscription: Subscription = {
    status: 'free',
    plan: null,
    currentPeriodEnd: null
  };

  if (!email) return defaultSubscription;

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, plan, current_period_end')
      .eq('user_email', email)
      .eq('status', 'pro')
      .order('current_period_end', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return defaultSubscription;
    }

    const subscription = data[0];
    return {
      status: 'pro',
      plan: subscription.plan as SubscriptionPlan,
      currentPeriodEnd: subscription.current_period_end
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return defaultSubscription;
  }
}

// 检查用户是否是 Pro 用户
export async function isPro(email: string): Promise<boolean> {
  const subscription = await getUserSubscription(email);
  return subscription.status === 'pro';
}

// 免费用户限制
export const FREE_LIMITS = {
  aiGenerationsPerDay: 3,
  collaboratorsPerRoom: 2,
  stickyNotesPerRoom: 10
};

// Pro 用户无限制
export const PRO_LIMITS = {
  aiGenerationsPerDay: Infinity,
  collaboratorsPerRoom: Infinity,
  stickyNotesPerRoom: Infinity
};
