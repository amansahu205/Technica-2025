from pathlib import Path
import json

BASE_DIRS = [Path("data/f500_json"), Path("f500_json")]

def ensure_company_dir(ticker):
    d = BASE_DIRS[0] / ticker.upper()
    d.mkdir(parents=True, exist_ok=True)
    return d

def find_company_json(ticker):
    tk = ticker.upper()
    for base in BASE_DIRS:
        p = base / tk / "data.json"
        if p.exists():
            return p
    src = BASE_DIRS[1] / tk / "data.json"
    if src.exists():
        dst_dir = ensure_company_dir(tk)
        dst = dst_dir / "data.json"
        dst.write_text(src.read_text(encoding="utf-8"), encoding="utf-8")
        return dst
    dst_dir = ensure_company_dir(tk)
    dst = dst_dir / "data.json"
    if not dst.exists():
        dst.write_text(json.dumps({
            "profile": {"company_name": None, "ticker": tk, "cik": None, "sector": None, "industry": None, "market_cap": None},
            "market_data": {"latest_close": None, "one_year_daily": None, "volume_trends": None, "sources": {}},
            "financial_statements": {"income_statement": None, "balance_sheet": None, "cash_flow": None, "eps": None, "diluted_eps": None, "shares_outstanding": None},
            "fundamentals": {"revenue_ttm": None, "net_income_ttm": None, "roe": None, "total_assets": None, "total_equity": None},
            "edgar_filings": {"ten_k": {"cik": None, "accession_number": None, "filing_date": None, "doc_url": None, "full_text": None, "sections": None}, "ten_q": {"cik": None, "accession_number": None, "filing_date": None, "doc_url": None, "full_text": None, "sections": None}},
            "training_ready_chunks": [],
            "sources": {}
        }, indent=2), encoding="utf-8")
    return dst

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception:
        return None

def save_json(path, data):
    Path(path).write_text(json.dumps(data, indent=2), encoding="utf-8")