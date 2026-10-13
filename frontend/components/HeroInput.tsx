'use client';

import React, { useState, useEffect } from 'react';
import { Link2, Clipboard, Search, AlertCircle, X, Download } from 'lucide-react';
import { SAMPLE_LINKS, detectPlatformFromUrl } from '../lib/platforms';
import { PlatformId } from '../lib/types';

interface HeroInputProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (url: string) => void;
  isLoading: boolean;
  selectedPlatform: PlatformId;
  onPlatformDetected: (platform: PlatformId) => void;
  onShowToast: (msg: string) => void;
  placeholderText?: string;
  externalError?: string | null;
  onClearError?: () => void;
}

export const HeroInput: React.FC<HeroInputProps> = ({
  url,
  setUrl,
  onSubmit,
  isLoading,
  selectedPlatform,
  onPlatformDetected,
  onShowToast,
  placeholderText,
  externalError,
  onClearError
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);

  const displayError = externalError || internalError;

  const handleInputChange = (val: string) => {
    setUrl(val);
    setInternalError(null);
    if (onClearError) onClearError();
    if (val.trim()) {
      const lower = val.toLowerCase();
      if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
        setInternalError('YouTube downloader is currently unavailable (Coming Soon). Please use Instagram, TikTok, Facebook, or X/Twitter.');
      }
      const detected = detectPlatformFromUrl(val);
      if (detected !== 'all') {
        onPlatformDetected(detected);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleInputChange(text.trim());
        onShowToast('Link pasted from clipboard!');
      } else {
        onShowToast('Clipboard is empty');
      }
    } catch {
      onShowToast('Please paste manually using Ctrl+V or Cmd+V');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = url.trim();
    if (!clean) {
      setInternalError('Please enter or paste a valid social media URL.');
      return;
    }
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      setInternalError('Please include "https://" in your URL.');
      return;
    }
    const lower = clean.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      setInternalError('YouTube downloader is currently paused (Coming Soon). Please try Instagram, TikTok, Facebook, or Twitter links.');
      onShowToast('YouTube downloader is Coming Soon');
      return;
    }
    setInternalError(null);
    if (onClearError) onClearError();
    onSubmit(clean);
  };

  const handleSampleClick = (sampleUrl: string) => {
    handleInputChange(sampleUrl);
    onShowToast('Sample link loaded!');
    onSubmit(sampleUrl);
  };

  return (
    <div className="bg-white dark:bg-darkCard p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Link2 className="w-5 h-5" />
          </div>
          <input
            type="url"
            id="mediaUrl"
            value={url}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholderText || "Paste video or photo link here (e.g. instagram.com/p/...)"}
            className="w-full pl-11 pr-24 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 transition-all focus:bg-white dark:focus:bg-gray-950"
          />

          {url ? (
            <button
              type="button"
              onClick={() => {
                setUrl('');
                setInternalError(null);
                if (onClearError) onClearError();
              }}
              className="absolute right-20 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-transform active:scale-90"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          <button
            type="button"
            id="pasteBtn"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all flex items-center gap-1 active:scale-95 hover:scale-105"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>
        </div>

        <button
          type="submit"
          id="fetchBtn"
          disabled={isLoading}
          className="btn-shimmer px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isLoading ? 'Downloading...' : 'Download'}</span>
        </button>
      </form>

      {/* Error Message Box */}
      {displayError && (
        <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Extraction Notice:</span>
            <span>{displayError}</span>
          </div>
          <button
            onClick={() => { setInternalError(null); if (onClearError) onClearError(); }}
            className="text-red-400 hover:text-red-600 transition-transform active:scale-90"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Sample Test Links matching reference HTML */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-400 font-medium">Try Sample Links:</span>
        {SAMPLE_LINKS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSampleClick(s.url)}
            className={`sample-link-btn px-2.5 py-1 rounded-md font-medium hover:underline transition-all hover:scale-105 active:scale-95 shadow-sm ${s.badgeClass}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
