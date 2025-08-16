import React, { useState, useRef, useEffect, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  placeholder,
  quality = 80,
  sizes,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Optimize image URL for better performance
  const getOptimizedSrc = (originalSrc: string, w?: number, h?: number, q?: number) => {
    if (!originalSrc) return '';
    
    // For external services like Unsplash, add optimization parameters
    if (originalSrc.includes('unsplash.com') || originalSrc.includes('pexels.com')) {
      const url = new URL(originalSrc);
      
      if (w) url.searchParams.set('w', w.toString());
      if (h) url.searchParams.set('h', h.toString());
      if (q && originalSrc.includes('unsplash.com')) {
        url.searchParams.set('q', q.toString());
      }
      
      // Add auto compression and format
      url.searchParams.set('auto', 'compress');
      url.searchParams.set('cs', 'tinysrgb');
      
      return url.toString();
    }
    
    return originalSrc;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (originalSrc: string) => {
    if (!originalSrc.includes('unsplash.com') && !originalSrc.includes('pexels.com')) {
      return undefined;
    }

    const breakpoints = [320, 640, 768, 1024, 1280, 1536];
    return breakpoints
      .map(bp => `${getOptimizedSrc(originalSrc, bp, undefined, quality)} ${bp}w`)
      .join(', ');
  };

  const optimizedSrc = getOptimizedSrc(src, width, height, quality);
  const srcSet = generateSrcSet(src);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Placeholder component
  const PlaceholderContent = () => (
    <div className={`bg-neutral-100 animate-pulse flex items-center justify-center ${className}`}>
      {placeholder ? (
        <img src={placeholder} alt="" className="w-full h-full object-cover opacity-50" />
      ) : (
        <div className="w-8 h-8 bg-neutral-300 rounded" />
      )}
    </div>
  );

  // Error fallback
  if (hasError) {
    return (
      <div className={`bg-neutral-100 flex items-center justify-center ${className}`}>
        <div className="text-neutral-400 text-sm">Failed to load image</div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder shown while loading */}
      {!isLoaded && <PlaceholderContent />}
      
      {/* Actual image */}
      {(isInView || loading === 'eager') && (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
