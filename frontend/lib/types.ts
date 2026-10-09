export interface MediaFormat {
  quality: string;
  res: string;
  size: string;
  ext: string;
  url: string;
}

export interface CarouselItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  caption?: string;
}

export interface MediaData {
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  platform: string;
  type: string;
  is_carousel: boolean;
  items: CarouselItem[];
  formats: MediaFormat[];
  originalUrl: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  platform: string;
  quality: string;
  timestamp: string;
  date: string;
  url?: string;
}

export type PlatformId =
  | 'all'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'reddit'
  | 'threads'
  | 'linkedin'
  | 'snapchat';
