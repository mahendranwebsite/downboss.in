import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

import Image from 'next/image';

export const metadata = {
  title: 'Terms of Service - DownBoss.in',
  description: 'Read the Terms of Service for using DownBoss.in social media downloader.'
};

export default function TermsPage() {
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
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="text-xs text-gray-400">Last updated: October 2026</p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using DownBoss.in (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">2. Permitted Use & Fair Usage</h2>
          <p>
            DownBoss.in is provided solely for personal, educational, non-commercial, and fair-use archiving purposes. You agree to download only content that you own, have created, or have explicit permission from the copyright owner to download and store.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">3. Intellectual Property Rights</h2>
          <p>
            DownBoss.in does not claim ownership of any media, images, audio, or videos extracted or processed by users. All copyrights, trademarks, and intellectual property belong to their respective creators and social platforms. DownBoss.in does not store, host, or re-distribute media files on our servers.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">4. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. We do not guarantee uninterrupted, secure, or error-free operation.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
