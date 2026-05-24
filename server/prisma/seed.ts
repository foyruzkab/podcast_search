import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_PODCASTS = [
  {
    feedUrl: 'https://feeds.simplecast.com/54nAGcIl',
    title: 'The Daily',
    description:
      'This is what the news should sound like. The biggest stories of our time, told by the best journalists in the world.',
    host: 'Michael Barbaro',
    thumbnailUrl:
      'https://megaphone.imgix.net/podcasts/d9b44a82-1811-11e9-81fb-7fbbb99ba0bf/image/TheDailyLogo.png',
  },
  {
    feedUrl: 'https://feeds.megaphone.fm/hubermanlab',
    title: 'Huberman Lab',
    description: 'Neuroscience and science-based tools for everyday life.',
    host: 'Andrew Huberman',
    thumbnailUrl: 'https://megaphone.imgix.net/podcasts/hubermanlab/image/hubermanlab.jpg',
  },
  {
    feedUrl: 'https://lexfridman.com/feed/podcast/',
    title: 'Lex Fridman Podcast',
    description:
      'Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power.',
    host: 'Lex Fridman',
    thumbnailUrl:
      'https://lexfridman.com/wordpress/wp-content/uploads/powerpress/artwork_3000-230.png',
  },
  {
    feedUrl: 'https://feeds.simplecast.com/Y8lFbOT4',
    title: 'Darknet Diaries',
    description: 'True stories from the dark side of the internet.',
    host: 'Jack Rhysider',
    thumbnailUrl: 'https://media.redcircle.com/images/2020/4/17/14/darknetdiaries.jpg',
  },
  {
    feedUrl: 'https://feeds.simplecast.com/82FI35Px',
    title: 'How I Built This with Guy Raz',
    description: "Guy Raz dives into the stories behind some of the world's best known companies.",
    host: 'Guy Raz',
    thumbnailUrl: 'https://megaphone.imgix.net/podcasts/hibt/image/hibt.jpg',
  },
];

async function seed() {
  console.log('Seeding database...');

  for (const data of SEED_PODCASTS) {
    const podcast = await prisma.podcast.upsert({
      where: { feedUrl: data.feedUrl },
      update: data,
      create: data,
    });

    await prisma.episode.upsert({
      where: { externalId: `seed-${podcast.id}-1` },
      update: {},
      create: {
        podcastId: podcast.id,
        externalId: `seed-${podcast.id}-1`,
        title: `${podcast.title} — Episode 1`,
        description: 'A sample episode.',
        publishedAt: new Date('2024-01-15'),
        audioUrl: null,
      },
    });

    await prisma.episode.upsert({
      where: { externalId: `seed-${podcast.id}-2` },
      update: {},
      create: {
        podcastId: podcast.id,
        externalId: `seed-${podcast.id}-2`,
        title: `${podcast.title} — Episode 2`,
        description: 'Another sample episode.',
        publishedAt: new Date('2024-02-20'),
        audioUrl: null,
      },
    });

    console.log(`Seeded: ${podcast.title}`);
  }

  console.log('Seed complete.');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
