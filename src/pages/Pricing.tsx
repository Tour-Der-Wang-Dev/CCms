import React, { useState } from 'react';
import { Check, Zap, Crown, Building, Rocket } from 'lucide-react';
import { STRIPE_CONFIG } from '../stripe-config';
import { stripeService } from '../services/stripeService';
import { useAuth } from '../contexts/AuthContext';

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string, productName: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(priceId);
      const { url } = await stripeService.createCheckoutSession(priceId, 'subscription');
      
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout process');
    } finally {
      setLoading(null);
    }
  };

  const getProductIcon = (name: string) => {
    switch (name) {
      case 'STARTER':
        return <Zap className="w-6 h-6" />;
      case 'PROFESSIONAL':
        return <Crown className="w-6 h-6" />;
      case 'ENTERPRISE':
        return <Building className="w-6 h-6" />;
      case 'AGENCY':
        return <Rocket className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getProductColor = (name: string) => {
    switch (name) {
      case 'STARTER':
        return 'text-warm-blue';
      case 'PROFESSIONAL':
        return 'text-sage';
      case 'ENTERPRISE':
        return 'text-dusty-purple';
      case 'AGENCY':
        return 'text-warm-amber';
      default:
        return 'text-sage';
    }
  };

  const getButtonColor = (name: string) => {
    switch (name) {
      case 'STARTER':
        return 'bg-warm-blue hover:bg-warm-blue/90';
      case 'PROFESSIONAL':
        return 'bg-sage hover:bg-sage/90 ring-2 ring-sage/20';
      case 'ENTERPRISE':
        return 'bg-dusty-purple hover:bg-dusty-purple/90';
      case 'AGENCY':
        return 'bg-warm-amber hover:bg-warm-amber/90';
      default:
        return 'bg-sage hover:bg-sage/90';
    }
  };

  const isPopular = (name: string) => name === 'PROFESSIONAL';

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Scale your social media management with our flexible pricing plans. 
            Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STRIPE_CONFIG.products.map((product) => (
            <div
              key={product.id}
              className={`relative bg-white rounded-2xl shadow-soft border transition-all duration-200 hover:shadow-medium ${
                isPopular(product.name) 
                  ? 'border-sage ring-2 ring-sage/10 scale-105' 
                  : 'border-neutral-200'
              }`}
            >
              {isPopular(product.name) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-sage text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center ${getProductColor(product.name)}`}>
                    {getProductIcon(product.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{product.name}</h3>
                  </div>
                </div>

                <p className="text-neutral-600 text-sm mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-neutral-900">
                      ${product.price}
                    </span>
                    <span className="text-neutral-500 ml-2">/month</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(product.priceId, product.name)}
                  disabled={loading === product.priceId}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonColor(product.name)}`}
                >
                  {loading === product.priceId ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    'Get Started'
                  )}
                </button>

                <div className="mt-8">
                  <h4 className="font-semibold text-neutral-900 mb-4">Features included:</h4>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-4">
            Need a custom solution? We're here to help.
          </p>
          <button className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors duration-200">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}