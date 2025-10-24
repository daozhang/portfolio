// Sharing utilities for social platforms including WeChat

export interface ShareData {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}

/**
 * Check if we're in WeChat browser
 */
export const isWeChatBrowser = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('micromessenger');
};

/**
 * Check if we're on a mobile device
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Native Web Share API
 */
export const shareWithWebAPI = async (data: ShareData): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
};

/**
 * Copy to clipboard fallback
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * WeChat-specific sharing instructions
 */
export const showWeChatShareInstructions = (data: ShareData): void => {
  const message = `
    To share this portfolio in WeChat:
    1. Copy this link: ${data.url}
    2. Open WeChat
    3. Paste the link in a chat or Moments
    
    The link has been copied to your clipboard.
  `;
  
  alert(message);
};

/**
 * Share to specific platforms
 */
export const shareToTwitter = (data: ShareData): void => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
};

export const shareToFacebook = (data: ShareData): void => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
  window.open(facebookUrl, '_blank', 'width=550,height=420');
};

export const shareToLinkedIn = (data: ShareData): void => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;
  window.open(linkedInUrl, '_blank', 'width=550,height=420');
};

/**
 * Universal share function that tries different methods
 */
export const universalShare = async (data: ShareData): Promise<void> => {
  // Try Web Share API first (works on mobile)
  const webShareSuccess = await shareWithWebAPI(data);
  if (webShareSuccess) {
    return;
  }

  // Copy to clipboard as fallback
  const copySuccess = await copyToClipboard(data.url);
  
  if (isWeChatBrowser()) {
    showWeChatShareInstructions(data);
  } else if (copySuccess) {
    // Show a simple notification
    if (isMobileDevice()) {
      alert('Portfolio link copied to clipboard!');
    } else {
      // For desktop, you might want to show a toast notification
      console.log('Portfolio link copied to clipboard!');
      alert('Portfolio link copied to clipboard!');
    }
  } else {
    alert('Unable to share. Please copy this link manually: ' + data.url);
  }
};

/**
 * Generate WeChat-optimized meta tags
 */
export const generateWeChatMetaTags = (data: ShareData) => {
  return {
    // WeChat-specific meta tags
    'wechat:card': 'summary_large_image',
    'wechat:title': data.title,
    'wechat:description': data.text,
    'wechat:image': data.imageUrl || '',
    
    // Standard Open Graph tags (also used by WeChat)
    'og:type': 'website',
    'og:title': data.title,
    'og:description': data.text,
    'og:url': data.url,
    'og:image': data.imageUrl || '',
    'og:image:width': '1200',
    'og:image:height': '630',
    
    // Twitter Card tags
    'twitter:card': 'summary_large_image',
    'twitter:title': data.title,
    'twitter:description': data.text,
    'twitter:image': data.imageUrl || '',
  };
};