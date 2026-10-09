import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-darkCard/40 py-10 text-xs text-gray-500 dark:text-gray-400 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top footer row: brand & links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black border border-sky-500/40 flex items-center justify-center shadow-md shadow-sky-500/10 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo-icon.png"
                alt="DownBoss.in"
                width={32}
                height={32}
                className="object-contain w-full h-full p-0.5"
              />
            </div>
            <div className="flex items-baseline">
              <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
                Down<span className="text-[#00A3FF]">Boss</span>
              </span>
              <span className="text-xs font-bold text-sky-500 dark:text-sky-400 ml-0.5">.in</span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Home
            </Link>
            <Link href="/contact" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Contact & Support
            </Link>
            <Link href="/terms" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/dmca" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              DMCA Takedown
            </Link>
          </div>
        </div>

        {/* SEO Platform Links */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-gray-400 dark:text-gray-500">
          <span>Popular Tools:</span>
          <Link href="/instagram-reel-downloader" className="hover:text-indigo-500 transition-colors">
            Instagram Reel Downloader
          </Link>
          <span>•</span>
          <Link href="/tiktok-video-downloader" className="hover:text-indigo-500 transition-colors">
            TikTok Video Downloader
          </Link>
          <span>•</span>
          <Link href="/youtube-video-downloader" className="hover:text-indigo-500 transition-colors">
            YouTube Video Downloader
          </Link>
          <span>•</span>
          <Link href="/twitter-video-downloader" className="hover:text-indigo-500 transition-colors">
            X (Twitter) Video Downloader
          </Link>
          <span>•</span>
          <Link href="/facebook-video-downloader" className="hover:text-indigo-500 transition-colors">
            Facebook Video Downloader
          </Link>
          <span>•</span>
          <Link href="/pinterest-video-downloader" className="hover:text-indigo-500 transition-colors">
            Pinterest Downloader
          </Link>
        </div>

        <div className="pt-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} DownBoss.in • All rights reserved. Free online social media downloader.
        </div>
      </div>
    </footer>
  );
};
