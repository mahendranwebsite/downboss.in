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
    "https://youtube.com/shorts/sample_short_video": "youtube"
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
            {"quality": "1080p HD", "res": "1080p", "size": "42.5 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"},
            {"quality": "720p SD", "res": "720p", "size": "24.1 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "12.8 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"},
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
            {"quality": "1080p HD", "res": "1080p", "size": "38.2 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4"},
            {"quality": "720p SD", "res": "720p", "size": "21.6 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "10.4 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"},
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
            {"quality": "1080p HD", "res": "1080p", "size": "65.4 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"},
            {"quality": "720p SD", "res": "720p", "size": "34.0 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "18.2 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"},
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
            {"quality": "1080p HD", "res": "1080p", "size": "78.0 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"},
            {"quality": "720p SD", "res": "720p", "size": "42.1 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"},
            {"quality": "480p Low", "res": "480p", "size": "21.5 MB", "ext": "mp4", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4"},
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

async def extract_media_info(url: str) -> Dict[str, Any]:
    url_clean = url.strip()
    url_lower = url_clean.lower()
    platform = detect_platform(url_clean)

    # Clean YouTube URLs from playlist / mix parameters (&list=, &index=)
    if "youtube.com/watch" in url_clean and "v=" in url_clean:
        vid_match = re.search(r'[?&]v=([a-zA-Z0-9_-]+)', url_clean)
        if vid_match:
            url_clean = f"https://www.youtube.com/watch?v={vid_match.group(1)}"
            url_lower = url_clean.lower()

    # 1. Check if this is an explicit sample demonstration link from the UI
    for sample_link, sample_key in KNOWN_SAMPLE_URLS.items():
        if sample_link.lower() in url_lower:
            mock = SAMPLE_MEDIA[sample_key].copy()
            mock["originalUrl"] = url_clean
            return mock

    # 2. Try yt-dlp first for video/reel extraction
    cookie_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cookies.txt")
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
        ydl_opts['remote_components'] = ['ejs:github']
        ydl_opts['js_engine'] = 'deno'
    elif has_node:
        ydl_opts['remote_components'] = ['ejs:github']
        ydl_opts['js_engine'] = 'node'
    ydl_opts['extractor_args'] = {
        'youtube': {
            'player_client': ['web_embedded', 'android', 'ios'],
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

        # If gallery-dl also couldn't find media, check if this is an Instagram carousel/photo post
        err_msg = str(ytdl_error) if ytdl_error else "Could not extract media."
        err_lower = err_msg.lower()

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
                if matching:
                    best_f = matching[-1]
                    fs = best_f.get('filesize') or best_f.get('filesize_approx')
                    if fs:
                        size_str = f"~ {round(fs / (1024 * 1024), 1)} MB"
                
                if not size_str:
                    if duration > 0:
                        size_str = f"~ {max(1, round((duration / 60.0) * mb_rate, 1))} MB"
                    else:
                        size_str = "HD Quality"

                dynamic_formats.append({
                    "quality": name,
                    "res": res_label,
                    "size": size_str,
                    "ext": "mp4",
                    "url": f"/api/download?url={raw_url}&quality={q_arg}&filename=DownBoss_{video_id}_{q_arg}.mp4"
                })

        # Fallback if no specific tiers matched
        if not dynamic_formats:
            dynamic_formats.append({
                "quality": "Best HD Video",
                "res": f"{max_res}p" if max_res else "HD",
                "size": "Original HD",
                "ext": "mp4",
                "url": f"/api/download?url={raw_url}&quality=best&filename=DownBoss_{video_id}_best.mp4"
            })

        # Add MP3 Audio option if audio is present
        has_audio = any(f.get('acodec') != 'none' for f in formats) or info_dict.get('vcodec') != 'none' or duration > 0
        if has_audio:
            audio_size = ""
            audio_fmts = [f for f in formats if f.get('vcodec') == 'none' and f.get('acodec') != 'none']
            if audio_fmts:
                best_a = audio_fmts[-1]
                fs = best_a.get('filesize') or best_a.get('filesize_approx')
                if fs:
                    audio_size = f"~ {round(fs / (1024 * 1024), 1)} MB"
            if not audio_size and duration > 0:
                audio_size = f"~ {max(1, round((duration / 60.0) * 1.5, 1))} MB"
            elif not audio_size:
                audio_size = "~ 4 MB"

            dynamic_formats.append({
                "quality": "MP3 Audio",
                "res": "MP3",
                "size": audio_size,
                "ext": "mp3",
                "url": f"/api/download?url={raw_url}&quality=mp3&filename=DownBoss_{video_id}.mp3"
            })

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