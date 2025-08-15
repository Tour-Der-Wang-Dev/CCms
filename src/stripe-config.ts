export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  products: [
    {
      id: 'prod_Sr4eDol0WIc4Ny',
      priceId: 'price_1RvMV2RCcsY5J3APzJMOHigT',
      name: 'STARTER',
      description: 'Perfect for individuals and small teams getting started with social media management.',
      price: 29.00,
      currency: 'USD',
      mode: 'subscription' as const,
      features: [
        '3 social media accounts',
        '50 posts/month across all platforms',
        'Basic analytics (30 days)',
        'Email support only',
        'Basic content generation via Gemini',
        'Standard scheduling',
        'Basic hashtag suggestions',
        'Simple performance metrics'
      ],
      limits: {
        accounts: 3,
        postsPerMonth: 50,
        analyticsRetention: 30,
        support: 'Email only'
      }
    },
    {
      id: 'prod_Sr4eE8rC0v9uY8',
      priceId: 'price_1RvMVZRCcsY5J3APopknbsxN',
      name: 'PROFESSIONAL',
      description: 'Advanced features for growing businesses and marketing teams.',
      price: 79.00,
      currency: 'USD',
      mode: 'subscription' as const,
      features: [
        '10 social media accounts',
        '500 posts/month across all platforms',
        'Advanced analytics (90 days)',
        'Priority email + chat support',
        'Advanced AI content optimization',
        'A/B testing (2 variants)',
        'Competitor analysis',
        'Custom posting schedules',
        'Team collaboration (3 users)'
      ],
      limits: {
        accounts: 10,
        postsPerMonth: 500,
        analyticsRetention: 90,
        support: 'Priority email + chat',
        teamUsers: 3
      }
    },
    {
      id: 'prod_Sr4fcxqPAZpqSA',
      priceId: 'price_1RvMW2RCcsY5J3APhbK9eqRt',
      name: 'ENTERPRISE',
      description: 'Complete solution for large organizations with advanced needs.',
      price: 199.00,
      currency: 'USD',
      mode: 'subscription' as const,
      features: [
        'Unlimited social media accounts',
        '2,000 posts/month across all platforms',
        'Full analytics suite (1 year)',
        'Dedicated account manager',
        'All Professional features',
        'Advanced AI insights & predictions',
        'Custom integrations',
        'White-label options',
        'Team collaboration (10 users)',
        'API access'
      ],
      limits: {
        accounts: 'Unlimited',
        postsPerMonth: 2000,
        analyticsRetention: 365,
        support: 'Dedicated account manager',
        teamUsers: 10
      }
    },
    {
      id: 'prod_Sr4fcjtsKniEyx',
      priceId: 'price_1RvMWbRCcsY5J3AP56ZxjaB3',
      name: 'AGENCY',
      description: 'Multi-client management solution for agencies and service providers.',
      price: 499.00,
      currency: 'USD',
      mode: 'subscription' as const,
      features: [
        'Multi-client management',
        '10,000 posts/month total',
        'Complete analytics suite (unlimited)',
        '24/7 phone support',
        'Client billing management',
        'Custom branding',
        'Advanced team permissions',
        'Bulk operations',
        'Custom reporting',
        'Dedicated infrastructure'
      ],
      limits: {
        accounts: 'Multi-client',
        postsPerMonth: 10000,
        analyticsRetention: 'Unlimited',
        support: '24/7 phone support'
      }
    }
  ]
};

export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription' | 'payment';
  features: string[];
  limits: {
    accounts: number | string;
    postsPerMonth: number;
    analyticsRetention: number | string;
    support: string;
    teamUsers?: number;
  };
}

export interface SubscriptionData {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}