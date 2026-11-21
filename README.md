# OneAtlas — AI Model Discovery & Intelligence Platform

OneAtlas is an enterprise-grade AI model discovery and benchmarking intelligence platform inspired by OpenRouter, RouterPlus, and LiteLLM. Designed with a modern, developer-first UX (clean neutral palette, mono typography, tight borders, responsive layouts), OneAtlas allows developers, AI engineers, and product leaders to explore, filter, compare, benchmark, and evaluate over 88 frontier language models across 12 research labs and 10 inference providers.

---

## 🚀 Live Demo & Key Capabilities

- **Model Discovery (`/models`)**: Real-time faceted filtering by lab, provider, modality, model type, license, price range, and context window. All filters, sort criteria, pagination, and view modes (grid/list) are bidirectionally synchronized with URL query parameters for seamless deep-linking and browser navigation.
- **Deep Model Intelligence (`/models/[slug]`)**: Detailed spec sheets, token pricing breakdown ($/1M tokens input & output), context capacity, multimodal capabilities, provider latency/throughput benchmarks, Recharts performance charts (Bar & Radar), and similar model recommendations.
- **Side-by-Side Model Comparator (`/compare`)**: Compare 2–4 models side-by-side with automatic best-in-class highlights (cheapest token cost, largest context window, top benchmark score), normalized radar overlay, and a persistent floating comparison tray that follows the user across the application.
- **Leaderboard & Pareto Frontier (`/rankings`)**: Comprehensive benchmark rankings (LMSYS Arena Elo, MMLU, GPQA, HumanEval, SWE-bench) featuring an interactive **Price vs. Performance Scatter Plot** that plots intelligence against token cost to reveal the cost-efficiency Pareto frontier.
- **AI Labs Directory (`/labs` & `/labs/[slug]`)**: Overview of leading AI research laboratories (OpenAI, Anthropic, Google DeepMind, Meta, Mistral, DeepSeek, xAI, Cohere, Alibaba/Qwen) with chronological model release timelines.
- **Inference Cloud Directory (`/providers` & `/providers/[slug]`)**: Host platform profiles (OpenRouter, Together, Fireworks, Groq, Azure, Bedrock) with live latency, throughput (tokens/sec), and uptime SLA metrics.
- **Universal Command Palette (Cmd/Ctrl + K)**: Fast, keyboard-navigable global search across models, labs, and providers powered by `cmdk`.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | React Server Components, Streaming SSR, Edge/Node route handlers |
| **Language** | TypeScript (Strict) | End-to-end typed contracts across schema, API, and UI |
| **Styling** | Tailwind CSS + Radix UI | Accessible headless primitives, custom theme tokens (light/dark) |
| **State & Cache** | TanStack Query v5 + Zustand v5 | Server state caching, stale-while-revalidate, persisted Compare Tray |
| **Visualizations**| Recharts | Responsive SVG charts (Bar, Radar, Scatter Plot) |
| **Validation** | Zod | Runtime validation on all API query params, route parameters, and payloads |
| **Database** | PostgreSQL + Prisma ORM | Relational schema with composite indexes, Neon Serverless ready |
| **Icons** | Lucide React | Consistent UI iconography |

---

## 📂 Project Architecture & Folder Structure

```
.
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema with Lab, Provider, Model, Benchmark, Capability
│   └── seed.ts                   # Realistic idempotent seed data (12 labs, 10 providers, 88 models)
├── src/
│   ├── app/                      # Next.js App Router (Pages, Layouts, API Handlers)
│   │   ├── api/
│   │   │   ├── benchmarks/       # GET /api/benchmarks
│   │   │   ├── compare/          # GET /api/compare?slugs=a,b,c
│   │   │   ├── labs/             # GET /api/labs, GET /api/labs/[slug]
│   │   │   ├── models/           # GET /api/models, GET /api/models/[slug]
│   │   │   ├── providers/        # GET /api/providers, GET /api/providers/[slug]
│   │   │   ├── rankings/         # GET /api/rankings?benchmark=&category=
│   │   │   └── search/           # GET /api/search?q= (global search)
│   │   ├── compare/              # /compare page
│   │   ├── labs/                 # /labs & /labs/[slug] pages
│   │   ├── models/               # /models & /models/[slug] pages
│   │   ├── providers/            # /providers & /providers/[slug] pages
│   │   ├── rankings/             # /rankings leaderboard & scatter plot
│   │   ├── globals.css           # Tailwind design tokens & dark/light CSS variables
│   │   ├── layout.tsx            # Root layout with QueryClientProvider, Navbar, Footer, CompareTray
│   │   └── page.tsx              # Home landing page with hero search and highlights
│   ├── components/
│   │   ├── compare/              # CompareTable, ModelSelector, CompareTray
│   │   ├── home/                 # Hero, StatStrip, FeaturedModels, TopLabs
│   │   ├── layout/               # Navbar, Footer, MobileNav
│   │   ├── models/               # ModelCard, ModelTable, FilterSidebar, BenchmarkChart, ProviderTable
│   │   ├── rankings/             # RankingsView, PricePerformanceScatter
│   │   ├── shared/               # CommandPalette, LabAvatar, ThemeToggle, PricingBadge
│   │   └── ui/                   # Button, Badge, Card, Dialog, Sheet, Select, Tabs, Skeleton
│   ├── hooks/
│   │   ├── use-compare.ts        # Zustand store with localStorage persistence for compare queue
│   │   └── use-model-filters.ts  # Bi-directional URL search params synchronization hook
│   ├── lib/
│   │   ├── api/                  # Shared typed API client
│   │   ├── data/                 # Database repository with fallback resilience
│   │   ├── db.ts                 # Singleton Prisma client
│   │   ├── utils.ts              # Formatters (formatPrice, formatContext, formatLatency, formatThroughput)
│   │   └── validators.ts         # Zod schemas & standardized API error responder
│   └── types/                    # Shared TypeScript interfaces & types
└── test/
    └── test-api.ts               # Automated API test suite (status codes, edge cases, error shapes)
```

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js 18.17+ or 20+
- PostgreSQL database (local or cloud like [Neon](https://neon.tech))

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/shettysaikumar20/oneatlas.git
cd oneatlas
npm install
```

> **Windows Quick Start**: You can also double-click `start.bat` to automatically check dependencies, generate Prisma client, and start the development server on `http://localhost:3000`.

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) with your Neon connection strings:
```env
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"
DIRECT_URL="postgresql://[user]:[password]@[neon_hostname].[region].aws.neon.tech/[dbname]?sslmode=require"
```

### 3. Push Database Schema & Seed
```bash
# Push schema to PostgreSQL database
npx prisma db push

# Run idempotent database seed
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Type Checks & Production Build
```bash
# Verify TypeScript strict typing
npx tsc --noEmit

# Run Next.js production build
npm run build

# Run API test suite
npx tsx test/test-api.ts
```

---

## 🧠 Architectural Decisions & Technical Highlights

### 1. URL as Single Source of Truth (`useModelFilters`)
- Filter parameters (`q`, `lab`, `provider`, `capability`, `modelType`, `license`, `minPrice`, `maxPrice`, `sort`, `order`, `page`, `view`) are kept entirely in URL search params.
- Any link copied and shared produces the exact view state for the recipient.
- Back and forward browser navigation works naturally with zero custom history stacks.
- Updates use Next.js `router.replace(url, { scroll: false })` combined with debounced search input (300ms) to ensure smooth typing with zero scroll jumps.

### 2. Server Components vs. Client Components Split
- Static and SEO-critical content (Page wrappers, `generateMetadata`, layouts) are rendered as Server Components.
- Dynamic data views (`ModelsView`, `ModelDetailView`, `RankingsView`, `CompareView`) are Client Components wrapped in React `Suspense` boundaries with corresponding skeletons to deliver instant First Contentful Paint (FCP).
- On-hover prefetching (`router.prefetch('/models/[slug]')`) is implemented in `ModelCard` and `ModelTable` to make detail page transitions feel instantaneous.

### 3. Dual State Compare System
- **Global Compare Tray**: Powered by a Zustand store with `persist` middleware, storing up to 4 selected models in `localStorage`. The floating tray displays on all pages, enabling users to browse different labs and collect models for comparison.
- **Deep Shareable Compare URLs**: When navigating to `/compare?models=slug-a,slug-b`, the view hydrates from URL params so compare sessions can be bookmarked or shared with colleagues.

### 4. Resilient Database Repository Pattern
- All API route handlers query via `src/lib/data/repository.ts`.
- Prisma handles high-speed relational queries with full composite index utilization.
- If the database is cold, undergoing maintenance, or during isolated test executions, the repository gracefully serves verified memory fallbacks without throwing 500 errors or failing static build generation.

### 5. Strict Zod Validation & Uniform Error Shape
All route handlers validate input queries using Zod and return a standard RFC-compliant error structure:
```json
{
  "error": {
    "code": "INVALID_QUERY_PARAMS",
    "message": "Invalid query parameters provided",
    "details": [...]
  }
}
```
Endpoints return proper HTTP status codes: `400 Bad Request` for invalid parameters, `404 Not Found` for missing resources, and `500 Internal Server Error` with server logs.

---

## 🌟 Original Touches & Frontend Engineering Highlights

1. **Price vs. Performance Scatter Plot (Pareto Frontier)**:
   - Placed directly on `/rankings`, this Recharts scatter plot graphs **Token Price ($/1M tokens)** on the X-axis (log scale) against **Benchmark Accuracy** on the Y-axis.
   - Allows engineers to spot outliers that sit on the Pareto frontier (such as DeepSeek-V3 and Llama 3.3 70B delivering GPT-4o level benchmark scores at a fraction of the cost).

2. **"Best Value" Badge & Computation**:
   - Calculated as `BenchmarkScore / (InputPricePerM + OutputPricePerM)`.
   - Models delivering the highest benchmark yield per dollar spent are awarded the `Best Value` badge on both the homepage and rankings leaderboard.

3. **Inference Latency & Throughput SLA Indicators**:
   - Visual telemetry badges comparing Groq, Together, Fireworks, Azure, Bedrock, and OpenRouter, showing real-world milliseconds-to-first-token (TTFT) and generation throughput (tokens/second).

---

## 📹 Video Walkthrough Guide (Loom Script Outline)

When recording a 3–5 minute Loom walkthrough, structure your presentation around these key points:

1. **Architecture & Design System (0:00 - 1:00)**:
   - Walk through the visual language: dark/light theme, developer palette inspired by Vercel/Linear, JetBrains Mono font for numbers, consistent spacing.
   - Demonstrate the **Universal Command Palette** (`Cmd + K`) with instant grouped navigation.
2. **Model Discovery & URL State (1:00 - 2:00)**:
   - Demonstrate filtering by Lab (e.g. Anthropic) and Capability (Vision + Tool Calling).
   - Point to the browser address bar: show how URL search params update live with debounced search, facet counts, and view toggling. Copy the URL into an incognito window to prove deep-link restoration.
3. **Compare System & Floating Tray (2:00 - 2:45)**:
   - Click "Add to compare" on 3 models. Show how the floating tray smoothly expands and persists as you navigate across pages.
   - Open `/compare` to show the side-by-side spec comparison matrix, auto-highlighted best values, and radar benchmark overlay.
4. **Rankings Leaderboard & Price-vs-Performance Scatter (2:45 - 3:30)**:
   - Switch between LMSYS Arena Elo, MMLU, and SWE-bench leaderboards.
   - Explain the Price-Performance scatter plot and how it helps teams optimize AI token budgets.
5. **Code Quality & Testing (3:30 - 4:00)**:
   - Show strict TypeScript compilation (`npx tsc --noEmit`), ESLint passing with zero warnings, and automated route testing.

---

## ⚖️ Trade-offs & Next Steps

- **Trade-off: Client-Side TanStack Query with Suspense vs Pure SSR**:
  - *Decision*: We used React Server Components for SEO shells and TanStack Query on the client for live filtering. This provides instant filter feedback without full page reloads, while URL parameters preserve complete SEO crawlability.
- **Next Steps & Roadmap**:
  - Live WebSocket streaming latency telemetry from real inference endpoints.
  - User custom API key vault for directly testing completions inside the model detail view.
  - User bookmarking and saved custom benchmark evaluation suites.

---

## 📄 License
MIT License. Built for the Senior Frontend Engineer evaluation.
