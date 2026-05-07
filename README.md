# MarketPulse

A focused stock-tracking SPA built as a portfolio piece. Watchlists, a real-price portfolio, interactive charts, and a Gemini-powered assistant grounded in the user's actual data.

**Live:** [market-pulse-two.vercel.app](https://market-pulse-two.vercel.app/) · **Source:** [github.com/Abhishek1334/MarketPulse](https://github.com/Abhishek1334/MarketPulse)

![Homepage](./screenshots/Homepage_Light.png)

---

## TL;DR for reviewers

- **Single-platform Vercel deploy.** React 19 SPA + Express 5 backend in one Function. Sub-second cold start via Fluid Compute.
- **AI assistant with visible tool calls.** Vercel AI SDK v6 + Gemini 2.5 Flash. Three tools (`getPortfolioSummary`, `getStockQuote`, `searchSymbol`); the UI surfaces what the agent did.
- **Editorial design language.** Fraunces (variable serif), Plus Jakarta Sans (body), JetBrains Mono with tabular numerals (prices). Single amber accent shared across light + dark.
- **Real persistence, real prices.** MongoDB for users / watchlists / portfolio. Quotes proxied through a cached Express endpoint; the API key never reaches the client.
- **Free across the stack.** Hobby Vercel + free Mongo Atlas + free Twelve Data + free Google AI Studio. No card on file anywhere.
- **0 fake metrics, 0 fake testimonials.** Every claim in this README and every number on the live site is real.

---

## What's worth your 60 seconds

**Single-Function backend that *isn't* Next.js.** Vercel's `api/[...slug]` catch-all is a Next.js convention; it deploys as a Function on a Vite project but never receives `/api/*` traffic. The bulletproof pattern that does work: a single `api/index.js` + a `vercel.json` rewrite that forwards `/api/:path*` to `/api?__path=:path*`, with the handler reconstructing `req.url` before invoking Express. Discovered by deploying it wrong four times. ([commit](https://github.com/Abhishek1334/MarketPulse/commit/dcd6cba))

**Mongoose connection caching for serverless.** Each warm Function invocation reuses a cached connection on `globalThis._mongooseCache`. Without this, Atlas blocks the deployment within minutes. ([server/db.js](./server/db.js))

**Streaming AI responses with audited tool calls.** The chat handler uses `streamText` + `pipeUIMessageStreamToResponse`. The frontend shows `🔧 Used: getStockQuote` chips inline so the agent's actions are inspectable, not opaque. ([server/controllers/aiController.js](./server/controllers/aiController.js))

**Brand consistency across modes.** Original tokens shifted from sky-blue (light) to purple (dark) — two products visually. New OKLCH-based system uses one amber accent (`oklch(72% 0.16 60)`) across both modes. ([src/index.css](./src/index.css))

**Server-side LRU cache.** Namespace-scoped TTLs (60s for quotes, 5min for charts, 1h for search/validate) extend the free Twelve Data quota by ~10× during demos. Hit-rate exposed at `/api/stock/_cache-stats`. ([server/utils/cache.js](./server/utils/cache.js))

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | React 19, Vite 6, Tailwind v4 | Fast dev loop, modern build, utility-first styling |
| State | Zustand (auth, theme, portfolio cache) + TanStack Query (watchlists) | Clean split between client state and server cache |
| Charts | Chart.js + react-chartjs-2 | Light footprint vs heavier alternatives |
| UI primitives | shadcn/ui (Radix + cva), lucide-react | Accessible, copy-paste, no runtime UI lib dep |
| Animation | GSAP for hero reveals, native CSS otherwise | One signature entrance, restrained micro-interactions |
| Typography | Fraunces (display), Plus Jakarta Sans (body), JetBrains Mono (numbers) | Editorial finance section feel; tabular numerals on prices |
| Backend | Express 5, Mongoose 8, MongoDB Atlas | Familiar Node stack, fast iteration |
| Auth | JWT (Bearer in `Authorization` header) | Simple, sessionless |
| Market data | Twelve Data | Single provider, server-cached |
| AI | Vercel AI SDK v6 + Google Gemini 2.5 Flash | Free permanent tier, supports tool-calling |
| Hosting | **Vercel** — frontend + Express together as one Function | Sub-second cold start, free Hobby plan, single domain |

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

## Features

- **Watchlists** — multiple per user, add/remove stocks, server-cached quotes.
- **Portfolio** — holdings + transactions persisted to MongoDB. Real current prices fetched on every load and re-fetched after every mutation.
- **Stock analytics** — interactive Chart.js price charts with technical indicators (RSI, MACD, SMA, EMA, Bollinger), timeframe + interval picker.
- **Symbol search** — Twelve Data search debounced through a server-cached endpoint.
- **AI assistant** (`/assistant`) — natural-language Q&A with three tools, streaming responses, visible tool-call chips.
- **Light + dark mode** — themed via OKLCH CSS variables, brand accent unified across modes.
- **Server-side response cache** — namespace-scoped TTLs, hit-rate exposed at `/api/stock/_cache-stats`.

---

## Screenshots

### Light mode

| Homepage | Dashboard | Portfolio |
| --- | --- | --- |
| ![Homepage](./screenshots/Homepage_Light.png) | ![Dashboard](./screenshots/Dashboard_Light.png) | ![Portfolio](./screenshots/Portfolio1_Light.png) |

| Analytics | Watchlist | Assistant |
| --- | --- | --- |
| ![Analytics](./screenshots/Analytics1_Light.png) | ![Watchlist](./screenshots/Watchlist_Light.png) | ![Assistant](./screenshots/Assistant_Light.png) |

### Dark mode

| Homepage | Dashboard | Portfolio |
| --- | --- | --- |
| ![Homepage](./screenshots/Homapage_Dark.png) | ![Dashboard](./screenshots/Dashboard_Dark.png) | ![Portfolio](./screenshots/Portfolio1_Dark.png) |

| Analytics | Watchlist | Assistant |
| --- | --- | --- |
| ![Analytics](./screenshots/Analytics1_Dark.png) | ![Watchlist](./screenshots/Watchlist_Dark.png) | ![Assistant](./screenshots/Assistant_Dark.png) |

Full set in [`/screenshots`](./screenshots).

---

## Trade-offs and known limits

- **JWT in localStorage.** Simple, but XSS-readable. A production version would use httpOnly cookies.
- **No tests yet.** Lint + build + server syntax-check run on every PR via GitHub Actions; runtime behavior is verified manually with Playwright.
- **No real-time prices.** Quotes refresh on user action, not via WebSocket. The free Twelve Data tier doesn't include WS.
- **Free-tier rate limits.** Twelve Data is 8 req/min on the free plan. The server-side cache extends this significantly during demos, but a sustained burst will return errors.
- **Bundle size.** ~370 KB gzipped. Chart.js + GSAP + AI SDK dominate. Code-splitting `/assistant` and `/stocks/:symbol` would shave ~200 KB for cold first paint.

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
JWT_SECRET=<long random>
TWELVE_DATA_API_KEY=<from twelvedata.com — free>
GOOGLE_GENERATIVE_AI_API_KEY=<from aistudio.google.com/app/apikey — free, optional>
PORT=5000
```

> If `GOOGLE_GENERATIVE_AI_API_KEY` is missing, `/assistant` returns a graceful "not configured" message instead of crashing.

Run dev:

```bash
npm run dev:server   # terminal 1, backend
npm run dev          # terminal 2, frontend
```

---

## Deploy to Vercel (5 minutes, free)

The repo is wired so the Express backend runs as a single Function alongside the static frontend.

1. Push the repo to GitHub.
2. **vercel.com → Add New → Project →** import the repo. Framework: Vite (auto-detected). Root: repo root.
3. Add environment variables for *Production + Preview + Development*:
   ```
   MONGO_URI                       (MongoDB Atlas connection string)
   JWT_SECRET                      (long random string)
   TWELVE_DATA_API_KEY             (free key)
   GOOGLE_GENERATIVE_AI_API_KEY    (free key)
   ```
4. **MongoDB Atlas → Network Access → add `0.0.0.0/0`** so Vercel's dynamic IPs can connect.
5. Click Deploy.

**How it's wired:**
- `api/index.js` exports the Express app from `server/app.js` as a Vercel Function.
- `vercel.json` rewrites `/api/:path*` → `/api?__path=:path*`. The handler reconstructs `req.url` before invoking Express.
- Non-`/api` paths rewrite to `/index.html` for SPA routing (path-to-regexp negative lookahead).
- `server/db.js` caches the Mongoose connection on `globalThis` for serverless warm reuse.
- Function `maxDuration = 60s` to cover AI streaming.

---

## What I learned shipping this

These are the lessons that cost an hour or more apiece. Saved here so the next person (and the next AI) doesn't repeat them.

- **Vercel rewrites use path-to-regexp, not standard RegExp.** Negative lookaheads must be in capture groups; `(.*)` is segment-bounded — use `:path*` for multi-segment captures. ([Vercel docs](https://vercel.com/docs/errors/error-list#invalid-route-source-pattern))
- **`api/[...slug].js` catch-all is Next.js-only.** On framework-agnostic projects (Vite, etc.), the file deploys but never receives traffic. Use a single `api/index.js` + a forwarding rewrite.
- **React minified error #527 = duplicate React versions in the bundle.** Always run `npm ls react react-dom` after installing any React-using package. They drift silently when one is updated and the lockfile pins the other.
- **`convertToModelMessages` from the AI SDK is async.** Forgetting `await` produces a "messages.some is not a function" error inside the SSE stream — diagnose by checking the response body, not the HTTP status (which will be 200).
- **Vercel AI Gateway is not perpetually free.** Hobby plans get a small starter credit. For a demo-traffic portfolio piece, Gemini 2.5 Flash on Google AI Studio has a permanent free tier (15 req/min, 1M tokens/day) and works through `@ai-sdk/google` with the same code shape.
- **Verify free-tier coverage of every endpoint before recommending an API migration.** I almost moved off Twelve Data to Finnhub before realizing I couldn't confirm `/stock/candle` was still on the free tier post-2024. Cache layer ended up solving the rate-limit pain anyway.

---

## What I'd do differently next time

- **TypeScript from day one.** Most defects in this repo were prop-shape or response-shape mismatches that TS would have caught.
- **Tests as a first-class citizen.** Even a small Vitest + Playwright harness would have caught several API-argument-order and stale-state bugs that surfaced in late-stage testing.
- **Code-split per route.** A 1.2 MB unsplit bundle is fine for an in-house tool, draggy on a public landing page.
- **Real-time prices via WebSocket.** Polling for quotes reads as a 2018 product when the upstream supports streams.

---

## Contact

- GitHub: [@Abhishek1334](https://github.com/Abhishek1334)
- LinkedIn: [Abhishek Rajoria](https://linkedin.com/in/AbhishekRajoria)
- Email: AbhishekRajoria24@gmail.com
