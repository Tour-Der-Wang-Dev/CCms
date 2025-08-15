import { supabase } from '../lib/supabase';
import { STRIPE_CONFIG, SubscriptionData, Product } from '../stripe-config';

export const stripeService = {
  async createCheckoutSession(priceId: string, mode: 'subscription' | 'payment') {
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: { priceId, mode },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async createPortalSession() {
    const { data, error } = await supabase.functions.invoke('stripe-portal');

    if (error) throw new Error(error.message);
    return data;
  },

  async getUserSubscription(): Promise<SubscriptionData | null> {
    // This would typically fetch from your Supabase 'stripe_subscriptions' table
    const { data, error } = await supabase
      .from('stripe_subscriptions')
      .select('*')
      .eq('customer_id', (await supabase.auth.getSession()).data.session?.user.id) // Assuming customer_id is user_id
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching user subscription:', error);
      return null;
    }

    return data as SubscriptionData | null;
  },

  getProductByPriceId(priceId: string): Product | undefined {
    return STRIPE_CONFIG.products.find(p => p.priceId === priceId);
  },

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  getSubscriptionStatusDisplay(status: string) {
    switch (status) {
      case 'active':
        return { text: 'Active', color: 'text-emerald-600' };
      case 'trialing':
        return { text: 'Trialing', color: 'text-blue-600' };
      case 'past_due':
        return { text: 'Past Due', color: 'text-red-600' };
      case 'canceled':
        return { text: 'Canceled', color: 'text-neutral-500' };
      case 'unpaid':
        return { text: 'Unpaid', color: 'text-red-600' };
      default:
        return { text: 'Inactive', color: 'text-amber-600' };
    }
  },

  isSubscriptionActive(subscription: SubscriptionData | null): boolean {
    if (!subscription) return false;
    const activeStatuses = ['active', 'trialing'];
    return activeStatuses.includes(subscription.subscription_status);
  },
};