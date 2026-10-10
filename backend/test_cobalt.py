import urllib.request
import json

url = "http://127.0.0.1:9000/"
data = json.dumps({"url": "https://youtu.be/iFaXJX7bcFA"}).encode("utf-8")
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

req = urllib.request.Request(url, data=data, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=30) as response:
        print("COBALT SUCCESS:", response.status)
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print("COBALT HTTP ERROR:", e.code)
    print(e.read().decode())
except Exception as e:
    print("COBALT ERROR:", e)
