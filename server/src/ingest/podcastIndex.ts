import crypto from 'crypto';

const BASE_URL = 'https://api.podcastindex.org/api/1.0';

function getHeaders() {
  const apiKey = process.env.PODCAST_INDEX_KEY ?? '';
  const apiSecret = process.env.PODCAST_INDEX_SECRET ?? '';
  const epochTime = Math.floor(Date.now() / 1000).toString();
  const hash = crypto.createHash('sha1').update(apiKey + apiSecret + epochTime).digest('hex');

  return {
    'X-Auth-Key': apiKey,
    'X-Auth-Date': epochTime,
    Authorization: hash,
    'User-Agent': 'podcast-search/1.0',
  };
}

export interface PodcastIndexFeed {
  id: number;
  title: string;
  description: string;
  author: string;
  image: string;
  url: string;
}

export interface PodcastIndexEpisode {
  id: number;
  title: string;
  description: string;
  datePublished: number;
  enclosureUrl: string;
  transcripts?: { url: string; type: string }[];
}

export async function searchPodcasts(term: string, max = 20): Promise<PodcastIndexFeed[]> {
  const url = `${BASE_URL}/search/byterm?q=${encodeURIComponent(term)}&max=${max}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Podcast Index search failed: ${res.status}`);
  const data = (await res.json()) as { feeds: PodcastIndexFeed[] };
  return data.feeds ?? [];
}

export async function getEpisodesByFeedId(
  feedId: number,
  max = 10,
): Promise<PodcastIndexEpisode[]> {
  const url = `${BASE_URL}/episodes/byfeedid?id=${feedId}&max=${max}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Podcast Index episodes failed: ${res.status}`);
  const data = (await res.json()) as { items: PodcastIndexEpisode[] };
  return data.items ?? [];
}

export async function fetchTranscript(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const text = await res.text();
    // Strip SRT sequence numbers and timestamps
    return text.replace(/^\d+\r?\n[\d:,]+ --> [\d:,]+\r?\n/gm, '').trim();
  } catch {
    return null;
  }
}
