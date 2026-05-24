import { Link } from 'react-router-dom';
import type { Podcast } from '@podcast-search/shared';

interface Props {
  podcast: Podcast;
}

export default function PodcastCard({ podcast }: Props) {
  return (
    <Link
      to={`/podcasts/${podcast.id}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {podcast.thumbnailUrl ? (
          <img
            src={podcast.thumbnailUrl}
            alt={podcast.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300 text-4xl">
            🎙
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug">
          {podcast.title}
        </h3>
        {podcast.host && <p className="text-xs text-gray-500">{podcast.host}</p>}
        <p className="text-xs text-gray-600 line-clamp-3 mt-1">{podcast.description}</p>
      </div>
    </Link>
  );
}
