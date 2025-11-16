import urllib.request
import json

def http_get(url, headers=None, timeout=30):
    req = urllib.request.Request(url)
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def json_get(url, headers=None, timeout=30):
    try:
        txt = http_get(url, headers, timeout)
        return json.loads(txt)
    except Exception:
        return None