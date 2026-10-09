'use client';

import React, { useState } from 'react';
import { Layers, X, Play } from 'lucide-react';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBatch: (urls: string[]) => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({ isOpen, onClose, onStartBatch }) => {
  const [batchText, setBatchText] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const lines = batchText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && (line.startsWith('http://') || line.startsWith('https://')));

    if (lines.length === 0) {
      alert('Please enter at least one valid URL (starting with http:// or https://)');
      return;
    }

    onStartBatch(lines);
    setBatchText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Batch Link Downloader</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Paste multiple social media URLs below (one link per line):
        </p>

        {/* Textarea */}
        <textarea
          rows={6}
          value={batchText}
          onChange={(e) => setBatchText(e.target.value)}
          placeholder={`https://x.com/user/status/123\nhttps://instagram.com/reel/456\nhttps://facebook.com/watch/?v=789\nhttps://tiktok.com/@user/video/999`}
          className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-all"
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Process Batch</span>
          </button>
        </div>

      </div>
    </div>
  );
};
