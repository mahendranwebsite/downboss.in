'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PlatformTabs } from '@/components/PlatformTabs';
import { HeroInput } from '@/components/HeroInput';
import { MediaResult } from '@/components/MediaResult';
import { FAQ_DATA } from '@/components/FAQ';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { BatchModal } from '@/components/BatchModal';
import { HistoryModal } from '@/components/HistoryModal';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';

import { PlatformId, MediaData, HistoryItem } from '@/lib/types';
import { PLATFORMS } from '@/lib/platforms';
import { fetchMediaInfo, getDownloadHistory, clearDownloadHistory } from '@/lib/api';

export default function HomePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('all');
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('Extracting media links...');
  const [mediaData, setMediaData] = useState<MediaData | null>(null);

  // Modals state
  const [isBatchOpen, setIsBatchOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Error state
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setHistoryItems(getDownloadHistory());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const handleStartFetch = async (inputUrl: string) => {
    setIsLoading(true);
    setMediaData(null);
    setFetchError(null);
    setProgressPercent(15);
    setProgressStatus('Connecting to media stream...');

    // Smooth incremental progress ticker with dynamic status messages
    let currentPct = 15;
    const progressInterval = setInterval(() => {
      currentPct += Math.floor(Math.random() * 8) + 4;
      if (currentPct > 92) {
        currentPct = 92;
        clearInterval(progressInterval);
      }
      setProgressPercent(currentPct);

      if (currentPct < 35) {
        setProgressStatus('Connecting to media servers...');
      } else if (currentPct < 65) {
        setProgressStatus('Extracting highest video & audio resolutions...');
      } else if (currentPct < 85) {
        setProgressStatus('Bypassing restrictions & generating direct links...');
      } else {
        setProgressStatus('Preparing instant download options...');
      }
    }, 280);

    try {
      const data = await fetchMediaInfo(inputUrl);
      clearInterval(progressInterval);

      setProgressPercent(100);
      setProgressStatus('Download options ready!');

      setTimeout(() => {
        setMediaData(data);
        setIsLoading(false);
        showToast('Media loaded successfully!');
      }, 250);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsLoading(false);
      const message = err?.message || 'Could not extract media. Please check URL.';
      setFetchError(message);
      showToast(message);
    }
  };

  const handleStartBatch = (urls: string[]) => {
    if (urls.length > 0) {
      showToast(`Queued ${urls.length} media links for batch download`);
      setUrl(urls[0]);
      handleStartFetch(urls[0]);
    }
  };

  const handleClearHistory = () => {
    clearDownloadHistory();
    setHistoryItems([]);
    showToast('History cleared');
  };

  // Dynamic placeholder text based on selected platform
  const currentConfig = PLATFORMS.find((p) => p.id === selectedPlatform);
  const placeholderText = currentConfig?.placeholder;

  return (
    <>
      {/* Header / Navbar */}
      <Navbar
        onOpenBatch={() => setIsBatchOpen(true)}
        onOpenHistory={() => {
          setHistoryItems(getDownloadHistory());
          setIsHistoryOpen(true);
        }}
        onShowToast={showToast}
      />

      {/* 3-Column Layout with Left and Right Ad Rails */}
      <div className="relative w-full max-w-[1640px] mx-auto flex justify-center items-start px-2 sm:px-4">
        {/* Left Side Ad (300x250) */}
        <aside className="hidden xl:flex flex-col items-center sticky top-24 pt-6 w-[300px] flex-shrink-0 mr-3 z-20">
          <AdPlaceholder slot="side-left" />
        </aside>

        {/* Main Content Container matching reference HTML max-w-4xl */}
        <main className="relative flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        {/* Ambient Animated Glowing Mesh Orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-10 left-1/4 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 dark:from-indigo-600/25 dark:to-purple-600/15 blur-3xl animate-float -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute top-44 right-10 w-72 h-72 rounded-full bg-gradient-to-bl from-pink-500/20 to-rose-500/10 dark:from-pink-600/20 dark:to-purple-800/15 blur-3xl animate-float-delayed -z-10" />
        
        {/* Hero Title with DownBoss Badge */}
        <div className="text-center space-y-3 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
            <span>DownBoss.in • Free HD & MP3 Media Downloader</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Download Media in{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 via-cyan-400 to-sky-500 animate-gradient-flow">
              Seconds
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Paste links from Instagram, TikTok, YouTube, X (Twitter), Facebook, or Pinterest to download high-quality videos, reels, photos, and audio effortlessly.
          </p>
        </div>

        {/* Platform Selection Tabs */}
        <PlatformTabs
          selectedPlatform={selectedPlatform}
          onSelectPlatform={(id) => setSelectedPlatform(id)}
        />

        {/* Top Ad Slot (728x90 Banner) */}
        <AdPlaceholder slot="top-banner" className="flex" />

        {/* Input Form Section */}
        <HeroInput
          url={url}
          setUrl={setUrl}
          onSubmit={handleStartFetch}
          isLoading={isLoading}
          selectedPlatform={selectedPlatform}
          onPlatformDetected={(detected) => setSelectedPlatform(detected)}
          onShowToast={showToast}
          placeholderText={placeholderText}
          externalError={fetchError}
          onClearError={() => setFetchError(null)}
        />

        {/* Processing & Preview Container */}
        <MediaResult
          isLoading={isLoading}
          progressPercent={progressPercent}
          progressStatus={progressStatus}
          mediaData={mediaData}
          onShowToast={showToast}
        />

        {/* Below-Result Ad Slot */}
        <AdPlaceholder slot="below-result" />

      </main>

        {/* Right Side Ad (300x250) */}
        <aside className="hidden xl:flex flex-col items-center sticky top-24 pt-6 w-[300px] flex-shrink-0 ml-3 z-20">
          <AdPlaceholder slot="side-right" />
        </aside>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals & Toast */}
      <BatchModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        onStartBatch={handleStartBatch}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyItems}
        onClearHistory={handleClearHistory}
      />

      <Toast message={toastMessage} />

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_DATA.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a
              }
            }))
          })
        }}
      />
    </>
  );
}
