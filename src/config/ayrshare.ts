export const AYRSHARE_CONFIG = {
  apiKey: import.meta.env.VITE_AYRSHARE_API_KEY || '',
  baseUrl: 'https://app.ayrshare.com/api',
  supportedPlatforms: [
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'x', name: 'X (Twitter)', icon: '🐦' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌' },
    { id: 'reddit', name: 'Reddit', icon: '🤖' },
    { id: 'threads', name: 'Threads', icon: '🧵' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻' },
    { id: 'telegram', name: 'Telegram', icon: '✈️' },
    { id: 'bluesky', name: 'Bluesky', icon: '🦋' },
    { id: 'google', name: 'Google Business', icon: '🏢' },
  ],
};

export interface SocialMediaAccount {
  platform: string;
  platformName: string;
  username: string;
  profileId: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface PublishingStatus {
  id: string;
  status: 'scheduled' | 'published' | 'failed' | 'pending';
  platform: string;
  postId?: string;
  scheduledDate?: string;
  publishedDate?: string;
  error?: string;
}