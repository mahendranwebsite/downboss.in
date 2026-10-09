import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy - DownBoss.in',
  description: 'Learn how DownBoss.in protects your privacy and handles data.'
};

export default function PrivacyPage() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-darkBg/80 glass-panel">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold hover:text-sky-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Downloader</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black border border-sky-500/40 flex items-center justify-center">
              <Image src="/logo-icon.png" alt="DownBoss.in" width={28} height={28} className="object-contain" />
            </div>
            <span className="font-extrabold text-lg text-gray-900 dark:text-white">
              Down<span className="text-[#00A3FF]">Boss</span><span className="text-sky-500 text-xs ml-0.5">.in</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 space-y-6 text-gray-700 dark:text-gray-300">
        <div className="space-y-2 border-b border-gray-200 dark:border-gray-800 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-xs text-gray-400">Last updated: October 2026</p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">1. No Registration or Personal Data Collection</h2>
          <p>
            DownBoss.in is built with privacy at its core. You are never asked to register an account, log in, or provide personal identifiers such as names, email addresses, or phone numbers.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">2. Local Browser Storage</h2>
          <p>
            Your download history and theme preferences (Dark Mode / Light Mode) are stored locally in your web browser&apos;s localStorage. This information never leaves your device and is not sent to our servers.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">3. Server Logs & Rate Limiting</h2>
          <p>
            To prevent denial-of-service attacks and ensure fair server access for everyone, our server applies rate limits based on anonymized IP addresses. These logs are stored temporarily in volatile memory (RAM) and purged regularly.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">4. Third-Party Advertising & Cookies</h2>
          <p>
            We may show advertisements through third-party ad networks such as Google AdSense. Third-party vendors use cookies to serve ads based on prior visits to this or other websites.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
