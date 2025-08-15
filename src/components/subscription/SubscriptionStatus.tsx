import React, { useEffect, useState } from 'react';
import { Crown, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { stripeService } from '../../services/stripeService';
import { useAuth } from '../../contexts/AuthContext';
import type { SubscriptionData } from '../../stripe-config';

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await stripeService.getUserSubscription();
        setSubscription(data);
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [user]);

  if (!user || loading) {
    return null;
  }

  if (!subscription || !subscription.subscription_status) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-amber-800 font-medium">No active subscription</p>
          <p className="text-amber-700 text-sm">
            Subscribe to unlock all features and start managing your content.
          </p>
        </div>
      </div>
    );
  }

  const product = subscription.price_id 
    ? stripeService.getProductByPriceId(subscription.price_id)
    : null;

  const statusDisplay = stripeService.getSubscriptionStatusDisplay(subscription.subscription_status);
  const isActive = stripeService.isSubscriptionActive(subscription);

  const getStatusIcon = () => {
    if (isActive) {
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    }
    
    switch (subscription.subscription_status) {
      case 'past_due':
      case 'unpaid':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'trialing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  const getBgColor = () => {
    if (isActive) {
      return 'bg-emerald-50 border-emerald-200';
    }
    
    switch (subscription.subscription_status) {
      case 'past_due':
      case 'unpaid':
        return 'bg-red-50 border-red-200';
      case 'trialing':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className={`rounded-xl p-4 border ${getBgColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <div className="flex items-center space-x-2">
              {product && (
                <>
                  <Crown className="w-4 h-4 text-sage" />
                  <span className="font-medium text-neutral-900">{product.name}</span>
                </>
              )}
            </div>
            <p className={`text-sm ${statusDisplay.color}`}>
              Status: {statusDisplay.text}
            </p>
          </div>
        </div>

        {subscription.current_period_end && (
          <div className="text-right">
            <p className="text-sm text-neutral-600">
              {subscription.cancel_at_period_end ? 'Expires' : 'Renews'}
            </p>
            <p className="text-sm font-medium text-neutral-900">
              {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {subscription.payment_method_last4 && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Payment method: {subscription.payment_method_brand?.toUpperCase()} ending in {subscription.payment_method_last4}
          </p>
        </div>
      )}
    </div>
  );
}