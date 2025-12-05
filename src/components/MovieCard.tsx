import React from 'react';

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
}

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

    return (
        <div className="group relative h-[400px] w-full overflow-hidden rounded-2xl bg-gray-900 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            {/* Image Background */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300 backdrop-blur-sm">
                            {year}
                        </span>
                        <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-300 backdrop-blur-sm">
                            ★ {movie.vote_average.toFixed(1)}
                        </span>
                    </div>

                    <h3 className="mb-2 text-2xl font-bold text-white leading-tight">
                        {movie.title}
                    </h3>

                    <p className="line-clamp-3 text-sm text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {movie.overview || "Sem sinopse disponível."}
                    </p>
                </div>
            </div>
        </div>
    );
};
