'use client';

import React, { useState, useMemo } from 'react';
import { MediaData, PlaylistItem } from '../lib/types';
import {
  Download,
  CheckSquare,
  Square,
  Search,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Film,
  Music,
  ArrowDownToLine,
  Zap,
  Layers,
  Sparkles,
  StopCircle,
  Play
} from 'lucide-react';
import { downloadMediaFile, saveDownloadToHistory } from '../lib/api';
import { OfficialLogo } from './PlatformTabs';

interface PlaylistGridProps {
  mediaData: MediaData;
  onShowToast: (msg: string) => void;
  onOpenBatch?: (urls: string[]) => void;
}

export const PlaylistGrid: React.FC<PlaylistGridProps> = ({
  mediaData,
  onShowToast,
  onOpenBatch
}) => {
  const allItems: PlaylistItem[] = mediaData.playlist_items || [];
  
  // Search / filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selection state (set of IDs)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(allItems.map(item => item.id)));
  
  // Default batch format
  const [batchQuality, setBatchQuality] = useState<'1080p' | '720p' | '480p' | 'mp3'>('720p');
  
  // Batch sequential download queue state
  const [isQueueRunning, setIsQueueRunning] = useState<boolean>(false);
  const [queueProgress, setQueueProgress] = useState<{ current: number; total: number; title: string }>({
    current: 0,
    total: 0,
    title: ''
  });
  const cancelQueueRef = React.useRef<boolean>(false);

  // Individual item downloading status map
  const [downloadingItems, setDownloadingItems] = useState<Record<string, string>>({});
  const [copiedLinks, setCopiedLinks] = useState<boolean>(false);

  // Filtered items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems;
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      item => item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q)
    );
  }, [allItems, searchQuery]);

  // Select / Deselect toggles
  const isAllSelected = allItems.length > 0 && selectedIds.size === allItems.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allItems.map(item => item.id)));
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Fast single item download
  const handleDownloadItem = async (item: PlaylistItem, quality: '1080p' | '720p' | '480p' | 'mp3') => {
    if (downloadingItems[item.id]) return;
    setDownloadingItems(prev => ({ ...prev, [item.id]: quality }));
    const isAudio = quality === 'mp3';
    const ext = isAudio ? 'mp3' : 'mp4';
    const cleanTitle = item.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45);
    const filename = `DownBoss_${cleanTitle}_${quality}.${ext}`;
    const targetUrl = item.url.startsWith('http') ? item.url : `https://www.youtube.com/watch?v=${item.id}`;

    try {
      await downloadMediaFile(targetUrl, filename);
      saveDownloadToHistory({
        title: item.title,
        platform: isAudio ? 'YouTube Audio (MP3)' : `YouTube Video (${quality})`,
        quality: quality === 'mp3' ? 'MP3 320k' : `${quality} HD`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        url: targetUrl
      });
      onShowToast(`Downloading #${item.index} in ${quality}! Check your downloads.`);
    } catch {
      onShowToast(`Failed to download "${item.title}".`);
    } finally {
      setTimeout(() => {
        setDownloadingItems(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
      }, 2500);
    }
  };

  // Sequential batch downloader for selected tracks
  const handleStartBatchDownload = async (forcedQuality?: '1080p' | '720p' | '480p' | 'mp3') => {
    const quality = forcedQuality || batchQuality;
    const targetItems = allItems.filter(item => selectedIds.has(item.id));
    if (targetItems.length === 0) {
      onShowToast('Please select at least 1 video from the playlist.');
      return;
    }

    setIsQueueRunning(true);
    cancelQueueRef.current = false;
    setQueueProgress({ current: 0, total: targetItems.length, title: '' });

    onShowToast(`Started queue: ${targetItems.length} videos in ${quality}...`);

    for (let i = 0; i < targetItems.length; i++) {
      if (cancelQueueRef.current) {
        onShowToast('Playlist download queue stopped.');
        break;
      }

      const item = targetItems[i];
      setQueueProgress({
        current: i + 1,
        total: targetItems.length,
        title: item.title
      });

      const isAudio = quality === 'mp3';
      const ext = isAudio ? 'mp3' : 'mp4';
      const cleanTitle = item.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
      const filename = `DownBoss_${cleanTitle}_${quality}.${ext}`;
      const targetUrl = item.url.startsWith('http') ? item.url : `https://www.youtube.com/watch?v=${item.id}`;

      try {
        await downloadMediaFile(targetUrl, filename);
        saveDownloadToHistory({
          title: item.title,
          platform: isAudio ? 'YouTube Audio (MP3)' : `YouTube Playlist (${quality})`,
          quality: quality === 'mp3' ? 'MP3 320k' : `${quality} HD`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString(),
          url: targetUrl
        });
      } catch (err) {
        console.error('Batch download item error:', err);
      }

      // 1.4s delay between items to allow browser download manager to schedule cleanly
      if (i < targetItems.length - 1) {
        await new Promise(res => setTimeout(res, 1400));
      }
    }

    setIsQueueRunning(false);
    onShowToast(`Playlist download queue completed!`);
  };

  const handleStopQueue = () => {
    cancelQueueRef.current = true;
    setIsQueueRunning(false);
  };

  // Copy all links helper
  const handleCopyAllLinks = () => {
    const targetItems = selectedIds.size > 0
      ? allItems.filter(item => selectedIds.has(item.id))
      : allItems;
    const links = targetItems.map(item => item.url).join('\n');
    navigator.clipboard.writeText(links);
    setCopiedLinks(true);
    onShowToast(`Copied ${targetItems.length} video links to clipboard!`);
    setTimeout(() => setCopiedLinks(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      
      {/* Playlist Hero Overview Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/10 via-rose-500/5 to-transparent dark:from-red-950/40 dark:via-gray-900 dark:to-gray-900 border border-red-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          
          {/* Playlist Cover Art with Stacked Count Badge */}
          <div className="relative w-full md:w-56 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-950 flex-shrink-0 shadow-lg group">
            <img
              src={mediaData.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'}
              alt={mediaData.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
              <span className="self-start px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md bg-red-600">
                <OfficialLogo id="youtube-playlist" className="w-3.5 h-3.5" />
                <span>YouTube Playlist</span>
              </span>
              <div className="flex items-center justify-between text-white text-xs font-semibold">
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                  <Layers className="w-3.5 h-3.5 text-red-400" />
                  {allItems.length} Videos
                </span>
                <span className="text-[11px] text-gray-300">Ready to DL</span>
              </div>
            </div>
          </div>

          {/* Details & Primary Batch Toolbar */}
          <div className="flex-1 flex flex-col justify-between gap-4 w-full">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Multi-Video Playlist
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Curator: <strong className="text-gray-900 dark:text-gray-200">{mediaData.author}</strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white line-clamp-2">
                {mediaData.title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Download the entire playlist, specific tracks, or convert all selected videos to MP3 audio files.
              </p>
            </div>

            {/* Batch Action Buttons Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              
              {/* Download Selected (MP4 Video) */}
              <button
                type="button"
                onClick={() => handleStartBatchDownload('720p')}
                disabled={isQueueRunning || selectedIds.size === 0}
                className="btn-shimmer px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-red-600/25 active:scale-95 transition-all disabled:opacity-50"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download Selected ({selectedIds.size}) MP4</span>
              </button>

              {/* Download Selected (MP3 Audio) */}
              <button
                type="button"
                onClick={() => handleStartBatchDownload('mp3')}
                disabled={isQueueRunning || selectedIds.size === 0}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <Music className="w-4 h-4" />
                <span>Download All as MP3 ({selectedIds.size})</span>
              </button>

              {/* Copy Links */}
              <button
                type="button"
                onClick={handleCopyAllLinks}
                className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                title="Copy all URLs to clipboard"
              >
                {copiedLinks ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLinks ? 'Copied!' : 'Copy Links'}</span>
              </button>

            </div>

          </div>

        </div>

        {/* Live Queue Progress Banner */}
        {isQueueRunning && (
          <div className="mt-4 p-4 rounded-xl border border-red-500/40 bg-red-500/10 dark:bg-red-950/40 flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  Processing Playlist: Downloading {queueProgress.current} of {queueProgress.total}...
                </span>
              </div>
              <button
                type="button"
                onClick={handleStopQueue}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 transition-colors"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop Queue</span>
              </button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-mono">
              ▶ {queueProgress.title || 'Preparing download...'}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(queueProgress.current / Math.max(1, queueProgress.total)) * 100}%`
                }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Playlist Tracklist Toolbar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-darkCard p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        
        {/* Select All Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-red-600" />
            ) : (
              <Square className="w-4 h-4 text-gray-400" />
            )}
            <span>Select All ({allItems.length})</span>
          </button>

          <span className="text-xs text-gray-400">•</span>

          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Selected: <strong className="text-red-600 dark:text-red-400">{selectedIds.size}</strong>
          </span>
        </div>

        {/* Search within playlist */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playlist tracks..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

      </div>

      {/* Tracklist List Grid */}
      <div className="flex flex-col gap-2.5">
        {filteredItems.map((item) => {
          const isSelected = selectedIds.has(item.id);
          const activeDl = downloadingItems[item.id];

          return (
            <div
              key={item.id}
              className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'border-red-500/40 bg-red-50/20 dark:bg-red-950/20 shadow-sm'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-darkCard hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              {/* Left Column: Checkbox, Index, Thumbnail, Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                
                {/* Select Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleItemSelection(item.id)}
                  className="text-gray-400 hover:text-red-600 p-0.5 rounded transition-colors flex-shrink-0"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-red-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                {/* Track Index Badge */}
                <span className="font-mono text-xs font-bold text-gray-400 w-6 text-center flex-shrink-0">
                  #{item.index}
                </span>

                {/* Thumbnail with duration badge */}
                <div className="relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 shadow-sm">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-mono text-white">
                    {item.duration}
                  </span>
                </div>

                {/* Title and Channel */}
                <div className="flex-1 min-w-0 pr-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
                    title={item.title}
                  >
                    <span>{item.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity flex-shrink-0" />
                  </a>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {item.author}
                  </p>
                </div>

              </div>

              {/* Right Column: Direct One-Click Actions */}
              <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                
                {/* 720p HD Video */}
                <button
                  type="button"
                  onClick={() => handleDownloadItem(item, '720p')}
                  disabled={!!activeDl}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-red-950/60 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                  title="Fast download 720p HD MP4"
                >
                  {activeDl === '720p' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  ) : (
                    <Zap className="w-3 h-3 text-amber-500" />
                  )}
                  <span>720p HD</span>
                </button>

                {/* 1080p HD Video */}
                <button
                  type="button"
                  onClick={() => handleDownloadItem(item, '1080p')}
                  disabled={!!activeDl}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-red-950/60 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                  title="Download 1080p Full HD MP4"
                >
                  {activeDl === '1080p' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  ) : (
                    <Film className="w-3 h-3 text-red-500" />
                  )}
                  <span>1080p</span>
                </button>

                {/* MP3 Audio */}
                <button
                  type="button"
                  onClick={() => handleDownloadItem(item, 'mp3')}
                  disabled={!!activeDl}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                  title="Download MP3 Audio Track"
                >
                  {activeDl === 'mp3' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  ) : (
                    <Music className="w-3 h-3 text-emerald-500" />
                  )}
                  <span>MP3</span>
                </button>

              </div>

            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              No videos matching "{searchQuery}"
            </p>
            <p className="text-xs text-gray-400 mt-1">Try searching for a different keyword or artist.</p>
          </div>
        )}
      </div>

    </div>
  );
};
