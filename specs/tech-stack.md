# Tech Stack

## Guiding constraint

All code is TypeScript end-to-end. One language across the full stack reduces context-switching and makes shared types (podcast, review, recommendation) safe across boundaries without code generation.

## Frontend

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 | Stakeholder requirement; large ecosystem, strong hiring pool |
| Language | TypeScript | Type safety, shared interfaces with backend |
| Styling | Tailwind CSS | Utility-first, fast to iterate, great for responsive design |
| Routing | React Router v6 | Client-side navigation for SPA behavior |
| State / data fetching | TanStack Query | Caching, background refresh, loading/error states out of the box |
| Build | Vite | Fast dev server, modern ESM output |

## Backend

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js | TypeScript-native, matches frontend language |
| Framework | Express | Lightweight, well-understood, easy to extend |
| Language | TypeScript | End-to-end type safety |
| ORM | Prisma | Type-safe database client, great migration tooling |

## Database

| Purpose | Technology | Reason |
|---|---|---|
| Primary store | PostgreSQL | Reliable, relational, handles users / reviews / metadata well |
| Semantic search & recommendations | pgvector (Postgres extension) | Vector similarity search in the same DB; no extra infrastructure |
| Full-text search | pg_tsvector (built-in) | Fast keyword search without a separate search service |

Using pgvector keeps the database layer simple (one Postgres instance) while enabling AI-powered recommendations via embedding similarity.

## External data

- **Podcast Index API** — open, free podcast directory; source of truth for podcast metadata and thumbnails
- Fallback: iTunes Search API for supplementary metadata

## Infrastructure (target)

- Frontend: static hosting (Vercel or Netlify)
- Backend: containerized Node service (Railway or Render)
- Database: managed Postgres (Supabase or Neon) with pgvector enabled

## Mobile

The web app is built responsive-first (mobile breakpoints via Tailwind). A dedicated mobile app (React Native) is deferred to a later roadmap phase.
