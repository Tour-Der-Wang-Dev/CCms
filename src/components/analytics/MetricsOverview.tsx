import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share, BarChart3, MousePointer } from 'lucide-react';
import { ayrshareService } from '../../services/ayrshareService';

interface MetricsOverviewProps {
  timeRange: string;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ timeRange }) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);

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

      const analytics = await ayrshareService.getAnalytics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
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

  // Use mock data if no real data available
  const data = analyticsData || {
    totalViews: 24800,
    totalLikes: 1240,
    totalComments: 234,
    totalShares: 156,
    totalImpressions: 45600,
    engagementRate: 4.2,
    clickThroughRate: 2.1,
    previousPeriod: {
      totalViews: 22100,
      totalLikes: 1180,
      totalComments: 198,
      totalShares: 134,
      engagementRate: 3.8
    }
  };

  const metrics = [
    {
      label: 'Total Views',
      value: formatNumber(data.totalViews),
      change: calculateChange(data.totalViews, data.previousPeriod?.totalViews || 0),
      icon: Eye,
      color: 'text-warm-blue',
    },
    {
      label: 'Engagement Rate',
      value: `${data.engagementRate.toFixed(1)}%`,
      change: calculateChange(data.engagementRate, data.previousPeriod?.engagementRate || 0),
      icon: Heart,
      color: 'text-muted-rose',
    },
    {
      label: 'Comments',
      value: formatNumber(data.totalComments),
      change: calculateChange(data.totalComments, data.previousPeriod?.totalComments || 0),
      icon: MessageCircle,
      color: 'text-soft-emerald',
    },
    {
      label: 'Shares',
      value: formatNumber(data.totalShares),
      change: calculateChange(data.totalShares, data.previousPeriod?.totalShares || 0),
      icon: Share,
      color: 'text-dusty-purple',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-neutral-200 rounded-xl"></div>
              <div className="w-16 h-4 bg-neutral-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-neutral-200 rounded mb-1"></div>
            <div className="w-16 h-4 bg-neutral-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              metric.change >= 0 ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {metric.change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-neutral-900 mb-1">{metric.value}</div>
          <div className="text-sm text-neutral-600">{metric.label}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;
