import React from 'react';

interface AdPlaceholderProps {
  slot: 'top-banner' | 'below-result' | 'sidebar' | 'footer-banner';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '' }) => {
  const getSlotInfo = () => {
    switch (slot) {
      case 'top-banner':
        return { label: 'Top Banner Ad Slot (728x90 / Responsive)', minHeight: 'min-h-[90px]' };
      case 'below-result':
        return { label: 'High-Impact Result Ad Slot (Native / Display)', minHeight: 'min-h-[120px]' };
      case 'sidebar':
        return { label: 'Sidebar Ad Slot (300x250 Medium Rectangle)', minHeight: 'min-h-[250px]' };
      case 'footer-banner':
        return { label: 'Footer Banner Ad Slot (Responsive)', minHeight: 'min-h-[90px]' };
    }
  };

  const info = getSlotInfo();

  return (
    <div
      className={`w-full ${info.minHeight} rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-darkCard/50 p-3 flex flex-col items-center justify-center text-center transition-all ${className}`}
      data-ad-slot={slot}
    >
      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-1">
        Advertisement
      </span>
      <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
        {info.label}
      </p>
      {/* Ready for Google AdSense <ins class="adsbygoogle" ...></ins> */}
    </div>
  );
};
