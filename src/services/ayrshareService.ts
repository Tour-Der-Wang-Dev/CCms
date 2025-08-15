// Official Ayrshare SDK implementation
import SocialPost from 'social-media-api';
import type {
  PostData,
  PostResponse,
  ProfileData,
  HistoryResponse,
  AnalyticsResponse,
  UploadResponse,
  JWTResponse
} from '../types/ayrshare';

// Enhanced mock data for development/fallback scenarios
const MOCK_DATA = {
  profiles: [
    { platform: 'facebook', username: 'demo_page', profileKey: 'fb_demo', verified: true },
    { platform: 'instagram', username: 'demo_insta', profileKey: 'ig_demo', verified: true },
    { platform: 'x', username: 'demo_x', profileKey: 'x_demo', verified: true }
  ],
  posts: [
    {
      id: 'demo_post_1',
      post: 'Check out our new product launch! 🚀',
      platforms: ['facebook', 'instagram', 'x'],
      postDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      numViews: 2450,
      numLikes: 89,
      numComments: 12,
      numShares: 15
    },
    {
      id: 'demo_post_2',
      post: 'Behind the scenes at our office today 📸',
      platforms: ['instagram', 'linkedin'],
      postDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      numViews: 1820,
      numLikes: 156,
      numComments: 8,
      numShares: 22
    }
  ],
  analytics: {
    totalPosts: 24,
    totalViews: 24800,
    totalLikes: 1240,
    totalComments: 234,
    totalShares: 156,
    totalImpressions: 45600,
    engagementRate: 4.2,
    clickThroughRate: 2.1,
    platformBreakdown: {
      facebook: { posts: 8, views: 8900, likes: 445, comments: 89, shares: 67 },
      instagram: { posts: 12, views: 12400, likes: 678, comments: 123, shares: 45 },
      x: { posts: 6, views: 2300, likes: 89, comments: 15, shares: 23 },
      linkedin: { posts: 4, views: 1200, likes: 28, comments: 7, shares: 21 }
    },
    previousPeriod: {
      totalViews: 22100,
      totalLikes: 1180,
      totalComments: 198,
      totalShares: 134,
      engagementRate: 3.8
    }
  }
};

// Initialize the official Ayrshare SDK
const getAyrshareClient = (): SocialPost | null => {
  const apiKey = import.meta.env.VITE_AYRSHARE_API_KEY || process.env.AYRSHARE_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ No Ayrshare API key found. Using demo mode with mock data.');
    return null;
  }

  try {
    return new SocialPost(apiKey);
  } catch (error) {
    console.error('Failed to initialize Ayrshare client:', error);
    return null;
  }
};

const handleServiceError = (error: any, action: string, fallbackData?: any) => {
  console.warn(`Ayrshare service error for ${action}:`, error);

  // In development or when service is unavailable, return mock data
  if (import.meta.env.DEV || !getAyrshareClient()) {
    console.info(`Using fallback data for ${action}`);
    return fallbackData || {};
  }

  throw new Error(error.message || `Failed to ${action}`);
};

export const ayrshareService = {
  async getConnectedAccounts() {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'get connected accounts', { profiles: MOCK_DATA.profiles });
    }

    try {
      const profiles = await client.getProfiles();
      return profiles;
    } catch (error) {
      return handleServiceError(error, 'get connected accounts', { profiles: MOCK_DATA.profiles });
    }
  },

  async generateAuthUrl(platform: string) {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'generate auth URL', { url: null });
    }

    try {
      const authData = await client.generateJWT({
        domain: window.location.origin,
        platforms: [platform]
      });
      return authData;
    } catch (error) {
      return handleServiceError(error, 'generate auth URL', { url: null });
    }
  },

  async createPost(postData: any) {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'create post', { id: 'mock-post-id', status: 'success' });
    }

    try {
      const result = await client.post(postData);
      return result;
    } catch (error) {
      return handleServiceError(error, 'create post', { id: 'mock-post-id', status: 'success' });
    }
  },

  async getPostHistory(params: { limit?: number }) {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'get post history', { posts: MOCK_DATA.posts });
    }

    try {
      const history = await client.getHistory({ lastRecords: params.limit || 20 });
      return history;
    } catch (error) {
      return handleServiceError(error, 'get post history', { posts: MOCK_DATA.posts });
    }
  },

  async deletePost(postId: string) {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'delete post', { success: true });
    }

    try {
      const result = await client.deletePost(postId);
      return result;
    } catch (error) {
      return handleServiceError(error, 'delete post', { success: true });
    }
  },

  async getAnalytics(params: { startDate: string; endDate: string }) {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'get analytics', MOCK_DATA.analytics);
    }

    try {
      const analytics = await client.getAnalytics({
        startDate: params.startDate,
        endDate: params.endDate
      });
      return analytics;
    } catch (error) {
      return handleServiceError(error, 'get analytics', MOCK_DATA.analytics);
    }
  },

  async uploadMedia(file: File) {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'upload media', { url: 'mock-media-url' });
    }

    try {
      // Convert file to base64 for upload
      const reader = new FileReader();
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await client.upload({
        file: base64File,
        fileName: file.name,
        description: `Uploaded via ContentFlow: ${file.name}`
      });

      return result;
    } catch (error) {
      return handleServiceError(error, 'upload media', { url: 'mock-media-url' });
    }
  },
};
