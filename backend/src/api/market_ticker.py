"""
Market Ticker API - Real-time stock ticker data with caching
"""
import time
from ..services.market_data import av_get
from ..config import ALPHAVANTAGE_API_KEY

# In-memory cache for ticker data
# Format: { "ticker": { "data": {...}, "timestamp": 123456789 } }
TICKER_CACHE = {}
CACHE_DURATION = 300  # 5 minutes cache

TRACKED_TICKERS = [
    'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'NVDA',
    'TSLA', 'META', 'JPM', 'XOM', 'BAC'
]

def get_cached_ticker(symbol):
    """Get ticker data from cache if still valid"""
    if symbol in TICKER_CACHE:
        cache_entry = TICKER_CACHE[symbol]
        age = time.time() - cache_entry["timestamp"]
        if age < CACHE_DURATION:
            return cache_entry["data"]
    return None

def set_cached_ticker(symbol, data):
    """Store ticker data in cache"""
    TICKER_CACHE[symbol] = {
        "data": data,
        "timestamp": time.time()
    }

def fetch_ticker_data(symbol):
    """Fetch live ticker data from AlphaVantage"""
    try:
        # Try GLOBAL_QUOTE first (fastest)
        quote_data = av_get({
            "function": "GLOBAL_QUOTE",
            "symbol": symbol
        })

        if quote_data and "Global Quote" in quote_data:
            quote = quote_data["Global Quote"]

            # Extract values with safe parsing
            price_str = quote.get("05. price", "0")
            change_str = quote.get("09. change", "0")
            change_percent_str = quote.get("10. change percent", "0%")

            # Parse values
            price = float(price_str) if price_str else 0
            change = float(change_str) if change_str else 0
            change_percent = float(change_percent_str.replace("%", "")) if change_percent_str else 0

            return {
                "symbol": symbol,
                "price": round(price, 2),
                "change": round(change, 2),
                "changePercent": round(change_percent, 2)
            }
    except Exception as e:
        print(f"Error fetching ticker {symbol}: {e}")

    return None

def handle_market_ticker():
    """
    Main handler for market ticker endpoint
    Returns: List of ticker data with caching
    """
    result = []

    for symbol in TRACKED_TICKERS:
        # Check cache first
        cached_data = get_cached_ticker(symbol)
        if cached_data:
            result.append(cached_data)
            continue

        # Fetch fresh data
        ticker_data = fetch_ticker_data(symbol)
        if ticker_data:
            set_cached_ticker(symbol, ticker_data)
            result.append(ticker_data)
        else:
            # Return placeholder if fetch fails
            result.append({
                "symbol": symbol,
                "price": 0.0,
                "change": 0.0,
                "changePercent": 0.0
            })

    return result

def get_cache_status():
    """Debug endpoint to check cache status"""
    status = {}
    current_time = time.time()

    for symbol, cache_entry in TICKER_CACHE.items():
        age = current_time - cache_entry["timestamp"]
        status[symbol] = {
            "cached": True,
            "age_seconds": round(age, 1),
            "expires_in": round(CACHE_DURATION - age, 1),
            "data": cache_entry["data"]
        }

    return {
        "cache_duration": CACHE_DURATION,
        "tracked_tickers": TRACKED_TICKERS,
        "cached_tickers": status
    }
