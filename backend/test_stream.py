import yt_dlp
import urllib.request

cookie_path = "/app/cookies.txt"
ydl_opts = {
    'quiet': True,
    'cookiefile': cookie_path,
    'noplaylist': True,
    'extractor_args': {'youtube': {'player_client': ['android', 'ios', 'web']}}
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info("https://youtu.be/iFaXJX7bcFA", download=False)
        formats = [f for f in info.get("formats", []) if f.get("url")]
        print(f"Total streamable formats: {len(formats)}")
        if formats:
            target = formats[-1]
            url = target["url"]
            print(f"Format ID: {target.get('format_id')}, Height: {target.get('height')}, URL: {url[:60]}")
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"Stream HTTP Status: {resp.status}, Content-Length: {resp.headers.get('Content-Length')}")
                chunk = resp.read(1024 * 64)
                print(f"Successfully read {len(chunk)} bytes from CDN stream!")
except Exception as e:
    print("Stream test failed:", e)
