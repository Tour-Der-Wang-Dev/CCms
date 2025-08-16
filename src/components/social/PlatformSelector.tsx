import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { SocialMediaAccount } from '../../config/ayrshare';

interface PlatformSelectorProps {
  connectedAccounts: SocialMediaAccount[];
  selectedPlatforms: string[];
  onPlatformToggle: (platform: string) => void;
  loading?: boolean;
}

const PlatformSelector = memo<PlatformSelectorProps>(({
  connectedAccounts,
  selectedPlatforms,
  onPlatformToggle,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Select Platforms</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (connectedAccounts.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Select Platforms</h3>
        <div className="p-4 bg-neutral-50 rounded-lg text-center">
          <p className="text-sm text-neutral-600">No connected accounts found</p>
          <p className="text-xs text-neutral-500 mt-1">
            Connect your social media accounts first
          </p>
        </div>
      </div>
    );
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook: '📘',
      instagram: '📷',
      x: '🐦',
      linkedin: '💼',
      youtube: '📺',
      tiktok: '🎵',
    };
    return icons[platform] || '📱';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-neutral-700 mb-3">Select Platforms</h3>
      <div className="space-y-2">
        {connectedAccounts.map((account) => (
          <button
            key={account.platform}
            onClick={() => onPlatformToggle(account.platform)}
            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
              selectedPlatforms.includes(account.platform)
                ? 'border-sage bg-sage/5'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <span className="text-lg">{getPlatformIcon(account.platform)}</span>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-neutral-900">
                {account.platformName}
              </div>
              <div className="text-xs text-neutral-500">
                @{account.username}
              </div>
            </div>
            {selectedPlatforms.includes(account.platform) && (
              <Check className="w-4 h-4 text-sage" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
});

PlatformSelector.displayName = 'PlatformSelector';

export default PlatformSelector;
