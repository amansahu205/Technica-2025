from ..utils.files import find_company_json, load_json

def handle_insights(payload):
    text = payload.get("text") or ""
    ticker = payload.get("ticker") or payload.get("symbol") or ""
    chunks = []
    if ticker:
        p = find_company_json(ticker)
        data = load_json(p)
        chunks = data.get("training_ready_chunks") or []
    used = chunks[:3]
    return {"input": text, "ticker": ticker, "used_chunks": [{"metadata": c.get("metadata"), "snippet": (c.get("text") or "")[:300]} for c in used], "explanation": "This headline relates to company fundamentals and market context. Review MD&A and Risk Factors for impacts on operations and liquidity."}