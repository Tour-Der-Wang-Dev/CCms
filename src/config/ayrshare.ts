export interface SocialMediaAccount {
  platform: string;
  platformName: string;
  username?: string;
  profileId?: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiresPageSelection?: boolean;
  specialInstructions?: string;
}

export const AYRSHARE_CONFIG = {
  supportedPlatforms: [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      description: 'Share posts, images, and videos to your Facebook page',
      requiresPageSelection: true,
      specialInstructions: 'You may be asked to choose which Facebook Page to connect'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      description: 'Post photos, videos, and stories to your Instagram account',
      specialInstructions: 'Must be connected through Facebook Business account'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '👔',
      description: 'Share professional content to your LinkedIn profile or company page',
      requiresPageSelection: true
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      icon: '𝕏',
      description: 'Post tweets, images, and videos to your X account',
      specialInstructions: 'If wrong account is linked, switch accounts in X and re-link'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '▶️',
      description: 'Upload videos and manage your YouTube channel'
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: '📌',
      description: 'Pin images and content to your Pinterest boards'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      description: 'Share short-form videos to your TikTok account'
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: '🧵',
      description: 'Post text and media to Meta\'s Threads platform'
    },
    {
      id: 'bluesky',
      name: 'Bluesky',
      icon: '🦋',
      description: 'Share posts on the decentralized Bluesky social network'
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: '👻',
      description: 'Share content to your Snapchat stories'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: '🤖',
      description: 'Post content to Reddit communities'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      description: 'Send messages to your Telegram channels'
    }
  ],

  authorizationNotes: [
    'Please grant ALL permissions that Ayrshare requests during authorization',
    'Removing permissions may cause issues with posting',
    'Make sure to allow pop-ups in your browser',
    'Some platforms may ask you to choose a specific page or account'
  ]
};
