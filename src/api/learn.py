import re

def handle_learn(payload):
    query = payload.get("query") or ""
    if re.search(r"diversification", query, re.I):
        resp = {"eli5": "Diversification means not putting all your money in one thing.", "medium": "Diversification spreads investments across assets, sectors, and geographies to reduce the impact of any single underperformer.", "example": "Holding a mix of large-cap stocks, bonds, and cash reduces portfolio volatility compared to a single stock."}
    elif re.search(r"p/?e", query, re.I):
        resp = {"eli5": "P/E compares a stock’s price to its earnings.", "medium": "Price-to-Earnings ratio equals market price per share divided by earnings per share; useful for comparing valuation across companies.", "example": "If EPS is $5 and price is $100, P/E is 20; higher vs peers can mean rich valuation."}
    else:
        resp = {"eli5": "This is an investing concept explained simply.", "medium": "We provide a plain-English overview and context for understanding.", "example": "Ask for a specific topic like ROE or beta."}
    return {"query": query, "explanation": resp}