import type { SearchResponse, PodcastDetailResponse } from '@podcast-search/shared';

const BASE = '/api';

export async function searchPodcasts(q: string): Promise<SearchResponse> {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json() as Promise<SearchResponse>;
}

export async function getPodcast(id: string): Promise<PodcastDetailResponse> {
  const res = await fetch(`${BASE}/podcasts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch podcast');
  return res.json() as Promise<PodcastDetailResponse>;
}
