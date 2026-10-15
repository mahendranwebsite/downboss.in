'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AdPlaceholderProps {
  slot: 'top-banner' | 'below-result' | 'sidebar' | 'footer-banner' | 'side-left' | 'side-right';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);

  const isSquareAd = slot === 'sidebar' || slot === 'side-left' || slot === 'side-right';
  const baseWidth = isSquareAd ? 300 : 728;
  const baseHeight = isSquareAd ? 250 : 90;
  const adKey = isSquareAd ? '6efd0b9ccd963175e1d9f0ab518d77b8' : '9b10bd4b0cf922ba57495bf09f23da3b';
  const scriptUrl = isSquareAd
    ? 'https://bellnewyork.org/22/6efd0b9ccd963175e1d9f0ab518d77b8'
    : 'https://bellnewyork.org/22/9b10bd4b0cf922ba57495bf09f23da3b';

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dynamically calculate scale factor for responsive display
  useEffect(() => {
    if (!isClient) return;

    const computeScale = () => {
      if (wrapperRef.current) {
        const availableWidth = wrapperRef.current.clientWidth || window.innerWidth;
        const targetWidth = Math.min(availableWidth - 8, baseWidth);
        if (targetWidth < baseWidth && targetWidth > 0) {
          setScale(targetWidth / baseWidth);
        } else {
          setScale(1);
        }
      }
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [isClient, baseWidth]);

  // Inject the ad iframe inside isolated context
  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = `${baseWidth}`;
    iframe.height = `${baseHeight}`;
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
      'key' : '${adKey}',
      'format' : 'iframe',
      'height' : ${baseHeight},
      'width' : ${baseWidth},
      'params' : {}
    };
  <\/script>
  <script type="text/javascript" src="${scriptUrl}"><\/script>
</body>
</html>`;

    iframe.srcdoc = adHtml;
    containerRef.current.appendChild(iframe);
  }, [isClient, slot, baseWidth, baseHeight, adKey, scriptUrl]);

  const scaledWidth = Math.round(baseWidth * scale);
  const scaledHeight = Math.round(baseHeight * scale);

  return (
    <div
      ref={wrapperRef}
      className={`w-full max-w-full overflow-hidden flex flex-col items-center justify-center text-center my-2 transition-all ${className}`}
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
            width: baseWidth,
            height: baseHeight,
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
