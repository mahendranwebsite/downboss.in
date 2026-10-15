'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AdPlaceholderProps {
  slot: 'top-banner' | 'below-result' | 'sidebar' | 'footer-banner';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    // Reset container on mount or slot change
    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = '728';
    iframe.height = '90';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    iframe.title = 'Advertisement';

    const adHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '9b10bd4b0cf922ba57495bf09f23da3b',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  <\/script>
  <script type="text/javascript" src="https://bellnewyork.org/22/9b10bd4b0cf922ba57495bf09f23da3b"><\/script>
</body>
</html>`;

    iframe.srcdoc = adHtml;
    containerRef.current.appendChild(iframe);
  }, [isClient, slot]);

  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center my-3 transition-all ${className}`}
      data-ad-slot={slot}
    >
      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-1">
        Advertisement
      </span>
      <div className="w-full flex justify-center items-center overflow-x-auto scrollbar-none py-1">
        <div
          ref={containerRef}
          className="flex justify-center items-center"
          style={{ minWidth: 728, width: 728, height: 90 }}
        />
      </div>
    </div>
  );
};
