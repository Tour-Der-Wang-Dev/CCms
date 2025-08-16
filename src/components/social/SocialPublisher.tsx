import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { X, Send, Calendar } from 'lucide-react';
import { SocialMediaAccount } from '../../config/ayrshare';
import { ayrshareService } from '../../services/ayrshareService';
import PlatformSelector from './PlatformSelector';
import MediaUpload from './MediaUpload';
import PublishStatus from './PublishStatus';

interface SocialPublisherProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: {
    title: string;
    description: string;
    scheduledDate?: string;
    scheduledTime?: string;
  };
}

const SocialPublisher = memo<SocialPublisherProps>(({ isOpen, onClose, initialContent }) => {
  // State management
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<SocialMediaAccount[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoized values
  const characterCount = useMemo(() => content.length, [content]);
  const isScheduled = useMemo(() => scheduleDate && scheduleTime, [scheduleDate, scheduleTime]);
  const canPublish = useMemo(() => 
    content.trim() && selectedPlatforms.length > 0 && !isPublishing,
    [content, selectedPlatforms.length, isPublishing]
  );

  // Load connected accounts when modal opens
  useEffect(() => {
    if (isOpen) {
      loadConnectedAccounts();
      resetForm();
      
      // Pre-fill with initial content if provided
      if (initialContent) {
        setContent(`${initialContent.title}\n\n${initialContent.description}`);
        if (initialContent.scheduledDate) setScheduleDate(initialContent.scheduledDate);
        if (initialContent.scheduledTime) setScheduleTime(initialContent.scheduledTime);
      }
    }
  }, [isOpen, initialContent]);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      mediaFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, [mediaFiles]);

  const resetForm = useCallback(() => {
    setContent('');
    setSelectedPlatforms([]);
    setScheduleDate('');
    setScheduleTime('');
    setMediaFiles([]);
    setPublishResult(null);
    setError(null);
  }, []);

  const loadConnectedAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ayrshareService.getConnectedAccounts();
      
      // Filter to only connected accounts
      const accounts = response.profiles?.map((profile: any) => ({
        platform: profile.platform,
        platformName: profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1),
        username: profile.username || '',
        profileId: profile.profileKey || '',
        isConnected: true,
      })) || [];

      setConnectedAccounts(accounts);
    } catch (err) {
      setError('Failed to load connected accounts');
      console.error('Failed to load accounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePlatformToggle = useCallback((platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  }, []);

  const handleMediaUpload = useCallback((newFiles: File[]) => {
    setMediaFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveMedia = useCallback((index: number) => {
    setMediaFiles(prev => {
      const fileToRemove = prev[index];
      // Clean up object URL if it's an image
      if (fileToRemove?.type.startsWith('image/')) {
        URL.revokeObjectURL(URL.createObjectURL(fileToRemove));
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handlePublish = useCallback(async () => {
    if (!canPublish) return;

    setIsPublishing(true);
    setError(null);

    try {
      // Upload media files first
      const mediaUrls = [];
      for (const file of mediaFiles) {
        try {
          const uploadResult = await ayrshareService.uploadMedia(file);
          if (uploadResult.url) {
            mediaUrls.push(uploadResult.url);
          }
        } catch (uploadError) {
          console.warn('Failed to upload media:', uploadError);
        }
      }

      // Prepare post data
      const postData: any = {
        post: content,
        platforms: selectedPlatforms,
      };

      if (mediaUrls.length > 0) {
        postData.mediaUrls = mediaUrls;
      }

      if (isScheduled) {
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        postData.scheduleDate = scheduledDateTime.toISOString();
      }

      // Publish the post
      const result = await ayrshareService.createPost(postData);
      setPublishResult(result);
      
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setIsPublishing(false);
    }
  }, [canPublish, content, selectedPlatforms, mediaFiles, isScheduled, scheduleDate, scheduleTime]);

  const handleClose = useCallback(() => {
    if (!isPublishing) {
      onClose();
    }
  }, [isPublishing, onClose]);

  if (!isOpen) return null;

  // Show publish status if publishing, has result, or error
  if (isPublishing || publishResult || error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <PublishStatus
              isPublishing={isPublishing}
              publishResult={publishResult}
              error={error}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Create Post</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Content Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-neutral-700">Content</label>
              <span className={`text-xs ${characterCount > 280 ? 'text-red-500' : 'text-neutral-500'}`}>
                {characterCount}/280
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full h-32 p-3 border border-neutral-200 rounded-xl resize-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
            />
          </div>

          {/* Platform Selection */}
          <PlatformSelector
            connectedAccounts={connectedAccounts}
            selectedPlatforms={selectedPlatforms}
            onPlatformToggle={handlePlatformToggle}
            loading={loading}
          />

          {/* Media Upload */}
          <MediaUpload
            mediaFiles={mediaFiles}
            onMediaUpload={handleMediaUpload}
            onRemoveMedia={handleRemoveMedia}
          />

          {/* Schedule */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <h3 className="text-sm font-medium text-neutral-700">Schedule (Optional)</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
              />
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-200">
          <div className="text-sm text-neutral-600">
            {isScheduled ? 'Post will be scheduled' : 'Post will be published immediately'}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              onClick={handlePublish}
              disabled={!canPublish}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                canPublish
                  ? 'bg-sage text-white hover:bg-sage/90 shadow-soft'
                  : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isScheduled ? 'Schedule' : 'Publish'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

SocialPublisher.displayName = 'SocialPublisher';

export default SocialPublisher;
