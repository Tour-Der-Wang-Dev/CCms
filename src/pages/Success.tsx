import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { stripeService } from '../services/stripeService';
import { STRIPE_CONFIG } from '../stripe-config';

export default function Success() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const subscriptionData = await stripeService.getUserSubscription();
        setSubscription(subscriptionData);

        if (subscriptionData?.price_id) {
          const productData = stripeService.getProductByPriceId(subscriptionData.price_id);
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSubscription();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-neutral-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Welcome to ContentFlow!
          </h1>

          {product ? (
            <div className="mb-6">
              <div className="bg-neutral-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-sage" />
                  <span className="font-semibold text-neutral-900">{product.name} Plan</span>
                </div>
                <p className="text-sm text-neutral-600">
                  {stripeService.formatPrice(product.price)}/month
                </p>
              </div>

              <p className="text-neutral-600 mb-6">
                Your subscription is now active! You have access to all {product.name.toLowerCase()} features.
              </p>
            </div>
          ) : (
            <p className="text-neutral-600 mb-6">
              Your payment was successful! Your subscription is being set up.
            </p>
          )}

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full bg-sage text-white py-3 px-4 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/social-accounts"
              className="w-full border border-neutral-200 text-neutral-700 py-3 px-4 rounded-xl font-medium hover:bg-neutral-50 transition-colors duration-200"
            >
              Connect Social Accounts
            </Link>
          </div>

          {sessionId && (
            <p className="text-xs text-neutral-500 mt-6">
              Session ID: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}