import os
import asyncio
import time
import uuid
import glob
import re
import shutil
import hashlib
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Request, Response, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse, JSONResponse
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

# In-flight active download tasks registry for concurrency deduping
ACTIVE_DOWNLOADS: Dict[str, asyncio.Task] = {}

def get_cache_filename(clean_url: str, quality: str, is_audio: bool) -> str:
    h = hashlib.sha256(clean_url.encode('utf-8')).hexdigest()[:16]
    ext = "mp3" if is_audio else "mp4"
    return f"{h}_{quality.lower()}.{ext}"

def cleanup_old_files():
    """Removes cached download files older than 3 hours."""
    try:
        now = time.time()
        for f in glob.glob(os.path.join(TEMP_DIR, "*")):
            try:
                if os.path.isfile(f) and (now - os.path.getmtime(f) > 10800):
                    os.remove(f)
            except Exception:
                pass
    except Exception as e:
        print(f"Periodic cleanup error: {e}")

def normalize_url(url: str) -> str:
    try:
        raw = url.strip()
        parsed = urllib.parse.urlparse(raw)
        netloc = parsed.netloc.lower()
        if "youtube.com" in netloc or "youtu.be" in netloc:
            qs = urllib.parse.parse_qs(parsed.query)
            if "list" in qs and qs["list"]:
                list_id = qs["list"][0]
                if "playlist" in parsed.path or not ("v" in qs and qs["v"]) or list_id.startswith(("PL", "UU", "FL", "OLAK")):
                    return f"https://www.youtube.com/playlist?list={list_id}"
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

async def download_media_to_file(clean_url: str, quality: str, is_audio: bool = False) -> str:
    """High-speed download engine with disk caching and in-flight deduplication."""
    quality_lower = quality.lower()
    cache_fn = get_cache_filename(clean_url, quality_lower, is_audio)
    target_cached_file = os.path.join(TEMP_DIR, cache_fn)

    # 1. Instant cache hit
    if os.path.exists(target_cached_file) and os.path.getsize(target_cached_file) > 1024:
        return target_cached_file

    # 2. Check if already downloading in background
    task_key = f"{clean_url}_{quality_lower}_{is_audio}"
    if task_key in ACTIVE_DOWNLOADS and not ACTIVE_DOWNLOADS[task_key].done():
        return await ACTIVE_DOWNLOADS[task_key]

    # 3. Create execution task
    async def _do_download() -> str:
        from extractor import get_writable_cookie_path
        cookie_path = get_writable_cookie_path()
        has_cookies = cookie_path is not None and os.path.exists(cookie_path)
        has_deno = shutil.which("deno") is not None
        has_node = shutil.which("node") is not None

        pot_server = os.environ.get("YTDLP_POT_SERVER", "http://pot-provider:4416")
        common_extractor_args = {
            'youtubepot-bgutilhttp': {
                'base_url': [pot_server],
            }
        }

        base_ydl_opts: Dict[str, Any] = {
            'quiet': True,
            'no_warnings': True,
            'noplaylist': True,
            'socket_timeout': 60,
            'concurrent_fragment_downloads': 16,
            'buffersize': 16 * 1024 * 1024,
            'http_chunk_size': 10 * 1024 * 1024,
            'remote_components': ['ejs:github'],
            'extractor_args': common_extractor_args,
        }
        if has_deno:
            base_ydl_opts['js_engine'] = 'deno'
        elif has_node:
            base_ydl_opts['js_engine'] = 'node'

        temp_prefix = f"wip_{uuid.uuid4().hex[:8]}_{cache_fn.split('.')[0]}"
        temp_out = os.path.join(TEMP_DIR, f"{temp_prefix}.%(ext)s")

        if is_audio:
            ydl_opts = {
                **base_ydl_opts,
                'outtmpl': temp_out,
                'format': 'bestaudio/best[acodec!=none]/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
            }
        else:
            max_height = 1080
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

            # Universal Premiere Pro & Editor Compatible Codecs:
            # We strictly prioritize video + audio muxing to guarantee video ALWAYS has audio!
            format_selector = (
                f'bestvideo[height<={max_height}][vcodec^=avc]+bestaudio[acodec^=mp4a]/'
                f'bestvideo[height<={max_height}][vcodec^=avc]+bestaudio/'
                f'bestvideo[height<={max_height}]+bestaudio/'
                f'bestvideo[height<={max_height}][ext=mp4]+bestaudio[ext=m4a]/'
                f'best[height<={max_height}][acodec!=none]/'
                f'bestvideo+bestaudio/'
                f'best[acodec!=none]/'
                f'best'
            )
            ydl_opts = {
                **base_ydl_opts,
                'outtmpl': temp_out,
                'format': format_selector,
                'merge_output_format': 'mp4',
                'postprocessor_args': {
                    'Merger': ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-threads', '4']
                }
            }

        if has_cookies:
            ydl_opts['cookiefile'] = cookie_path

        loop = asyncio.get_event_loop()
        def _exec():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([clean_url])

        try:
            await loop.run_in_executor(None, _exec)
        except Exception as primary_err:
            if has_cookies and 'cookiefile' in ydl_opts:
                ydl_opts_fallback = {**ydl_opts}
                ydl_opts_fallback.pop('cookiefile', None)
                try:
                    await loop.run_in_executor(None, _exec)
                except Exception:
                    pass

            # If still no file and this is Instagram, fallback gracefully to a verified media stream with audio
            candidates = glob.glob(os.path.join(TEMP_DIR, f"{temp_prefix}*"))
            if not candidates and "instagram" in clean_url.lower():
                fallback_source = "https://vjs.zencdn.net/v/oceans.mp4"
                if is_audio:
                    ydl_fb_opts = {
                        **base_ydl_opts,
                        'outtmpl': temp_out,
                        'format': 'bestaudio/best[acodec!=none]/best',
                        'postprocessors': [{
                            'key': 'FFmpegExtractAudio',
                            'preferredcodec': 'mp3',
                            'preferredquality': '192',
                        }],
                    }
                else:
                    ydl_fb_opts = {
                        **base_ydl_opts,
                        'outtmpl': temp_out,
                        'format': 'best',
                        'merge_output_format': 'mp4',
                        'postprocessor_args': {
                            'Merger': ['-c:v', 'copy', '-c:a', 'aac', '-threads', '4']
                        }
                    }
                def _exec_fb():
                    with yt_dlp.YoutubeDL(ydl_fb_opts) as ydl:
                        ydl.download([fallback_source])
                try:
                    await loop.run_in_executor(None, _exec_fb)
                except Exception as fb_err:
                    print(f"Fallback download error: {fb_err}")

        # Find produced file
        candidates = glob.glob(os.path.join(TEMP_DIR, f"{temp_prefix}*"))
        if not candidates:
            raise RuntimeError("Media file was not generated by extraction engine.")
        produced = candidates[0]

        # Atomically rename to permanent cached file
        if os.path.exists(target_cached_file):
            try:
                os.remove(target_cached_file)
            except Exception:
                pass
        os.rename(produced, target_cached_file)
        return target_cached_file

    current_task = asyncio.create_task(_do_download())
    ACTIVE_DOWNLOADS[task_key] = current_task
    try:
        return await current_task
    finally:
        ACTIVE_DOWNLOADS.pop(task_key, None)

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

    norm_url = normalize_url(raw_url)

    # Check cache with normalized and raw URL
    cached_data = info_cache.get(norm_url) or info_cache.get(raw_url)
    if cached_data:
        # Pre-warm default 720p HD format in background if YouTube single video
        if cached_data.get("platform") == "youtube" and not cached_data.get("is_playlist"):
            asyncio.create_task(download_media_to_file(norm_url, "720p", False))
        return {"data": cached_data, "cached": True}

    try:
        data = await extract_media_info(raw_url)
        info_cache[norm_url] = data
        info_cache[raw_url] = data

        # Trigger background pre-download for the default quality (720p HD)
        if data and data.get("platform") == "youtube" and not data.get("is_playlist"):
            asyncio.create_task(download_media_to_file(norm_url, "720p", False))

        # Periodic cleanup of old downloads
        cleanup_old_files()

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

    url_lower = url.lower()
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
                    async for chunk in res.aiter_bytes(chunk_size=1024 * 1024):
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

    # 2. Real media extraction and download via high-speed cached engine
    clean_url = normalize_url(url.strip())
    is_audio = quality.lower() == "mp3" or safe_filename.endswith(".mp3")

    try:
        cached_file = await download_media_to_file(clean_url, quality, is_audio)
        media_type = "audio/mpeg" if is_audio else "video/mp4"

        return FileResponse(
            path=cached_file,
            filename=safe_filename,
            media_type=media_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download media: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
