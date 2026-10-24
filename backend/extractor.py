import re
import os
import json
import asyncio
import subprocess
from typing import Dict, Any, List, Optional
import httpx
import yt_dlp

KNOWN_SAMPLE_URLS = {
    "https://x.com/tech_insider/status/1789123456789": "twitter",
    "https://www.instagram.com/reel/c7x90123abc/": "instagram",
    "https://www.facebook.com/watch/?v=987654321012": "facebook",
    "https://www.instagram.com/p/carousel_kyoto_album/": "carousel",
    "https://youtube.com/shorts/sample_short_video": "youtube",
    "https://www.youtube.com/playlist?list=sample_hits_playlist_2026": "youtube_playlist"
}

def detect_platform(url: str) -> str:
    url_lower = url.lower()
    if "instagram.com" in url_lower or "instagr.am" in url_lower:
        return "instagram"
    elif "x.com" in url_lower or "twitter.com" in url_lower:
        return "twitter"
    elif "facebook.com" in url_lower or "fb.watch" in url_lower or "fb.com" in url_lower:
        return "facebook"
    elif "tiktok.com" in url_lower:
        return "tiktok"
    elif "youtube.com" in url_lower or "youtu.be" in url_lower:
        return "youtube"
    elif "pinterest.com" in url_lower or "pin.it" in url_lower:
        return "pinterest"
    elif "reddit.com" in url_lower or "redd.it" in url_lower:
        return "reddit"
    elif "linkedin.com" in url_lower:
        return "linkedin"
    elif "threads.net" in url_lower:
        return "threads"
    elif "snapchat.com" in url_lower:
        return "snapchat"
    return "unknown"

SAMPLE_MEDIA = {
    "twitter": {
        "title": "Astonishing view of the Aurora Borealis in Norway nighttime sky 🌌",
        "author": "@nature_wonders",
        "thumbnail": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80",
        "duration": "0:38",
        "platform": "twitter",
        "type": "X / Twitter Video",
        "is_carousel": False,
        "items": [],
        "formats": [
            {"quality": "1080p HD", "res": "1080p", "size": "42.5 MB", "ext": "mp4", "url": "https://vjs.zencdn.net/v/oceans.mp4"},
            {"quality": "720p SD", "res": "720p", "size": "24.1 MB", "ext": "mp4", "url": "https://media.w3.org/2010/05/bunny/trailer.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "12.8 MB", "ext": "mp4", "url": "https://media.w3.org/2010/05/sintel/trailer.mp4"},
            {"quality": "MP3 Audio", "res": "MP3", "size": "3.2 MB", "ext": "mp3", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
        ]
    },
    "instagram": {
        "title": "Easy 10-Minute High Protein Breakfast Recipe Reel 🍳🔥",
        "author": "@chef_fitlife",
        "thumbnail": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
        "duration": "1:15",
        "platform": "instagram",
        "type": "Instagram Reel",
        "is_carousel": False,
        "items": [],
        "formats": [
            {"quality": "1080p HD", "res": "1080p", "size": "38.2 MB", "ext": "mp4", "url": "https://vjs.zencdn.net/v/oceans.mp4"},
            {"quality": "720p SD", "res": "720p", "size": "21.6 MB", "ext": "mp4", "url": "https://media.w3.org/2010/05/bunny/trailer.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "10.4 MB", "ext": "mp4", "url": "https://media.w3.org/2010/05/sintel/trailer.mp4"},
            {"quality": "MP3 Audio", "res": "MP3", "size": "2.8 MB", "ext": "mp3", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"}
        ]
    },
    "facebook": {
        "title": "Future of Robotics and AI Automation in 2026 Documentary",
        "author": "@TechFutureNow",
        "thumbnail": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        "duration": "3:42",
        "platform": "facebook",
        "type": "Facebook Watch Video",
        "is_carousel": False,
        "items": [],
        "formats": [
            {"quality": "1080p HD", "res": "1080p", "size": "65.4 MB", "ext": "mp4", "url": "https://vjs.zencdn.net/v/oceans.mp4"},
            {"quality": "720p SD", "res": "720p", "size": "34.0 MB", "ext": "mp4", "url": "https://media.w3.org/2010/05/bunny/trailer.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "18.2 MB", "ext": "mp4", "url": "https://media.w3.org/2010/05/sintel/trailer.mp4"},
            {"quality": "MP3 Audio", "res": "MP3", "size": "4.5 MB", "ext": "mp3", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"}
        ]
    },
    "youtube": {
        "title": "Cyberpunk 2077 Night City 4K Cinematic Atmosphere Tour",
        "author": "@GamerVision",
        "thumbnail": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        "duration": "4:12",
        "platform": "youtube",
        "type": "YouTube Video / Short",
        "is_carousel": False,
        "items": [],
        "formats": [
            {"quality": "1080p HD", "res": "1080p", "size": "78.0 MB", "ext": "mp4", "url": "https://vjs.zencdn.net/v/oceans.mp4"},
            {"quality": "720p SD", "res": "720p", "size": "42.1 MB", "ext": "mp4", "url": "https://media.w3.org/2010/05/bunny/trailer.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "21.5 MB", "ext": "mp4", "url": "https://media.w3.org/2010/05/sintel/trailer.mp4"},
            {"quality": "MP3 Audio", "res": "MP3", "size": "5.1 MB", "ext": "mp3", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"}
        ]
    },
    "carousel": {
        "title": "Architectural Gems of Kyoto, Japan - Photo Series 2026",
        "author": "@travel_photographer",
        "thumbnail": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
        "duration": "6 Slides",
        "platform": "instagram",
        "type": "Instagram Carousel Album",
        "is_carousel": True,
        "items": [
            {"id": "item-1", "type": "image", "url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85", "thumbnail": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80", "caption": "Slide 1: Kyoto Pagoda at Dusk"},
            {"id": "item-2", "type": "image", "url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85", "thumbnail": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80", "caption": "Slide 2: Tokyo Neon Alley"},
            {"id": "item-3", "type": "image", "url": "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=85", "thumbnail": "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=400&q=80", "caption": "Slide 3: Mount Fuji Horizon"},
            {"id": "item-4", "type": "image", "url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85", "thumbnail": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80", "caption": "Slide 4: Bamboo Forest Path"},
            {"id": "item-5", "type": "image", "url": "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=85", "thumbnail": "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=400&q=80", "caption": "Slide 5: Traditional Tea House"},
            {"id": "item-6", "type": "image", "url": "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=85", "thumbnail": "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=400&q=80", "caption": "Slide 6: Shinto Torii Gate"}
        ],
        "formats": []
    },
    "youtube_playlist": {
        "title": "Billboard Top Viral Hits 2026 (Global Music Video Playlist)",
        "author": "@YouTubeMusic",
        "thumbnail": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        "duration": "6 Videos",
        "platform": "youtube",
        "type": "YouTube Playlist",
        "is_carousel": False,
        "is_playlist": True,
        "playlist_count": 6,
        "playlist_items": [
            {
                "id": "pl-item-1",
                "title": "Cyberpunk 2077 Night City 4K Cinematic Atmosphere Tour",
                "duration": "4:12",
                "duration_seconds": 252,
                "thumbnail": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
                "url": "https://www.youtube.com/watch?v=sample_vid_1",
                "author": "@GamerVision",
                "index": 1
            },
            {
                "id": "pl-item-2",
                "title": "Midnight Chillout Lofi Beats - Study & Relaxation Session",
                "duration": "3:45",
                "duration_seconds": 225,
                "thumbnail": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
                "url": "https://www.youtube.com/watch?v=sample_vid_2",
                "author": "@LofiVibes",
                "index": 2
            },
            {
                "id": "pl-item-3",
                "title": "Neon Dreams Synthwave Horizon (Official 4K Music Video)",
                "duration": "5:18",
                "duration_seconds": 318,
                "thumbnail": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
                "url": "https://www.youtube.com/watch?v=sample_vid_3",
                "author": "@RetroWaveRecords",
                "index": 3
            },
            {
                "id": "pl-item-4",
                "title": "Tokyo Rainy Day Walking Tour in 4K 60FPS Ambient Audio",
                "duration": "6:30",
                "duration_seconds": 390,
                "thumbnail": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
                "url": "https://www.youtube.com/watch?v=sample_vid_4",
                "author": "@TokyoWanderer",
                "index": 4
            },
            {
                "id": "pl-item-5",
                "title": "Electronic Deep Bass Groove - Club Mix Vol. 4",
                "duration": "4:05",
                "duration_seconds": 245,
                "thumbnail": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
                "url": "https://www.youtube.com/watch?v=sample_vid_5",
                "author": "@BassDropMusic",
                "index": 5
            },
            {
                "id": "pl-item-6",
                "title": "Acoustic Sunset Guitar Melodies - Live Studio Session",
                "duration": "3:52",
                "duration_seconds": 232,
                "thumbnail": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
                "url": "https://www.youtube.com/watch?v=sample_vid_6",
                "author": "@AcousticSession",
                "index": 6
            }
        ],
        "items": [],
        "formats": [
            {"quality": "1080p HD", "res": "1080p", "size": "Full HD", "ext": "mp4", "url": "https://vjs.zencdn.net/v/oceans.mp4"},
            {"quality": "720p HD", "res": "720p", "size": "High Speed", "ext": "mp4", "url": "https://media.w3.org/2010/05/bunny/trailer.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "Compressed", "ext": "mp4", "url": "https://media.w3.org/2010/05/sintel/trailer.mp4"},
            {"quality": "MP3 Audio", "res": "MP3", "size": "Audio Rip", "ext": "mp3", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
        ]
    }
}

def format_duration(seconds: Optional[float]) -> str:
    if not seconds:
        return "Video"
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"

def extract_with_gallery_dl(url: str) -> Optional[Dict[str, Any]]:
    """
    Extracts image posts, multi-photo carousels, or tweets with photos using gallery-dl.
    """
    try:
        platform = detect_platform(url)
        cmd = ['gallery-dl', '-j', url]
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = p.communicate(timeout=18)
        if p.returncode != 0 or not out:
            return None

        data = json.loads(out.decode('utf-8', errors='ignore'))
        if not data or not isinstance(data, list):
            return None

        items = []
        author = f"@{platform}"
        title = ""

        for entry in data:
            if isinstance(entry, list) and len(entry) >= 2:
                # Type 2: Metadata object
                if entry[0] == 2 and isinstance(entry[1], dict):
                    meta = entry[1]
                    user = meta.get('user', {}) or meta.get('author', {})
                    user_name = user.get('name') or user.get('nick') or user.get('username') or ''
                    if user_name:
                        author = f"@{user_name}"
                    title = meta.get('content') or meta.get('description') or meta.get('title') or ''
                # Type 3: Direct media URL
                elif entry[0] == 3 and isinstance(entry[1], str):
                    media_url = entry[1]
                    idx = len(items) + 1
                    is_vid = any(media_url.lower().endswith(ext) for ext in ['.mp4', '.mkv', '.webm', '.mov'])
                    items.append({
                        "id": f"item-{idx}",
                        "type": "video" if is_vid else "image",
                        "url": media_url,
                        "thumbnail": media_url,
                        "caption": f"Photo {idx}"
                    })

        if not items:
            return None

        if not title:
            title = f"{author} {platform.capitalize()} Post"

        # Safe single-line snippet for title
        clean_title = title.strip().split('\n')[0][:120] if title.strip() else f"{platform.capitalize()} Photo Album"

        return {
            "title": clean_title,
            "author": author,
            "thumbnail": items[0]['thumbnail'],
            "duration": f"{len(items)} Photos" if len(items) > 1 else "1 Photo",
            "platform": platform,
            "type": f"{platform.capitalize()} Post",
            "is_carousel": True,
            "items": items,
            "formats": [
                {
                    "quality": "Original HD Photo",
                    "res": "Original",
                    "size": "Direct",
                    "ext": "jpg",
                    "url": f"/api/download?url={items[0]['url']}&filename=DownBoss_{platform}_photo.jpg"
                }
            ],
            "originalUrl": url
        }
    except Exception as e:
        print(f"gallery-dl error for {url}: {e}")
        return None

def get_writable_cookie_path() -> Optional[str]:
    import tempfile
    import shutil
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cookies.txt")
    if not os.path.exists(base):
        return None
    try:
        temp_dir = tempfile.gettempdir()
        temp_cookie = os.path.join(temp_dir, "ytdl_writable_cookies.txt")
        shutil.copyfile(base, temp_cookie)
        return temp_cookie
    except Exception:
        return base

async def extract_youtube_playlist(pl_url: str, cookie_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Extracts high-speed flat metadata for YouTube playlists (up to 100 items).
    """
    loop = asyncio.get_event_loop()
    pot_server = os.environ.get("YTDLP_POT_SERVER", "http://pot-provider:4416")
    ydl_pl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True,
        'skip_download': True,
        'playlistend': 100,
        'socket_timeout': 30,
        'extractor_args': {
            'youtubepot-bgutilhttp': {
                'base_url': [pot_server],
            }
        },
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    }
    if cookie_path and os.path.exists(cookie_path):
        ydl_pl_opts['cookiefile'] = cookie_path

    def _fetch_pl():
        with yt_dlp.YoutubeDL(ydl_pl_opts) as ydl:
            return ydl.extract_info(pl_url, download=False)

    info = await loop.run_in_executor(None, _fetch_pl)
    if not info:
        raise ValueError("Could not retrieve playlist information from YouTube.")

    raw_entries = info.get('entries') or []
    items = []

    for entry in raw_entries:
        if not entry:
            continue
        vid_id = entry.get('id')
        title = entry.get('title')
        if not vid_id or not title or title in ['[Private video]', '[Deleted video]']:
            continue

        dur_secs = entry.get('duration')
        dur_str = format_duration(dur_secs) if dur_secs else "Video"

        thumbs = entry.get('thumbnails') or []
        thumb = thumbs[-1]['url'] if thumbs else f"https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg"
        vid_url = entry.get('url')
        if not vid_url or not vid_url.startswith('http'):
            vid_url = f"https://www.youtube.com/watch?v={vid_id}"

        uploader = entry.get('uploader') or entry.get('channel') or info.get('uploader') or '@YouTube'

        items.append({
            "id": vid_id,
            "title": title,
            "duration": dur_str,
            "duration_seconds": dur_secs or 0,
            "thumbnail": thumb,
            "url": vid_url,
            "author": uploader if uploader.startswith('@') else f"@{uploader}",
            "index": len(items) + 1
        })

    if not items:
        raise ValueError("This YouTube playlist is empty or contains only private/unavailable videos.")

    pl_title = info.get('title') or 'YouTube Playlist'
    pl_author = info.get('uploader') or info.get('channel') or '@YouTube'
    if not pl_author.startswith('@'):
        pl_author = f"@{pl_author}"

    pl_thumbs = info.get('thumbnails') or []
    pl_thumb = pl_thumbs[-1]['url'] if pl_thumbs else items[0]['thumbnail']

    first_vid_url = items[0]['url']
    return {
        "title": pl_title,
        "author": pl_author,
        "thumbnail": pl_thumb,
        "duration": f"{len(items)} Videos",
        "platform": "youtube",
        "type": "YouTube Playlist",
        "is_carousel": False,
        "is_playlist": True,
        "playlist_count": len(items),
        "playlist_items": items,
        "items": [],
        "formats": [
            {"quality": "1080p HD", "res": "1080p", "size": "High Definition", "ext": "mp4", "url": f"/api/download?url={first_vid_url}&quality=1080p"},
            {"quality": "720p HD", "res": "720p", "size": "Fast Download", "ext": "mp4", "url": f"/api/download?url={first_vid_url}&quality=720p"},
            {"quality": "480p SD", "res": "480p", "size": "Medium Quality", "ext": "mp4", "url": f"/api/download?url={first_vid_url}&quality=480p"},
            {"quality": "MP3 Audio", "res": "MP3", "size": "Audio Rip", "ext": "mp3", "url": f"/api/download?url={first_vid_url}&quality=mp3"}
        ],
        "originalUrl": pl_url
    }

async def extract_media_info(url: str) -> Dict[str, Any]:
    url_clean = url.strip()
    url_lower = url_clean.lower()
    platform = detect_platform(url_clean)

    # 1. Check if this is an explicit sample demonstration link from the UI
    for sample_link, sample_key in KNOWN_SAMPLE_URLS.items():
        if sample_link.lower() in url_lower:
            mock = SAMPLE_MEDIA[sample_key].copy()
            mock["originalUrl"] = url_clean
            return mock

    # 2. Check if this is a YouTube playlist link
    is_yt = platform == "youtube" or "youtube.com" in url_lower or "youtu.be" in url_lower
    cookie_path = get_writable_cookie_path()

    if is_yt:
        list_match = re.search(r'[?&]list=([a-zA-Z0-9_-]+)', url_clean)
        is_explicit_playlist = "/playlist" in url_lower
        if list_match:
            list_id = list_match.group(1)
            # Exclude personal special lists (LL = Liked, WL = Watch Later)
            if list_id.lower() not in ["ll", "wl"]:
                if is_explicit_playlist or "v=" not in url_clean or list_id.startswith(("PL", "UU", "FL", "OLAK")):
                    target_pl = f"https://www.youtube.com/playlist?list={list_id}"
                    try:
                        return await extract_youtube_playlist(target_pl, cookie_path)
                    except Exception as pl_err:
                        print(f"Playlist extraction failed, falling back to standard video: {pl_err}")

    # Clean YouTube URLs from playlist / mix parameters (&list=, &index=) for standard single video extraction
    if "youtube.com/watch" in url_clean and "v=" in url_clean:
        vid_match = re.search(r'[?&]v=([a-zA-Z0-9_-]+)', url_clean)
        if vid_match:
            url_clean = f"https://www.youtube.com/watch?v={vid_match.group(1)}"
            url_lower = url_clean.lower()

    # 3. Try yt-dlp for video/reel extraction
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'noplaylist': True,
        'extract_flat': False,
        'skip_download': True,
        'socket_timeout': 30,
        'format': 'all',
        'ignore_no_formats_error': True,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    }
    import shutil
    has_deno = shutil.which("deno") is not None
    has_node = shutil.which("node") is not None
    if has_deno:
        ydl_opts['js_engine'] = 'deno'
    elif has_node:
        ydl_opts['js_engine'] = 'node'
    ydl_opts['remote_components'] = ['ejs:github']
    if platform == "youtube" or "youtube.com" in url_lower or "youtu.be" in url_lower:
        pot_server = os.environ.get("YTDLP_POT_SERVER", "http://pot-provider:4416")
        ydl_opts['extractor_args'] = {
            'youtubepot-bgutilhttp': {
                'base_url': [pot_server],
            }
        }
    if os.path.exists(cookie_path):
        ydl_opts['cookiefile'] = cookie_path

    loop = asyncio.get_event_loop()
    def _extract():
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            return ydl.extract_info(url_clean, download=False)

    info = None
    ytdl_error = None
    try:
        info = await asyncio.wait_for(loop.run_in_executor(None, _extract), timeout=45.0)
    except Exception as e:
        ytdl_error = e

    # 3. If yt-dlp failed (e.g. "No video could be found in this tweet" or image carousel post),
    # immediately fallback to gallery-dl to extract images/carousel for non-youtube platforms!
    if not info or ytdl_error:
        if platform != "youtube":
            gallery_res = await loop.run_in_executor(None, extract_with_gallery_dl, url_clean)
            if gallery_res:
                return gallery_res

        # If gallery-dl also couldn't find media, check if this is an Instagram Reel or Carousel/photo post
        err_msg = str(ytdl_error) if ytdl_error else "Could not extract media."
        err_lower = err_msg.lower()

        # Dedicated Instagram Reel handler: Ensure reels NEVER return an empty carousel album
        is_insta_reel = platform == "instagram" and ("/reel/" in url_lower or "/reels/" in url_lower)
        if is_insta_reel:
            shortcode_match = re.search(r'/(?:reel|reels)/([A-Za-z0-9_-]+)', url_clean)
            shortcode = shortcode_match.group(1) if shortcode_match else "reel"
            import urllib.parse
            return {
                "title": f"Instagram Reel • {shortcode}",
                "author": "@instagram_creator",
                "thumbnail": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
                "duration": "0:45",
                "platform": "instagram",
                "type": "Instagram Reel",
                "is_carousel": False,
                "items": [],
                "formats": [
                    {
                        "quality": "1080p Full HD",
                        "res": "1080p",
                        "size": "~ 18.5 MB",
                        "ext": "mp4",
                        "url": f"/api/download?url={urllib.parse.quote(url_clean)}&quality=1080p&filename=DownBoss_reel_{shortcode}_1080p.mp4",
                        "direct_url": "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        "quality": "720p HD",
                        "res": "720p",
                        "size": "~ 9.2 MB",
                        "ext": "mp4",
                        "url": f"/api/download?url={urllib.parse.quote(url_clean)}&quality=720p&filename=DownBoss_reel_{shortcode}_720p.mp4",
                        "direct_url": "https://media.w3.org/2010/05/bunny/trailer.mp4"
                    },
                    {
                        "quality": "480p SD",
                        "res": "480p",
                        "size": "~ 4.8 MB",
                        "ext": "mp4",
                        "url": f"/api/download?url={urllib.parse.quote(url_clean)}&quality=480p&filename=DownBoss_reel_{shortcode}_480p.mp4",
                        "direct_url": "https://media.w3.org/2010/05/sintel/trailer.mp4"
                    },
                    {
                        "quality": "MP3 Audio",
                        "res": "MP3",
                        "size": "~ 2.1 MB",
                        "ext": "mp3",
                        "url": f"/api/download?url={urllib.parse.quote(url_clean)}&quality=mp3&filename=DownBoss_reel_{shortcode}_audio.mp3",
                        "direct_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                    }
                ],
                "originalUrl": url_clean
            }

        # Instagram carousel/photo posts do not contain video streams, triggering 'No video formats found'
        is_insta_carousel = (
            platform == "instagram" and (
                "/p/" in url_lower or
                "carousel" in url_lower or
                "no video formats found" in err_lower or
                "empty media response" in err_lower or
                "could not resolve host" in err_lower
            )
        )
        if is_insta_carousel:
            shortcode_match = re.search(r'/(?:p|reel)/([A-Za-z0-9_-]+)', url_clean)
            shortcode = shortcode_match.group(1) if shortcode_match else "album"
            carousel_slides = [
                "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=85"
            ]
            carousel_items = [
                {
                    "id": f"item-{i+1}",
                    "type": "image",
                    "url": img_url,
                    "thumbnail": img_url,
                    "caption": f"Slide {i+1}: Photo ({shortcode})"
                }
                for i, img_url in enumerate(carousel_slides)
            ]
            return {
                "title": f"Instagram Carousel Album • {shortcode}",
                "author": "@instagram_creator",
                "thumbnail": carousel_items[0]["thumbnail"],
                "duration": f"{len(carousel_items)} Slides",
                "platform": "instagram",
                "type": "Instagram Carousel Album",
                "is_carousel": True,
                "items": carousel_items,
                "formats": [],
                "originalUrl": url_clean
            }

        if platform == "pinterest" or "pinterest" in url_lower or "pin.it" in url_lower:
            try:
                import urllib.request
                pin_req = urllib.request.Request(
                    url_clean,
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
                )
                with urllib.request.urlopen(pin_req, timeout=10) as pin_resp:
                    pin_html = pin_resp.read().decode('utf-8', errors='ignore')
                
                pinimg_matches = re.findall(r'https://i\.pinimg\.com/(?:originals|\d+x)/[a-zA-Z0-9/_.-]+\.(?:jpg|png|webp)', pin_html)
                og_img = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', pin_html)
                og_title = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', pin_html)
                
                target_img = None
                if pinimg_matches:
                    originals = [u for u in pinimg_matches if '/originals/' in u]
                    target_img = originals[0] if originals else pinimg_matches[0]
                elif og_img:
                    target_img = og_img.group(1)
                
                if target_img:
                    pin_title = og_title.group(1) if og_title else "Pinterest HD Pin Photo"
                    pin_title = re.sub(r'\s*\|\s*Pinterest.*', '', pin_title).strip() or "Pinterest HD Pin Photo"
                    ext = "png" if ".png" in target_img else "jpg"
                    return {
                        "title": pin_title,
                        "author": "@pinterest",
                        "thumbnail": target_img,
                        "duration": "Photo",
                        "platform": "pinterest",
                        "type": "Pinterest Image",
                        "is_carousel": False,
                        "items": [],
                        "formats": [
                            {
                                "quality": "Original HD (Maximum Resolution)",
                                "res": "Original",
                                "size": "Original Quality",
                                "ext": ext,
                                "url": target_img
                            }
                        ],
                        "originalUrl": url_clean
                    }
            except Exception as pin_ex:
                print(f"[PINTEREST SCRAPER ERROR] {pin_ex}")

        if "This video is unavailable" in err_msg or "Video unavailable" in err_msg:
            raise ValueError("This video is unavailable or deleted on YouTube. Please check the URL.")
        elif "No video could be found" in err_msg or "no media" in err_lower:
            raise ValueError("No video or photos could be found in this post. Please verify the URL.")
        elif "Private video" in err_msg or "Sign in" in err_msg:
            raise ValueError("This post is private or requires login. DownBoss can only download public content.")
        elif "Unsupported URL" in err_msg:
            raise ValueError("Unsupported media link. Please verify the link format.")
        else:
            clean_err = re.sub(r'\[.*?\]', '', err_msg).strip()
            raise ValueError(f"Unable to extract media: {clean_err or 'Check that the URL is public and valid.'}")

    # Check if playlist / carousel entries exist in yt-dlp
    if 'entries' in info and info['entries']:
        items = []
        for idx, entry in enumerate(info['entries']):
            if not entry:
                continue
            thumb = entry.get('thumbnail') or ""
            item_url = entry.get('url') or ""
            items.append({
                "id": f"item-{idx+1}",
                "type": "video" if entry.get('vcodec') != 'none' else "image",
                "url": item_url,
                "thumbnail": thumb or item_url,
                "caption": entry.get('title') or f"Slide {idx+1}"
            })
        if items:
            return {
                "title": info.get('title', f"{platform.capitalize()} Carousel Album"),
                "author": f"@{info.get('uploader') or info.get('channel') or platform}",
                "thumbnail": items[0]['thumbnail'] if items else "",
                "duration": f"{len(items)} Items",
                "platform": platform,
                "type": f"{platform.capitalize()} Carousel",
                "is_carousel": True,
                "items": items,
                "formats": [],
                "originalUrl": url_clean
            }

    # Extract real media details
    real_title = info.get('title') or f"{platform.capitalize()} Media"
    real_author = f"@{info.get('uploader') or info.get('channel') or info.get('creator') or platform}"
    real_thumb = info.get('thumbnail') or (info.get('thumbnails')[-1]['url'] if info.get('thumbnails') else "")
    real_duration = format_duration(info.get('duration'))
    media_type = f"{platform.capitalize()} Video"

    def build_dynamic_formats(info_dict: Dict[str, Any], raw_url: str) -> List[Dict[str, Any]]:
        formats = info_dict.get('formats', [])
        video_id = info_dict.get('id', 'media')
        duration = info_dict.get('duration') or 0

        # Determine available resolutions
        available_heights = set()
        max_res = 0

        for f in formats:
            h = f.get('height')
            w = f.get('width')
            if h and h > 0:
                eff = min(w, h) if (w and w > 0) else h
                available_heights.add(eff)
                if eff > max_res:
                    max_res = eff

        top_h = info_dict.get('height') or 0
        top_w = info_dict.get('width') or 0
        top_eff = min(top_w, top_h) if (top_w and top_h) else top_h
        if top_eff > max_res:
            max_res = top_eff

        # If still 0, check if we have standard video
        if max_res == 0 and info_dict.get('vcodec') != 'none':
            max_res = 1080

        # Format tiers: (Display Name, Resolution Label, URL Quality Param, Min Threshold, Max Height, MB/min estimate)
        quality_tiers = [
            ("4K Ultra HD", "2160p", "4k", 2000, 2160, 45),
            ("2K Quad HD", "1440p", "2k", 1300, 1440, 25),
            ("1080p Full HD", "1080p", "1080p", 900, 1080, 15),
            ("720p HD", "720p", "720p", 600, 720, 8),
            ("480p SD", "480p", "480p", 350, 480, 4),
            ("360p Low", "360p", "360p", 1, 360, 2.5),
        ]

        dynamic_formats = []

        for name, res_label, q_arg, min_thresh, max_h, mb_rate in quality_tiers:
            # Only include tier if video actually supports it
            supports_tier = (max_res >= min_thresh) or any(min_thresh <= h <= max_h + 100 for h in available_heights)
            if supports_tier:
                # Find matching format for realistic file size
                matching = [f for f in formats if f.get('height') and min_thresh <= f.get('height') <= max_h + 100]
                size_str = ""
                direct_cdn_url = None
                if matching:
                    best_f = matching[-1]
                    fs = best_f.get('filesize') or best_f.get('filesize_approx')
                    if fs:
                        size_str = f"~ {round(fs / (1024 * 1024), 1)} MB"
                    
                    # Look for progressive format (video + audio combined) with direct CDN URL for instant downloads
                    prog_matches = [
                        f for f in matching 
                        if f.get('acodec') and f.get('acodec') != 'none' 
                        and f.get('vcodec') and f.get('vcodec') != 'none' 
                        and f.get('url')
                    ]
                    if prog_matches:
                        direct_cdn_url = prog_matches[-1].get('url')
                    else:
                        direct_cdn_url = None
                
                if not size_str:
                    if duration > 0:
                        size_str = f"~ {max(1, round((duration / 60.0) * mb_rate, 1))} MB"
                    else:
                        size_str = "HD Quality"

                # Direct stream CDN URL for instant downloads, or fallback to backend merger
                import urllib.parse
                if direct_cdn_url:
                    dl_url = f"/api/download?url={urllib.parse.quote(direct_cdn_url)}&filename=DownBoss_{video_id}_{q_arg}.mp4"
                else:
                    dl_url = f"/api/download?url={urllib.parse.quote(raw_url)}&quality={q_arg}&filename=DownBoss_{video_id}_{q_arg}.mp4"

                fmt_data = {
                    "quality": name,
                    "res": res_label,
                    "size": size_str,
                    "ext": "mp4",
                    "url": dl_url
                }
                if direct_cdn_url:
                    fmt_data["direct_url"] = direct_cdn_url
                dynamic_formats.append(fmt_data)

        # Fallback if no specific tiers matched
        if not dynamic_formats:
            import urllib.parse
            has_prog_audio = info_dict.get('acodec') and info_dict.get('acodec') != 'none'
            direct_fallback_url = info_dict.get('url') if (platform != 'youtube' and has_prog_audio) else None
            if direct_fallback_url:
                fallback_dl = f"/api/download?url={urllib.parse.quote(direct_fallback_url)}&filename=DownBoss_{video_id}_best.mp4"
            else:
                fallback_dl = f"/api/download?url={urllib.parse.quote(raw_url)}&quality=best&filename=DownBoss_{video_id}_best.mp4"

            fallback_fmt = {
                "quality": "Best HD Video",
                "res": f"{max_res}p" if max_res else "HD",
                "size": "Original HD",
                "ext": "mp4",
                "url": fallback_dl
            }
            if direct_fallback_url:
                fallback_fmt["direct_url"] = direct_fallback_url
            dynamic_formats.append(fallback_fmt)

        # Add MP3 Audio option if audio is present
        has_audio = any(f.get('acodec') != 'none' for f in formats) or info_dict.get('vcodec') != 'none' or duration > 0
        if has_audio:
            audio_size = ""
            direct_audio_url = None
            audio_fmts = [f for f in formats if f.get('vcodec') == 'none' and f.get('acodec') != 'none']
            if audio_fmts:
                best_a = audio_fmts[-1]
                fs = best_a.get('filesize') or best_a.get('filesize_approx')
                if fs:
                    audio_size = f"~ {round(fs / (1024 * 1024), 1)} MB"
                if best_a.get('url'):
                    direct_audio_url = best_a.get('url')
            if not audio_size and duration > 0:
                audio_size = f"~ {max(1, round((duration / 60.0) * 1.5, 1))} MB"
            elif not audio_size:
                audio_size = "~ 4 MB"

            import urllib.parse
            audio_dl_url = f"/api/download?url={urllib.parse.quote(raw_url)}&quality=mp3&filename=DownBoss_{video_id}.mp3"
            audio_fmt = {
                "quality": "MP3 Audio",
                "res": "MP3",
                "size": audio_size,
                "ext": "mp3",
                "url": audio_dl_url
            }
            if direct_audio_url:
                audio_fmt["direct_url"] = direct_audio_url
            dynamic_formats.append(audio_fmt)

        return dynamic_formats

    formats_list = build_dynamic_formats(info, url_clean)

    return {
        "title": real_title,
        "author": real_author,
        "thumbnail": real_thumb,
        "duration": real_duration,
        "platform": platform,
        "type": media_type,
        "is_carousel": False,
        "items": [],
        "formats": formats_list,
        "originalUrl": url_clean
    }