'use client';

import { useState } from 'react';
import { MovieCard, Movie } from '@/components/MovieCard';
import { VibeSelector } from '@/components/VibeSelector';

const API_KEY = '70e97a15d2253fb7336781191814b5f6';

export default function Home() {
  const [vibe, setVibe] = useState<number | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomMovie = async (genreId: number, retryWithPage1 = false) => {
    setLoading(true);
    setVibe(genreId);

    try {
      console.log("Buscando gênero ID:", genreId);

      // 1. Random Page Logic
      // If retrying, force page 1. Otherwise, random 1-20.
      const randomPage = retryWithPage1 ? 1 : Math.floor(Math.random() * 20) + 1;

      // 2. Construct URL
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&include_adult=false&with_genres=${genreId}&page=${randomPage}`;

      console.log("URL Gerada:", url);

      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // 3. Random Movie from the list
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setMovie(data.results[randomIndex]);
      } else {
        // SAFETY CHECK: If no results and we haven't retried yet, try page 1.
        if (!retryWithPage1) {
          console.warn(`Nenhum resultado na página ${randomPage}. Tentando página 1...`);
          await fetchRandomMovie(genreId, true); // Recursive call with force page 1
          return; // Exit this execution context
        }
        console.error("Nenhum filme encontrado mesmo na página 1.");
        setMovie(null);
      }
    } catch (error) {
      console.error('Erro ao buscar filme:', error);
      setMovie(null);
    } finally {
      // Only stop loading if we are not retrying (or if retry finished)
      // The recursive call handles its own loading state, but we need to ensure we don't turn it off prematurely if we are about to recurse.
      // Actually, since await fetchRandomMovie waits for the recursion, we can set loading false here safely.
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVibe(null);
    setMovie(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:px-8 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">

      {/* Initial State: Title & Selector */}
      {!movie && !loading && (
        <div className="w-full max-w-4xl text-center space-y-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x pb-2">
            Qual gênero você quer assistir hoje?
          </h1>

          <div className="flex justify-center">
            <VibeSelector selectedVibe={vibe} onSelectVibe={(id) => fetchRandomMovie(id)} />
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="text-xl text-white font-medium animate-pulse">Sintonizando sua vibe...</p>
        </div>
      )}

      {/* Result State: Single Movie Card */}
      {movie && !loading && (
        <div className="w-full max-w-md space-y-8 animate-scale-in">
          <div className="transform transition-all hover:scale-105 duration-500">
            <MovieCard movie={movie} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => vibe && fetchRandomMovie(vibe)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              🔄 Quero outra sugestão
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl backdrop-blur-sm transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              🔙 Escolher outro Gênero
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
