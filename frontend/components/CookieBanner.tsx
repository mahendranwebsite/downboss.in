'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const accepted = localStorage.getItem('downboss_consent_accepted') || localStorage.getItem('omnisave_consent_accepted');
    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('downboss_consent_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 p-4 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">
            Cookies & Fair Usage Disclaimer
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
            DownBoss uses local storage to remember your preferences and recent download history.
            <strong className="text-gray-700 dark:text-gray-300 block mt-1">
              Disclaimer: Download only content you own or have permission to use.
            </strong>
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Policy
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
        <button
          onClick={handleAccept}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 -mr-1 -mt-1"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          Got it, I agree
        </button>
      </div>
    </div>
  );
};
