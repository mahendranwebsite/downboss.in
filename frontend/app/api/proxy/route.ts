import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.downboss.in';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'DownBoss_media.mp4';

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL parameter' }, { status: 400 });
  }

  // Safe filename
  const cleanFilename = filename.replace(/["/\\]/g, '_');

  // Resolve relative URLs or backend port URLs
  let resolvedUrl = targetUrl;
  if (resolvedUrl.startsWith('/api/download')) {
    resolvedUrl = `${BACKEND_URL}${resolvedUrl}`;
  } else if (resolvedUrl.startsWith('http://localhost:8000')) {
    resolvedUrl = resolvedUrl.replace('http://localhost:8000', BACKEND_URL);
  }

  try {
    const urlLower = resolvedUrl.toLowerCase();
    let referer = 'https://www.google.com/';
    if (urlLower.includes('instagram.com') || urlLower.includes('cdninstagram') || urlLower.includes('fbcdn.net')) {
      referer = 'https://www.instagram.com/';
    } else if (urlLower.includes('twitter.com') || urlLower.includes('x.com') || urlLower.includes('twimg.com')) {
      referer = 'https://twitter.com/';
    }

    const upstreamRes = await fetch(resolvedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Referer: referer,
        Accept: '*/*'
      },
      redirect: 'follow'
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      const errText = await upstreamRes.text().catch(() => '');
      return NextResponse.json(
        { error: errText || `Media stream error (Status: ${upstreamRes.status})` },
        { status: upstreamRes.status >= 400 ? upstreamRes.status : 502 }
      );
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    const contentLength = upstreamRes.headers.get('content-length');

    const headers: Record<string, string> = {
      'Content-Disposition': `attachment; filename="${cleanFilename}"`,
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length'
    };

    if (contentLength) {
      headers['Content-Length'] = contentLength;
    }

    return new NextResponse(upstreamRes.body as any, {
      status: 200,
      headers
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Download failed: ${err?.message || 'Remote media server error'}` },
      { status: 500 }
    );
  }
}
