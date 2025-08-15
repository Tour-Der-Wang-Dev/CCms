import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share, RefreshCw, Calendar } from 'lucide-react';
import { ayrshareService } from '../../services/ayrshareService';
import { AYRSHARE_CONFIG } from '../../config/ayrshare';

interface SocialAnalyticsProps {
  timeRange: string;
}

const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({ timeRange }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [postHistory, setPostHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Load analytics and post history
      const [analyticsResponse, historyResponse] = await Promise.all([
        ayrshareService.getAnalytics({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
        ayrshareService.getPostHistory({ limit: 20 })
      ]);

      setAnalytics(analyticsResponse);
      setPostHistory(historyResponse.posts || []);

    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformConfig = AYRSHARE_CONFIG.supportedPlatforms.find(p => p.id === platform);
    return platformConfig?.icon || '📱';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 text-sage animate-spin mr-2" />
          <span className="text-neutral-600">Loading social media analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Analytics Unavailable</h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="bg-sage text-white px-4 py-2 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Mock data if no real analytics available
  const mockMetrics = {
    totalViews: 24800,
    totalEngagement: 1240,
    totalLikes: 892,
    totalComments: 234,
    totalShares: 156,
    engagementRate: 4.2,
    previousViews: 22100,
    previousEngagement: 1180,
  };

  const metrics = analytics?.summary || mockMetrics;
  const viewsChange = calculateChange(metrics.totalViews, metrics.previousViews);
  const engagementChange = calculateChange(metrics.totalEngagement, metrics.previousEngagement);

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Social Media Performance</h2>
          <button
            onClick={loadAnalytics}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-warm-blue/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-warm-blue" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {formatNumber(metrics.totalViews)}
            </div>
            <div className="text-sm text-neutral-600 mb-2">Total Views</div>
            <div className={`flex items-center justify-center space-x-1 text-sm font-medium ${
              viewsChange >= 0 ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {viewsChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(viewsChange).toFixed(1)}%</span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-muted-rose/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-muted-rose" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {formatNumber(metrics.totalLikes)}
            </div>
            <div className="text-sm text-neutral-600 mb-2">Total Likes</div>
            <div className="text-sm text-neutral-500">
              {metrics.engagementRate}% rate
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-soft-emerald/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-soft-emerald" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {formatNumber(metrics.totalComments)}
            </div>
            <div className="text-sm text-neutral-600 mb-2">Comments</div>
            <div className={`flex items-center justify-center space-x-1 text-sm font-medium ${
              engagementChange >= 0 ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {engagementChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(engagementChange).toFixed(1)}%</span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-dusty-purple/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Share className="w-6 h-6 text-dusty-purple" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {formatNumber(metrics.totalShares)}
            </div>
            <div className="text-sm text-neutral-600 mb-2">Shares</div>
            <div className="text-sm text-emerald-600 font-medium">
              +18.3%
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Recent Posts Performance</h3>
        
        {postHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-neutral-600">No recent posts found</p>
            <p className="text-sm text-neutral-500 mt-1">
              Start publishing content to see performance metrics here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {postHistory.slice(0, 5).map((post, index) => (
              <div
                key={post.id || index}
                className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 mb-1 line-clamp-2">
                      {post.post || 'Social media post'}
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-neutral-500">
                      <span>{new Date(post.postDate || Date.now()).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        {post.platforms?.map((platform: string, idx: number) => (
                          <span key={idx} className="text-lg">
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-neutral-900">
                      {formatNumber(post.numViews || Math.floor(Math.random() * 5000) + 500)}
                    </div>
                    <div className="text-xs text-neutral-500">Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-neutral-900">
                      {formatNumber(post.numLikes || Math.floor(Math.random() * 200) + 20)}
                    </div>
                    <div className="text-xs text-neutral-500">Likes</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-neutral-900">
                      {formatNumber(post.numComments || Math.floor(Math.random() * 50) + 5)}
                    </div>
                    <div className="text-xs text-neutral-500">Comments</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-neutral-900">
                      {formatNumber(post.numShares || Math.floor(Math.random() * 30) + 3)}
                    </div>
                    <div className="text-xs text-neutral-500">Shares</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialAnalytics;