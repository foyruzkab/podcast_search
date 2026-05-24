import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import type { SearchResponse } from '@podcast-search/shared';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const q = ((req.query.q as string) ?? '').trim();

  if (!q) {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }

  try {
    type Row = {
      id: string;
      feedUrl: string;
      title: string;
      description: string;
      host: string | null;
      thumbnailUrl: string | null;
      indexedAt: Date;
      rank: number;
    };

    const rows = await prisma.$queryRaw<Row[]>`
      WITH matches AS (
        SELECT p.id,
          ts_rank(
            to_tsvector('english', p.title || ' ' || p.description || ' ' || COALESCE(p.host, '')),
            plainto_tsquery('english', ${q})
          ) AS rank
        FROM podcasts p
        WHERE to_tsvector('english', p.title || ' ' || p.description || ' ' || COALESCE(p.host, ''))
              @@ plainto_tsquery('english', ${q})
        UNION
        SELECT p.id,
          ts_rank(to_tsvector('english', t.content), plainto_tsquery('english', ${q})) AS rank
        FROM podcasts p
        JOIN episodes e ON e."podcastId" = p.id
        JOIN transcripts t ON t."episodeId" = e.id
        WHERE to_tsvector('english', t.content) @@ plainto_tsquery('english', ${q})
      ),
      best AS (
        SELECT id, MAX(rank) AS rank FROM matches GROUP BY id
      )
      SELECT p.id, p."feedUrl", p.title, p.description, p.host, p."thumbnailUrl", p."indexedAt", best.rank
      FROM podcasts p
      JOIN best ON best.id = p.id
      ORDER BY best.rank DESC
      LIMIT 20
    `;

    const response: SearchResponse = {
      results: rows.map(({ rank: _rank, indexedAt, ...rest }) => ({
        ...rest,
        indexedAt: indexedAt.toISOString(),
      })),
      total: rows.length,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export { router as searchRouter };
