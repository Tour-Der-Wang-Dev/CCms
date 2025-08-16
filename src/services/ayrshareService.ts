import { supabase } from '../lib/supabase';
import { cachedRequest, apiCache, debounce } from '../lib/cache';

// Enhanced mock data based on Ayrshare's unified API structure
const MOCK_DATA = {
  connectedAccounts: {
    profiles: [
      { platform: 'facebook', username: 'demo_page', profileKey: 'fb_demo', verified: true },
      { platform: 'instagram', username: 'demo_insta', profileKey: 'ig_demo', verified: true },
      { platform: 'x', username: 'demo_x', profileKey: 'x_demo', verified: true }
    ]
  },
  postHistory: {
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
    ]
  },
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

const handleServiceError = (error: any, action: string, fallbackData?: any) => {
  console.warn(`Ayrshare service error for ${action}:`, error);

  // In development or when service is unavailable, return mock data
  if (import.meta.env.DEV || error.message?.includes('Edge Function')) {
    console.info(`Using fallback data for ${action}`);
    return fallbackData || {};
  }

  throw new Error(error.message || `Failed to ${action}`);
};

// Debounced analytics request
const debouncedAnalyticsRequest = debounce(async (params: { startDate: string; endDate: string }) => {
  const cacheKey = `analytics_${params.startDate}_${params.endDate}`;
  
  return cachedRequest(cacheKey, async () => {
    const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
      body: { action: 'getAnalytics', params },
    });

    if (error) {
      return handleServiceError(error, 'get analytics', MOCK_DATA.analytics);
    }

    return data;
  }, 10 * 60 * 1000); // Cache for 10 minutes
}, 300);

export const ayrshareService = {
  async getConnectedAccounts() {
    const cacheKey = 'connected_accounts';
    
    return cachedRequest(cacheKey, async () => {
      const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
        body: { action: 'getConnectedAccounts' },
      });

      if (error) {
        return handleServiceError(error, 'get connected accounts', MOCK_DATA.connectedAccounts);
      }

      return data;
    }, 5 * 60 * 1000); // Cache for 5 minutes
  },

  async generateAuthUrl(platform: string) {
    // Don't cache auth URLs as they should be fresh
    try {
      const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
        body: { action: 'generateAuthUrl', platform },
      });

      if (error) {
        return handleServiceError(error, 'generate auth URL', { url: null });
      }

      // Invalidate connected accounts cache when generating auth URLs
      apiCache.invalidate('connected_accounts');

      return data;
    } catch (error) {
      return handleServiceError(error, 'generate auth URL', { url: null });
    }
  },

  async createPost(postData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
        body: { action: 'createPost', postData },
      });

      if (error) {
        return handleServiceError(error, 'create post', { id: 'mock-post-id', status: 'success' });
      }

      // Invalidate relevant caches after posting
      apiCache.invalidate('post_history');
      apiCache.invalidate('analytics');

      return data;
    } catch (error) {
      return handleServiceError(error, 'create post', { id: 'mock-post-id', status: 'success' });
    }
  },

  async getPostHistory(params: { limit?: number } = {}) {
    const cacheKey = `post_history_${params.limit || 50}`;
    
    return cachedRequest(cacheKey, async () => {
      const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
        body: { action: 'getPostHistory', params },
      });

      if (error) {
        return handleServiceError(error, 'get post history', MOCK_DATA.postHistory);
      }

      return data;
    }, 2 * 60 * 1000); // Cache for 2 minutes
  },

  async deletePost(postId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
        body: { action: 'deletePost', postId },
      });

      if (error) {
        return handleServiceError(error, 'delete post', { success: true });
      }

      // Invalidate caches after deletion
      apiCache.invalidate('post_history');
      apiCache.invalidate('analytics');

      return data;
    } catch (error) {
      return handleServiceError(error, 'delete post', { success: true });
    }
  },

  async getAnalytics(params: { startDate: string; endDate: string }) {
    // Use debounced request to prevent rapid successive calls
    return debouncedAnalyticsRequest(params);
  },

  async uploadMedia(file: File) {
    const cacheKey = `media_${file.name}_${file.size}_${file.lastModified}`;
    
    return cachedRequest(cacheKey, async () => {
      const reader = new FileReader();
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
        body: { action: 'uploadMedia', file: base64File, fileName: file.name, fileType: file.type },
      });

      if (error) {
        return handleServiceError(error, 'upload media', { url: 'mock-media-url' });
      }

      return data;
    }, 60 * 60 * 1000); // Cache media uploads for 1 hour
  },

  // Cache management utilities
  clearCache() {
    apiCache.clear();
  },

  invalidateCache(pattern?: string) {
    if (pattern) {
      apiCache.invalidate(pattern);
    } else {
      apiCache.clear();
    }
  }
};
