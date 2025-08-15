import React, { useState, useEffect } from 'react';
import { Plus, Check, X, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { AYRSHARE_CONFIG, SocialMediaAccount } from '../../config/ayrshare';
import { ayrshareService } from '../../services/ayrshareService';

const SocialAccountManager = () => {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      setLoading(true);
      const response = await ayrshareService.getConnectedAccounts();
      
      // Transform API response to our format
      const connectedAccounts = AYRSHARE_CONFIG.supportedPlatforms.map(platform => {
        const connected = response.profiles?.find((p: any) => p.platform === platform.id);
        return {
          platform: platform.id,
          platformName: platform.name,
          username: connected?.username || '',
          profileId: connected?.profileKey || '',
          isConnected: !!connected,
          lastSync: connected?.lastSync,
        };
      });

      setAccounts(connectedAccounts);
    } catch (err) {
      setError('Failed to load connected accounts');
      console.error('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async (platform: string) => {
    try {
      setConnecting(platform);
      setError(null);

      // Generate auth URL and redirect user
      const authResponse = await ayrshareService.generateAuthUrl(platform);
      
      if (authResponse.url) {
        // Open in new window for OAuth flow
        const authWindow = window.open(
          authResponse.url,
          'social-auth',
          'width=600,height=600,scrollbars=yes,resizable=yes'
        );

        // Listen for auth completion
        const checkClosed = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkClosed);
            setConnecting(null);
            // Refresh accounts after auth
            setTimeout(() => loadConnectedAccounts(), 1000);
          }
        }, 1000);
      }
    } catch (err) {
      setError(`Failed to connect ${platform}`);
      setConnecting(null);
      console.error('Connection error:', err);
    }
  };

  const handleDisconnectAccount = async (platform: string) => {
    if (confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
      try {
        // Note: Ayrshare doesn't have a direct disconnect API
        // This would typically be handled through their dashboard
        alert('Please disconnect this account through your Ayrshare dashboard');
      } catch (err) {
        setError(`Failed to disconnect ${platform}`);
      }
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformConfig = AYRSHARE_CONFIG.supportedPlatforms.find(p => p.id === platform);
    return platformConfig?.icon || '📱';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-sage animate-spin" />
          <span className="ml-2 text-neutral-600">Loading social accounts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Connected Social Accounts</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Manage your social media connections for publishing content
          </p>
        </div>
        <button
          onClick={loadConnectedAccounts}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          title="Refresh accounts"
        >
          <RefreshCw className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {import.meta.env.DEV && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-2">
          <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-700 font-medium">Development Mode</p>
            <p className="text-blue-600 mt-1">
              Social media features are running in demo mode. Connect your Ayrshare API key to enable live functionality.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div
            key={account.platform}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              account.isConnected
                ? 'border-sage/20 bg-sage/5'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
                <div>
                  <h3 className="font-medium text-neutral-900">{account.platformName}</h3>
                  {account.isConnected && account.username && (
                    <p className="text-xs text-neutral-500">@{account.username}</p>
                  )}
                </div>
              </div>
              
              {account.isConnected ? (
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-sage" />
                  <button
                    onClick={() => handleDisconnectAccount(account.platform)}
                    className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors duration-200"
                    title="Disconnect"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnectAccount(account.platform)}
                  disabled={connecting === account.platform}
                  className="flex items-center space-x-1 px-3 py-1 bg-sage text-white rounded-lg text-sm font-medium hover:bg-sage/90 transition-colors duration-200 disabled:opacity-50"
                >
                  {connecting === account.platform ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                  <span>Connect</span>
                </button>
              )}
            </div>

            <div className="text-xs text-neutral-500">
              {account.isConnected ? (
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-sage rounded-full"></span>
                  <span>Connected</span>
                </span>
              ) : (
                <span>Not connected</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-2">
          <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-700 font-medium">Need help connecting accounts?</p>
            <p className="text-blue-600 mt-1">
              Visit your{' '}
              <a
                href="https://app.ayrshare.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Ayrshare dashboard
              </a>{' '}
              to manage social media connections and API settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialAccountManager;
