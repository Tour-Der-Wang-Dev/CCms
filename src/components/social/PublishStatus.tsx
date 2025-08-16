import React, { memo } from 'react';
import { Check, Clock, AlertCircle, ExternalLink } from 'lucide-react';

interface PublishStatusProps {
  isPublishing: boolean;
  publishResult: any;
  error: string | null;
  onClose: () => void;
}

const PublishStatus = memo<PublishStatusProps>(({
  isPublishing,
  publishResult,
  error,
  onClose,
}) => {
  if (isPublishing) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Publishing...</h3>
        <p className="text-neutral-600">Please wait while we post to your selected platforms</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Publishing Failed</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (publishResult) {
    const isScheduled = publishResult.scheduleDate || publishResult.postDate;
    
    return (
      <div className="text-center py-8">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isScheduled ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          {isScheduled ? (
            <Clock className="w-6 h-6 text-blue-600" />
          ) : (
            <Check className="w-6 h-6 text-green-600" />
          )}
        </div>
        
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          {isScheduled ? 'Post Scheduled!' : 'Published Successfully!'}
        </h3>
        
        <p className="text-neutral-600 mb-4">
          {isScheduled 
            ? `Your post will be published at the scheduled time`
            : `Your content has been posted to the selected platforms`
          }
        </p>

        {/* Platform Results */}
        {publishResult.platforms && (
          <div className="space-y-2 mb-6">
            {publishResult.platforms.map((platform: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {platform.platform === 'facebook' && '📘'}
                    {platform.platform === 'instagram' && '📷'}
                    {platform.platform === 'x' && '🐦'}
                    {platform.platform === 'linkedin' && '💼'}
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {platform.platform}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {platform.status === 'success' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : platform.status === 'scheduled' ? (
                    <Clock className="w-4 h-4 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  
                  {platform.postUrl && (
                    <a
                      href={platform.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage hover:text-sage/80 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors duration-200"
          >
            Done
          </button>
          
          {publishResult.postId && (
            <a
              href={`/analytics?postId=${publishResult.postId}`}
              className="px-6 py-2 border border-sage text-sage rounded-lg hover:bg-sage/5 transition-colors duration-200"
            >
              View Analytics
            </a>
          )}
        </div>
      </div>
    );
  }

  return null;
});

PublishStatus.displayName = 'PublishStatus';

export default PublishStatus;
