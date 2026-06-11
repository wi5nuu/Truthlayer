Node.js API server for TruthLayer extension analysis.

## Available Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/analyze` | Analyze a webpage |
| GET | `/api/v1/report/:domain` | Get cached report |
| GET | `/api/v1/report/:domain/history` | Report history (paginated) |
| GET | `/api/v1/report/:domain/export` | Export report data |
| GET | `/api/v1/export/:domain/json` | Download JSON |
| GET | `/api/v1/export/:domain/csv` | Download CSV |
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login user |

## Running

```bash
npm install
cp .env.example .env
npm start        # Production
npm run dev      # Development (nodemon)
npm test         # Run tests
```

## Environment

See `.env.example` for all configuration options.
