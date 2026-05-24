import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPodcast } from '../api/client';

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${rating.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function PodcastDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['podcast', id],
    queryFn: () => getPodcast(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse text-lg">Loading…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">Failed to load podcast.</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          ← Back to search
        </Link>
      </div>
    );
  }

  const { podcast, episodes, averageRating } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link to="/" className="text-indigo-600 hover:underline text-sm">
            ← Back to search
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex gap-6 mb-8">
          {podcast.thumbnailUrl ? (
            <img
              src={podcast.thumbnailUrl}
              alt={podcast.title}
              className="w-32 h-32 rounded-xl object-cover flex-shrink-0 shadow"
            />
          ) : (
            <div
              className="w-32 h-32 rounded-xl bg-indigo-50 flex items-center justify-center text-4xl flex-shrink-0"
              aria-hidden="true"
            >
              🎙
            </div>
          )}
          <div className="flex flex-col gap-2 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{podcast.title}</h1>
            {podcast.host && <p className="text-gray-500 text-sm">by {podcast.host}</p>}
            {averageRating !== null ? (
              <StarRating rating={averageRating} />
            ) : (
              <p className="text-sm text-gray-400">No ratings yet</p>
            )}
            <p className="text-gray-700 text-sm leading-relaxed">{podcast.description}</p>
          </div>
        </div>

        <section aria-labelledby="episodes-heading">
          <h2 id="episodes-heading" className="text-lg font-semibold text-gray-900 mb-4">
            Episodes ({episodes.length})
          </h2>
          {episodes.length === 0 ? (
            <p className="text-gray-400">No episodes available.</p>
          ) : (
            <ul className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-200">
              {episodes.map((episode) => (
                <li key={episode.id} className="px-4 py-3">
                  <p className="font-medium text-gray-900 text-sm">{episode.title}</p>
                  {episode.publishedAt && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(episode.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
