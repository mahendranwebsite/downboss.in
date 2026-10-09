'use client';

import React from 'react';
import { HistoryItem } from '../lib/types';
import { History, Trash2, X, CheckCircle2, DownloadCloud, ExternalLink } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onReDownload?: (item: HistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onReDownload
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Download History</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs flex flex-col items-center gap-2">
              <History className="w-8 h-8 opacity-40 text-gray-500" />
              <p>No recent downloads found in local storage.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="font-semibold text-xs text-gray-900 dark:text-white truncate" title={item.title}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                      {item.quality}
                    </span>
                    <span>{item.platform}</span>
                    <span>•</span>
                    <span>{item.date} {item.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-emerald-500" title="Completed">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
