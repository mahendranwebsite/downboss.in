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

export interface PlaylistItem {
  id: string;
  title: string;
  duration: string;
  duration_seconds?: number;
  thumbnail: string;
  url: string;
  author: string;
  index: number;
}

export interface MediaData {
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  platform: string;
  type: string;
  is_carousel: boolean;
  is_playlist?: boolean;
  playlist_count?: number;
  playlist_items?: PlaylistItem[];
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
  | 'youtube-playlist'
  | 'tiktok'
  | 'pinterest'
  | 'reddit'
  | 'threads'
  | 'linkedin'
  | 'snapchat';
