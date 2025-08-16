import React, { memo, useCallback, useRef } from 'react';
import { Image, Video, FileText, X, Upload } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';
import { useObjectUrls } from '../../hooks/useCleanup';

interface MediaUploadProps {
  mediaFiles: File[];
  onMediaUpload: (files: File[]) => void;
  onRemoveMedia: (index: number) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const MediaUpload = memo<MediaUploadProps>(({
  mediaFiles,
  onMediaUpload,
  onRemoveMedia,
  maxFiles = 10,
  acceptedTypes = ['image/*', 'video/*'],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = maxFiles - mediaFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length > 0) {
      onMediaUpload(filesToAdd);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [mediaFiles.length, maxFiles, onMediaUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const remainingSlots = maxFiles - mediaFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length > 0) {
      onMediaUpload(filesToAdd);
    }
  }, [mediaFiles.length, maxFiles, onMediaUpload]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-soft-emerald" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-5 h-5 text-dusty-purple" />;
    }
    return <FileText className="w-5 h-5 text-warm-blue" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createImagePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-700">Media Files</h3>
        <span className="text-xs text-neutral-500">
          {mediaFiles.length}/{maxFiles} files
        </span>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-sage/50 transition-colors duration-200 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
        <p className="text-sm text-neutral-600 mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-neutral-500">
          Images, videos up to 10MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* File List */}
      {mediaFiles.length > 0 && (
        <div className="space-y-2">
          {mediaFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg group"
            >
              {/* Preview */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                {file.type.startsWith('image/') ? (
                  <OptimizedImage
                    src={createImagePreview(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveMedia(index);
                }}
                className="p-1 text-neutral-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

MediaUpload.displayName = 'MediaUpload';

export default MediaUpload;
