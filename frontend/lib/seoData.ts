import { PlatformId } from './types';

export interface SeoLandingPageData {
  slug: string;
  platform: PlatformId;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  platformName: string;
  features: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const SEO_PAGES: Record<string, SeoLandingPageData> = {
  'instagram-reel-downloader': {
    slug: 'instagram-reel-downloader',
    platform: 'instagram',
    title: 'Free Instagram Reel & Video Downloader in HD 1080p - DownBoss.in',
    metaDescription:
      'Download Instagram reels, stories, carousel albums, and IGTV videos in 1080p Full HD without app installation. Fast, 100% free, and no login required.',
    h1: 'Instagram Reel & Carousel Downloader',
    subtitle: 'Save high-definition reels, multi-slide carousels, and audio tracks directly to your phone or PC in seconds.',
    platformName: 'Instagram',
    features: [
      { title: 'Full 1080p HD Video', desc: 'Preserves the original reel bitrate and crispness without loss of quality.' },
      { title: 'Download All Carousel (ZIP)', desc: 'Extract all 10 slides from carousel albums in one click as a packaged ZIP.' },
      { title: 'MP3 Audio Extractor', desc: 'Rip trending reel audio tracks and background music cleanly into MP3 files.' }
    ],
    faqs: [
      { q: 'How do I download an Instagram Reel?', a: 'Copy the Reel link by tapping the share icon in Instagram, paste it into DownBoss, and click "Download" to choose your desired video resolution.' },
      { q: 'Can I download multi-photo Instagram carousel albums?', a: 'Yes! DownBoss extracts all images and videos from carousel posts and offers a "Download All as ZIP" button.' },
      { q: 'Do I need to log into my Instagram account?', a: 'No, DownBoss requires zero logins or personal credentials.' }
    ]
  },
  'tiktok-video-downloader': {
    slug: 'tiktok-video-downloader',
    platform: 'tiktok',
    title: 'TikTok Video Downloader Without Watermark (HD & MP3) - DownBoss.in',
    metaDescription:
      'Download TikTok videos without watermark in high definition MP4 format. Free online TikTok MP3 audio ripper. Works on iPhone, Android, and PC.',
    h1: 'TikTok Downloader (No Watermark)',
    subtitle: 'Extract crystal-clear TikTok videos without annoying logo watermarks or save trending TikTok sound clips to MP3.',
    platformName: 'TikTok',
    features: [
      { title: 'No Watermark', desc: 'Removes the floating TikTok logo watermark for a clean viewing experience.' },
      { title: 'Fast CDN Speed', desc: 'Direct high-speed media stream fetching with zero server queues.' },
      { title: 'Audio Sound Ripper', desc: 'Extract high-fidelity MP3 audio from any viral TikTok dance or soundtrack.' }
    ],
    faqs: [
      { q: 'Does this remove the TikTok watermark?', a: 'Yes! Our extraction engine streams the clean raw feed without the TikTok floating watermark whenever available.' },
      { q: 'Can I use this on iPhone or iPad?', a: 'Yes, DownBoss works in Safari, Chrome, and any modern mobile browser without requiring additional apps.' }
    ]
  },
  'youtube-video-downloader': {
    slug: 'youtube-video-downloader',
    platform: 'youtube',
    title: 'YouTube Shorts & Video Downloader in 1080p HD - DownBoss.in',
    metaDescription:
      'Free YouTube Shorts and video downloader. Save YouTube clips in 1080p, 720p MP4 or convert video to MP3 audio online.',
    h1: 'YouTube Shorts & Video Downloader',
    subtitle: 'Download trending YouTube Shorts, podcasts, and video clips in 1080p HD or extract MP3 audio effortlessly.',
    platformName: 'YouTube',
    features: [
      { title: 'Shorts & Longform', desc: 'Supports vertical 60-second YouTube Shorts as well as full-length clips.' },
      { title: 'Multi-Resolution', desc: 'Choose between 1080p HD, 720p SD, 480p, or background MP3 audio.' },
      { title: 'No Buffering or Ads', desc: 'Direct file streaming with instant attachment download trigger.' }
    ],
    faqs: [
      { q: 'Does DownBoss support YouTube Shorts?', a: 'Yes, simply paste the youtube.com/shorts/... link and click Download.' },
      { q: 'Can I download YouTube videos as MP3 audio?', a: 'Yes, select the MP3 Audio button on the preview card to download the audio track.' }
    ]
  },
  'twitter-video-downloader': {
    slug: 'twitter-video-downloader',
    platform: 'twitter',
    title: 'X (Twitter) Video & GIF Downloader - DownBoss.in',
    metaDescription:
      'Download X / Twitter videos and animated GIFs in MP4 format. Free online high-speed Twitter video downloader.',
    h1: 'X / Twitter Video Downloader',
    subtitle: 'Easily save viral tweets, sports highlights, and GIFs from X (Twitter) in original high definition.',
    platformName: 'X / Twitter',
    features: [
      { title: 'Crisp Bitrate', desc: 'Extracts the highest bitrate MP4 version available from X media servers.' },
      { title: 'GIF to MP4', desc: 'Converts looped Twitter GIFs into standard downloadable MP4 files.' },
      { title: '1-Click Direct Download', desc: 'Download right away without redirects or annoying popups.' }
    ],
    faqs: [
      { q: 'How do I download a video from X (Twitter)?', a: 'Click the share icon on the tweet, copy link to tweet, paste it into DownBoss, and click Download.' },
      { q: 'Does it work with x.com and twitter.com links?', a: 'Yes, DownBoss fully supports both modern x.com and classic twitter.com URLs.' }
    ]
  },
  'facebook-video-downloader': {
    slug: 'facebook-video-downloader',
    platform: 'facebook',
    title: 'Facebook Video & Reel Downloader in 1080p - DownBoss.in',
    metaDescription:
      'Download public Facebook videos, watch clips, and reels in Full HD MP4. Free FB video downloader online.',
    h1: 'Facebook Video & Watch Downloader',
    subtitle: 'Save public Facebook watch videos, viral reels, and group clips directly to your device storage in Full HD.',
    platformName: 'Facebook',
    features: [
      { title: 'FB Watch & Reels', desc: 'Fully compatible with both Facebook Watch links and vertical FB Reels.' },
      { title: 'Full 1080p Quality', desc: 'Download high-definition streams with full audio synchronization.' },
      { title: 'Completely Anonymous', desc: 'No login required and no activity history logged.' }
    ],
    faqs: [
      { q: 'Can I download Facebook Reels?', a: 'Yes, paste any public Facebook Reel link to generate direct download options.' },
      { q: 'Can I download private Facebook videos?', a: 'DownBoss only processes publicly accessible videos to respect user privacy.' }
    ]
  },
  'pinterest-video-downloader': {
    slug: 'pinterest-video-downloader',
    platform: 'pinterest',
    title: 'Pinterest Video & Image Downloader - DownBoss.in',
    metaDescription:
      'Download Pinterest videos, idea pins, and high-resolution photos in original quality with DownBoss.',
    h1: 'Pinterest Video & Pin Downloader',
    subtitle: 'Save aesthetic inspiration, cooking tutorials, and high-res pins from Pinterest with zero quality loss.',
    platformName: 'Pinterest',
    features: [
      { title: 'Original Resolution', desc: 'Extracts full-resolution Pinterest pins and HD videos.' },
      { title: 'Idea Pins & Videos', desc: 'Supports both standard pins and video idea pins.' },
      { title: 'Unlimited & Free', desc: 'Download as many pins as you like without restrictions.' }
    ],
    faqs: [
      { q: 'How do I download a video from Pinterest?', a: 'Copy the pin link (e.g., pinterest.com/pin/... or pin.it/...), paste it into DownBoss, and click Download.' }
    ]
  }
};
