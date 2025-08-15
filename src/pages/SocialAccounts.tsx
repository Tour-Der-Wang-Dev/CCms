import React from 'react';
import { Link, Settings } from 'lucide-react';
import SocialAccountManager from '../components/social/SocialAccountManager';
import PublishingQueue from '../components/social/PublishingQueue';

const SocialAccounts = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Social Media Accounts</h1>
          <p className="text-neutral-600">Connect and manage your social media accounts for publishing</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <a
            href="https://app.ayrshare.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Ayrshare Dashboard</span>
          </a>
        </div>
      </div>

      <SocialAccountManager />

      {/* Publishing Queue */}
      <div className="mt-8">
        <PublishingQueue />
      </div>

      {/* Quick Setup Guide */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Setup Guide</h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">Get Your API Key</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Sign up at Ayrshare and copy your API key to your environment variables
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">Connect Social Accounts</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Use the connect buttons above to link your social media accounts
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">Start Publishing</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Schedule and publish content directly from your calendar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialAccounts;