// Performance utilities for mobile optimization

/**
 * Preload critical images for better performance
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Lazy load images with intersection observer
 */
export const createImageObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      rootMargin: '50px 0px', // Start loading 50px before the image comes into view
      threshold: 0.1,
    }
  );
};

/**
 * Optimize image URL based on device capabilities
 */
export const getOptimizedImageUrl = (
  urls: {
    original: string;
    thumbnail: string;
    mobile: string;
    desktop: string;
  },
  preferredSize: 'thumbnail' | 'mobile' | 'desktop' = 'desktop'
): string => {
  // Check if we're on a mobile device
  const isMobile = window.innerWidth <= 768;
  
  // Check connection quality if available
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData
  );

  // Return appropriate image size based on device and connection
  if (isSlowConnection || (isMobile && preferredSize !== 'desktop')) {
    return urls.mobile || urls.thumbnail || urls.original;
  }
  
  if (isMobile) {
    return urls.mobile || urls.desktop || urls.original;
  }
  
  switch (preferredSize) {
    case 'thumbnail':
      return urls.thumbnail || urls.mobile || urls.original;
    case 'mobile':
      return urls.mobile || urls.thumbnail || urls.original;
    case 'desktop':
    default:
      return urls.desktop || urls.original;
  }
};

/**
 * Check if device is likely to be on a slow connection
 */
export const isSlowConnection = (): boolean => {
  const connection = (navigator as any).connection;
  
  if (!connection) {
    return false;
  }
  
  return (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true
  );
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get viewport dimensions
 */
export const getViewportDimensions = () => {
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
  };
};