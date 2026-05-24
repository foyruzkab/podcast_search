export interface Podcast {
  id: string;
  feedUrl: string;
  title: string;
  description: string;
  host: string | null;
  thumbnailUrl: string | null;
  indexedAt: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  externalId: string | null;
  title: string;
  description: string | null;
  publishedAt: string | null;
  audioUrl: string | null;
}

export interface Transcript {
  id: string;
  episodeId: string;
  content: string;
  source: 'fetched' | 'generated';
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  podcastId: string;
  body: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  podcastId: string;
  stars: number;
}

export interface SearchResponse {
  results: Podcast[];
  total: number;
}

export interface PodcastDetailResponse {
  podcast: Podcast;
  episodes: Episode[];
  averageRating: number | null;
}
