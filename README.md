# InvestIQ - AI-Powered Investing Education Platform

InvestIQ is a comprehensive educational platform designed to teach investing concepts through personalized AI-powered lessons, interactive simulations, and real-time market insights.

## Project Structure

```
Technica-2025/
├── frontend/           # Next.js frontend application
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable React components
│   ├── lib/          # Utilities and API clients
│   └── types/        # TypeScript type definitions
├── backend/          # Python backend server
│   └── src/
│       ├── api/      # API route handlers
│       ├── services/ # Business logic
│       └── utils/    # Helper functions
└── README.md
```

## Features

### Frontend
- **Dashboard**: Personalized learning dashboard with progress tracking
- **Assessment**: 10-question quiz to determine user's skill level
- **Simulator**: Interactive portfolio simulator with real-time calculations
- **Insights**: Market news interpreter powered by AI
- **Learning Path**: Structured lessons with multiple complexity levels
- **Accessibility**: Full support for screen readers, high contrast mode, and keyboard navigation
- **Dark Mode**: Complete dark/light theme support
- **i18n**: Multi-language support ready

### Backend
- **Assessment API**: POST `/assessment/profile` - Evaluates user knowledge level
- **Learn API**: POST `/learn/explain` - Provides concept explanations at multiple levels
- **Insights API**: POST `/insights/news` - Analyzes market news headlines
- **Company API**: GET `/company/:ticker` - Fetches company fundamentals

## Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- pnpm (recommended) or npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt  # Create this if needed
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. Start the backend server:
   ```bash
   python investiq_server.py
   ```

   The server will start on `http://127.0.0.1:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or: npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local if needed (default API URL is already set)
   ```

4. Start the development server:
   ```bash
   pnpm dev
   # or: npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Development

### Running Both Servers

For development, you'll need to run both servers simultaneously:

1. **Terminal 1** (Backend):
   ```bash
   cd backend && python investiq_server.py
   ```

2. **Terminal 2** (Frontend):
   ```bash
   cd frontend && pnpm dev
   ```

### API Integration

The frontend communicates with the backend through a typed API client layer:
- API types: `frontend/types/api.ts`
- API clients: `frontend/lib/api/`
- Base client: `frontend/lib/api/client.ts`

### Building for Production

**Frontend:**
```bash
cd frontend
pnpm build
pnpm start
```

**Backend:**
The Python server is production-ready as-is. Consider using a WSGI server like Gunicorn for deployment.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom glassmorphism design
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Backend
- **Language**: Python 3
- **Server**: Built-in HTTP server with CORS support
- **Data Sources**:
  - Financial Modeling Prep API
  - Alpha Vantage API
  - SEC Edgar API

## API Endpoints

### POST `/assessment/profile`
Submit assessment answers and receive skill level.

**Request:**
```json
{
  "answers": ["a", "b", "c", ...]
}
```

**Response:**
```json
{
  "profile": "beginner",
  "score": 7
}
```

### POST `/learn/explain`
Get explanations for investing concepts.

**Request:**
```json
{
  "query": "What is diversification?"
}
```

**Response:**
```json
{
  "query": "What is diversification?",
  "explanation": {
    "eli5": "...",
    "medium": "...",
    "example": "..."
  }
}
```

### POST `/insights/news`
Analyze market news headlines.

**Request:**
```json
{
  "text": "Fed raises interest rates",
  "ticker": "AAPL"
}
```

**Response:**
```json
{
  "input": "Fed raises interest rates",
  "ticker": "AAPL",
  "used_chunks": [...],
  "explanation": "..."
}
```

### GET `/company/:ticker`
Get company fundamental data.

**Response:**
```json
{
  "summary": "...",
  "data": {...}
}
```

## Environment Variables

### Frontend (`.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: `http://127.0.0.1:8080`)

### Backend (`.env`)
- `FMP_API_KEY`: Financial Modeling Prep API key
- `ALPHAVANTAGE_API_KEY`: Alpha Vantage API key
- `SEC_EMAIL`: Email for SEC Edgar API requests
- `PORT`: Server port (default: 8080)

## License

MIT License - See LICENSE file for details

## Contributing

This project was built for Technica 2025 hackathon.
