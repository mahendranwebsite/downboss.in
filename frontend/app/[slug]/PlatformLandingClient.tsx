'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PlatformTabs } from '@/components/PlatformTabs';
import { HeroInput } from '@/components/HeroInput';
import { MediaResult } from '@/components/MediaResult';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { BatchModal } from '@/components/BatchModal';
import { HistoryModal } from '@/components/HistoryModal';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';
import { SeoLandingPageData } from '@/lib/seoData';
import { PlatformId, MediaData, HistoryItem } from '@/lib/types';
import { fetchMediaInfo, getDownloadHistory, clearDownloadHistory } from '@/lib/api';
import { ChevronDown, Sparkles } from 'lucide-react';

interface Props {
  pageData: SeoLandingPageData;
}

export default function PlatformLandingClient({ pageData }: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>(pageData.platform);
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('Extracting media links...');
  const [mediaData, setMediaData] = useState<MediaData | null>(null);

  const [isBatchOpen, setIsBatchOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : currentMessage(c, msg)));
    }, 3000);
  };

  const currentMessage = (curr: string | null, target: string) => (curr === target ? null : curr);

  const handleStartFetch = async (inputUrl: string) => {
    setIsLoading(true);
    setMediaData(null);
    setProgressPercent(15);
    setProgressStatus(`Extracting ${pageData.platformName} links...`);

    const timer1 = setTimeout(() => {
      setProgressPercent(45);
      setProgressStatus('Contacting media servers...');
    }, 250);

    const timer2 = setTimeout(() => {
      setProgressPercent(80);
      setProgressStatus('Decrypting HD format resolutions...');
    }, 550);

    try {
      const data = await fetchMediaInfo(inputUrl);
      clearTimeout(timer1);
      clearTimeout(timer2);
      setProgressPercent(100);
      setProgressStatus('Ready to download!');
      setTimeout(() => {
        setMediaData(data);
        setIsLoading(false);
        showToast('Media loaded successfully!');
      }, 300);
    } catch {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
      showToast('Extraction failed. Check link.');
    }
  };

  return (
    <>
      <Navbar
        onOpenBatch={() => setIsBatchOpen(true)}
        onOpenHistory={() => {
          setHistoryItems(getDownloadHistory());
          setIsHistoryOpen(true);
        }}
        onShowToast={showToast}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        
        {/* SEO Custom Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200/50 dark:border-indigo-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated {pageData.platformName} Downloader</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {pageData.h1}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {pageData.subtitle}
          </p>
        </div>

        {/* Platform Selection Tabs */}
        <PlatformTabs
          selectedPlatform={selectedPlatform}
          onSelectPlatform={(id) => setSelectedPlatform(id)}
        />

        {/* Top Ad Slot */}
        <AdPlaceholder slot="top-banner" className="flex" />

        {/* Input Form Section */}
        <HeroInput
          url={url}
          setUrl={setUrl}
          onSubmit={handleStartFetch}
          isLoading={isLoading}
          selectedPlatform={selectedPlatform}
          onPlatformDetected={(id) => setSelectedPlatform(id)}
          onShowToast={showToast}
          placeholderText={`Paste ${pageData.platformName} link here...`}
        />

        {/* Processing & Preview */}
        <MediaResult
          isLoading={isLoading}
          progressPercent={progressPercent}
          progressStatus={progressStatus}
          mediaData={mediaData}
          onShowToast={showToast}
        />

        {/* Below-Result Ad Slot */}
        <AdPlaceholder slot="below-result" />

        {/* Platform Specific Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pageData.features.map((f, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 space-y-1.5 shadow-sm"
            >
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{f.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Platform Specific FAQ Accordion */}
        <section className="py-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              {pageData.platformName} Download FAQs
            </h2>
          </div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {pageData.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-darkCard overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/60 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />

      <BatchModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        onStartBatch={(urls) => {
          if (urls.length > 0) {
            setUrl(urls[0]);
            handleStartFetch(urls[0]);
          }
        }}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyItems}
        onClearHistory={() => {
          clearDownloadHistory();
          setHistoryItems([]);
          showToast('History cleared');
        }}
      />

      <Toast message={toastMessage} />

      {/* JSON-LD FAQ Schema for Platform Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: pageData.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a
              }
            }))
          })
        }}
      />
    </>
  );
}
