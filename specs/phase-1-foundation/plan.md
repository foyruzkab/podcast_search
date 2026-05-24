# Plan — Phase 1: Foundation

## Sequence

Work proceeds in dependency order. Each step must be complete before the next begins.

---

### Step 1 — Monorepo scaffold (day 1–2)

1. Initialise the root `package.json` with workspaces: `["web", "server", "shared"]`.
2. Create `/shared` — a TypeScript package exporting core interfaces (`Podcast`, `Episode`, `Transcript`, `Review`, `Rating`, `User`). Both `/web` and `/server` import from here.
3. Create `/server`:
   - Express app with TypeScript (`ts-node` / `tsx` for dev).
   - Prisma installed and pointed at a local Postgres instance via `DATABASE_URL` in `.env`.
   - Health check route `GET /api/health`.
4. Create `/web`:
   - `npm create vite` with the React + TypeScript template.
   - Add Tailwind CSS, React Router v6, TanStack Query.
   - Proxy `/api` to the local server in `vite.config.ts`.
5. Add a root `Makefile` (or `package.json` scripts) to start both packages with one command.

---

### Step 2 — Database schema (day 2–3)

1. Write the Prisma schema (`/server/prisma/schema.prisma`) with models: `Podcast`, `Episode`, `Transcript`, `User`, `Review`, `Rating`.
2. Add `@@index` on `Podcast.title` and a raw migration to create `tsvector` columns and GIN indexes on `podcasts` and `transcripts`.
3. Run `prisma migrate dev --name init` to apply the schema.
4. Seed script (`/server/prisma/seed.ts`) with 5–10 hardcoded podcasts so the UI can be developed without live API calls.

---

### Step 3 — Podcast Index API integration (day 3–4)

1. Register for a Podcast Index API key; store as `PODCAST_INDEX_KEY` / `PODCAST_INDEX_SECRET` in `.env`.
2. Create `/server/src/ingest/podcastIndex.ts` — a typed client wrapping the Podcast Index search and feed endpoints.
3. Write an ingestion script (`/server/src/ingest/run.ts`) that:
   - Fetches the top N podcasts by category.
   - Upserts into `podcasts` via Prisma (`upsert` on `feedUrl`).
   - Upserts episodes from the feed into `episodes`.
4. Run the script to populate the dev database with real data.

---

### Step 4 — Transcript ingestion (day 4–5)

1. Extend the ingestion script to check each episode for a transcript URL in the podcast feed (RSS `<podcast:transcript>` tag).
2. If a transcript URL exists, fetch the content (plain text or SRT) and strip formatting.
3. Upsert into `transcripts` with `source = 'fetched'`.
4. If no transcript is available, skip without error (`source` field remains absent).
5. Update the `tsvector` column on `transcripts` after each upsert via a Postgres trigger or explicit `UPDATE`.

---

### Step 5 — Search endpoint (day 5–6)

1. Create `GET /api/search` in `/server/src/routes/search.ts`.
2. Accept query param `q`; sanitise and pass to `to_tsquery`.
3. Run a ranked full-text search joining `podcasts` and `transcripts` on the `tsvector` columns; return deduplicated podcast rows ordered by `ts_rank`.
4. Response: `{ results: Podcast[], total: number }`.
5. Return 400 with a clear message if `q` is empty.

---

### Step 6 — Search UI (day 6–7)

1. Home page (`/web/src/pages/Home.tsx`):
   - Controlled search bar; debounce input by 300 ms.
   - TanStack Query `useQuery` hitting `/api/search?q=`.
   - Results grid: `PodcastCard` component (thumbnail, title, host, truncated description).
   - Loading skeleton and "no results" empty state.
2. `PodcastCard` links to `/podcasts/:id`.

---

### Step 7 — Podcast detail page (day 7–8)

1. Route `/podcasts/:id` → `PodcastDetail.tsx`.
2. Fetch `GET /api/podcasts/:id` — returns podcast + episodes + average rating.
3. Render: cover art, title, host, description, average star rating (display only), episode list (title + publish date, chronological).
4. Add the `/api/podcasts/:id` endpoint in `/server/src/routes/podcasts.ts`.

---

## Key risks

| Risk | Mitigation |
|---|---|
| Podcast Index API rate limits | Cache responses; run ingestion script once, not on every request |
| Few episodes have transcript URLs | Accept best-effort in Phase 1; transcript generation is Phase 3 |
| `pg_tsvector` ranking quality | Tune column weights (title > description > transcript) via `setweight` |
| Monorepo DX friction | Validate shared-type imports early (Step 1) before building on top |
