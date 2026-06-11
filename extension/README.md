# TruthLayer Chrome Extension

Browser extension that reveals hidden website intentions, trust scores, and dark patterns.

## Features

- Real-time trust score (0–100)
- Hidden intent detection (primary, secondary, tertiary)
- Dark pattern identification (10+ patterns)
- Data collection audit
- AI content estimation
- 24-hour local cache
- Keyboard shortcuts (Ctrl+Shift+T, Ctrl+Shift+Y)
- Welcome onboarding page
- Options/settings page

## Installation (Development)

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select this folder

## Files

| Path | Description |
|------|-------------|
| `manifest.json` | Extension manifest (V3) |
| `popup/` | Popup UI (HTML/CSS/JS) |
| `background/` | Service worker |
| `content/` | Content script |
| `options/` | Settings page |
| `welcome/` | First-install onboarding |
| `icons/` | Extension icons (SVG) |
| `_locales/` | i18n translations |
