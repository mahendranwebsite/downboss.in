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

    # 1. If direct sample URL, CDN media, or direct image (.jpg, .png, .webp, pbs.twimg.com)
    url_lower = url.lower()
    is_direct_file = (
        url_lower.endswith(".mp4") or url_lower.endswith(".mp3") or
        url_lower.endswith(".jpg") or url_lower.endswith(".jpeg") or
        url_lower.endswith(".png") or url_lower.endswith(".webp") or
        "pbs.twimg.com" in url_lower or "format=" in url_lower or
        "storage.googleapis.com" in url_lower or "soundhelix.com" in url_lower
    )
    if is_direct_file:
        client = httpx.AsyncClient(timeout=60.0, follow_redirects=True)
        try:
            req = client.build_request("GET", url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                "Referer": "https://www.google.com/"
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
        import re
        vid_match = re.search(r'[?&]v=([a-zA-Z0-9_-]+)', clean_url)
        if vid_match:
            clean_url = f"https://www.youtube.com/watch?v={vid_match.group(1)}"

    common_extractor_args = {
        'youtube': {
            'player_client': ['android', 'ios', 'mweb'],
            'player_skip': ['web'],
        }
    }

    if is_audio:
        out_template = os.path.join(TEMP_DIR, f"{download_id}_audio.%(ext)s")
        ydl_opts = {
            'outtmpl': out_template,
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'quiet': True,
            'no_warnings': True,
            'noplaylist': True,
            'socket_timeout': 30,
            'extractor_args': common_extractor_args,
        }
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
        
        ydl_opts = {
            'outtmpl': out_template,
            'format': f'bestvideo[height<={max_height}]+bestaudio/best[height<={max_height}]/best',
            'merge_output_format': 'mp4',
            'quiet': True,
            'no_warnings': True,
            'noplaylist': True,
            'socket_timeout': 30,
            'extractor_args': common_extractor_args,
        }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([clean_url])

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
