export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string; // Stripe Price ID
  features: string[];
}

export interface SubscriptionData {
  customer_id: string;
  subscription_id: string;
  subscription_status: string;
  price_id: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const STRIPE_CONFIG = {
  products: [
    {
      id: 'prod_starter',
      name: 'STARTER',
      description: 'Perfect for individuals starting their content journey.',
      price: 19,
      priceId: 'price_1PZ0x0J234567890abcdef', // Replace with actual Stripe Price ID
      features: [
        'Up to 3 social accounts',
        'Basic analytics',
        'Content calendar',
        'Idea board',
        'Email support',
      ],
    },
    {
      id: 'prod_professional',
      name: 'PROFESSIONAL',
      description: 'Ideal for growing teams needing advanced features.',
      price: 49,
      priceId: 'price_1PZ0x1J234567890abcdef', // Replace with actual Stripe Price ID
      features: [
        'Up to 10 social accounts',
        'Advanced analytics & insights',
        'Team collaboration (5 members)',
        'Content briefs',
        'Priority support',
        'Custom branding',
      ],
    },
    {
      id: 'prod_enterprise',
      name: 'ENTERPRISE',
      description: 'Tailored for large organizations with extensive needs.',
      price: 199,
      priceId: 'price_1PZ0x2J234567890abcdef', // Replace with actual Stripe Price ID
      features: [
        'Unlimited social accounts',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced security & compliance',
        'On-demand training',
        'All Professional features',
      ],
    },
    {
      id: 'prod_agency',
      name: 'AGENCY',
      description: 'Built for agencies managing multiple client accounts.',
      price: 299,
      priceId: 'price_1PZ0x3J234567890abcdef', // Replace with actual Stripe Price ID
      features: [
        'Client management dashboards',
        'White-label reporting',
        'Bulk content scheduling',
        'API access',
        'All Enterprise features',
      ],
    },
  ],
};