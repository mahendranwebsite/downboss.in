import urllib.request
import json

test_urls = [
    "https://www.tiktok.com/@tiktok/video/7106594312292453675",
    "https://twitter.com/Twitter/status/1500000000000000000",
    "https://www.instagram.com/p/C-Uq2_8v123/"
]

for u in test_urls:
    data = json.dumps({"url": u}).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:9000/",
        data=data,
        headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            print("COBALT SUCCESS for", u[:35], ":", resp.read().decode()[:150])
    except urllib.error.HTTPError as e:
        print("COBALT HTTP", e.code, "for", u[:35], ":", e.read().decode()[:150])
    except Exception as e:
        print("COBALT ERROR for", u[:35], ":", e)
