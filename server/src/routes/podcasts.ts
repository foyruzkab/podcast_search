import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import type { PodcastDetailResponse } from '@podcast-search/shared';

const router = Router();
const prisma = new PrismaClient();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const podcast = await prisma.podcast.findUnique({
      where: { id },
      include: {
        episodes: { orderBy: { publishedAt: 'asc' } },
        ratings: { select: { stars: true } },
      },
    });

    if (!podcast) {
      res.status(404).json({ error: 'Podcast not found' });
      return;
    }

    const { ratings, episodes, indexedAt, ...podcastData } = podcast;

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
        : null;

    const response: PodcastDetailResponse = {
      podcast: { ...podcastData, indexedAt: indexedAt.toISOString() },
      episodes: episodes.map((e) => ({
        ...e,
        publishedAt: e.publishedAt?.toISOString() ?? null,
      })),
      averageRating,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch podcast' });
  }
});

export { router as podcastsRouter };
