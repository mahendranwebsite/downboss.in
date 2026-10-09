import React from 'react';
import { Copy, Link2, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Copy Media Link',
      desc: 'Open Instagram, TikTok, YouTube, X, or Facebook and copy the shareable link of any reel, video, or carousel post.',
      icon: <Copy className="w-5 h-5 text-indigo-500" />
    },
    {
      step: '02',
      title: 'Paste URL in DownBoss',
      desc: 'Paste the link into the search box above or tap the "Paste" button to auto-detect your platform and format.',
      icon: <Link2 className="w-5 h-5 text-purple-500" />
    },
    {
      step: '03',
      title: 'Download & Save',
      desc: 'Select your preferred resolution (1080p, 720p, MP3) or click "Download All (ZIP)" for carousel posts to save instantly.',
      icon: <DownloadCloud className="w-5 h-5 text-pink-500" />
    }
  ];

  return (
    <section id="how-it-works" className="py-6 space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
          How It Works in 3 Simple Steps
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Save your favorite reels, videos, and carousels with no technical setup required
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="card-glow-hover p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 flex flex-col gap-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800/80 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {s.icon}
              </div>
              <span className="text-2xl font-black text-gray-200 dark:text-gray-800 group-hover:text-indigo-500/40 group-hover:scale-110 transition-all duration-300">
                {s.step}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">
                {s.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
