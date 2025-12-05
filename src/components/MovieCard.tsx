import React from 'react';

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    runtime: number;
    'watch/providers'?: {
        results: {
            BR?: {
                flatrate?: {
                    provider_id: number;
                    provider_name: string;
                    logo_path: string;
                }[];
            };
        };
    };
}

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

    const formatRuntime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const providers = movie['watch/providers']?.results?.BR?.flatrate || [];

    return (
        <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-gray-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 animate-in">
            {/* Image Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Gradient Overlay - Always visible and darker at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90" />

            {/* Content - Always visible */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300 backdrop-blur-sm">
                            {year}
                        </span>
                        <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-300 backdrop-blur-sm">
                            ★ {movie.vote_average.toFixed(1)}
                        </span>
                        {movie.runtime > 0 && (
                            <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-300 backdrop-blur-sm">
                                ⏱ {formatRuntime(movie.runtime)}
                            </span>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-white leading-tight">
                        {movie.title}
                    </h3>

                    {/* Streaming Providers */}
                    {providers.length > 0 && (
                        <div className="flex items-center gap-2 my-1">
                            <span className="text-xs text-gray-400">Disponível em:</span>
                            <div className="flex gap-2">
                                {providers.map((provider) => (
                                    <img
                                        key={provider.provider_id}
                                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                        alt={provider.provider_name}
                                        title={provider.provider_name}
                                        className="w-8 h-8 rounded-md shadow-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="line-clamp-4 text-sm text-gray-300">
                        {movie.overview || "Sem sinopse disponível."}
                    </p>
                </div>
            </div>
        </div>
    );
};
