# Requirements — Phase 1: Foundation

## Goal

Deliver a working search experience with real podcast data, including episode transcripts, by end of week 3.

## Functional Requirements

### Monorepo Scaffold
- The repository must contain a `/web` package (Vite + React 18 + TypeScript + Tailwind CSS + React Router v6 + TanStack Query) and a `/server` package (Node.js + Express + TypeScript + Prisma).
- Shared TypeScript types (e.g. `Podcast`, `Episode`) must be defined once and importable by both packages without code generation.

### Database Schema
The Prisma schema must define the following models:

| Model | Key fields |
|---|---|
| `Podcast` | id, title, description, host, thumbnailUrl, feedUrl, indexedAt |
| `Episode` | id, podcastId, title, description, publishedAt, audioUrl |
| `Transcript` | id, episodeId, content (full text), source (fetched or generated) |
| `User` | id, email, passwordHash, createdAt |
| `Review` | id, userId, podcastId, body, createdAt |
| `Rating` | id, userId, podcastId, stars (1–5) |

- `pg_tsvector` search vectors must be maintained on `Podcast` (title, description, host) and `Transcript` (content).

### Podcast Index API Integration
- An ingestion script must fetch podcast metadata (title, description, host, thumbnail, feed URL) from the Podcast Index API and upsert records into the `podcasts` table.
- Thumbnails must be stored as remote URLs (no local file storage in Phase 1).

### Transcript Ingestion
- For each ingested episode, the system must attempt to fetch a pre-existing transcript (e.g. from the podcast feed or a third-party source).
- If no transcript is available, the episode is stored without one (transcript ingestion is best-effort in Phase 1).
- Transcript text must be stored in the `transcripts` table linked to the episode.

### Search Endpoint
- `GET /api/search?q=<query>` must return a ranked list of podcasts whose title, description, host, or any associated transcript content matches the query.
- Full-text search must be implemented via `pg_tsvector` / `to_tsquery`.
- Response shape: `{ results: Podcast[], total: number }`.

### Search UI
- A search bar must appear prominently on the home page.
- Results must render as a grid of cards, each showing: thumbnail, title, host, and a truncated description.
- Loading and empty states must be handled.

### Podcast Detail Page
- Route: `/podcasts/:id`
- Must display: cover art, full description, host, average star rating, and a chronological episode list.
- Each episode in the list shows its title and publish date.

## Non-Functional Requirements

- **Performance:** Search results must return in under 500 ms for a cold query on a dataset of ≥ 10,000 podcasts.
- **Reliability:** The server must not crash on malformed search queries or missing transcript data.
- **Accessibility:** All interactive elements must be keyboard-navigable and have appropriate ARIA labels.
- **Type safety:** No `any` types in shared interfaces across `/web` and `/server`.
- **Listener-first:** No ads, sponsored results, or creator-facing features are introduced in this phase.
