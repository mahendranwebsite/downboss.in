import yt_dlp
import sys

url = "https://youtu.be/LqAbjewIj6M"
cookie_path = "/app/cookies.txt"

ydl = yt_dlp.YoutubeDL({
    "quiet": False,
    "noplaylist": True,
    "format": "best",
    "cookiefile": cookie_path,
    "js_engine": "deno",
})

try:
    info = ydl.extract_info(url, download=False)
    print("SUCCESS WITH COOKIES! Title:", info.get("title"))
    print("Formats:", len(info.get("formats", [])))
except Exception as e:
    print("FAILED WITH COOKIES:", e)
