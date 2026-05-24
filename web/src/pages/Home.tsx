import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar';
import PodcastCard from '../components/PodcastCard';
import SkeletonCard from '../components/SkeletonCard';
import { searchPodcasts } from '../api/client';

export default function Home() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchPodcasts(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-indigo-600 mb-3">Podcast Search</h1>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!debouncedQuery && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4" aria-hidden="true">🎧</div>
            <p className="text-lg">Search for any podcast by title, topic, or host.</p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500 py-10">Search failed. Please try again.</p>
        )}

        {data && data.results.length === 0 && (
          <p className="text-center text-gray-400 py-20">
            No podcasts found for &ldquo;{debouncedQuery}&rdquo;.
          </p>
        )}

        {data && data.results.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">{data.total} results</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.results.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
