'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Layers, History, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenBatch?: () => void;
  onOpenHistory: () => void;
  onShowToast: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBatch, onOpenHistory, onShowToast }) => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('downboss_theme') || localStorage.getItem('omnisave_theme');
    if (savedTheme) {
      const darkActive = savedTheme === 'dark';
      setIsDark(darkActive);
      document.documentElement.classList.toggle('dark', darkActive);
    } else {
      // Default dark
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('downboss_theme', 'dark');
      onShowToast('Switched to Dark Mode');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('downboss_theme', 'light');
      onShowToast('Switched to Light Mode');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-darkBg/80 glass-panel transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black border border-sky-500/40 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 group-hover:border-sky-400 group-hover:shadow-sky-500/40 transition-all duration-300 flex-shrink-0">
            <Image
              src="/logo-icon.png"
              alt="DownBoss.in Logo"
              width={40}
              height={40}
              className="object-contain w-full h-full p-0.5 group-hover:scale-110 transition-transform duration-300"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white leading-none">
                Down<span className="text-[#00A3FF]">Boss</span>
              </span>
              <span className="text-xs font-bold text-sky-500 dark:text-sky-400 ml-0.5">.in</span>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5 hidden sm:inline font-medium">
              Free All-in-One Media Downloader
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            How it works
          </a>
          <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* History Button */}
          <button
            id="openHistoryBtn"
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all active:scale-95"
            title="Recent download history"
          >
            <History className="w-4 h-4 text-purple-500" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            id="themeToggleBtn"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all active:scale-90"
            aria-label="Toggle color theme"
          >
            {mounted && isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
