import React, { useState } from 'react';
import defaultFallbackImg from '../assets/images/';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  optimizeUnsplash?: boolean;
}

// Optimizes Unsplash images by reducing quality and width for ultra-fast loading
const optimizeUrl = (url: string, optimize = true): string => {
  if (!url) return defaultFallbackImg;
  if (optimize && url.includes('images.unsplash.com')) {
    if (!url.includes('q=')) {
      url += '&q=70';
    } else {
      url = url.replace(/q=\d+/, 'q=70');
    }
    if (!url.includes('auto=')) {
      url += '&auto=format';
    }
  }
  return url;
};

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = defaultFallbackImg,
  optimizeUnsplash = true,
  onError,
  onLoad,
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  const initialUrl = optimizeUrl(src || fallbackSrc, optimizeUnsplash);
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className.includes('rounded') ? '' : ''}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/20 dark:bg-slate-700/30 animate-pulse rounded-[inherit]" />
      )}
      <img
        {...props}
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        decoding={decoding}
        referrerPolicy="no-referrer"
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string = defaultFallbackImg) => {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
};

