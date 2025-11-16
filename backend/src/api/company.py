from ..utils.files import find_company_json, load_json, save_json
from ..services.market_data import av_get, av_recent_price, av_1y_prices, yahoo_chart_1y, select_last_year, compute_volume_trends
from ..services.fundamentals import fetch_financials, derive_fundamentals
from ..services.edgar import pad_cik, edgar_submissions, pick_latest, build_index_url, fetch_filing_text
from ..services.chunking import remove_tables, html_to_text, normalize_spaces, chunk_text
from ..config import ALPHAVANTAGE_API_KEY
import os

def populate_company(ticker):
    p = find_company_json(ticker)
    data = load_json(p)
    summary = {"ticker": ticker.upper(), "fixed": [], "sources": []}
    profile = data.get("profile") or {}
    cik_pad = pad_cik(profile.get("cik")) if profile.get("cik") else None
    md = data.get("market_data") or {}
    if not md.get("latest_close") or not md.get("one_year_daily"):
        av_daily = av_get({"function": "TIME_SERIES_DAILY_ADJUSTED", "symbol": ticker.upper(), "outputsize": "full"})
        if av_daily:
            md["latest_close"] = md.get("latest_close") or av_recent_price(av_daily)
            md["one_year_daily"] = md.get("one_year_daily") or av_1y_prices(av_daily)
            md["volume_trends"] = compute_volume_trends(md.get("one_year_daily"))
            md.setdefault("sources", {})["alpha_daily_url"] = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={ticker.upper()}&outputsize=full&apikey={ALPHAVANTAGE_API_KEY}" if ALPHAVANTAGE_API_KEY else None
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
    fs = data.get("financial_statements") or {}
    if not fs.get("income_statement") or not fs.get("balance_sheet") or not fs.get("cash_flow"):
        fetched = fetch_financials(ticker.upper())
        if fetched.get("income_statement"): fs["income_statement"] = fetched["income_statement"]
        if fetched.get("balance_sheet"): fs["balance_sheet"] = fetched["balance_sheet"]
        if fetched.get("cash_flow"): fs["cash_flow"] = fetched["cash_flow"]
        summary["fixed"].append("financial_statements")
        summary["sources"].append("FMP")
    data["financial_statements"] = fs
    fundamentals = data.get("fundamentals") or {}
    if not fundamentals.get("revenue_ttm") or not fundamentals.get("net_income_ttm") or not fundamentals.get("roe"):
        fundamentals.update(derive_fundamentals(fs))
        summary["fixed"].append("fundamentals")
    data["fundamentals"] = fundamentals
    ef = data.get("edgar_filings") or {"ten_k": {}, "ten_q": {}}
    for form in ["10-K", "10-Q"]:
        key = "ten_k" if form == "10-K" else "ten_q"
        rec = ef.get(key) or {}
        if (not rec.get("accession_number") or not rec.get("full_text")) and cik_pad:
            subs = edgar_submissions(cik_pad)
            latest = pick_latest(subs, form) if subs else None
            if latest:
                index_url = build_index_url(cik_pad, latest["accession_number"])
                html = fetch_filing_text(index_url)
                full_text = normalize_spaces(html_to_text(remove_tables(html))) if html else None
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