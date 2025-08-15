import React from 'react';
import { ExternalLink, CheckCircle, Circle, User, Link, Code, Rocket, Users, HelpCircle } from 'lucide-react';

const AyrshareOnboarding = () => {
  const steps = [
    {
      title: 'Create Your Account',
      description: 'Sign up for Ayrshare and find your API key in the dashboard',
      icon: User,
      action: 'Visit Ayrshare',
      url: 'https://app.ayrshare.com/register',
      completed: false
    },
    {
      title: 'Connect Social Accounts', 
      description: 'Link the social media accounts you want to manage',
      icon: Link,
      action: 'Go to Social Accounts',
      url: '/social-accounts',
      internal: true,
      completed: false
    },
    {
      title: 'Configure API Key',
      description: 'Add your Ayrshare API key to enable live functionality',
      icon: Code,
      action: 'Set Environment Variable',
      completed: false
    },
    {
      title: 'Test Integration',
      description: 'Make your first API call and verify the connection',
      icon: Rocket,
      action: 'View Documentation',
      url: 'https://docs.ayrshare.com/apis/overview',
      completed: false
    },
    {
      title: 'Scale to Multiple Users',
      description: 'Learn how to manage social media for all your users',
      icon: Users,
      action: 'Business Plan Info',
      url: 'https://docs.ayrshare.com/multiple-users/business-plan-overview',
      completed: false
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center space-x-2 mb-6">
        <Rocket className="w-5 h-5 text-sage" />
        <h3 className="text-lg font-semibold text-neutral-900">Get Started with Ayrshare</h3>
      </div>

      <div className="space-y-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {step.completed ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-neutral-300" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <step.icon className="w-4 h-4 text-sage" />
                <h4 className="font-medium text-neutral-900">{step.title}</h4>
              </div>
              <p className="text-sm text-neutral-600 mt-1 mb-2">{step.description}</p>
              
              {step.url && (
                <a
                  href={step.url}
                  target={step.internal ? '_self' : '_blank'}
                  rel={step.internal ? '' : 'noopener noreferrer'}
                  className="inline-flex items-center space-x-1 text-sm text-sage hover:text-sage/80 font-medium transition-colors duration-200"
                >
                  <span>{step.action}</span>
                  {!step.internal && <ExternalLink className="w-3 h-3" />}
                </a>
              )}
              
              {step.title === 'Configure API Key' && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Code className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-amber-800 font-medium">Official SDK Configuration</p>
                      <p className="text-amber-700 mt-1">
                        Set <code className="bg-amber-100 px-1 rounded">VITE_AYRSHARE_API_KEY</code> or <code className="bg-amber-100 px-1 rounded">AYRSHARE_API_KEY</code> in your environment variables to enable the official Ayrshare SDK.
                      </p>
                      <p className="text-amber-600 text-xs mt-1">
                        ✨ Now using the official social-media-api SDK for enhanced reliability and features!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600">Need help?</span>
          </div>
          <a
            href="https://docs.ayrshare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-sage hover:text-sage/80 font-medium transition-colors duration-200"
          >
            <span>View Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AyrshareOnboarding;
