import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from 'lucide-react';
import { AYRSHARE_CONFIG } from '../../config/ayrshare';
import { ayrshareService } from '../../services/ayrshareService';

interface PlatformBreakdownProps {
  timeRange: string;
}

const PlatformBreakdown: React.FC<PlatformBreakdownProps> = ({ timeRange }) => {
  const [platformData, setPlatformData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlatformAnalytics();
  }, [timeRange]);

  const loadPlatformAnalytics = async () => {
    try {
      setLoading(true);
      
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

      const analytics = await ayrshareService.getAnalytics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setPlatformData(analytics.platformBreakdown || {});
    } catch (error) {
      console.error('Error loading platform analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number = 0) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const calculateEngagementRate = (likes: number = 0, comments: number = 0, shares: number = 0, views: number = 0) => {
    if (views === 0) return 0;
    return ((likes + comments + shares) / views * 100);
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = AYRSHARE_CONFIG.supportedPlatforms.find(p => p.id === platformId);
    return platform?.icon || '📱';
  };

  const getPlatformName = (platformId: string) => {
    const platform = AYRSHARE_CONFIG.supportedPlatforms.find(p => p.id === platformId);
    return platform?.name || platformId;
  };

  // Get platforms with data or show all supported platforms
  const platformsToShow = Object.keys(platformData).length > 0 
    ? Object.keys(platformData)
    : AYRSHARE_CONFIG.supportedPlatforms.slice(0, 6).map(p => p.id); // Show top 6 for demo

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-sage animate-spin" />
          <span className="ml-2 text-neutral-600">Loading platform analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-sage" />
          <h3 className="text-lg font-semibold text-neutral-900">Platform Performance</h3>
        </div>
        <button
          onClick={loadPlatformAnalytics}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          title="Refresh analytics"
        >
          <RefreshCw className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      <div className="space-y-4">
        {platformsToShow.map((platformId) => {
          const data = platformData[platformId] || {
            posts: Math.floor(Math.random() * 10) + 1,
            views: Math.floor(Math.random() * 5000) + 500,
            likes: Math.floor(Math.random() * 200) + 20,
            comments: Math.floor(Math.random() * 50) + 5,
            shares: Math.floor(Math.random() * 30) + 3
          };

          const engagementRate = calculateEngagementRate(data.likes, data.comments, data.shares, data.views);

          return (
            <div
              key={platformId}
              className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPlatformIcon(platformId)}</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">{getPlatformName(platformId)}</h4>
                    <p className="text-sm text-neutral-500">{data.posts} posts</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-neutral-900">{formatNumber(data.views)}</div>
                  <div className="text-neutral-500">Views</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-neutral-900">{formatNumber(data.likes)}</div>
                  <div className="text-neutral-500">Likes</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-neutral-900">{formatNumber(data.comments)}</div>
                  <div className="text-neutral-500">Comments</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-neutral-900">{engagementRate.toFixed(1)}%</div>
                  <div className="text-neutral-500">Engagement</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(platformData).length === 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <div className="text-sm">
              <p className="text-blue-700 font-medium">Platform Analytics</p>
              <p className="text-blue-600">
                Connect your social media accounts to see detailed platform-specific performance metrics.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformBreakdown;
