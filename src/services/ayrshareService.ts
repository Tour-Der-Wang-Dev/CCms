import { AYRSHARE_CONFIG } from '../config/ayrshare';

class AyrshareService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = AYRSHARE_CONFIG.apiKey;
    this.baseUrl = AYRSHARE_CONFIG.baseUrl;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Post to social media
  async createPost(postData: {
    post: string;
    platforms: string[];
    mediaUrls?: string[];
    scheduleDate?: string;
    profileKeys?: string[];
  }) {
    return this.makeRequest('/post', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // Get post analytics
  async getPostAnalytics(postId: string) {
    return this.makeRequest(`/analytics/post/${postId}`);
  }

  // Get user's connected social accounts
  async getConnectedAccounts() {
    return this.makeRequest('/profiles');
  }

  // Get post history
  async getPostHistory(params?: {
    platform?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.platform) queryParams.append('platform', params.platform);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return this.makeRequest(`/history${query ? `?${query}` : ''}`);
  }

  // Delete a scheduled post
  async deletePost(postId: string) {
    return this.makeRequest(`/delete/${postId}`, {
      method: 'DELETE',
    });
  }

  // Get analytics for all posts
  async getAnalytics(params?: {
    platforms?: string[];
    startDate?: string;
    endDate?: string;
  }) {
    return this.makeRequest('/analytics', {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  }

  // Generate auth URL for connecting social accounts
  async generateAuthUrl(platform: string) {
    return this.makeRequest('/generate-jwt', {
      method: 'POST',
      body: JSON.stringify({ 
        domain: window.location.origin,
        privateKey: this.apiKey 
      }),
    });
  }

  // Upload media
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload media');
    }

    return response.json();
  }
}

export const ayrshareService = new AyrshareService();