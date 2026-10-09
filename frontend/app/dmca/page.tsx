import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'DMCA Takedown & Copyright Notice - DownBoss.in',
  description: 'Submit copyright claims and DMCA takedown notifications to DownBoss.in.'
};

export default function DmcaPage() {
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
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">DMCA Copyright Policy</h1>
          <p className="text-xs text-gray-400">Digital Millennium Copyright Act Notice</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            DownBoss.in does not host, store, or archive any copyrighted videos, media, or audio files on our servers. The service is a client extraction utility linking directly to publicly available streams hosted by third-party social networks.
          </p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filing a DMCA Notice</h2>
          <p>
            If you are a copyright owner or an agent thereof and believe that any link or content accessed via DownBoss.in infringes upon your copyrights, you may submit a written DMCA notice with the following details:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Specific URL or direct link to the material you wish blocked from extraction.</li>
            <li>Your contact information including legal name, address, telephone number, and email.</li>
            <li>A statement that you have a good faith belief that use of the material is not authorized.</li>
            <li>A statement made under penalty of perjury that the information in the notification is accurate.</li>
            <li>An electronic or physical signature of the authorized copyright holder.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Designated Agent</h2>
          <p>
            Send all copyright complaints to our designated agent at:{' '}
            <a href="mailto:dmca@downboss.in" className="text-sky-600 dark:text-sky-400 font-semibold underline">
              dmca@downboss.in
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
