'use client';

import React, { useState } from 'react';
import { MediaData, MediaFormat } from '../lib/types';
import { Play, DownloadCloud, Twitter, Instagram, Facebook, Youtube, Music, CheckCircle2, Layers } from 'lucide-react';
import { CarouselGrid } from './CarouselGrid';
import { downloadMediaFile, saveDownloadToHistory } from '../lib/api';
import { OfficialLogo } from './PlatformTabs';

interface MediaResultProps {
  isLoading: boolean;
  progressPercent: number;
  progressStatus: string;
  mediaData: MediaData | null;
  onShowToast: (msg: string) => void;
}

export const MediaResult: React.FC<MediaResultProps> = ({
  isLoading,
  progressPercent,
  progressStatus,
  mediaData,
  onShowToast
}) => {
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p HD');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadPercent, setDownloadPercent] = useState<number>(0);

  React.useEffect(() => {
    if (mediaData?.formats && mediaData.formats.length > 0) {
      setSelectedQuality(mediaData.formats[0].quality);
    }
  }, [mediaData]);

  if (!isLoading && !mediaData) {
    return null;
  }

  // Find active format object
  const activeFormat = mediaData?.formats?.find(f => f.quality === selectedQuality) || mediaData?.formats?.[0];

  const handleDownloadSingle = async () => {
    if (!mediaData) return;
    setIsDownloading(true);
    setDownloadPercent(10);

    const ext = activeFormat?.ext || 'mp4';
    const authorClean = mediaData.author.replace('@', '').trim() || 'video';
    const filename = `DownBoss_${authorClean}_${activeFormat?.res || 'hd'}.${ext}`;
    const targetUrl = activeFormat?.url || mediaData.originalUrl;

    try {
      await downloadMediaFile(targetUrl, filename, (pct) => {
        setDownloadPercent(pct);
      });
      saveDownloadToHistory({
        title: mediaData.title,
        platform: mediaData.type,
        quality: activeFormat?.quality || 'HD',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        url: mediaData.originalUrl
      });
      onShowToast(`Downloading ${activeFormat?.quality || 'HD'}! Check your browser downloads.`);
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadPercent(0);
      }, 2500);
    } catch (e) {
      console.error(e);
      onShowToast('Download failed. Please try again.');
      setIsDownloading(false);
      setDownloadPercent(0);
    }
  };

  const renderPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md bg-black">
            <OfficialLogo id="twitter" className="w-3.5 h-3.5" />
            <span>𝕏 / Twitter</span>
          </span>
        );
      case 'instagram':
        return (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md instagram-gradient">
            <OfficialLogo id="instagram" className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </span>
        );
      case 'facebook':
        return (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md bg-facebook">
            <OfficialLogo id="facebook" className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </span>
        );
      case 'youtube':
        return (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md bg-red-600">
            <OfficialLogo id="youtube" className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </span>
        );
      case 'tiktok':
        return (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md bg-black">
            <OfficialLogo id="tiktok" className="w-3.5 h-3.5 text-cyan-400" />
            <span>TikTok</span>
          </span>
        );
      default:
        return (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md bg-indigo-600">
            <Layers className="w-3.5 h-3.5" />
            <span className="capitalize">{platform}</span>
          </span>
        );
    }
  };

  return (
    <div id="mediaPreviewContainer" className="flex flex-col gap-4 bg-white dark:bg-darkCard p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl transition-all">
      
      {/* Loading State without technical decrypting texts */}
      {isLoading && (
        <div id="loadingState" className="flex flex-col items-center justify-center py-12 gap-5 animate-fadeIn">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin"></div>
            <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/10 animate-pulse"></div>
          </div>
          <div className="w-full max-w-sm bg-gray-100 dark:bg-gray-800/80 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              id="progressBar"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${Math.max(progressPercent, 15)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Preview Content */}
      {!isLoading && mediaData && (
        <>
          {mediaData.is_carousel ? (
            /* Carousel Grid Display */
            <CarouselGrid mediaData={mediaData} onShowToast={onShowToast} />
          ) : (
            /* Standard Single Video/Audio Preview Card matching Reference */
            <div id="previewCard" className="flex flex-col md:flex-row gap-6 items-start">
              
              {/* Thumbnail with Play Icon / Badge */}
              <div className="relative w-full md:w-64 aspect-video md:aspect-square rounded-xl overflow-hidden bg-gray-900 group flex-shrink-0 shadow-md">
                <img
                  id="previewThumbnail"
                  src={mediaData.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                  alt={mediaData.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current pl-0.5" />
                  </div>
                </div>

                {/* Platform Badge */}
                {renderPlatformBadge(mediaData.platform)}

                {/* Duration Badge */}
                <span id="durationBadge" className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-medium text-white">
                  {mediaData.duration || '0:45'}
                </span>
              </div>

              {/* Details & Download Controls */}
              <div className="flex-1 flex flex-col justify-between w-full h-full space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded" id="mediaTypeLabel">
                      {mediaData.type || 'HD Video'}
                    </span>
                    <span className="text-xs text-gray-400" id="authorHandle">
                      {mediaData.author || '@creator'}
                    </span>
                  </div>
                  <h3 id="previewTitle" className="font-bold text-base sm:text-lg text-gray-900 dark:text-white line-clamp-2">
                    {mediaData.title}
                  </h3>
                </div>

                {/* Quality Selector (Shows only actually available qualities) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                    Available Quality / Format
                  </label>
                  <div className="flex flex-wrap gap-2.5" id="qualityOptions">
                    {mediaData.formats && mediaData.formats.length > 0 ? (
                      mediaData.formats.map((fmt, idx) => {
                        const isActive = selectedQuality === fmt.quality || (!selectedQuality && idx === 0);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedQuality(fmt.quality)}
                            className={`quality-btn px-4 py-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                              isActive
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10 scale-[1.02]'
                                : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span className="font-bold text-xs sm:text-sm">{fmt.quality}</span>
                            {fmt.size && (
                              <span className="text-[10px] opacity-70 font-normal mt-0.5">{fmt.size}</span>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <button className="quality-btn active px-4 py-2.5 rounded-xl border border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center text-center">
                        <span>Original HD</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Download Button & Percentage Bar */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    id="downloadNowBtn"
                    onClick={handleDownloadSingle}
                    disabled={isDownloading}
                    className="btn-shimmer relative overflow-hidden flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 flex items-center justify-center gap-2 active:scale-[0.98] hover:scale-[1.01] transition-all disabled:opacity-90"
                  >
                    <DownloadCloud className={`w-5 h-5 ${isDownloading ? 'animate-bounce text-white' : ''}`} />
                    <span>
                      {isDownloading
                        ? 'Starting Browser Download... ⬇'
                        : `Download Selected (${activeFormat?.quality || 'HD'})`}
                    </span>
                  </button>
                  {isDownloading && (
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-500/50"
                        style={{ width: `${Math.max(downloadPercent, 8)}%` }}
                      />
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
};
