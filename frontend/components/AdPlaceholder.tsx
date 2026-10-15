'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AdPlaceholderProps {
  slot: 'top-banner' | 'below-result' | 'sidebar' | 'footer-banner';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dynamically calculate scale factor for mobile devices
  useEffect(() => {
    if (!isClient) return;

    const computeScale = () => {
      if (wrapperRef.current) {
        // Measure the container width (subtract small padding so it never touches screen edges)
        const availableWidth = wrapperRef.current.clientWidth || window.innerWidth;
        const targetWidth = Math.min(availableWidth - 8, 728);
        if (targetWidth < 728 && targetWidth > 0) {
          setScale(targetWidth / 728);
        } else {
          setScale(1);
        }
      }
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [isClient]);

  // Inject the ad iframe inside isolated context
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

  const scaledWidth = Math.round(728 * scale);
  const scaledHeight = Math.round(90 * scale);

  return (
    <div
      ref={wrapperRef}
      className={`w-full max-w-full overflow-hidden flex flex-col items-center justify-center text-center my-2.5 transition-all ${className}`}
      data-ad-slot={slot}
    >
      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-1">
        Advertisement
      </span>
      <div
        className="relative flex items-center justify-center overflow-hidden max-w-full mx-auto"
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: 728,
            height: 90,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  );
};
