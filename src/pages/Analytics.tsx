import React, { useState } from 'react';
import { TrendingUp, BarChart3, Calendar, Download } from 'lucide-react';
import MetricsOverview from '../components/analytics/MetricsOverview';
import ContentPerformance from '../components/analytics/ContentPerformance';
import ChannelAnalytics from '../components/analytics/ChannelAnalytics';
import PlanningInsights from '../components/analytics/PlanningInsights';
import SocialAnalytics from '../components/analytics/SocialAnalytics';
import PlatformBreakdown from '../components/analytics/PlatformBreakdown';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const handleExport = async () => {
    try {
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

      // Import the ayrshareService at the top level
      const { ayrshareService } = await import('../services/ayrshareService');

      // Get comprehensive analytics data
      const [analytics, postHistory] = await Promise.all([
        ayrshareService.getAnalytics({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
        ayrshareService.getPostHistory({ limit: 100 })
      ]);

      // Prepare CSV data
      const csvData = [
        ['Metric', 'Value', 'Previous Period', 'Change %'],
        ['Total Views', analytics.totalViews || 0, analytics.previousPeriod?.totalViews || 0, ''],
        ['Total Likes', analytics.totalLikes || 0, analytics.previousPeriod?.totalLikes || 0, ''],
        ['Total Comments', analytics.totalComments || 0, analytics.previousPeriod?.totalComments || 0, ''],
        ['Total Shares', analytics.totalShares || 0, analytics.previousPeriod?.totalShares || 0, ''],
        ['Engagement Rate', `${analytics.engagementRate || 0}%`, `${analytics.previousPeriod?.engagementRate || 0}%`, ''],
        [''],
        ['Platform Breakdown'],
        ['Platform', 'Posts', 'Views', 'Likes', 'Comments', 'Shares', 'Engagement Rate'],
      ];

      // Add platform data
      Object.entries(analytics.platformBreakdown || {}).forEach(([platform, data]: [string, any]) => {
        const engagementRate = data.views > 0
          ? ((data.likes + data.comments + data.shares) / data.views * 100).toFixed(1)
          : '0.0';

        csvData.push([
          platform.charAt(0).toUpperCase() + platform.slice(1),
          data.posts?.toString() || '0',
          data.views?.toString() || '0',
          data.likes?.toString() || '0',
          data.comments?.toString() || '0',
          data.shares?.toString() || '0',
          `${engagementRate}%`
        ]);
      });

      // Convert to CSV string
      const csvContent = csvData.map(row =>
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Also offer JSON export
      const jsonData = {
        exportDate: new Date().toISOString(),
        timeRange,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        summary: analytics,
        postHistory: postHistory.posts || []
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const jsonLink = document.createElement('a');
      const jsonUrl = URL.createObjectURL(jsonBlob);

      jsonLink.setAttribute('href', jsonUrl);
      jsonLink.setAttribute('download', `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`);
      jsonLink.style.visibility = 'hidden';

      document.body.appendChild(jsonLink);
      jsonLink.click();
      document.body.removeChild(jsonLink);

      alert(`Analytics data exported successfully!\n- CSV: Metrics and platform breakdown\n- JSON: Complete data export`);

    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export analytics data. Please try again.');
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Content Analytics</h1>
          <p className="text-neutral-600">Track performance and gain insights for better content planning</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleExport}
            className="px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview timeRange={timeRange} />

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <SocialAnalytics timeRange={timeRange} />
          <PlatformBreakdown timeRange={timeRange} />
          <ContentPerformance />
          <ChannelAnalytics />
        </div>

        <div>
          <PlanningInsights />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
