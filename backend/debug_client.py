import yt_dlp
import sys

url = "https://youtu.be/LqAbjewIj6M"
clients = [
    ["android"],
    ["ios"],
    ["mweb"],
    ["web_creator"],
    ["android_creator"],
]

for c in clients:
    try:
        ydl = yt_dlp.YoutubeDL({
            "quiet": True,
            "noplaylist": True,
            "format": "best",
            "extractor_args": {"youtube": {"player_client": c}}
        })
        info = ydl.extract_info(url, download=False)
        has_dl = bool(info.get("url") or any(f.get("url") for f in info.get("formats", [])))
        print(f"Client {c}: SUCCESS! Playable/downloadable: {has_dl}, formats: {len(info.get('formats', []))}")
    except Exception as e:
        print(f"Client {c}: FAILED - {str(e)[:80]}")
