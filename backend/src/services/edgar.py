from ..config import sec_headers
from .net import json_get, http_get
import urllib.parse

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
    return http_get(doc_url, sec_headers()) if doc_url else None