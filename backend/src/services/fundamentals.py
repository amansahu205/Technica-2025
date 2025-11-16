from ..config import FMP_API_KEY
from .net import json_get

def fmp_get(path):
    if not FMP_API_KEY: return None
    data = json_get(f"https://financialmodelingprep.com{path}apikey={FMP_API_KEY}")
    if isinstance(data, dict) and data.get("Error Message"):
        return None
    return data

def fetch_financials(ticker):
    inc = fmp_get(f"/api/v3/income-statement/{ticker}?period=annual&limit=20&")
    bal = fmp_get(f"/api/v3/balance-sheet-statement/{ticker}?period=annual&limit=20&")
    cf = fmp_get(f"/api/v3/cash-flow-statement/{ticker}?period=annual&limit=20&")
    return {
        "income_statement": inc[:5] if isinstance(inc, list) else None,
        "balance_sheet": bal[:5] if isinstance(bal, list) else None,
        "cash_flow": cf[:5] if isinstance(cf, list) else None
    }

def derive_fundamentals(financials):
    inc = financials.get("income_statement") or []
    bal = financials.get("balance_sheet") or []
    rev_ttm = None; ni_ttm = None; total_assets = None; total_equity = None; roe = None
    try:
        if len(inc) >= 4:
            rvals = [x.get("revenue") for x in inc[:4] if x.get("revenue")]
            ivals = [x.get("netIncome") or x.get("netIncomeCommonStockholders") for x in inc[:4] if (x.get("netIncome") or x.get("netIncomeCommonStockholders"))]
            rev_ttm = sum(rvals) if rvals else None
            ni_ttm = sum(ivals) if ivals else None
        if len(bal) >= 1:
            total_assets = bal[0].get("totalAssets")
            total_equity = bal[0].get("totalStockholdersEquity") or bal[0].get("totalEquity")
        if ni_ttm is not None and total_equity:
            roe = (ni_ttm / total_equity) if total_equity else None
    except Exception:
        pass
    return {"revenue_ttm": rev_ttm, "net_income_ttm": ni_ttm, "roe": roe, "total_assets": total_assets, "total_equity": total_equity}