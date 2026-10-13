import urllib.request
import json
import time

url = "https://api.downboss.in/api/info"
payload = {"url": "https://youtu.be/LqAbjewIj6M?si=FnQkEg57Dsuj8Jww"}

print("Sending request to:", url)
t0 = time.time()
req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        elapsed = round(time.time() - t0, 2)
        print(f"Status: {resp.status} in {elapsed}s")
        data = json.loads(resp.read().decode("utf-8"))
        print("Cached:", data.get("cached"))
        media = data.get("data", {})
        print("Title:", media.get("title"))
        print("Formats count:", len(media.get("formats", [])))
        for f in media.get("formats", []):
            print(f" - {f.get('quality')} | {f.get('size')} | {f.get('url')[:65]}")
except Exception as e:
    elapsed = round(time.time() - t0, 2)
    print(f"Error after {elapsed}s: {e}")
