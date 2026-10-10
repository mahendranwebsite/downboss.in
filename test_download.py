import yt_dlp
import traceback

ydl_opts = {
    'cookiefile': '/app/cookies.txt',
    'outtmpl': '/app/temp_downloads/test_video.%(ext)s',
    'remote_components': ['ejs:github'],
    'format': 'bestvideo*+bestaudio/best',
    'merge_output_format': 'mp4',
    'quiet': False,
    'noplaylist': True,
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download(['https://www.youtube.com/watch?v=zKhSut7nV8Q'])
        print("DOWNLOAD SUCCESSFUL!")
except Exception as e:
    print("DOWNLOAD FAILED:", e)
    traceback.print_exc()
