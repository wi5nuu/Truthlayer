# TruthLayer API Documentation

## Base URL

`https://api.truthlayer.io`

## Authentication

Most endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Endpoints

### POST /api/v1/analyze

Analyzes a webpage and returns intent analysis, trust score, and dark pattern detection.

**Rate Limits:** 60 req/min (free), 600 req/min (pro)

**Request Body:**
```json
{
  "pageData": {
    "url": "https://amazon.com",
    "domain": "amazon.com",
    "title": "Amazon.com",
    "metaDescription": "...",
    "headings": ["..."],
    "bodyTextSample": "...",
    "formCount": 2,
    "trackers": ["google-analytics.com"],
    "countdownTimers": 3
  },
  "tier": "free | pro"
}
```

**Response:**
```json
{
  "success": true,
  "domain": "amazon.com",
  "trustScore": 82,
  "trustLabel": "Generally Trustworthy",
  "primaryIntent": "Drive impulsive purchases",
  "intents": [
    {
      "rank": 1,
      "intent": "Drive impulsive purchases",
      "confidence": 0.94,
      "evidence": ["countdown timers", "limited stock"]
    }
  ],
  "darkPatterns": {
    "count": 3,
    "detected": [
      {
        "type": "urgency",
        "description": "Countdown timers",
        "severity": "high"
      }
    ]
  },
  "dataCollection": {
    "percentage": 89,
    "trackers": ["Google Analytics"],
    "dataTypes": ["browsing behavior"]
  },
  "aiContent": {
    "percentage": 23,
    "confidence": 0.78
  },
  "manipulationLevel": "medium",
  "summary": "Analysis summary here...",
  "cached": false
}
```

**Error Codes:**
- `400` — Invalid request body
- `429` — Rate limit exceeded
- `504` — Analysis timed out

### GET /api/v1/report/:domain

Retrieves cached analysis for a domain.

**Response:** Same as analyze endpoint with `cached: true`.

### POST /api/v1/auth/register

Register a new account.

**Request:**
```json
{ "email": "user@example.com", "password": "securepass123" }
```

### POST /api/v1/auth/login

Login to existing account.

### POST /api/v1/auth/upgrade

Upgrade free account to Pro (requires auth token).

### GET /health

Health check endpoint.
