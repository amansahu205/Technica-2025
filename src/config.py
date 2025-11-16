import os

FMP_API_KEY = os.getenv("FMP_API_KEY")
ALPHAVANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY")
SEC_EMAIL = os.getenv("SEC_EMAIL")
PORT = int(os.getenv("PORT", "8080"))

def sec_headers():
    h = {"User-Agent": "InvestIQ/1.0", "Accept-Encoding": "gzip, deflate"}
    if SEC_EMAIL:
        h["From"] = SEC_EMAIL
    return h