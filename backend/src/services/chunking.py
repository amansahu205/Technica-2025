import re

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