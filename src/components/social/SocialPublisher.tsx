import React, { useState, useEffect } from 'react';
import { X, Send, Calendar, Image, Video, FileText, AlertCircle, Check, Clock } from 'lucide-react';
import { AYRSHARE_CONFIG, SocialMediaAccount } from '../../config/ayrshare';
import { ayrshareService } from '../../services/ayrshareService';

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

const SocialPublisher: React.FC<SocialPublisherProps> = ({ isOpen, onClose, initialContent }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<SocialMediaAccount[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadConnectedAccounts();
      
      // Pre-fill with initial content if provided
      if (initialContent) {
        setContent(`${initialContent.title}\n\n${initialContent.description}`);
        if (initialContent.scheduledDate) {
          setScheduleDate(initialContent.scheduledDate);
        }
        if (initialContent.scheduledTime) {
          setScheduleTime(initialContent.scheduledTime);
        }
      }
    }
  }, [isOpen, initialContent]);

  const loadConnectedAccounts = async () => {
    try {
      setLoading(true);
      const response = await ayrshareService.getConnectedAccounts();
      
      const accounts = AYRSHARE_CONFIG.supportedPlatforms
        .map(platform => {
          const connected = response.profiles?.find((p: any) => p.platform === platform.id);
          return {
            platform: platform.id,
            platformName: platform.name,
            username: connected?.username || '',
            profileId: connected?.profileKey || '',
            isConnected: !!connected,
          };
        })
        .filter(account => account.isConnected);

      setConnectedAccounts(accounts);
    } catch (err) {
      setError('Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      setError('Please enter content to publish');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    try {
      setIsPublishing(true);
      setError(null);

      // Upload media files if any
      let uploadedMediaUrls: string[] = [...mediaUrls];
      
      for (const file of mediaFiles) {
        try {
          const uploadResult = await ayrshareService.uploadMedia(file);
          if (uploadResult.url) {
            uploadedMediaUrls.push(uploadResult.url);
          }
        } catch (uploadError) {
          console.warn('Failed to upload media file:', file.name, uploadError);
        }
      }

      // Prepare post data
      const postData: any = {
        post: content,
        platforms: selectedPlatforms,
      };

      if (uploadedMediaUrls.length > 0) {
        postData.mediaUrls = uploadedMediaUrls;
      }

      // Add schedule date if specified
      if (scheduleDate && scheduleTime) {
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        postData.scheduleDate = scheduledDateTime.toISOString();
      }

      // Publish the post
      const result = await ayrshareService.createPost(postData);
      setPublishResult(result);

      // Show success message
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to publish content');
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setSelectedPlatforms([]);
    setScheduleDate('');
    setScheduleTime('');
    setMediaFiles([]);
    setMediaUrls([]);
    setPublishResult(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getPlatformIcon = (platform: string) => {
    const platformConfig = AYRSHARE_CONFIG.supportedPlatforms.find(p => p.id === platform);
    return platformConfig?.icon || '📱';
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Publish to Social Media</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {publishResult ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-sage" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Content Published Successfully!</h3>
            <p className="text-neutral-600 mb-4">
              Your content has been {scheduleDate ? 'scheduled' : 'published'} to {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''}.
            </p>
            {publishResult.id && (
              <p className="text-sm text-neutral-500">Post ID: {publishResult.id}</p>
            )}
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Content Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What would you like to share?"
                  rows={6}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-neutral-500">
                    {content.length} characters
                  </span>
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Select Platforms ({selectedPlatforms.length} selected)
                </label>
                
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage"></div>
                    <span className="ml-2 text-neutral-600">Loading accounts...</span>
                  </div>
                ) : connectedAccounts.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-amber-700 text-sm">
                      No connected social accounts found. Please connect your accounts first.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {connectedAccounts.map((account) => (
                      <button
                        key={account.platform}
                        onClick={() => handlePlatformToggle(account.platform)}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          selectedPlatforms.includes(account.platform)
                            ? 'border-sage bg-sage/5 text-sage'
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPlatformIcon(account.platform)}</span>
                          <div className="text-left">
                            <div className="font-medium text-sm">{account.platformName}</div>
                            {account.username && (
                              <div className="text-xs opacity-75">@{account.username}</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Media (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="block w-full p-4 border-2 border-dashed border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors duration-200 cursor-pointer text-center"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Image className="w-6 h-6 text-neutral-400" />
                    <span className="text-sm text-neutral-600">
                      Click to upload images or videos
                    </span>
                  </div>
                </label>

                {mediaFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file)}
                          <span className="text-sm text-neutral-700">{file.name}</span>
                          <span className="text-xs text-neutral-500">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeMediaFile(index)}
                          className="p-1 hover:bg-neutral-200 rounded text-neutral-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Schedule Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Schedule Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-100">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !content.trim() || selectedPlatforms.length === 0}
                  className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      {scheduleDate ? <Clock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      <span>{scheduleDate ? 'Schedule Post' : 'Publish Now'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialPublisher;