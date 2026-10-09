import type { Metadata } from 'next';
import './globals.css';
import { CookieBanner } from '@/components/CookieBanner';

export const metadata: Metadata = {
  metadataBase: new URL('https://downboss.in'),
  title: 'DownBoss.in - Free All-in-One Social Media Downloader (HD & MP3)',
  description:
    'Free online social media downloader for Instagram reels, TikTok videos without watermark, YouTube shorts, X (Twitter), Facebook videos, and Pinterest in full HD and MP3 audio.',
  keywords: [
    'downboss',
    'downboss.in',
    'social media downloader',
    'instagram reel downloader',
    'tiktok video downloader without watermark',
    'youtube short downloader',
    'twitter video downloader',
    'facebook video download',
    'carousel photo downloader',
    'pinterest video downloader',
    'free video downloader'
  ],
  authors: [{ name: 'DownBoss.in' }],
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png'
  },
  openGraph: {
    title: 'DownBoss.in - Free All-in-One Social Media Downloader',
    description:
      'Download high-quality videos, reels, photos, audio and carousel albums from Instagram, TikTok, YouTube, X, and Facebook in seconds.',
    url: 'https://downboss.in',
    siteName: 'DownBoss.in',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/logo.png', width: 1024, height: 1024, alt: 'DownBoss.in Logo' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DownBoss.in - Free All-in-One Social Media Downloader',
    description: 'Fast, free, no-login downloader for Reels, TikToks, Carousel Posts & Audio.',
    images: ['/logo.png']
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Anti-Flicker theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('downboss_theme') || localStorage.getItem('omnisave_theme');
                if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `
          }}
        />
        {/* JSON-LD Software Application Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'DownBoss.in',
              url: 'https://downboss.in',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description:
                'Free all-in-one social media downloader for Instagram, TikTok, YouTube, Twitter/X, Facebook, and Pinterest.'
            })
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-300 antialiased selection:bg-sky-500 selection:text-white">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
