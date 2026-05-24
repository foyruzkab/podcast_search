# Roadmap

## Phase 1 — Foundation (weeks 1–3)

Goal: a working search experience with real podcast data.

- [ ] Project scaffold: monorepo with `/web` (Vite + React) and `/server` (Express + Prisma)
- [ ] Database schema: `podcasts`, `episodes`, `users`, `reviews`, `ratings`
- [ ] Podcast Index API integration: ingest metadata and thumbnails into Postgres
- [ ] Transcript ingestion: fetch or generate episode transcripts and store them in Postgres
- [ ] Search endpoint: full-text search via `pg_tsvector` across title, description, host, and transcript content
- [ ] Search UI: search bar, results grid with podcast thumbnails, title, and description
- [ ] Podcast detail page: cover art, description, episode list, average rating

## Phase 2 — Reviews (weeks 4–5)

Goal: listeners can contribute and read reviews.

- [ ] User auth: email + password (JWT); OAuth stretch goal
- [ ] Review submission: star rating + text review per podcast
- [ ] Review display: threaded list on podcast detail page, sorted by helpfulness
- [ ] My reviews page: user profile showing their review history

## Phase 3 — Recommendations (weeks 6–8)

Goal: personalized discovery powered by vector similarity.

- [ ] Enable pgvector on Postgres
- [ ] Generate embeddings for each podcast (description + tags) via Claude or OpenAI embeddings API
- [ ] Store embeddings in a `podcast_embeddings` table
- [ ] "More like this" feature: nearest-neighbor query on podcast detail page
- [ ] Personalized feed: blend of top-rated + similar to podcasts the user has reviewed highly
- [ ] Recommendation explanation: short "why we recommended this" label

## Phase 4 — Mobile & Polish (weeks 9–12)

Goal: production-ready web app; mobile app foundations.

- [ ] Responsive audit: test all pages at mobile, tablet, and desktop breakpoints
- [ ] Performance: lazy-load thumbnails, paginate results, cache popular searches
- [ ] Accessibility: keyboard navigation, ARIA labels, color contrast audit
- [ ] React Native app: search + browse screens reusing backend API
- [ ] Analytics: track search queries, click-through, and recommendation engagement

## Out of scope (for now)

- Podcast audio playback (use native apps for that)
- Creator / podcast owner accounts
- Paid placement or sponsored results
