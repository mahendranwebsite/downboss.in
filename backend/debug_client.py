import yt_dlp

test_urls = [
    "https://www.instagram.com/reel/C-Uq2_8v123/",
    "https://twitter.com/X/status/1800000000000000000",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
]

for u in test_urls:
    try:
        ydl = yt_dlp.YoutubeDL({"quiet": True, "noplaylist": True, "format": "best"})
        info = ydl.extract_info(u, download=False)
        print("URL:", u, "-> SUCCESS! Title:", info.get("title", "")[:40])
    except Exception as e:
        print("URL:", u, "-> FAILED:", str(e)[:60])
