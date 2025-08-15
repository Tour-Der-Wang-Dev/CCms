import { supabase } from '../lib/supabase';
import { STRIPE_CONFIG, type SubscriptionData } from '../stripe-config';

export class StripeService {
  private static instance: StripeService;

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async createCheckoutSession(priceId: string, mode: 'subscription' | 'payment' = 'subscription') {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    const baseUrl = window.location.origin;
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing`;

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();
    return data;
  }

  async getUserSubscription(): Promise<SubscriptionData | null> {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  }

  async getUserOrders() {
    const { data, error } = await supabase
      .from('stripe_user_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  }

  getProductByPriceId(priceId: string) {
    return STRIPE_CONFIG.products.find(product => product.priceId === priceId);
  }

  getProductByName(name: string) {
    return STRIPE_CONFIG.products.find(product => product.name.toLowerCase() === name.toLowerCase());
  }

  formatPrice(price: number, currency: string = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }

  isSubscriptionActive(subscription: SubscriptionData | null): boolean {
    if (!subscription || !subscription.subscription_status) {
      return false;
    }

    const activeStatuses = ['active', 'trialing'];
    return activeStatuses.includes(subscription.subscription_status);
  }

  getSubscriptionStatusDisplay(status: string): { text: string; color: string } {
    switch (status) {
      case 'active':
        return { text: 'Active', color: 'text-emerald-600' };
      case 'trialing':
        return { text: 'Trial', color: 'text-blue-600' };
      case 'past_due':
        return { text: 'Past Due', color: 'text-amber-600' };
      case 'canceled':
        return { text: 'Canceled', color: 'text-red-600' };
      case 'incomplete':
        return { text: 'Incomplete', color: 'text-amber-600' };
      case 'unpaid':
        return { text: 'Unpaid', color: 'text-red-600' };
      default:
        return { text: 'Unknown', color: 'text-neutral-600' };
    }
  }
}

export const stripeService = StripeService.getInstance();