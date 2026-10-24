'use client';

import React from 'react';
import { PlatformId } from '../lib/types';
import { PLATFORMS } from '../lib/platforms';

export const OfficialLogo: React.FC<{ id: string; className?: string }> = ({ id, className = 'w-4 h-4' }) => {
  switch (id) {
    case 'all':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    case 'twitter':
      // Official 𝕏 Logo
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'instagram':
      // Official Instagram Gradient Logo
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <defs>
            <linearGradient id="ig-brand-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="url(#ig-brand-gradient)" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="4.3" fill="none" stroke="url(#ig-brand-gradient)" strokeWidth="2.2" />
          <circle cx="17.5" cy="6.5" r="1.4" fill="url(#ig-brand-gradient)" />
        </svg>
      );
    case 'facebook':
      // Official Facebook Circle Badge
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="11" fill="#1877F2" />
          <path d="M15.12 12.5h-2.12v7h-3v-7H8.5v-2.5h1.5v-1.62c0-2.07 1.23-3.2 3.12-3.2.9 0 1.68.07 1.9.1v2.2h-1.3c-1 0-1.2.48-1.2 1.18V10h2.46l-.36 2.5z" fill="#FFFFFF" />
        </svg>
      );
    case 'youtube':
      // Official YouTube Logo
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
            fill="#FF0000"
          />
          <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
        </svg>
      );
    case 'youtube-playlist':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M3 6h12M3 12h12M3 18h8" stroke="#FF0000" strokeWidth="2.4" strokeLinecap="round" />
          <polygon points="17,14 17,22 23,18" fill="#FF0000" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.52 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.35 0 .69.06 1 .17V9.11a6.45 6.45 0 0 0-1-.08A6.34 6.34 0 0 0 3.15 15.37 6.34 6.34 0 0 0 9.49 21.71a6.34 6.34 0 0 0 6.34-6.34V8.71a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="11" fill="#E60023" />
          <path d="M12 4.5a7.5 7.5 0 0 0-2.73 14.5c.08-.66.15-1.68.03-2.4l.88-3.73s-.22-.44-.22-1.1c0-1.03.6-1.8 1.34-1.8.63 0 .94.47.94 1.04 0 .63-.4 1.58-.61 2.46-.17.74.37 1.35 1.1 1.35 1.33 0 2.34-1.4 2.34-3.42 0-1.79-1.28-3.04-3.12-3.04-2.28 0-3.62 1.71-3.62 3.47 0 .69.26 1.42.6 1.82a.24.24 0 0 1 .06.23c-.06.26-.2.82-.23.94-.04.16-.13.2-.3.12-1.11-.52-1.8-2.14-1.8-3.44 0-2.8 2.04-5.38 5.88-5.38 3.09 0 5.49 2.2 5.49 5.14 0 3.07-1.94 5.54-4.63 5.54-.9 0-1.75-.47-2.04-1.02l-.56 2.11c-.2.78-.74 1.75-1.1 2.33A7.5 7.5 0 0 0 12 19.5a7.5 7.5 0 0 0 0-15z" fill="#FFFFFF" />
        </svg>
      );
    case 'reddit':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="11" fill="#FF4500" />
          <path d="M18.8 11.2a1.4 1.4 0 0 0-2.32-1.04 7.6 7.6 0 0 0-3.9-1.14l.66-3.1 2.16.46a1.05 1.05 0 1 0 .22-.64l-2.46-.52a.35.35 0 0 0-.42.27l-.76 3.56a7.66 7.66 0 0 0-3.99 1.15 1.4 1.4 0 0 0-2.32 1.06 1.38 1.38 0 0 0 .61 1.15c-.02.16-.03.32-.03.49 0 2.5 2.91 4.53 6.5 4.53s6.5-2.03 6.5-4.53c0-.17-.01-.33-.03-.49a1.38 1.38 0 0 0 .6-1.16zm-9.3.93a.93.93 0 1 1 .93.93.93.93 0 0 1-.93-.93zm5.06 2.8c-.8.8-2.32.8-3.12 0a.35.35 0 0 1 .5-.5c.52.52 1.6.52 2.12 0a.35.35 0 1 1 .5.5zm-.06-1.87a.93.93 0 1 1 .93-.93.93.93 0 0 1-.93.93z" fill="#FFFFFF" />
        </svg>
      );
    case 'threads':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12.186 24C5.466 24 0 18.534 0 11.814 0 5.094 5.466 0 12.186 0 18.906 0 24 5.094 24 11.814c0 1.956-.462 3.84-1.332 5.52l-2.508-1.392a9.144 9.144 0 0 0 .972-4.128c0-5.064-4.116-9.18-9.18-9.18-5.064 0-9.18 4.116-9.18 9.18 0 5.064 4.116 9.18 9.18 9.18 2.652 0 5.064-1.128 6.78-2.928l2.064 1.992A11.976 11.976 0 0 1 12.186 24zm4.848-11.772c-.156-3.84-2.52-5.748-5.736-5.748-3.324 0-5.88 2.376-5.88 5.496 0 3.252 2.64 5.376 6.096 5.376 2.064 0 3.864-.84 4.968-2.328l-1.98-1.572a3.864 3.864 0 0 1-2.988 1.344c-1.872 0-3.324-1.044-3.528-2.604h8.928c.072-.636.12-1.284.12-1.964zm-8.916-.864c.264-1.428 1.548-2.34 3.12-2.34 1.632 0 2.82.936 3.036 2.34h-6.156z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="11" fill="#0A66C2" />
          <path d="M8.5 16.5H6.5v-6.5h2v6.5zM7.5 9.1a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3zm10 7.4h-2v-3.3c0-.85-.3-1.43-1.06-1.43-.58 0-.93.39-1.08.77-.06.14-.07.33-.07.52v3.44h-2s.03-5.9 0-6.5h2v.92c.27-.41.74-1 1.82-1 1.33 0 2.33.87 2.33 2.74v3.84h.06z" fill="#FFFFFF" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
  }
};

interface PlatformTabsProps {
  selectedPlatform: PlatformId;
  onSelectPlatform: (id: PlatformId) => void;
}

export const PlatformTabs: React.FC<PlatformTabsProps> = ({ selectedPlatform, onSelectPlatform }) => {
  // Main top tabs (active platforms: All, YouTube, YT Playlist, Instagram, Facebook, Twitter)
  const mainPlatforms = PLATFORMS.filter(p => ['all', 'youtube', 'youtube-playlist', 'instagram', 'facebook', 'twitter'].includes(p.id));
  const morePlatforms = PLATFORMS.filter(p => !['all', 'youtube', 'youtube-playlist', 'instagram', 'facebook', 'twitter'].includes(p.id));

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Primary Tabs with Official Brand Logos */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 p-1.5 bg-gray-100 dark:bg-darkCard rounded-2xl border border-gray-200 dark:border-gray-800 max-w-xl mx-auto w-full transition-colors overflow-x-auto scrollbar-none">
        {mainPlatforms.map((platform) => {
          const isActive = selectedPlatform === platform.id;
          return (
            <button
              key={platform.id}
              data-platform={platform.id}
              onClick={() => onSelectPlatform(platform.id)}
              className={`platform-tab flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <OfficialLogo id={platform.id} className="w-4 h-4 flex-shrink-0" />
              <span>{platform.name}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Chips with Official Logos */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto px-2">
        <span className="text-[11px] font-medium text-gray-400 mr-1 hidden sm:inline">Also supports:</span>
        {morePlatforms.map((platform) => {
          const isActive = selectedPlatform === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => onSelectPlatform(platform.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:text-indigo-500 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <OfficialLogo id={platform.id} className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{platform.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
