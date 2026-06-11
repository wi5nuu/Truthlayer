# Changelog

## [1.0.0] - 2026-06-11

### Added
- Chrome Extension V3 with popup, content script, service worker
- Real-time trust score (0-100) with color-coded indicators
- Hidden intent detection (primary, secondary, tertiary)
- Dark pattern identification (10+ patterns: urgency, scarcity, confirm-shaming, etc.)
- Data collection audit showing all data being tracked
- AI content estimation percentage
- 24-hour local cache to avoid re-analyzing the same pages
- Welcome onboarding page on first install
- Options/settings page with notifications toggle
- Keyboard shortcuts: Ctrl+Shift+T (analyze), Ctrl+Shift+Y (toggle)
- SVG icons for light/dark mode visibility

### Backend
- Node.js Express API with rate limiting, CORS, and auth middleware
- AI-powered analysis endpoint with textacy integration
- Trust scoring engine (0-100) based on multiple weighted factors
- Dark pattern detection engine with regex and heuristic rules
- Report history with pagination, JSON/CSV export
- 17 unit/integration tests across 4 test suites

### Web
- Next.js 15 landing page with hero, features, live demo, FAQ
- About page with team and mission information
- Privacy policy page
- Custom 404 page
- Server-side rewrites to backend API
- Tailwind CSS dark/light theme

### Infrastructure
- GitHub Actions CI: backend tests, web lint, web build, extension build
- ESLint + Prettier configs for code consistency
- Docker Compose for backend and web services
- Issue templates for bug reports and feature requests
- CODEOWNERS, SECURITY.md, CONTRIBUTING.md
- Dev setup script (node scripts/setup.js)
