# TruthLayer Web Dashboard

Next.js 15 web application for TruthLayer — landing page, public reports, and user dashboard.

## Pages

| Path | Description |
|------|-------------|
| `/` | Landing page with hero, features, live demo |
| `/about` | About TruthLayer |
| `/privacy` | Privacy policy |
| `/report/:domain` | Public report for a domain |
| `/dashboard` | User dashboard (Pro) |
| `/download` | Extension installation guide |

## Architecture

- Next.js 15 App Router
- Tailwind CSS for styling
- Server-side rewrites proxy API calls to backend
- No catch-all API routes needed

## Running

```bash
npm install
npm run dev     # Development at http://localhost:3000
npm run build   # Production build
npm start       # Production server
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend API base URL |
