'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ_DATA = [
  {
    q: 'Is DownBoss.in completely free to use?',
    a: 'Yes, DownBoss.in is 100% free with unlimited downloads. You do not need an account, credit card, or registration to download media from Instagram, TikTok, YouTube, X (Twitter), Facebook, or Pinterest.'
  },
  {
    q: 'How do I download carousel or album posts with multiple photos/videos?',
    a: 'Simply paste the link of the carousel post into DownBoss. We automatically extract each slide, allowing you to download photos individually or click "Download All (ZIP)" to download everything packaged into a single ZIP file.'
  },
  {
    q: 'Are the downloaded videos watermark-free and in high quality?',
    a: 'Yes! DownBoss extracts the direct high-definition CDN stream, meaning videos from TikTok and Instagram reels can be downloaded in crisp 1080p without platform watermarks whenever supported by the source stream.'
  },
  {
    q: 'How do I download an entire YouTube Playlist?',
    a: 'Paste any YouTube playlist URL (e.g., youtube.com/playlist?list=...) into the DownBoss search bar. DownBoss will load all videos in the playlist, allowing you to select tracks and click "Download Selected (MP4)" or "Download All as MP3" to batch download them effortlessly.'
  },
  {
    q: 'Can I extract only the audio (MP3) from a video?',
    a: 'Yes, for supported video posts, DownBoss provides an "MP3 Audio" quality button that allows you to download just the background sound or voice track as a high-bitrate MP3 audio file.'
  },
  {
    q: 'Can I download private social media posts?',
    a: 'No. DownBoss respects privacy and security policies. We can only process publicly accessible posts and reels that do not require authenticated follower permissions.'
  },
  {
    q: 'Where do the downloaded media files get saved on my device?',
    a: 'Downloaded files are saved directly to your default browser downloads directory (e.g., Downloads folder on Windows and Mac, or Files / Photos app on mobile devices).'
  }
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-6 space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Everything you need to know about downloading social media content
        </p>
      </div>

      <div className="space-y-3 max-w-3xl mx-auto">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-darkCard overflow-hidden transition-all shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-indigo-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/60 animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
