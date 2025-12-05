import React from 'react';

interface VibeSelectorProps {
    selectedVibe: number | null;
    onSelectVibe: (genreId: number) => void;
}

const genres = [
    { id: 28, name: "💥 Ação" },
    { id: 12, name: "🤠 Aventura" },
    { id: 16, name: "🎨 Animação" },
    { id: 35, name: "🤣 Comédia" },
    { id: 80, name: "🕵️‍♂️ Crime" },
    { id: 99, name: "📖 Documentário" },
    { id: 18, name: "🎭 Drama" },
    { id: 10751, name: "👨‍👩‍👧‍👦 Família" },
    { id: 14, name: "🧙‍♂️ Fantasia" },
    { id: 36, name: "📜 História" },
    { id: 27, name: "👻 Terror" },
    { id: 10402, name: "🎵 Música" },
    { id: 9648, name: "🔎 Mistério" },
    { id: 10749, name: "💘 Romance" },
    { id: 878, name: "👽 Sci-Fi" },
    { id: 53, name: "👀 Suspense" },
    { id: 10752, name: "⚔️ Guerra" },
    { id: 37, name: "🌵 Faroeste" }
];

export const VibeSelector: React.FC<VibeSelectorProps> = ({ selectedVibe, onSelectVibe }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
                {genres.map((genre) => (
                    <button
                        key={genre.id}
                        onClick={() => onSelectVibe(genre.id)}
                        className={`rounded-full px-6 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-110
              ${selectedVibe === genre.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105 ring-2 ring-purple-400'
                                : 'bg-white/10 text-gray-200 hover:bg-white/20 hover:text-white backdrop-blur-md border border-white/10'
                            }`}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
