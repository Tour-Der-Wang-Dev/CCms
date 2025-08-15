export interface SocialMediaAccount {
  platform: string;
  platformName: string;
  username?: string;
  profileId?: string;
  isConnected: boolean;
  lastSync?: string;
}

export const AYRSHARE_CONFIG = {
  supportedPlatforms: [
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'linkedin', name: 'LinkedIn', icon: '👔' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'youtube', name: 'YouTube', icon: '▶️' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  ],
};