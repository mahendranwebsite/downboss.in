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

  if (onProgress) onProgress(50);

  // 1. Trigger via hidden iframe (100% bypasses Chrome popup blocker & opens Downloads tray)
  try {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = targetDownloadUrl;
    document.body.appendChild(iframe);
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch {}
    }, 45000);
  } catch (frameErr) {
    console.warn('Iframe download trigger error:', frameErr);
  }

  // 2. Also trigger direct anchor download without target=_blank
  try {
    const link = document.createElement('a');
    link.href = targetDownloadUrl;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {}
    }, 2000);
  } catch (linkErr) {
    console.warn('Anchor download trigger error:', linkErr);
  }

  if (onProgress) onProgress(100);
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
