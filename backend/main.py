import os
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

# Rate Limiter setup (15 requests per minute per IP)
limiter = Limiter(key_func=get_remote_address, default_limits=["15/minute"])

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
@limiter.limit("20/minute")
async def get_media_info(payload: InfoRequest, request: Request):
    raw_url = payload.url.strip()
    if not raw_url or not (raw_url.startswith("http://") or raw_url.startswith("https://")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid URL format. Please provide a valid http or https link."
        )

    # Check cache
    if raw_url in info_cache:
        return {"data": info_cache[raw_url], "cached": True}

    try:
        data = await extract_media_info(raw_url)
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
    is_direct_file = (
        bool(re.search(r'\.(?:mp4|mp3|m4a|webm|jpg|jpeg|png|webp)(?:[?&#]|$)', url_lower)) or
        "cdninstagram.com" in url_lower or
        "fbcdn.net" in url_lower or
        "pbs.twimg.com" in url_lower or
        "twimg.com" in url_lower or
        "format=" in url_lower or
        "unsplash.com" in url_lower or
        "storage.googleapis.com" in url_lower or
        "soundhelix.com" in url_lower
    )
    if is_direct_file:
        client = httpx.AsyncClient(timeout=90.0, follow_redirects=True)
        try:
            referer = "https://www.google.com/"
            if "instagram" in url_lower or "cdninstagram" in url_lower or "fbcdn" in url_lower:
                referer = "https://www.instagram.com/"
            elif "twimg" in url_lower or "twitter" in url_lower:
                referer = "https://twitter.com/"

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
                    async for chunk in res.aiter_bytes(chunk_size=1024 * 64):
                        yield chunk
                finally:
                    await res.aclose()
                    await client.aclose()

            content_type = res.headers.get("content-type", "application/octet-stream")
            headers = {
                "Content-Disposition": f'attachment; filename="{safe_filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
            return StreamingResponse(stream_content(), status_code=200, headers=headers, media_type=content_type)
        except Exception as e:
            await client.aclose()
            raise HTTPException(status_code=500, detail=f"Proxy error: {str(e)}")

    # 2. Real media extraction and download via yt-dlp
    download_id = str(uuid.uuid4())[:8]
    is_audio = quality.lower() == "mp3" or safe_filename.endswith(".mp3")
    
    clean_url = url.strip()
    if "youtube.com/watch" in clean_url and "v=" in clean_url:
        vid_match = re.search(r'[?&]v=([a-zA-Z0-9_-]+)', clean_url)
        if vid_match:
            clean_url = f"https://www.youtube.com/watch?v={vid_match.group(1)}"

    cookie_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cookies.txt")
    has_cookies = os.path.exists(cookie_path)
    has_deno = shutil.which("deno") is not None
    has_node = shutil.which("node") is not None

    common_extractor_args = {
        'youtube': {
            'player_client': ['android', 'ios', 'mweb'],
            'player_skip': ['web'],
        }
    } if not has_cookies else {}

    base_ydl_opts: Dict[str, Any] = {
        'quiet': True,
        'no_warnings': True,
        'noplaylist': True,
        'socket_timeout': 45,
    }
    if has_deno:
        base_ydl_opts['remote_components'] = ['ejs:github']
        base_ydl_opts['js_engine'] = 'deno'
    elif has_node:
        base_ydl_opts['remote_components'] = ['ejs:github']
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
            ydl_opts['extractor_args'] = common_extractor_args
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
            f'bestvideo[height<={max_height}]+bestaudio/best[height<={max_height}]/'
            f'bestvideo+bestaudio/best'
        )
        ydl_opts = {
            **base_ydl_opts,
            'outtmpl': out_template,
            'format': format_selector,
            'merge_output_format': 'mp4',
        }
        if has_cookies:
            ydl_opts['cookiefile'] = cookie_path
        else:
            ydl_opts['extractor_args'] = common_extractor_args

    try:
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([clean_url])
        except Exception as primary_err:
            # If failed with cookies, try falling back without cookies for public platforms (e.g. reels)
            if has_cookies and 'cookiefile' in ydl_opts:
                ydl_opts_fallback = {**ydl_opts}
                ydl_opts_fallback.pop('cookiefile', None)
                if 'extractor_args' not in ydl_opts_fallback:
                    ydl_opts_fallback['extractor_args'] = common_extractor_args
                with yt_dlp.YoutubeDL(ydl_opts_fallback) as ydl_fallback:
                    ydl_fallback.download([clean_url])
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
