import urllib.parse
from datetime import datetime
from .net import json_get
from ..config import ALPHAVANTAGE_API_KEY

def av_get(params):
    if not ALPHAVANTAGE_API_KEY: return None
    params["apikey"] = ALPHAVANTAGE_API_KEY
    return json_get("https://www.alphavantage.co/query?" + urllib.parse.urlencode(params))

def av_recent_price(daily_json):
    try:
        ts = daily_json.get("Time Series (Daily)", {})
        if not ts: return None
        k = sorted(ts.keys())[-1]
        rec = ts[k]
        return {"date": k, "close": float(rec.get("4. close")), "volume": int(float(rec.get("6. volume"))) if rec.get("6. volume") else None}
    except Exception:
        return None

def av_1y_prices(daily_json):
    try:
        ts = daily_json.get("Time Series (Daily)", {})
        dates = sorted(ts.keys())[-252:]
        out = []
        for d in dates:
            rec = ts[d]
            out.append({"date": d, "close": float(rec.get("4. close")) if rec.get("4. close") else None, "volume": int(float(rec.get("6. volume"))) if rec.get("6. volume") else None})
        return out
    except Exception:
        return None

def yahoo_chart_1y(ticker):
    return json_get(f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?range=1y&interval=1d")

def select_last_year(yahoo_json):
    try:
        res = yahoo_json["chart"]["result"][0]
        t = res.get("timestamp") or []
        q = res.get("indicators", {}).get("quote", [{}])[0]
        closes = q.get("close") or []
        vols = q.get("volume") or []
        out = []
        for i, ts in enumerate(t):
            d = datetime.utcfromtimestamp(ts).strftime("%Y-%m-%d")
            c = closes[i] if i < len(closes) else None
            v = vols[i] if i < len(vols) else None
            out.append({"date": d, "close": float(c) if c is not None else None, "volume": int(v) if v is not None else None})
        return out
    except Exception:
        return None

def compute_volume_trends(series):
    if not series: return None
    vols = [x["volume"] for x in series if x.get("volume") is not None]
    if not vols: return None
    return {"avg_volume": sum(vols) / len(vols), "max_volume": max(vols), "min_volume": min(vols)}