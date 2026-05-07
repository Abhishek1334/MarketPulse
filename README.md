# MarketPulse

A stock market analytics SPA: watchlists, portfolio tracking, interactive price charts, technical indicators, and AI-powered insights.

**Live:** https://market-pulse-two.vercel.app/
**Source:** https://github.com/Abhishek1334/MarketPulse

> Built as a portfolio piece to practice fullstack development end-to-end: auth, third-party API integration, charting, state management, and deployment across two platforms.

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | React 19, Vite 6, Tailwind v4 | Fast dev loop, modern build, utility-first styling |
| State | Zustand (auth/UI) + TanStack Query (server data) | Clear split between client state and server cache |
| Charts | Chart.js + react-chartjs-2 | Light footprint vs. heavier alternatives |
| UI primitives | shadcn/ui (Radix + cva), lucide-react icons | Accessible, copy-paste, no runtime dep on a UI lib |
| Animations | GSAP + ScrollTrigger | Smooth scroll-driven entrances |
| Backend | Express 5, Mongoose, MongoDB Atlas | Familiar Node stack, fast iteration |
| Auth | JWT (Bearer in `Authorization` header) | Simple, works without sessions |
| Market data | Twelve Data (search, quote, time-series) | Single provider after migrating off Yahoo Finance |
| AI | Vercel AI SDK v6 + Google Gemini 2.5 Flash (free tier) | Tool-call-driven assistant, streaming via `pipeUIMessageStreamToResponse` |
| Hosting | **Vercel** (single deploy: frontend + Express as a Function) | Single platform, sub-second cold start via Fluid Compute, free Hobby plan |

## Features

- **Watchlists** — multiple per user, add/remove stocks, live quotes.
- **Portfolio tracking** — holdings + transactions persisted to MongoDB. Real-time current prices fetched on load.
- **Stock analytics** — interactive Chart.js price charts with technical indicators (RSI, MACD, SMA, EMA), timeframe + interval picker.
- **Symbol search** — Twelve Data search debounced through a server-cached endpoint.
- **AI Assistant** (`/assistant`) — natural-language Q&A about your portfolio and any stock. Tool-calling agent fetches live data through three tools: `getPortfolioSummary`, `getStockQuote`, `searchSymbol`. Streams responses via Server-Sent Events.
- **Light + dark mode** — fully themed via CSS variables.
- **Server-side response cache** — namespace-scoped TTL cache (60s for quotes, 5min for charts, 1h for search/validate) extends the free-tier API quota during demos. Cache stats exposed at `/api/stock/_cache-stats`.

---

## Architecture

```
┌──────────────────────────────────────────┐
│              Vercel deployment            │
│                                           │
│  ┌──────────────┐    ┌──────────────────┐ │
│  │ React SPA    │ /api/* │ Express app  │ │
│  │ (static dist)│ ─────► │ (Function)   │ │
│  └──────────────┘    └─────┬────────────┘ │
└─────────────────────────────┼─────────────┘
              │               │
   localStorage               │ Mongoose (cached connection)
   (auth + theme)             ▼
                       ┌─────────────┐
                       │  MongoDB    │
                       │  Atlas      │
                       └─────────────┘
                              ▲
                              │
              Twelve Data API ┘
              (proxied through Function,
              API key never reaches client)
```

**Data ownership:**
- **Server-of-record (Mongo):** users, watchlists, portfolio holdings, transactions, settings.
- **Client-only (Zustand persist → localStorage):** auth token, theme.

---

## Notable design decisions

**API proxy, not direct calls.** All Twelve Data requests go through Express. The API key stays server-side. Client never sees it. (The downside: every quote lookup costs you a server roundtrip, so we cache aggressively.)

**Hybrid state model.** Zustand for things the client owns (auth, UI). TanStack Query for things the server owns (watchlists). Portfolio uses Zustand-as-cache + explicit `loadPortfolio()` actions that call the API — pragmatic, but a future cleanup would move it fully into TanStack Query.

**Embedded subdocuments.** Holdings and transactions live as subdoc arrays inside one `Portfolio` doc per user, mirroring the watchlist+stocks shape. Trade-off: simpler reads, harder atomic updates at scale. Fine for the use case.

**Client-side rate limiter for chart fetches.** A `useRateLimitedFetch` hook batches and dedupes chart requests with a 5-minute TTL cache. It does *not* protect the actual API quota — that's the server's job — but it dramatically reduces redundant requests when a user toggles intervals.

---

## Trade-offs and known limits

- **JWT in localStorage.** Simple, but XSS-readable. A production version would use httpOnly cookies.
- **Two hosts.** Frontend on Vercel, backend on Railway. Two CI pipelines, two cold starts. A future cut would consolidate to Vercel Functions.
- **No tests yet.** Build/lint pass on PR; runtime behavior is verified manually.
- **No real-time prices.** Quotes refresh on user action, not via WebSocket.
- **Bundle size.** ~344 KB gzipped — Chart.js + GSAP are the bulk.

---

## Getting started

Requires Node 20+ and a MongoDB connection string.

```bash
git clone git@github.com:Abhishek1334/MarketPulse.git
cd MarketPulse
npm install
cd server && npm install && cd ..
```

Create a `.env` in `server/`:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=<a long random string>
TWELVE_DATA_API_KEY=<from twelvedata.com — free>
GOOGLE_GENERATIVE_AI_API_KEY=<from aistudio.google.com/app/apikey — free, optional, enables /assistant>
PORT=5000
```

> The AI Assistant uses Google Gemini 2.5 Flash, which has a permanently free tier on Google AI Studio (no card required). If `GOOGLE_GENERATIVE_AI_API_KEY` is missing, the `/assistant` page surfaces a "not configured" message instead of crashing.

Run dev (two terminals):

```bash
# terminal 1 — backend
npm run dev:server

# terminal 2 — frontend
npm run dev
```

Build for production:

```bash
npm run build
```

## Deploy to Vercel (5 minutes, free)

The repo is set up so the Express backend runs as a single Vercel Function alongside the static frontend.

1. **Push the repo to GitHub** (if not already).
2. **Create a Vercel project**: vercel.com → Add New → Project → import the repo.
   - Framework preset: **Vite** (auto-detected).
   - Root directory: leave as repo root.
   - Build command, output directory: leave defaults.
3. **Set environment variables** in the project settings → Environment Variables. Add for *Production + Preview + Development*:
   ```
   MONGO_URI                       (your MongoDB Atlas connection string)
   JWT_SECRET                      (any long random string)
   TWELVE_DATA_API_KEY             (free key from twelvedata.com)
   GOOGLE_GENERATIVE_AI_API_KEY    (free key from aistudio.google.com/app/apikey)
   ```
4. **Click Deploy.** First build takes ~2 minutes.

That's it. Frontend and backend live on the same domain — no CORS config, no two-host coordination, no sleep.

### How it's wired
- `api/[...slug].js` is a Vercel Function (catch-all filename) that exports the Express app.
- `vercel.json` sets `maxDuration: 60s` for the Function (covers AI streaming) and rewrites all non-`/api/*` paths to `index.html` for SPA routing.
- `server/db.js` caches the Mongoose connection on `globalThis` so warm Function invocations reuse it instead of opening a new one each request.
- `server/app.js` runs an Express middleware that awaits `connectDB()` before any handler — fast on warm starts, transparent on cold.

---

## Screenshots

### Light mode
| Homepage | Dashboard | Analytics |
| --- | --- | --- |
| ![Homepage](./screenshots/Homepage_Light.png) | ![Dashboard](./screenshots/Dashboard_Light.png) | ![Analytics](./screenshots/Analytics1_Light.png) |

### Dark mode
| Homepage | Dashboard | Analytics |
| --- | --- | --- |
| ![Homepage](./screenshots/Homapage_Dark.png) | ![Dashboard](./screenshots/Dashboard_Dark.png) | ![Analytics](./screenshots/Analytics1_Dark.png) |

Full screenshot set in [`/screenshots`](./screenshots).

---

## What I'd do differently next time

- **TypeScript from day one.** Most defects in this repo were prop-shape or response-shape mismatches that TS would have caught.
- **One backend host.** Cold-start coordination across Vercel + Railway adds latency and complexity.
- **Tests as a first-class citizen.** Even a small Vitest + Playwright harness would have caught the API-argument-order bug class.
- **Move the rate limiter server-side.** Client-side counters protect the user's UX, not the API quota — those are different problems.

---

## Contact

- GitHub: [@Abhishek1334](https://github.com/Abhishek1334)
- LinkedIn: [Abhishek Rajoria](https://linkedin.com/in/AbhishekRajoria)
- Email: AbhishekRajoria24@gmail.com
