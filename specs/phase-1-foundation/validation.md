# Validation — Phase 1: Foundation

## Definition of Done

Phase 1 is complete when every item below passes without manual workarounds.

---

### Scaffold

- [ ] `make dev` (or equivalent) starts both `/web` (Vite) and `/server` (Express) with a single command.
- [ ] `GET /api/health` returns `200 OK`.
- [ ] `/web` proxies `/api/*` to the local server — no CORS errors in the browser console.
- [ ] A type defined in `/shared` is importable in both `/web` and `/server` without TypeScript errors.

### Database schema

- [ ] `prisma migrate dev` runs to completion with no errors on a fresh Postgres instance.
- [ ] All six models (`Podcast`, `Episode`, `Transcript`, `User`, `Review`, `Rating`) exist in the database.
- [ ] GIN indexes on `tsvector` columns exist (verify via `\d podcasts` in psql).
- [ ] Seed script populates at least 5 podcasts with episodes.

### Podcast Index API integration

- [ ] Running the ingestion script inserts at least 100 podcasts into the `podcasts` table.
- [ ] Each podcast record has a non-null `title`, `description`, and `thumbnailUrl`.
- [ ] Re-running the script does not create duplicate rows (upsert is idempotent).
- [ ] Episodes for each ingested podcast appear in the `episodes` table.

### Transcript ingestion

- [ ] At least one episode in the dev dataset has a populated `transcripts` row.
- [ ] Re-running ingestion does not duplicate transcript rows.
- [ ] Episodes without a transcript source are stored normally in `episodes` with no error thrown.
- [ ] The `tsvector` column on `transcripts` is populated for rows that have content.

### Search endpoint

- [ ] `GET /api/search?q=technology` returns a JSON body with a `results` array and `total` count.
- [ ] Results are ordered — the most relevant podcast appears first.
- [ ] A search term present only in a transcript (not in the podcast title or description) still returns the matching podcast.
- [ ] `GET /api/search?q=` returns `400` with a descriptive error message.
- [ ] Response time is under 500 ms measured via `curl` on the local dev database.

### Search UI

- [ ] Typing in the search bar on the home page triggers a query (debounced — not on every keystroke).
- [ ] Results render as a grid of cards with thumbnail, title, host, and truncated description.
- [ ] A loading skeleton is shown while the query is in flight.
- [ ] Clearing the search bar removes results and shows the default empty state.
- [ ] Clicking a podcast card navigates to `/podcasts/:id`.

### Podcast detail page

- [ ] `/podcasts/:id` renders without errors for any seeded podcast id.
- [ ] Cover art, title, host, and description are all visible.
- [ ] Average star rating is displayed (shows "No ratings yet" if none exist).
- [ ] Episode list is present and ordered chronologically.
- [ ] Navigating directly to the URL (hard refresh) works — no blank page.

### Cross-cutting

- [ ] `tsc --noEmit` passes with zero errors across all packages.
- [ ] All interactive elements (search bar, podcast cards, episode links) are reachable via keyboard tab navigation.
- [ ] No `console.error` output appears in the browser during a standard search → detail page flow.
