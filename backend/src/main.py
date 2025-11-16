from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from .api.company import populate_company
from .api.insights import handle_insights
from .api.learn import handle_learn
from .api.assessment import handle_assessment
from .api.market_ticker import handle_market_ticker, get_cache_status
from .config import PORT

class Handler(BaseHTTPRequestHandler):
    def _json_response(self, code, obj):
        body = json.dumps(obj, indent=2).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        # Market ticker endpoint
        if self.path == "/market-ticker":
            try:
                ticker_data = handle_market_ticker()
                self._json_response(200, ticker_data)
            except Exception as e:
                self._json_response(500, {"error": str(e)})
            return

        # Cache status debug endpoint
        if self.path == "/market-ticker/cache-status":
            try:
                status = get_cache_status()
                self._json_response(200, status)
            except Exception as e:
                self._json_response(500, {"error": str(e)})
            return

        # Company data endpoint
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
            self._json_response(200, handle_insights(payload))
            return
        if self.path == "/learn/explain":
            self._json_response(200, handle_learn(payload))
            return
        if self.path == "/assessment/profile":
            self._json_response(200, handle_assessment(payload))
            return
        self._json_response(404, {"error": "Not Found"})

def run(host="127.0.0.1", port=PORT):
    httpd = HTTPServer((host, port), Handler)
    httpd.serve_forever()