# Adverto API Documentation

Welcome to the official documentation for the Adverto API.

## Quick Start

Integrate Adverto into your existing workflows using our REST API.

```javascript
const response = await fetch("https://api.adverto.ai/v1/campaigns", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Winter Collection",
    objective: "CONVERSIONS",
    budget: 500
  })
});
```

## Features

- **Automated Creative Generation**: Call the `/generate` endpoint to produce variants.
- **Real-Time Analytics**: Stream ROAS and Spend data via our webhooks.
- **Autopilot Sync**: Automatically push optimized creatives to Meta and Google Ads.

For advanced tutorials, please see the integration guides.
