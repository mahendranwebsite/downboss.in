import React from 'react';
import { Zap, ShieldCheck, Sparkles, CheckCheck } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card-glow-hover group p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 flex flex-col gap-2 transition-all hover:border-blue-500/50 shadow-sm hover:shadow-lg">
        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          <Zap className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">Lightning Fast</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Direct CDN media streaming with minimal processing delay and high bitrate speed.
        </p>
      </div>

      <div className="card-glow-hover group p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 flex flex-col gap-2 transition-all hover:border-purple-500/50 shadow-sm hover:shadow-lg">
        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">No Registration</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          100% free and private. No login, zero data tracked.
        </p>
      </div>

      <div className="card-glow-hover group p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 flex flex-col gap-2 transition-all hover:border-pink-500/50 shadow-sm hover:shadow-lg">
        <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          <Sparkles className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">Full HD & Audio</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Extract up to 4K resolution videos or rip clean high-quality MP3 audio files.
        </p>
      </div>
    </div>
  );
};
