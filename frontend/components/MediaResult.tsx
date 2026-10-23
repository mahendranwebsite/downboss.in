'use client';

import React, { useState } from 'react';
import { MediaData, MediaFormat } from '../lib/types';
import { Play, DownloadCloud, Twitter, Instagram, Facebook, Youtube, Music, CheckCircle2, Layers, Zap, ArrowDownToLine, Film, Sparkles } from 'lucide-react';
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

  const handleDownloadSingle = async (formatOverride?: MediaFormat) => {
    if (!mediaData) return;
    const fmt = formatOverride || activeFormat;
    if (formatOverride) {
      setSelectedQuality(formatOverride.quality);
    }
    setIsDownloading(true);
    setDownloadPercent(15);

    const ext = fmt?.ext || 'mp4';
    const authorClean = mediaData.author.replace('@', '').trim() || 'video';
    const filename = `DownBoss_${authorClean}_${fmt?.res || 'hd'}.${ext}`;
    const targetUrl = fmt?.url || mediaData.originalUrl;

    try {
      await downloadMediaFile(targetUrl, filename, (pct) => {
        setDownloadPercent(pct);
      });
      saveDownloadToHistory({
        title: mediaData.title,
        platform: mediaData.type,
        quality: fmt?.quality || 'HD',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        url: mediaData.originalUrl
      });
      onShowToast(`Downloading ${fmt?.quality || 'HD'}! Check your browser downloads.`);
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

  const handleSelectAndDownload = (fmt: MediaFormat) => {
    setSelectedQuality(fmt.quality);
    handleDownloadSingle(fmt);
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
      
      {/* Animated High-End Loading State */}
      {isLoading && (
        <div id="loadingState" className="flex flex-col items-center justify-center py-8 px-4 gap-6 animate-fadeIn w-full max-w-2xl mx-auto">
          
          {/* Animated Central Scanner Orb */}
          <div className="relative flex items-center justify-center w-28 h-28 my-2">
            {/* Outer Pulsing Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-25 blur-xl animate-pulse"></div>

            {/* Outer Spinning Dashed Orbit */}
            <div className="absolute -inset-1 rounded-full border-2 border-dashed border-indigo-400/50 animate-spin [animation-duration:8s]"></div>

            {/* Middle Reverse Ring */}
            <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500 animate-spin [animation-duration:3s] [animation-direction:reverse]"></div>

            {/* Inner Gradient Rotating Ring */}
            <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-cyan-400 border-l-indigo-600 animate-spin [animation-duration:1.5s]"></div>

            {/* Core Pulsing Sphere with Icon */}
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 animate-pulse">
              <DownloadCloud className="w-7 h-7 text-white animate-bounce" />
            </div>

            {/* Floating Mini Platform Badges */}
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 shadow-md flex items-center justify-center text-white text-[10px] animate-bounce [animation-delay:0.2s]">
              <Youtube className="w-3.5 h-3.5" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full instagram-gradient shadow-md flex items-center justify-center text-white text-[10px] animate-bounce [animation-delay:0.5s]">
              <Instagram className="w-3.5 h-3.5" />
            </div>
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-5 h-5 rounded-full bg-black shadow-md flex items-center justify-center text-cyan-400 text-[9px] animate-pulse">
              <Music className="w-3 h-3" />
            </div>
          </div>

          {/* Dynamic Status Badges & Text */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>DownBoss Ultra Engine</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-all duration-300">
              {progressStatus || 'Connecting to media stream...'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Fetching 1080p Full HD, audio tracks & high-speed direct download streams
            </p>
          </div>

          {/* Futuristic Glowing Shimmer Progress Bar */}
          <div className="w-full max-w-md flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 px-1">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                Optimizing Stream
              </span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                {Math.min(100, Math.max(15, progressPercent))}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800/90 rounded-full h-3 p-0.5 overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700/60">
              <div
                id="progressBar"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-cyan-400 h-full rounded-full transition-all duration-300 relative overflow-hidden shadow-md shadow-indigo-500/40"
                style={{ width: `${Math.min(100, Math.max(15, progressPercent))}%` }}
              >
                {/* Light shimmer sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
            </div>
          </div>

          {/* Shimmer Ghost Preview Skeleton (Visualizing the Loaded Card) */}
          <div className="w-full max-w-md p-4 rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 flex gap-4 items-center animate-pulse shadow-sm">
            <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Film className="w-8 h-8 text-gray-400/60" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-1/2"></div>
              <div className="flex gap-1.5 pt-1">
                <div className="h-5 bg-indigo-500/20 rounded-md w-14"></div>
                <div className="h-5 bg-purple-500/20 rounded-md w-14"></div>
                <div className="h-5 bg-pink-500/20 rounded-md w-14"></div>
              </div>
            </div>
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

                {/* Quality Selector with Fast One-Click Download */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Available Quality (Click any format to fast download)
                    </label>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                      ⚡ Instant Browser Download
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" id="qualityOptions">
                    {mediaData.formats && mediaData.formats.length > 0 ? (
                      mediaData.formats.map((fmt, idx) => {
                        const isActive = selectedQuality === fmt.quality || (!selectedQuality && idx === 0);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectAndDownload(fmt)}
                            title={`Click to fast download ${fmt.quality}`}
                            className={`group relative quality-btn px-3 py-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                              isActive
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/15 scale-[1.02] ring-2 ring-indigo-500/30'
                                : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-gray-800 hover:scale-[1.01]'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-xs sm:text-sm">{fmt.quality}</span>
                              <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-500 opacity-80 group-hover:translate-y-0.5 transition-transform" />
                            </div>
                            {fmt.size && (
                              <span className="text-[10px] opacity-75 font-normal mt-0.5">{fmt.size}</span>
                            )}
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider">
                              ⚡ Fast DL
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <button
                        onClick={() => handleDownloadSingle()}
                        className="quality-btn active col-span-2 px-4 py-2.5 rounded-xl border border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center text-center"
                      >
                        <span>⚡ Original HD Video (Fast DL)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Fast Download Button */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    id="downloadNowBtn"
                    onClick={() => handleDownloadSingle()}
                    disabled={isDownloading}
                    className="btn-shimmer relative overflow-hidden flex-1 py-3.5 sm:py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm sm:text-base shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 flex items-center justify-center gap-2.5 active:scale-[0.98] hover:scale-[1.01] transition-all disabled:opacity-90 cursor-pointer"
                  >
                    <DownloadCloud className={`w-5 h-5 ${isDownloading ? 'animate-bounce text-white' : ''}`} />
                    <span>
                      {isDownloading
                        ? 'Starting High-Speed Download... ⬇'
                        : `⚡ Fast Download (${activeFormat?.quality || 'HD'})`}
                    </span>
                  </button>
                  {isDownloading && (
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-500/50"
                        style={{ width: `${Math.max(downloadPercent, 10)}%` }}
                      />
                    </div>
                  )}
                  <p className="text-[11px] text-center text-gray-500 dark:text-gray-400">
                    💡 Click any format above or the Fast Download button to start your instant download.
                  </p>
                </div>

              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
};
