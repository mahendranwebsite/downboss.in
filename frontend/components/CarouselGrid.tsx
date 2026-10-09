'use client';

import React, { useState } from 'react';
import { MediaData, CarouselItem } from '../lib/types';
import { Download, Archive, Image as ImageIcon, Video, CheckCircle2, Loader2 } from 'lucide-react';
import { downloadMediaFile, downloadCarouselAsZip, saveDownloadToHistory } from '../lib/api';

interface CarouselGridProps {
  mediaData: MediaData;
  onShowToast: (msg: string) => void;
}

export const CarouselGrid: React.FC<CarouselGridProps> = ({ mediaData, onShowToast }) => {
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<number>(0);
  const [downloadingItems, setDownloadingItems] = useState<Record<string, boolean>>({});

  const handleDownloadSingleItem = async (item: CarouselItem, index: number) => {
    setDownloadingItems(prev => ({ ...prev, [item.id]: true }));
    const ext = item.type === 'video' ? 'mp4' : 'jpg';
    const filename = `DownBoss_${mediaData.author.replace('@', '')}_slide_${index + 1}.${ext}`;

    try {
      await downloadMediaFile(item.url, filename);
      saveDownloadToHistory({
        title: `${mediaData.title} (Slide ${index + 1})`,
        platform: mediaData.type,
        quality: 'Original HD',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        url: item.url
      });
      onShowToast(`Downloaded slide ${index + 1}`);
    } catch {
      onShowToast(`Failed to download slide ${index + 1}`);
    } finally {
      setDownloadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleDownloadZip = async () => {
    if (!mediaData.items || mediaData.items.length === 0) return;
    setDownloadingZip(true);
    setZipProgress(5);

    try {
      await downloadCarouselAsZip(mediaData.items, mediaData.title, (percent) => {
        setZipProgress(percent);
      });
      saveDownloadToHistory({
        title: `${mediaData.title} (Full ZIP Archive)`,
        platform: mediaData.type,
        quality: `${mediaData.items.length} Files ZIP`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        url: mediaData.originalUrl
      });
      onShowToast(`ZIP archive downloaded successfully!`);
    } catch (err) {
      console.error(err);
      onShowToast('Error building ZIP file.');
    } finally {
      setDownloadingZip(false);
      setZipProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Carousel Header with Details and "Download All ZIP" */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              Carousel Post
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {mediaData.items?.length || 0} Media Slides
            </span>
            <span className="text-xs text-gray-400">{mediaData.author}</span>
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">
            {mediaData.title}
          </h3>
        </div>

        {/* Big ZIP Download Button */}
        <button
          onClick={handleDownloadZip}
          disabled={downloadingZip}
          className="btn-shimmer w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.02] transition-all flex-shrink-0 disabled:opacity-70"
        >
          {downloadingZip ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Packaging ZIP ({zipProgress}%)</span>
            </>
          ) : (
            <>
              <Archive className="w-4 h-4" />
              <span>Download All as ZIP ({mediaData.items?.length || 0} items)</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of all Slides */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {mediaData.items?.map((item, idx) => {
          const isItemDownloading = downloadingItems[item.id];
          return (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex flex-col shadow-sm hover:shadow-md transition-all"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-800">
                <img
                  src={item.thumbnail || item.url}
                  alt={item.caption || `Slide ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Slide index badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white">
                  #{idx + 1}
                </span>

                {/* Media Type indicator */}
                <span className="absolute top-2 right-2 p-1 rounded-md bg-black/60 backdrop-blur-md text-white">
                  {item.type === 'video' ? (
                    <Video className="w-3.5 h-3.5" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5" />
                  )}
                </span>
              </div>

              {/* Slide caption and individual download button */}
              <div className="p-2.5 flex flex-col justify-between gap-2 flex-1 bg-white dark:bg-darkCard">
                <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300 truncate">
                  {item.caption || `Slide ${idx + 1}`}
                </p>
                <button
                  type="button"
                  onClick={() => handleDownloadSingleItem(item, idx)}
                  disabled={isItemDownloading}
                  className="w-full py-1.5 px-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isItemDownloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{isItemDownloading ? 'Saving...' : 'Download'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
