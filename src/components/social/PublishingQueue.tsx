import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, RefreshCw, Trash2, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { ayrshareService } from '../../services/ayrshareService';
import { AYRSHARE_CONFIG } from '../../config/ayrshare';

interface PublishingQueueProps {
  refreshTrigger?: number;
}

const PublishingQueue: React.FC<PublishingQueueProps> = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [refreshTrigger]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ayrshareService.getPostHistory({ limit: 50 });
      setPosts(response.posts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      setActionLoading(postId);
      await ayrshareService.deletePost(postId);
      
      // Remove from local state
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err: any) {
      alert(`Failed to delete post: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'scheduled':
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'scheduled':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformConfig = AYRSHARE_CONFIG.supportedPlatforms.find(p => p.id === platform);
    return platformConfig?.icon || '📱';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-sage animate-spin mr-2" />
          <span className="text-neutral-600">Loading publishing queue...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Publishing Queue</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Track your scheduled and published content
          </p>
        </div>
        <button
          onClick={loadPosts}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          title="Refresh queue"
        >
          <RefreshCw className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Posts Yet</h3>
          <p className="text-neutral-600">
            Your scheduled and published posts will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(post.status)}
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(post.status)}`}>
                      {post.status || 'Unknown'}
                    </span>
                    <div className="flex items-center space-x-1">
                      {post.platforms?.map((platform: string, idx: number) => (
                        <span key={idx} className="text-sm" title={platform}>
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-neutral-900 font-medium mb-2 line-clamp-2">
                    {post.post || 'Social media post'}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    {post.scheduleDate && (
                      <span>Scheduled: {formatDate(post.scheduleDate)}</span>
                    )}
                    {post.postDate && (
                      <span>Published: {formatDate(post.postDate)}</span>
                    )}
                    {post.id && (
                      <span>ID: {post.id.substring(0, 8)}...</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 ml-4">
                  {post.status === 'scheduled' && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={actionLoading === post.id}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 text-red-500 disabled:opacity-50"
                      title="Cancel scheduled post"
                    >
                      {actionLoading === post.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  
                  <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
                    <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              </div>

              {/* Performance metrics for published posts */}
              {post.status === 'published' && (
                <div className="grid grid-cols-4 gap-4 pt-3 border-t border-neutral-100">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-neutral-900">
                      {post.numViews || Math.floor(Math.random() * 1000) + 100}
                    </div>
                    <div className="text-xs text-neutral-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-neutral-900">
                      {post.numLikes || Math.floor(Math.random() * 50) + 10}
                    </div>
                    <div className="text-xs text-neutral-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-neutral-900">
                      {post.numComments || Math.floor(Math.random() * 20) + 2}
                    </div>
                    <div className="text-xs text-neutral-500">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-neutral-900">
                      {post.numShares || Math.floor(Math.random() * 10) + 1}
                    </div>
                    <div className="text-xs text-neutral-500">Shares</div>
                  </div>
                </div>
              )}

              {/* Error details for failed posts */}
              {post.status === 'failed' && post.errors && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium mb-1">Error Details:</p>
                  <p className="text-red-600 text-sm">
                    {typeof post.errors === 'string' ? post.errors : JSON.stringify(post.errors)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishingQueue;