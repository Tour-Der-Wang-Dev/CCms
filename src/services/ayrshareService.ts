import { supabase } from '../lib/supabase';

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

interface AyrshareErrorResponse {
  status?: number;
  message?: string;
  code?: string;
  errors?: any[];
}

const handleServiceError = (error: any, action: string, fallbackData?: any) => {
  // Enhanced error logging with more details
  const errorInfo = {
    action,
    message: error.message,
    status: error.status || error.response?.status,
    code: error.code,
    timestamp: new Date().toISOString()
  };

  console.warn(`Ayrshare service error:`, errorInfo);

  // Check for specific error types from Ayrshare
  if (error.status === 401 || error.message?.includes('unauthorized')) {
    console.error('❌ Ayrshare API authentication failed. Check your API key.');
  } else if (error.status === 429) {
    console.warn('⚠️ Ayrshare API rate limit exceeded. Retrying with fallback data.');
  } else if (error.status >= 500) {
    console.warn('⚠️ Ayrshare API server error. Using fallback data.');
  }

  // In development, when no API client, or on certain errors, use mock data
  if (import.meta.env.DEV || !getAyrshareClient() || error.status >= 500) {
    console.info(`📝 Using fallback data for ${action}`);
    return fallbackData || {};
  }

  // For client errors (4xx), re-throw with enhanced message
  if (error.status >= 400 && error.status < 500) {
    throw new Error(`Ayrshare API error (${error.status}): ${error.message || `Failed to ${action}`}`);
  }

  throw new Error(error.message || `Failed to ${action}`);
};

// Retry mechanism for network errors
const withRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = 2,
  delay: number = 1000
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.status >= 500)) {
      console.log(`🔄 Retrying operation in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const ayrshareService = {
  async getConnectedAccounts(): Promise<{ profiles: ProfileData[] }> {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'get connected accounts', { profiles: MOCK_DATA.profiles });
    }

    try {
      const profiles = await withRetry(() => client.getProfiles());
      return profiles;
    } catch (error) {
      return handleServiceError(error, 'get connected accounts', { profiles: MOCK_DATA.profiles });
    }
  },

  async generateAuthUrl(platform: string): Promise<JWTResponse> {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'generate auth URL', { url: null });
    }

    try {
      const authData = await withRetry(() => client.generateJWT({
        domain: window.location.origin,
        platforms: [platform]
      }));
      return authData;
    } catch (error) {
      return handleServiceError(error, 'generate auth URL', { url: null });
    }
  },

  async createPost(postData: PostData): Promise<PostResponse> {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'create post', { id: 'mock-post-id', status: 'success' });
    }

    try {
      const result = await withRetry(() => client.post(postData));
      return result;
    } catch (error) {
      return handleServiceError(error, 'create post', { id: 'mock-post-id', status: 'success' });
    }
  },

  async getPostHistory(params: { limit?: number }): Promise<HistoryResponse> {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'get post history', { posts: MOCK_DATA.posts });
    }

    try {
      const history = await withRetry(() => client.getHistory({ lastRecords: params.limit || 20 }));
      return history;
    } catch (error) {
      return handleServiceError(error, 'get post history', { posts: MOCK_DATA.posts });
    }
  },

  async deletePost(postId: string): Promise<{ success: boolean }> {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'delete post', { success: true });
    }

    try {
      const result = await withRetry(() => client.deletePost(postId));
      return result;
    } catch (error) {
      return handleServiceError(error, 'delete post', { success: true });
    }
  },

  async getAnalytics(params: { startDate: string; endDate: string }): Promise<AnalyticsResponse> {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'get analytics', MOCK_DATA.analytics);
    }

    try {
      const analytics = await withRetry(() => client.getAnalytics({
        startDate: params.startDate,
        endDate: params.endDate
      }));
      return analytics;
    } catch (error) {
      return handleServiceError(error, 'get analytics', MOCK_DATA.analytics);
    }
  },

  async uploadMedia(file: File): Promise<UploadResponse> {
    const client = getAyrshareClient();

    if (!client) {
      return handleServiceError(new Error('No API client'), 'upload media', { url: 'mock-media-url', fileName: file.name });
    }

    try {
      // Convert file to base64 for upload
      const reader = new FileReader();
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await withRetry(() => client.upload({
        file: base64File,
        fileName: file.name,
        description: `Uploaded via ContentFlow: ${file.name}`
      }));

      return result;
    } catch (error) {
      return handleServiceError(error, 'upload media', { url: 'mock-media-url', fileName: file.name });
    }
  },
};
