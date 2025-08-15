// TypeScript declarations for the official Ayrshare social-media-api SDK

declare module 'social-media-api' {
  interface PostData {
    post: string;
    platforms: string[];
    mediaUrls?: string[];
    scheduleDate?: string;
    shorten?: boolean;
    customThumbnail?: string;
    youTubeOptions?: {
      title?: string;
      description?: string;
      tags?: string[];
      categoryId?: number;
      defaultLanguage?: string;
      privacy?: 'private' | 'public' | 'unlisted';
    };
  }

  interface PostResponse {
    id: string;
    status: string;
    postIds?: { [platform: string]: string };
    errors?: any[];
  }

  interface ProfileData {
    platform: string;
    username?: string;
    profileKey: string;
    verified?: boolean;
    lastSync?: string;
  }

  interface HistoryResponse {
    posts: PostHistoryItem[];
    lastKey?: string;
  }

  interface PostHistoryItem {
    id: string;
    post: string;
    platforms: string[];
    postDate: string;
    status?: string;
    numViews?: number;
    numLikes?: number;
    numComments?: number;
    numShares?: number;
    mediaUrls?: string[];
  }

  interface AnalyticsParams {
    startDate: string;
    endDate: string;
    platforms?: string[];
  }

  interface AnalyticsResponse {
    totalPosts?: number;
    totalViews?: number;
    totalLikes?: number;
    totalComments?: number;
    totalShares?: number;
    totalImpressions?: number;
    engagementRate?: number;
    clickThroughRate?: number;
    platformBreakdown?: {
      [platform: string]: {
        posts: number;
        views: number;
        likes: number;
        comments: number;
        shares: number;
      };
    };
    previousPeriod?: {
      totalViews?: number;
      totalLikes?: number;
      totalComments?: number;
      totalShares?: number;
      engagementRate?: number;
    };
  }

  interface UploadParams {
    file: string; // base64 encoded file
    fileName: string;
    description?: string;
  }

  interface UploadResponse {
    url: string;
    fileName: string;
    mediaId?: string;
  }

  interface JWTParams {
    domain: string;
    platforms: string[];
    privateKey?: string;
  }

  interface JWTResponse {
    url?: string;
    jwt?: string;
  }

  interface HistoryParams {
    lastRecords?: number;
    lastKey?: string;
    platform?: string;
  }

  interface DeleteResponse {
    status: string;
    success: boolean;
  }

  class SocialPost {
    constructor(apiKey: string);

    // Core posting functionality
    post(data: PostData): Promise<PostResponse>;
    
    // Profile management
    getProfiles(): Promise<{ profiles: ProfileData[] }>;
    
    // Authentication
    generateJWT(params: JWTParams): Promise<JWTResponse>;
    
    // Post history and management
    getHistory(params?: HistoryParams): Promise<HistoryResponse>;
    deletePost(postId: string): Promise<DeleteResponse>;
    
    // Analytics
    getAnalytics(params: AnalyticsParams): Promise<AnalyticsResponse>;
    
    // Media management
    upload(params: UploadParams): Promise<UploadResponse>;
    
    // Comments (if available)
    getComments?(postId: string): Promise<any>;
    setComment?(postId: string, comment: string): Promise<any>;
    
    // Direct messages (if available)
    getDirectMessages?(): Promise<any>;
    sendDirectMessage?(message: string, userId: string): Promise<any>;
  }

  export = SocialPost;
}

// Additional type exports for our application
export interface AyrshareError {
  message: string;
  status?: number;
  code?: string;
}

export interface ServiceResponse<T> {
  data?: T;
  error?: AyrshareError;
}
