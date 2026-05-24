import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { searchPodcasts, getEpisodesByFeedId, fetchTranscript } from './podcastIndex';

const prisma = new PrismaClient();

const SEARCH_TERMS = ['technology', 'science', 'business', 'true crime', 'comedy', 'history'];

async function ingest() {
  console.log('Starting ingestion...');

  for (const term of SEARCH_TERMS) {
    console.log(`\nFetching podcasts for: "${term}"`);
    const feeds = await searchPodcasts(term, 20);

    for (const feed of feeds) {
      const podcast = await prisma.podcast.upsert({
        where: { feedUrl: feed.url },
        update: {
          title: feed.title,
          description: feed.description,
          host: feed.author || null,
          thumbnailUrl: feed.image || null,
        },
        create: {
          feedUrl: feed.url,
          title: feed.title,
          description: feed.description,
          host: feed.author || null,
          thumbnailUrl: feed.image || null,
        },
      });

      console.log(`  [podcast] ${podcast.title}`);

      const episodes = await getEpisodesByFeedId(feed.id, 10);

      for (const ep of episodes) {
        const episode = await prisma.episode.upsert({
          where: { externalId: `pi-${ep.id}` },
          update: {
            title: ep.title,
            description: ep.description || null,
            publishedAt: ep.datePublished ? new Date(ep.datePublished * 1000) : null,
            audioUrl: ep.enclosureUrl || null,
          },
          create: {
            podcastId: podcast.id,
            externalId: `pi-${ep.id}`,
            title: ep.title,
            description: ep.description || null,
            publishedAt: ep.datePublished ? new Date(ep.datePublished * 1000) : null,
            audioUrl: ep.enclosureUrl || null,
          },
        });

        const transcriptMeta = ep.transcripts?.find(
          (t) => t.type === 'text/plain' || t.type === 'text/html',
        );

        if (transcriptMeta) {
          const content = await fetchTranscript(transcriptMeta.url);
          if (content) {
            await prisma.transcript.upsert({
              where: { episodeId: episode.id },
              update: { content, source: 'fetched' },
              create: { episodeId: episode.id, content, source: 'fetched' },
            });
            console.log(`    [transcript] ${episode.title}`);
          }
        }
      }
    }
  }

  console.log('\nIngestion complete.');
  await prisma.$disconnect();
}

ingest().catch((err) => {
  console.error(err);
  process.exit(1);
});
