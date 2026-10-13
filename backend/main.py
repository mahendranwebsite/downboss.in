import os
import asyncio
import time
import uuid
import glob
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Request, Response, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse, JSONResponse
from starlette.background import BackgroundTask
from pydantic import BaseModel
import httpx
import yt_dlp
from cachetools import TTLCache
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from extractor import extract_media_info, detect_platform

import urllib.parse

def get_real_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return get_remote_address(request)

# Rate Limiter setup (300 requests per minute per IP for high concurrency)
limiter = Limiter(key_func=get_real_client_ip, default_limits=["300/minute"])

app = FastAPI(
    title="DownBoss Media Extraction API",
    description="All-in-one real media extractor and streaming service for DownBoss using yt-dlp",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for 10 minutes (TTL 600s, max 1000 items)
info_cache = TTLCache(maxsize=1000, ttl=600)

TEMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_downloads")
os.makedirs(TEMP_DIR, exist_ok=True)

# Write/update cookies.txt if YTDL_COOKIES environment variable is provided in cloud
cookie_env = os.environ.get("YTDL_COOKIES")
cookie_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cookies.txt")
if cookie_env:
    try:
        with open(cookie_file_path, "w", encoding="utf-8") as f:
            f.write(cookie_env)
    except Exception as e:
        print(f"Failed to write YTDL_COOKIES: {e}")

def cleanup_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        print(f"Cleanup error for {path}: {e}")

def normalize_url(url: str) -> str:
    try:
        raw = url.strip()
        parsed = urllib.parse.urlparse(raw)
        netloc = parsed.netloc.lower()
        if "youtube.com" in netloc or "youtu.be" in netloc:
            qs = urllib.parse.parse_qs(parsed.query)
            if "v" in qs and qs["v"]:
                return f"https://www.youtube.com/watch?v={qs['v'][0]}"
            parts = [p for p in parsed.path.split("/") if p]
            if "youtu.be" in netloc and parts:
                return f"https://www.youtube.com/watch?v={parts[0]}"
            if "shorts" in parts:
                idx = parts.index("shorts")
                if idx + 1 < len(parts):
                    return f"https://www.youtube.com/watch?v={parts[idx+1]}"
        if "instagram.com" in netloc:
            clean_path = parsed.path.rstrip("/")
            return f"https://www.instagram.com{clean_path}/"
        if "twitter.com" in netloc or "x.com" in netloc:
            return f"https://x.com{parsed.path}"
    except Exception:
        pass
    return url.strip()

class InfoRequest(BaseModel):
    url: str

@app.get("/")
def home():
    return {
        "status": "online",
        "service": "DownBoss Media Extraction API",
        "backend": "yt-dlp real engine",
        "endpoints": ["POST /api/info", "GET /api/download"]
    }

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": time.time()}

@app.post("/api/info")
@limiter.limit("300/minute")
async def get_media_info(payload: InfoRequest, request: Request):
    raw_url = payload.url.strip()
    if not raw_url or not (raw_url.startswith("http://") or raw_url.startswith("https://")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid URL format. Please provide a valid http or https link."
        )

    raw_lower = raw_url.lower()
    if "youtube.com" in raw_lower or "youtu.be" in raw_lower:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="YouTube downloads are currently unavailable (Coming Soon). Please use Instagram, TikTok, Facebook, or Twitter."
        )

    norm_url = normalize_url(raw_url)

    # Check cache with normalized and raw URL
    if norm_url in info_cache:
        return {"data": info_cache[norm_url], "cached": True}
    if raw_url in info_cache:
        return {"data": info_cache[raw_url], "cached": True}

    try:
        data = await extract_media_info(raw_url)
        info_cache[norm_url] = data
        info_cache[raw_url] = data
        return {"data": data, "cached": False}
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unable to process media: {str(e)}"
        )

@app.api_route("/api/download", methods=["GET", "HEAD"])
async def stream_download(
    url: str = Query(..., description="Target media URL"),
    quality: Optional[str] = Query("1080p", description="Quality: 1080p, 720p, 480p, mp3"),
    filename: Optional[str] = Query("DownBoss_media.mp4", description="Attachment filename")
):
    safe_filename = filename.replace('"', '').replace('/', '_').replace('\\', '_')
    if not safe_filename:
        safe_filename = "DownBoss_media.mp4"

    # 1. If direct sample URL, CDN media, or direct media (.mp4, .jpg, cdninstagram, etc.)
    import re
    import shutil
    url_lower = url.lower()
    if "youtube.com" in url_lower or "youtu.be" in url_lower:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="YouTube downloads are currently unavailable (Coming Soon). Please use Instagram, TikTok, Facebook, or Twitter."
        )
    is_direct_file = (
        bool(re.search(r'\.(?:mp4|mp3|m4a|webm|jpg|jpeg|png|webp)(?:[?&#]|$)', url_lower)) or
        "cdninstagram.com" in url_lower or
        "fbcdn.net" in url_lower or
        "pbs.twimg.com" in url_lower or
        "twimg.com" in url_lower or
        "googlevideo.com" in url_lower or
        "tiktokcdn.com" in url_lower or
        "byteoversea.com" in url_lower or
        "ibyteimg.com" in url_lower or
        "pinterest.com" in url_lower or
        "pinimg.com" in url_lower or
        "format=" in url_lower or
        "unsplash.com" in url_lower or
        "storage.googleapis.com" in url_lower or
        "soundhelix.com" in url_lower
    )
    if is_direct_file:
        client = httpx.AsyncClient(timeout=120.0, follow_redirects=True)
        try:
            referer = "https://www.google.com/"
            if "instagram" in url_lower or "cdninstagram" in url_lower or "fbcdn" in url_lower:
                referer = "https://www.instagram.com/"
            elif "twimg" in url_lower or "twitter" in url_lower:
                referer = "https://twitter.com/"
            elif "googlevideo.com" in url_lower:
                referer = "https://www.youtube.com/"
            elif "tiktok" in url_lower or "byteoversea" in url_lower:
                referer = "https://www.tiktok.com/"

            req = client.build_request("GET", url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                "Referer": referer,
                "Accept": "*/*"
            })
            res = await client.send(req, stream=True)

            if res.status_code >= 400:
                await client.aclose()
                raise HTTPException(status_code=res.status_code, detail="Remote media stream unreachable.")

            async def stream_content():
                try:
                    async for chunk in res.aiter_bytes(chunk_size=1024 * 128):
                        yield chunk
                finally:
                    await res.aclose()
                    await client.aclose()

            content_type = res.headers.get("content-type") or ("video/mp4" if safe_filename.endswith(".mp4") else "application/octet-stream")
            content_length = res.headers.get("content-length")
            headers = {
                "Content-Disposition": f'attachment; filename="{safe_filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition, Content-Length"
            }
            if content_length:
                headers["Content-Length"] = content_length

            return StreamingResponse(stream_content(), status_code=200, headers=headers, media_type=content_type)
        except Exception as e:
            await client.aclose()
            raise HTTPException(status_code=500, detail=f"Proxy error: {str(e)}")

    # 2. Real media extraction and download via yt-dlp
    download_id = str(uuid.uuid4())[:8]
    is_audio = quality.lower() == "mp3" or safe_filename.endswith(".mp3")
    
    clean_url = normalize_url(url.strip())

    cookie_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cookies.txt")
    has_cookies = os.path.exists(cookie_path)
    has_deno = shutil.which("deno") is not None
    has_node = shutil.which("node") is not None

    pot_server = os.environ.get("YTDLP_POT_SERVER", "http://127.0.0.1:4416")
    common_extractor_args = {
        'youtube': {
            'player_client': ['tv', 'ios', 'android', 'mweb', 'web'],
            'player_skip': ['webpage', 'configs'],
        },
        'youtubepot-bgutilhttp': {
            'base_url': [pot_server],
        }
    }

    base_ydl_opts: Dict[str, Any] = {
        'quiet': True,
        'no_warnings': True,
        'noplaylist': True,
        'socket_timeout': 60,
        'concurrent_fragment_downloads': 8,
        'buffersize': 1024 * 1024,
        'extractor_args': common_extractor_args,
    }
    if has_deno:
        base_ydl_opts['js_engine'] = 'deno'
    elif has_node:
        base_ydl_opts['js_engine'] = 'node'

    if is_audio:
        out_template = os.path.join(TEMP_DIR, f"{download_id}_audio.%(ext)s")
        ydl_opts = {
            **base_ydl_opts,
            'outtmpl': out_template,
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
        if has_cookies:
            ydl_opts['cookiefile'] = cookie_path
    else:
        out_template = os.path.join(TEMP_DIR, f"{download_id}_video.%(ext)s")
        max_height = 1080
        quality_lower = quality.lower()
        if "4k" in quality_lower or "2160" in quality_lower:
            max_height = 2160
        elif "2k" in quality_lower or "1440" in quality_lower:
            max_height = 1440
        elif "1080" in quality_lower:
            max_height = 1080
        elif "720" in quality_lower:
            max_height = 720
        elif "480" in quality_lower:
            max_height = 480
        elif "360" in quality_lower:
            max_height = 360
        else:
            max_height = 2160
        
        format_selector = (
            f'bestvideo[height<={max_height}]+bestaudio/'
            f'best[height<={max_height}]/'
            f'bestvideo+bestaudio/'
            f'best'
        )
        ydl_opts = {
            **base_ydl_opts,
            'outtmpl': out_template,
            'format': format_selector,
            'merge_output_format': 'mp4',
        }
        if has_cookies:
            ydl_opts['cookiefile'] = cookie_path

    try:
        loop = asyncio.get_event_loop()
        def _exec_download(opts):
            with yt_dlp.YoutubeDL(opts) as ydl:
                ydl.download([clean_url])

        try:
            await loop.run_in_executor(None, _exec_download, ydl_opts)
        except Exception as primary_err:
            # If failed with cookies, try falling back without cookies for public platforms (e.g. reels)
            if has_cookies and 'cookiefile' in ydl_opts:
                ydl_opts_fallback = {**ydl_opts}
                ydl_opts_fallback.pop('cookiefile', None)
                if 'extractor_args' not in ydl_opts_fallback:
                    ydl_opts_fallback['extractor_args'] = common_extractor_args
                await loop.run_in_executor(None, _exec_download, ydl_opts_fallback)
            else:
                raise primary_err

        # Find the produced file
        pattern = os.path.join(TEMP_DIR, f"{download_id}_*")
        matching = glob.glob(pattern)
        if not matching:
            raise HTTPException(status_code=500, detail="Downloaded media file was not found.")

        target_file = matching[0]
        media_type = "audio/mpeg" if is_audio else "video/mp4"

        return FileResponse(
            path=target_file,
            filename=safe_filename,
            media_type=media_type,
            background=BackgroundTask(cleanup_file, target_file)
        )
    except Exception as e:
        # Clean any partial downloads
        for f in glob.glob(os.path.join(TEMP_DIR, f"{download_id}_*")):
            cleanup_file(f)
        raise HTTPException(status_code=500, detail=f"Failed to download media: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
