import { MediaData } from './types';

export const SAMPLE_MEDIA_MOCK: Record<string, MediaData> = {
  twitter: {
    title: 'Astonishing view of the Aurora Borealis in Norway nighttime sky 🌌',
    author: '@nature_wonders',
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
    duration: '0:38',
    platform: 'twitter',
    type: 'X / Twitter Video',
    is_carousel: false,
    items: [],
    formats: [
      { quality: '4K Ultra HD', res: '2160p', size: '145.0 MB', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '2K Quad HD', res: '1440p', size: '82.5 MB', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '1080p HD', res: '1080p', size: '42.5 MB', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '720p SD', res: '720p', size: '24.1 MB', ext: 'mp4', url: 'https://media.w3.org/2010/05/bunny/trailer.mp4' },
      { quality: '480p Low', res: '480p', size: '12.8 MB', ext: 'mp4', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
      { quality: 'MP3 Audio', res: 'MP3', size: '3.2 MB', ext: 'mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
    ],
    originalUrl: 'https://x.com/tech_insider/status/1789123456789'
  },
  instagram: {
    title: 'Easy 10-Minute High Protein Breakfast Recipe Reel 🍳🔥',
    author: '@chef_fitlife',
    thumbnail: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    duration: '1:15',
    platform: 'instagram',
    type: 'Instagram Reel',
    is_carousel: false,
    items: [],
    formats: [
      { quality: '1080p HD', res: '1080p', size: '38.2 MB', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '720p SD', res: '720p', size: '21.6 MB', ext: 'mp4', url: 'https://media.w3.org/2010/05/bunny/trailer.mp4' },
      { quality: '480p Low', res: '480p', size: '10.4 MB', ext: 'mp4', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
      { quality: 'MP3 Audio', res: 'MP3', size: '2.8 MB', ext: 'mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
    ],
    originalUrl: 'https://www.instagram.com/reel/C7X90123ABC/'
  },
  facebook: {
    title: 'Future of Robotics and AI Automation in 2026 Documentary',
    author: '@TechFutureNow',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    duration: '3:42',
    platform: 'facebook',
    type: 'Facebook Watch Video',
    is_carousel: false,
    items: [],
    formats: [
      { quality: '1080p HD', res: '1080p', size: '65.4 MB', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '720p SD', res: '720p', size: '34.0 MB', ext: 'mp4', url: 'https://media.w3.org/2010/05/bunny/trailer.mp4' },
      { quality: '480p Low', res: '480p', size: '18.2 MB', ext: 'mp4', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
      { quality: 'MP3 Audio', res: 'MP3', size: '4.5 MB', ext: 'mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
    ],
    originalUrl: 'https://www.facebook.com/watch/?v=987654321012'
  },
  youtube: {
    title: 'Cyberpunk 2077 Night City 4K Cinematic Atmosphere Tour',
    author: '@GamerVision',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    duration: '4:12',
    platform: 'youtube',
    type: 'YouTube Video / Short',
    is_carousel: false,
    items: [],
    formats: [
      { quality: '4K Ultra HD', res: '2160p', size: '210.0 MB', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '2K Quad HD', res: '1440p', size: '125.0 MB', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '1080p HD', res: '1080p', size: '78.0 MB', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '720p SD', res: '720p', size: '42.1 MB', ext: 'mp4', url: 'https://media.w3.org/2010/05/bunny/trailer.mp4' },
      { quality: '480p Low', res: '480p', size: '21.5 MB', ext: 'mp4', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
      { quality: 'MP3 Audio', res: 'MP3', size: '5.1 MB', ext: 'mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
    ],
    originalUrl: 'https://youtube.com/shorts/sample_short_video'
  },
  tiktok: {
    title: 'Viral Street Dance Choreography in Tokyo Shibuya Crossing 🎧🕺',
    author: '@tokyo_moves',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    duration: '0:45',
    platform: 'tiktok',
    type: 'TikTok Video (No Watermark)',
    is_carousel: false,
    items: [],
    formats: [
      { quality: '1080p HD (No Watermark)', res: '1080p', size: '28.4 MB', ext: 'mp4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { quality: '720p SD', res: '720p', size: '16.2 MB', ext: 'mp4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      { quality: 'MP3 Audio', res: 'MP3', size: '2.1 MB', ext: 'mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
    ],
    originalUrl: 'https://tiktok.com/@tokyo_moves/video/123456789'
  },
  carousel: {
    title: 'Architectural Gems of Kyoto, Japan - Photo Series 2026',
    author: '@travel_photographer',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    duration: '6 Slides',
    platform: 'instagram',
    type: 'Instagram Carousel Album',
    is_carousel: true,
    items: [
      { id: 'item-1', type: 'image', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85', thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80', caption: 'Kyoto Pagoda at Dusk' },
      { id: 'item-2', type: 'image', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85', thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80', caption: 'Tokyo Neon Alley' },
      { id: 'item-3', type: 'image', url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=85', thumbnail: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=400&q=80', caption: 'Mount Fuji Horizon' },
      { id: 'item-4', type: 'image', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85', thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80', caption: 'Bamboo Forest Path' },
      { id: 'item-5', type: 'image', url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=85', thumbnail: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=400&q=80', caption: 'Traditional Tea House' },
      { id: 'item-6', type: 'image', url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=85', thumbnail: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=400&q=80', caption: 'Shinto Torii Gate' }
    ],
    formats: [],
    originalUrl: 'https://www.instagram.com/p/carousel_kyoto_album/'
  }
};
