import yt_dlp
import traceback

ydl_opts = {
    'cookiefile': '/app/cookies.txt',
    'quiet': True,
    'no_warnings': True,
    'noplaylist': True,
    'format': 'all',
    'ignore_no_formats_error': True,
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        res = ydl.extract_info('https://www.youtube.com/watch?v=zKhSut7nV8Q', download=False)
        print("SUCCESS! Title:", res.get('title'))
        print("Uploader:", res.get('uploader'))
        print("Format count:", len(res.get('formats', [])))
        if res.get('formats'):
            print("First format:", res['formats'][0].get('format_id'), res['formats'][0].get('resolution'))
except Exception as e:
    print("FAILED:", e)
    traceback.print_exc()
