import JSZip from 'jszip';
import { MediaData, HistoryItem } from './types';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.downboss.in';

export async function fetchMediaInfo(url: string): Promise<MediaData> {
  const cleanUrl = url.trim();

  const res = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: cleanUrl })
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || json.detail || 'Could not extract media from this link.');
  }

  if (json && json.data) {
    return json.data;
  }

  throw new Error('No media information returned for this URL.');
}

export async function downloadMediaFile(
  url: string,
  filename: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  let targetDownloadUrl = url;
  if (url.startsWith('/api/download')) {
    targetDownloadUrl = `${BACKEND_URL}${url}`;
  }

  // Initial progress
  if (onProgress) onProgress(10);

  // Progressive timer to simulate smooth downloading updates (10%, 20%, 30%...)
  let currentPercent = 10;
  const progressTimer = setInterval(() => {
    if (currentPercent < 90) {
      currentPercent += 10;
      if (onProgress) onProgress(currentPercent);
    }
  }, 400);

  // 1. Fetch the file as a Blob and trigger a native download.
  try {
    let res: Response | null = null;
    const isDirectBackend =
      targetDownloadUrl.startsWith('http://localhost:8000') ||
      targetDownloadUrl.startsWith('http://127.0.0.1:8000');

    if (isDirectBackend) {
      try {
        res = await fetch(targetDownloadUrl);
      } catch {
        res = null;
      }
    }

    // If direct fetch didn't succeed or it's a cross-origin URL, use our streaming proxy
    if (!res || !res.ok) {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(targetDownloadUrl)}&filename=${encodeURIComponent(filename)}`;
      res = await fetch(proxyUrl);
    }

    if (!res || !res.ok) {
      const errData = await res?.json().catch(() => ({})) || {};
      throw new Error(errData.error || errData.detail || 'Download stream unreachable. Please try again.');
    }

    const contentLength = res.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    if (res.body && totalBytes > 0) {
      clearInterval(progressTimer);
      const reader = res.body.getReader();
      const chunks: BlobPart[] = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedBytes += value.length;
          const pct = Math.min(95, Math.round((receivedBytes / totalBytes) * 100));
          if (onProgress) onProgress(pct);
        }
      }

      const blob = new Blob(chunks, {
        type: res.headers.get('content-type') || 'application/octet-stream'
      });
      if (onProgress) onProgress(100);
      triggerBlobDownload(blob, filename);
      return;
    }

    const blob = await res.blob();
    clearInterval(progressTimer);
    if (onProgress) onProgress(100);
    triggerBlobDownload(blob, filename);
    return;
  } catch (err: any) {
    clearInterval(progressTimer);
    console.error('Download error:', err);
    throw new Error(err?.message || 'Download failed. Please try again.');
  }
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

export async function downloadCarouselAsZip(
  items: { id: string; url: string; caption?: string; type: string }[],
  postTitle: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const cleanPostTitle = postTitle.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
  const folderName = cleanPostTitle ? `DownBoss_${cleanPostTitle}` : 'DownBoss_Album';
  const folder = zip.folder(folderName) || zip;

  let completed = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const ext = item.type === 'video' ? 'mp4' : 'jpg';
    const fileName = `slide_${i + 1}.${ext}`;

    try {
      const response = await fetch(item.url);
      if (response.ok) {
        const blob = await response.blob();
        folder.file(fileName, blob);
      } else {
        folder.file(fileName, `Content from ${item.url}`);
      }
    } catch {
      folder.file(fileName, `Content from ${item.url}`);
    }

    completed++;
    if (onProgress) {
      onProgress(Math.round((completed / items.length) * 80));
    }
  }

  if (onProgress) onProgress(90);
  const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(80 + Math.round((metadata.percent / 100) * 20));
    }
  });

  triggerBlobDownload(zipBlob, `${folderName}.zip`);
  if (onProgress) onProgress(100);
}

// History Storage Management
const HISTORY_KEY = 'downboss_history';

export function getDownloadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY) || localStorage.getItem('omnisave_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDownloadToHistory(item: Omit<HistoryItem, 'id'>): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getDownloadHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    const updated = [newItem, ...history].slice(0, 30);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history', e);
  }
}

export function clearDownloadHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}
