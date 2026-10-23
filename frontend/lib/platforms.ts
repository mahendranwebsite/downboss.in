import { PlatformId } from './types';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  iconName: string;
  colorClass: string;
  badgeBg: string;
  placeholder: string;
  domainKeywords: string[];
  isComingSoon?: boolean;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'all',
    name: 'All',
    iconName: 'Globe',
    colorClass: 'text-indigo-500',
    badgeBg: 'bg-indigo-600',
    placeholder: 'Paste video or photo link here (e.g. instagram.com/p/..., x.com/...)',
    domainKeywords: []
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    iconName: 'Twitter',
    colorClass: 'text-twitter',
    badgeBg: 'bg-twitter',
    placeholder: 'Paste X (Twitter) video or post link (e.g. x.com/user/status/...)',
    domainKeywords: ['x.com', 'twitter.com']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    iconName: 'Instagram',
    colorClass: 'text-pink-500',
    badgeBg: 'instagram-gradient',
    placeholder: 'Paste Instagram Reel, Post, or Carousel link (e.g. instagram.com/reel/...)',
    domainKeywords: ['instagram.com', 'instagr.am']
  },
  {
    id: 'facebook',
    name: 'Facebook',
    iconName: 'Facebook',
    colorClass: 'text-facebook',
    badgeBg: 'bg-facebook',
    placeholder: 'Paste Facebook video or watch link (e.g. facebook.com/watch/?v=...)',
    domainKeywords: ['facebook.com', 'fb.watch', 'fb.com']
  },
  {
    id: 'youtube',
    name: 'YouTube',
    iconName: 'Youtube',
    colorClass: 'text-red-500',
    badgeBg: 'bg-red-600',
    placeholder: 'Paste YouTube video or Shorts link (e.g. youtube.com/watch?v=...)',
    domainKeywords: ['youtube.com', 'youtu.be'],
    isComingSoon: false
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    iconName: 'Music',
    colorClass: 'text-cyan-400',
    badgeBg: 'bg-cyan-500',
    placeholder: 'Paste TikTok video link (e.g. tiktok.com/@user/video/...)',
    domainKeywords: ['tiktok.com']
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    iconName: 'Pin',
    colorClass: 'text-red-600',
    badgeBg: 'bg-red-700',
    placeholder: 'Paste Pinterest Pin link (e.g. pinterest.com/pin/...)',
    domainKeywords: ['pinterest.com', 'pin.it']
  },
  {
    id: 'reddit',
    name: 'Reddit',
    iconName: 'MessageSquare',
    colorClass: 'text-orange-500',
    badgeBg: 'bg-orange-600',
    placeholder: 'Paste Reddit video post link (e.g. reddit.com/r/.../comments/...)',
    domainKeywords: ['reddit.com', 'redd.it']
  },
  {
    id: 'threads',
    name: 'Threads',
    iconName: 'AtSign',
    colorClass: 'text-gray-400',
    badgeBg: 'bg-gray-800',
    placeholder: 'Paste Threads video or photo post link (e.g. threads.net/@...)',
    domainKeywords: ['threads.net']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    iconName: 'Linkedin',
    colorClass: 'text-blue-600',
    badgeBg: 'bg-blue-700',
    placeholder: 'Paste LinkedIn post or video link (e.g. linkedin.com/posts/...)',
    domainKeywords: ['linkedin.com']
  }
];

export const SAMPLE_LINKS = [
  {
    label: 'X Video',
    url: 'https://x.com/tech_insider/status/1789123456789',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
  },
  {
    label: 'Insta Reel',
    url: 'https://www.instagram.com/reel/C7X90123ABC/',
    badgeClass: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400'
  },
  {
    label: 'FB Video',
    url: 'https://www.facebook.com/watch/?v=987654321012',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
  },
  {
    label: 'Insta Carousel (6 Slides)',
    url: 'https://www.instagram.com/p/carousel_kyoto_album/',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
  },
  {
    label: 'TikTok Video',
    url: 'https://www.tiktok.com/@sample_traveler/video/7391234567890123456',
    badgeClass: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400'
  }
];

export function detectPlatformFromUrl(url: string): PlatformId {
  const urlLower = url.toLowerCase();
  for (const p of PLATFORMS) {
    if (p.id === 'all') continue;
    if (p.domainKeywords.some(kw => urlLower.includes(kw))) {
      return p.id;
    }
  }
  return 'all';
}
