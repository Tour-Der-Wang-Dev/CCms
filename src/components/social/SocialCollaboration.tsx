import React, { useState } from 'react';
import { Users, MessageCircle, CheckCircle, Clock, AlertCircle, Send, Eye } from 'lucide-react';

interface SocialCollaborationProps {
  postId?: string;
  contentTitle: string;
}

const SocialCollaboration: React.FC<SocialCollaborationProps> = ({ postId, contentTitle }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'The LinkedIn version looks great! Should we adjust the hashtags for better reach?',
      timestamp: '2 hours ago',
      type: 'comment',
    },
    {
      id: 2,
      user: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'Approved for publishing. The timing looks perfect for our audience.',
      timestamp: '1 hour ago',
      type: 'approval',
    },
    {
      id: 3,
      user: 'Emma Davis',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: 'Added visual assets to the media library. Ready for Instagram stories too.',
      timestamp: '30 minutes ago',
      type: 'update',
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      user: 'You',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: newComment,
      timestamp: 'Just now',
      type: 'comment' as const,
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleApproval = (status: 'approved' | 'rejected') => {
    setApprovalStatus(status);
    
    const approvalComment = {
      id: comments.length + 1,
      user: 'You',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      message: status === 'approved' ? 'Approved for publishing' : 'Requested changes before publishing',
      timestamp: 'Just now',
      type: 'approval' as const,
    };

    setComments(prev => [...prev, approvalComment]);
  };

  const getCommentIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'update':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Team Collaboration</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Collaborate on "{contentTitle}"
          </p>
        </div>
        
        <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getApprovalStatusColor(approvalStatus)}`}>
          <div className="flex items-center space-x-1">
            {approvalStatus === 'approved' && <CheckCircle className="w-3 h-3" />}
            {approvalStatus === 'rejected' && <AlertCircle className="w-3 h-3" />}
            {approvalStatus === 'pending' && <Clock className="w-3 h-3" />}
            <span className="capitalize">{approvalStatus}</span>
          </div>
        </div>
      </div>

      {/* Approval Actions */}
      {approvalStatus === 'pending' && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
          <h4 className="font-medium text-neutral-900 mb-3">Review & Approve</h4>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleApproval('approved')}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => handleApproval('rejected')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Request Changes</span>
            </button>
            <button className="px-4 py-2 border border-neutral-200 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200">
              Preview
            </button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-neutral-900">Discussion ({comments.length})</h4>
        
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <img
                src={comment.avatar}
                alt={comment.user}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {getCommentIcon(comment.type)}
                  <span className="font-medium text-neutral-900 text-sm">{comment.user}</span>
                  <span className="text-xs text-neutral-500">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-neutral-700">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Comment */}
      <div className="border-t border-neutral-100 pt-4">
        <div className="flex items-start space-x-3">
          <img
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
            alt="You"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <button className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-sage text-white px-3 py-1 rounded-lg font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3 h-3" />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="mt-6 pt-4 border-t border-neutral-100">
        <h4 className="font-medium text-neutral-900 mb-3">Team Members</h4>
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {[
              'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
              'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
              'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
              'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
            ].map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt=""
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <span className="text-sm text-neutral-600">4 team members</span>
        </div>
      </div>
    </div>
  );
};

export default SocialCollaboration;