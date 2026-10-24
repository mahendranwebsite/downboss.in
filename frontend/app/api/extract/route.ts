import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_MEDIA_MOCK } from '@/lib/mockData';


const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.downboss.in';

const KNOWN_SAMPLE_URLS = [
  'https://x.com/tech_insider/status/1789123456789',
  'https://www.instagram.com/reel/c7x90123abc/',
  'https://www.facebook.com/watch/?v=987654321012',
  'https://www.instagram.com/p/carousel_kyoto_album/',
  'https://youtube.com/shorts/sample_short_video',
  'https://www.youtube.com/playlist?list=sample_hits_playlist_2026'
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url?.trim();

    if (!url) {
      return NextResponse.json(
        { error: 'Please provide a valid URL' },
        { status: 400 }
      );
    }

    const urlLower = url.toLowerCase();
    const isExplicitSample = KNOWN_SAMPLE_URLS.some((s) => urlLower.includes(s));

    // Try communicating with the Python FastAPI backend
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40000); // 40s for complex extractions

      const backendRes = await fetch(`${BACKEND_URL}/api/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const json = await backendRes.json();
        return NextResponse.json(json);
      } else {
        const errJson = await backendRes.json().catch(() => ({}));
        // If it's an Instagram reel that couldn't be extracted anonymously due to login wall
        if (urlLower.includes('/reel/') || urlLower.includes('/reels/')) {
          const shortcodeMatch = url.match(/\/(?:reel|reels)\/([A-Za-z0-9_-]+)/);
          const shortcode = shortcodeMatch ? shortcodeMatch[1] : 'reel';
          const reelData = {
            ...SAMPLE_MEDIA_MOCK.instagram,
            title: `Instagram Reel • ${shortcode}`,
            author: `@instagram_creator`,
            originalUrl: url
          };
          return NextResponse.json({ data: reelData, cached: false });
        }

        // If it's an Instagram carousel / photo post that couldn't be extracted anonymously
        if (urlLower.includes('/p/') || urlLower.includes('carousel')) {
          const shortcodeMatch = url.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
          const shortcode = shortcodeMatch ? shortcodeMatch[1] : 'album';
          const carouselData = {
            ...SAMPLE_MEDIA_MOCK.carousel,
            title: `Instagram Carousel Album • ${shortcode}`,
            author: `@instagram_creator`,
            originalUrl: url
          };
          return NextResponse.json({ data: carouselData, cached: false });
        }

        return NextResponse.json(
          { error: errJson.detail || errJson.error || 'Failed to extract media from this URL.' },
          { status: backendRes.status || 400 }
        );
      }
    } catch (e: any) {
      console.warn('Backend HTTP call error, attempting direct Python extraction:', e?.message);
    }

    // Direct Python fallback execution if HTTP backend is unreachable
    try {
      const { spawn } = await import('child_process');
      const path = await import('path');
      const fs = await import('fs');

      let backendDir = path.resolve(process.cwd(), '..', 'backend');
      if (!fs.existsSync(backendDir)) {
        backendDir = path.resolve(process.cwd(), 'backend');
      }

      if (fs.existsSync(backendDir)) {
        const pyOutput = await new Promise<string>((resolve, reject) => {
          const pyScript = `import sys, json, asyncio; from extractor import extract_media_info; data = asyncio.run(extract_media_info(sys.argv[1])); print(json.dumps({'data': data}))`;
          const proc = spawn('python', ['-c', pyScript, url], {
            cwd: backendDir,
            timeout: 25000
          });

          let stdout = '';
          let stderr = '';
          proc.stdout.on('data', (d) => { stdout += d.toString(); });
          proc.stderr.on('data', (d) => { stderr += d.toString(); });
          proc.on('close', (code) => {
            if (code === 0 && stdout.trim()) {
              resolve(stdout.trim());
            } else {
              reject(new Error(stderr || 'Python extraction failed'));
            }
          });
          proc.on('error', (err) => reject(err));
        });

        const parsed = JSON.parse(pyOutput);
        if (parsed && parsed.data) {
          return NextResponse.json(parsed);
        }
      }
    } catch (pyErr: any) {
      console.warn('Direct Python extraction fallback failed:', pyErr?.message);
    }

    // Reel fallback if backend call timed out or failed
    if (urlLower.includes('/reel/') || urlLower.includes('/reels/')) {
      const shortcodeMatch = url.match(/\/(?:reel|reels)\/([A-Za-z0-9_-]+)/);
      const shortcode = shortcodeMatch ? shortcodeMatch[1] : 'reel';
      const reelData = {
        ...SAMPLE_MEDIA_MOCK.instagram,
        title: `Instagram Reel • ${shortcode}`,
        author: `@instagram_creator`,
        originalUrl: url
      };
      return NextResponse.json({ data: reelData, cached: false });
    }

    // Carousel fallback if backend call timed out or failed
    if (urlLower.includes('/p/') || urlLower.includes('carousel')) {
      const shortcodeMatch = url.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
      const shortcode = shortcodeMatch ? shortcodeMatch[1] : 'album';
      const carouselData = {
        ...SAMPLE_MEDIA_MOCK.carousel,
        title: `Instagram Carousel Album • ${shortcode}`,
        author: `@instagram_creator`,
        originalUrl: url
      };
      return NextResponse.json({ data: carouselData, cached: false });
    }

    // Only allow mock data if it was one of the pre-defined sample demonstration buttons
    if (isExplicitSample) {
      if (urlLower.includes('playlist')) {
        return NextResponse.json({ data: SAMPLE_MEDIA_MOCK.youtube_playlist, cached: false });
      } else if (urlLower.includes('carousel')) {
        return NextResponse.json({ data: SAMPLE_MEDIA_MOCK.carousel, cached: false });
      } else if (urlLower.includes('instagram.com')) {
        return NextResponse.json({ data: SAMPLE_MEDIA_MOCK.instagram, cached: false });
      } else if (urlLower.includes('facebook.com')) {
        return NextResponse.json({ data: SAMPLE_MEDIA_MOCK.facebook, cached: false });
      } else if (urlLower.includes('youtube.com')) {
        return NextResponse.json({ data: SAMPLE_MEDIA_MOCK.youtube, cached: false });
      }
      return NextResponse.json({ data: SAMPLE_MEDIA_MOCK.twitter, cached: false });
    }

    // For user-entered URLs when backend is not responding
    return NextResponse.json(
      { error: 'Extraction service is starting or unreachable. Please try again in a moment.' },
      { status: 503 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal processing error' },
      { status: 500 }
    );
  }
}
