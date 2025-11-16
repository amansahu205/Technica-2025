#!/usr/bin/env python3
import json, re, os, urllib.request, urllib.parse, time
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from datetime import datetime

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

def sec_headers():
    h = {"User-Agent": "InvestIQ/1.0", "Accept-Encoding": "gzip, deflate"}
    em = os.getenv("SEC_EMAIL")
    if em:
        h["From"] = em
    return h

def normalize_spaces(t):
    return re.sub(r"\s+", " ", t or "").strip()

def remove_tables(html):
    return re.sub(r"(?is)<table.*?>.*?</table>", " ", html or "")

def html_to_text(html):
    return re.sub(r"(?is)<[^>]+>", " ", html or "")

def chunk_text(text, min_len=1500, max_len=3000, target=2000, overlap=200):
    if not text: return []
    t = normalize_spaces(text)
    n = len(t)
    chunks = []
    i = 0
    while i < n:
        end = min(i + target, n)
        j = end
        while j < n and j - i < max_len and t[j] != " ":
            j += 1
        if j - i < min_len and end < n:
            j = min(i + min_len, n)
        chunks.append(t[i:j])
        i = j - overlap if j - overlap > i else j
    return chunks

BASE_DIRS = [Path("data/f500_json"), Path("f500_json")] 

def ensure_company_dir(ticker):
    base = BASE_DIRS[0]
    d = base / ticker.upper()
    d.mkdir(parents=True, exist_ok=True)
    return d

def find_company_json(ticker):
    tk = ticker.upper()
    for base in BASE_DIRS:
        p = base / tk / "data.json"
        if p.exists():
            return p
    # Try to copy from secondary to primary
    src = BASE_DIRS[1] / tk / "data.json"
    if src.exists():
        dst_dir = ensure_company_dir(tk)
        dst = dst_dir / "data.json"
        dst.write_text(src.read_text(encoding="utf-8"), encoding="utf-8")
        return dst
    # Otherwise create empty structure
    dst_dir = ensure_company_dir(tk)
    dst = dst_dir / "data.json"
    if not dst.exists():
        empty = {"profile": {"company_name": None, "ticker": tk, "cik": None, "sector": None, "industry": None, "market_cap": None}, "market_data": {"latest_close": None, "one_year_daily": None, "volume_trends": None, "sources": {}}, "financial_statements": {"income_statement": None, "balance_sheet": None, "cash_flow": None, "eps": None, "diluted_eps": None, "shares_outstanding": None}, "fundamentals": {"revenue_ttm": None, "net_income_ttm": None, "roe": None, "total_assets": None, "total_equity": None}, "edgar_filings": {"ten_k": {"cik": None, "accession_number": None, "filing_date": None, "doc_url": None, "full_text": None, "sections": None}, "ten_q": {"cik": None, "accession_number": None, "filing_date": None, "doc_url": None, "full_text": None, "sections": None}}, "training_ready_chunks": [], "sources": {}}
        dst.write_text(json.dumps(empty, indent=2), encoding="utf-8")
    return dst

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception:
        return None

def save_json(path, data):
    Path(path).write_text(json.dumps(data, indent=2), encoding="utf-8")

def pad_cik(cik_str):
    try:
        return str(int(str(cik_str))).zfill(10)
    except Exception:
        return None

def edgar_submissions(cik_pad):
    return json_get(f"https://data.sec.gov/submissions/CIK{cik_pad}.json", sec_headers())

def pick_latest(subs, form_code):
    try:
        fr = subs["filings"]["recent"]["form"]
        an = subs["filings"]["recent"]["accessionNumber"]
        pd = subs["filings"]["recent"]["primaryDocument"]
        fd = subs["filings"]["recent"]["filingDate"]
        for i, f in enumerate(fr):
            if f == form_code:
                return {"accession_number": an[i], "primary_document": pd[i], "filing_date": fd[i]}
        return None
    except Exception:
        return None

def build_index_url(cik_pad, accession_number):
    try:
        c = str(int(cik_pad))
        a = accession_number.replace("-", "")
        return f"https://www.sec.gov/Archives/edgar/data/{c}/{a}/{accession_number}-index.html"
    except Exception:
        return None

def fetch_filing_text(doc_url):
    html = http_get(doc_url, sec_headers()) if doc_url else None
    if not html: return None
    clean = html_to_text(remove_tables(html))
    return normalize_spaces(clean)

def fmp_get(path):
    key = os.getenv("FMP_API_KEY")
    if not key: return None
    data = json_get(f"https://financialmodelingprep.com{path}apikey={key}")
    if isinstance(data, dict) and data.get("Error Message"):
        return None
    return data

def av_get(params):
    key = os.getenv("ALPHAVANTAGE_API_KEY")
    if not key: return None
    params["apikey"] = key
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

def compute_volume_trends(series):
    if not series: return None
    vols = [x["volume"] for x in series if x.get("volume") is not None]
    if not vols: return None
    return {"avg_volume": sum(vols) / len(vols), "max_volume": max(vols), "min_volume": min(vols)}

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

def populate_company(ticker):
    p = find_company_json(ticker)
    data = load_json(p)
    summary = {"ticker": ticker.upper(), "fixed": [], "sources": []}
    profile = data.get("profile") or {}
    cik_pad = pad_cik(profile.get("cik")) if profile.get("cik") else None
    # Market data
    md = data.get("market_data") or {}
    if not md.get("latest_close") or not md.get("one_year_daily"):
        av_daily = av_get({"function": "TIME_SERIES_DAILY_ADJUSTED", "symbol": ticker.upper(), "outputsize": "full"})
        if av_daily:
            md["latest_close"] = md.get("latest_close") or av_recent_price(av_daily)
            md["one_year_daily"] = md.get("one_year_daily") or av_1y_prices(av_daily)
            md["volume_trends"] = compute_volume_trends(md.get("one_year_daily"))
            md.setdefault("sources", {})["alpha_daily_url"] = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={ticker.upper()}&outputsize=full&apikey={os.getenv('ALPHAVANTAGE_API_KEY')}" if os.getenv("ALPHAVANTAGE_API_KEY") else None
            summary["sources"].append("AlphaVantage")
        if not md.get("one_year_daily"):
            yc = yahoo_chart_1y(ticker.upper())
            series = select_last_year(yc) if yc else None
            if series:
                md["one_year_daily"] = series
                md["volume_trends"] = compute_volume_trends(series)
                if not md.get("latest_close"):
                    latest = next((x for x in reversed(series) if x.get("close") is not None), None)
                    md["latest_close"] = latest
                md.setdefault("sources", {})["yahoo_chart_url"] = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker.upper()}?range=1y&interval=1d"
                summary["sources"].append("YahooFinance")
        if md.get("latest_close") or md.get("one_year_daily"):
            summary["fixed"].append("market_data")
    data["market_data"] = md
    # Financials and fundamentals
    fs = data.get("financial_statements") or {}
    if not fs.get("income_statement") or not fs.get("balance_sheet") or not fs.get("cash_flow"):
        inc = fmp_get(f"/api/v3/income-statement/{ticker.upper()}?period=annual&limit=20&")
        bal = fmp_get(f"/api/v3/balance-sheet-statement/{ticker.upper()}?period=annual&limit=20&")
        cf = fmp_get(f"/api/v3/cash-flow-statement/{ticker.upper()}?period=annual&limit=20&")
        if inc: fs["income_statement"] = inc[:5]
        if bal: fs["balance_sheet"] = bal[:5]
        if cf: fs["cash_flow"] = cf[:5]
        summary["fixed"].append("financial_statements")
        summary["sources"].append("FMP")
    data["financial_statements"] = fs
    fundamentals = data.get("fundamentals") or {}
    if not fundamentals.get("revenue_ttm") or not fundamentals.get("net_income_ttm") or not fundamentals.get("roe"):
        inc = fs.get("income_statement")
        bal = fs.get("balance_sheet")
        rev_ttm = None; ni_ttm = None; total_assets = None; total_equity = None; roe = None
        try:
            if inc and len(inc) >= 4:
                rvals = [x.get("revenue") for x in inc[:4] if x.get("revenue")]
                ivals = [x.get("netIncome") or x.get("netIncomeCommonStockholders") for x in inc[:4] if (x.get("netIncome") or x.get("netIncomeCommonStockholders"))]
                rev_ttm = sum(rvals) if rvals else None
                ni_ttm = sum(ivals) if ivals else None
            if bal and len(bal) >= 1:
                total_assets = bal[0].get("totalAssets")
                total_equity = bal[0].get("totalStockholdersEquity") or bal[0].get("totalEquity")
            if ni_ttm is not None and total_equity:
                roe = (ni_ttm / total_equity) if total_equity else None
        except Exception:
            pass
        fundamentals.update({"revenue_ttm": rev_ttm, "net_income_ttm": ni_ttm, "roe": roe, "total_assets": total_assets, "total_equity": total_equity})
        summary["fixed"].append("fundamentals")
    data["fundamentals"] = fundamentals
    # EDGAR filings
    ef = data.get("edgar_filings") or {"ten_k": {}, "ten_q": {}}
    for form in ["10-K", "10-Q"]:
        key = "ten_k" if form == "10-K" else "ten_q"
        rec = ef.get(key) or {}
        if (not rec.get("accession_number") or not rec.get("full_text")) and cik_pad:
            subs = edgar_submissions(cik_pad)
            latest = pick_latest(subs, form) if subs else None
            if latest:
                index_url = build_index_url(cik_pad, latest["accession_number"])
                full_text = fetch_filing_text(index_url)
                rec.update({"cik": cik_pad, "accession_number": latest["accession_number"], "filing_date": latest["filing_date"], "doc_url": index_url, "full_text": full_text})
                data_chunks = chunk_text(full_text)
                for i, chunk in enumerate(data_chunks):
                    data.setdefault("training_ready_chunks", []).append({"text": chunk, "metadata": {"ticker": ticker.upper(), "cik": cik_pad, "form_type": form, "chunk_index": i}})
                summary["fixed"].append(key)
                summary["sources"].append("EDGAR")
        ef[key] = rec
    data["edgar_filings"] = ef
    save_json(p, data)
    summary["chunks_generated"] = len(data.get("training_ready_chunks") or [])
    summary["output_path"] = str(p)
    return summary, data

class Handler(BaseHTTPRequestHandler):
    def _json_response(self, code, obj):
        body = json.dumps(obj, indent=2).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith("/company/"):
            ticker = self.path.split("/company/")[-1].strip().upper()
            try:
                summary, data = populate_company(ticker)
                self._json_response(200, {"summary": summary, "data": data})
            except Exception as e:
                self._json_response(500, {"error": str(e)})
            return
        self._json_response(404, {"error": "Not Found"})

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        raw = self.rfile.read(length).decode('utf-8') if length > 0 else ""
        try:
            payload = json.loads(raw) if raw else {}
        except Exception:
            payload = {}
        if self.path == "/insights/news":
            text = payload.get("text") or ""
            ticker = payload.get("ticker") or payload.get("symbol") or ""
            chunks = []
            if ticker:
                p = find_company_json(ticker)
                data = load_json(p)
                chunks = data.get("training_ready_chunks") or []
            used = chunks[:3]
            self._json_response(200, {"input": text, "ticker": ticker, "used_chunks": [{"metadata": c.get("metadata"), "snippet": (c.get("text") or "")[:300]} for c in used], "explanation": "This headline relates to company fundamentals and market context. Review MD&A and Risk Factors for impacts on operations and liquidity."})
            return
        if self.path == "/learn/explain":
            query = payload.get("query") or ""
            if re.search(r"diversification", query, re.I):
                resp = {"eli5": "Diversification means not putting all your money in one thing.", "medium": "Diversification spreads investments across assets, sectors, and geographies to reduce the impact of any single underperformer.", "example": "Holding a mix of large-cap stocks, bonds, and cash reduces portfolio volatility compared to a single stock."}
            elif re.search(r"p/?e", query, re.I):
                resp = {"eli5": "P/E compares a stock’s price to its earnings.", "medium": "Price-to-Earnings ratio equals market price per share divided by earnings per share; useful for comparing valuation across companies.", "example": "If EPS is $5 and price is $100, P/E is 20; higher vs peers can mean rich valuation."}
            else:
                resp = {"eli5": "This is an investing concept explained simply.", "medium": "We provide a plain-English overview and context for understanding.", "example": "Ask for a specific topic like ROE or beta."}
            self._json_response(200, {"query": query, "explanation": resp})
            return
        if self.path == "/assessment/profile":
            answers = payload.get("answers") or []
            score = sum(1 for a in answers if str(a).lower() in ["a","b","c"])
            level = "beginner" if score < 3 else "intermediate" if score < 6 else "advanced"
            self._json_response(200, {"profile": level, "score": score})
            return
        self._json_response(404, {"error": "Not Found"})

def run(host="127.0.0.1", port=int(os.getenv("PORT", "8080"))):
    httpd = HTTPServer((host, port), Handler)
    httpd.serve_forever()

if __name__ == "__main__":
    run()