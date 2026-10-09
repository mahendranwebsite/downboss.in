import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-darkBg text-center">
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-black border border-sky-500/40 flex items-center justify-center shadow-xl shadow-sky-500/20 mb-6">
        <Image
          src="/logo-icon.png"
          alt="DownBoss.in"
          width={64}
          height={64}
          className="object-contain w-full h-full p-1"
          priority
        />
      </div>

      <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Page Not Found</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8">
        The downloader link or page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to DownBoss.in</span>
      </Link>
    </div>
  );
}
