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
  youtube_playlist: {
    title: 'Billboard Top Viral Hits 2026 (Global Music Video Playlist)',
    author: '@YouTubeMusic',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    duration: '6 Videos',
    platform: 'youtube',
    type: 'YouTube Playlist',
    is_carousel: false,
    is_playlist: true,
    playlist_count: 6,
    playlist_items: [
      {
        id: 'pl-item-1',
        title: 'Cyberpunk 2077 Night City 4K Cinematic Atmosphere Tour',
        duration: '4:12',
        duration_seconds: 252,
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/watch?v=sample_vid_1',
        author: '@GamerVision',
        index: 1
      },
      {
        id: 'pl-item-2',
        title: 'Midnight Chillout Lofi Beats - Study & Relaxation Session',
        duration: '3:45',
        duration_seconds: 225,
        thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/watch?v=sample_vid_2',
        author: '@LofiVibes',
        index: 2
      },
      {
        id: 'pl-item-3',
        title: 'Neon Dreams Synthwave Horizon (Official 4K Music Video)',
        duration: '5:18',
        duration_seconds: 318,
        thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/watch?v=sample_vid_3',
        author: '@RetroWaveRecords',
        index: 3
      },
      {
        id: 'pl-item-4',
        title: 'Tokyo Rainy Day Walking Tour in 4K 60FPS Ambient Audio',
        duration: '6:30',
        duration_seconds: 390,
        thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/watch?v=sample_vid_4',
        author: '@TokyoWanderer',
        index: 4
      },
      {
        id: 'pl-item-5',
        title: 'Electronic Deep Bass Groove - Club Mix Vol. 4',
        duration: '4:05',
        duration_seconds: 245,
        thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/watch?v=sample_vid_5',
        author: '@BassDropMusic',
        index: 5
      },
      {
        id: 'pl-item-6',
        title: 'Acoustic Sunset Guitar Melodies - Live Studio Session',
        duration: '3:52',
        duration_seconds: 232,
        thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/watch?v=sample_vid_6',
        author: '@AcousticSession',
        index: 6
      }
    ],
    items: [],
    formats: [
      { quality: '1080p HD', res: '1080p', size: 'Full HD', ext: 'mp4', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
      { quality: '720p HD', res: '720p', size: 'High Speed', ext: 'mp4', url: 'https://media.w3.org/2010/05/bunny/trailer.mp4' },
      { quality: '480p Low', res: '480p', size: 'Compressed', ext: 'mp4', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
      { quality: 'MP3 Audio', res: 'MP3', size: 'Audio Rip', ext: 'mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
    ]
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
