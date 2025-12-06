'use client';

import { useState } from 'react';
import { MovieCard, Movie } from '@/components/MovieCard';

const API_KEY = '70e97a15d2253fb7336781191814b5f6';

// --- Data Structures ---

const standardGenres = [
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

const specialCollections = [
  { name: "🧟 Zumbis", type: "keyword", value: "12377" },
  { name: "🦸 Super-heróis", type: "keyword", value: "9715" },
  { name: "🔰 Animes", type: "custom", value: "&with_genres=16&with_original_language=ja" },
  { name: "📼 Anos 80", type: "custom", value: "&primary_release_date.gte=1980-01-01&primary_release_date.lte=1989-12-31" },
  { name: "🧠 Fatos Reais", type: "keyword", value: "9672" },
  { name: "🧚 Studio Ghibli", type: "custom", value: "&with_companies=10342" },
  { name: "🩸 Vampiros", type: "keyword", value: "3133" },
  { name: "⏳ Viagem no Tempo", type: "keyword", value: "4385" },
  { name: "🌪️ Desastre", type: "keyword", value: "4414" },
  { name: "🏆 Aclamados", type: "custom", value: "&vote_average.gte=8&vote_count.gte=300" }
];

// Helper type for our categories
type Category =
  | { type: 'standard'; id: number; name: string }
  | { type: 'keyword'; value: string; name: string }
  | { type: 'custom'; value: string; name: string };

export default function Home() {
  // We'll store the selected category name or ID to show what's active, 
  // but for the fetch logic we pass the whole object.
  const [activeCategory, setActiveCategory] = useState<string | number | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  // We need to store the last selected category object to allow "Retry" functionality
  const [lastSelectedCategory, setLastSelectedCategory] = useState<Category | null>(null);

  const asianLanguages = "ja,zh,ko,th,cn";

  const fetchRandomMovie = async (category: Category, retryWithPage1 = false) => {
    setLoading(true);
    setActiveCategory(category.type === 'standard' ? category.id : category.name);
    setLastSelectedCategory(category);

    try {
      console.log("Buscando categoria:", category.name);

      // 1. Random Page Logic
      const randomPage = retryWithPage1 ? 1 : Math.floor(Math.random() * 20) + 1;

      // 2. Construct URL
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&include_adult=false&page=${randomPage}`;

      // Apply filter based on type
      if (category.type === 'keyword') {
        url += `&with_keywords=${category.value}`;
      } else if (category.type === 'custom') {
        url += category.value;
      } else {
        // Standard Genre
        url += `&with_genres=${category.id}`;
      }

      // 3. Language & Quality Filters
      // Block Asian languages for non-anime categories to avoid untranslated titles
      if (category.name !== "🔰 Animes" && category.name !== "🧚 Studio Ghibli") {
        url += `&without_original_language=${asianLanguages}`;
      }

      // Always apply quality filter
      url += `&vote_count.gte=300`;

      console.log("URL Gerada:", url);

      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // 3. Random Movie from the list
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const basicMovie = data.results[randomIndex];

        // 4. Fetch Detailed Info (Runtime & Providers)
        const detailsUrl = `https://api.themoviedb.org/3/movie/${basicMovie.id}?api_key=${API_KEY}&language=pt-BR&append_to_response=watch/providers`;
        const detailsResponse = await fetch(detailsUrl);
        const detailedMovie = await detailsResponse.json();

        setMovie(detailedMovie);
      } else {
        // SAFETY CHECK
        if (!retryWithPage1) {
          console.warn(`Nenhum resultado na página ${randomPage}. Tentando página 1...`);
          await fetchRandomMovie(category, true);
          return;
        }
        console.error("Nenhum filme encontrado mesmo na página 1.");
        setMovie(null);
      }
    } catch (error) {
      console.error('Erro ao buscar filme:', error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveCategory(null);
    setMovie(null);
    setLastSelectedCategory(null);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 md:px-8 overflow-hidden">

      {/* Dynamic Background */}
      {movie?.backdrop_path ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Initial State: Title & Selectors */}
        {!movie && !loading && (
          <div className="w-full max-w-5xl text-center space-y-8 animate-fade-in relative">

            {/* Mobile Favorites Link */}
            <div className="md:hidden flex justify-center mb-4">
              <a href="/favoritos" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20">
                ❤️ Meus Favoritos
              </a>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient-x pb-4">
              Qual gênero você quer assistir hoje?
            </h1>

            {/* BLOCK 1: Standard Genres */}
            <div className="w-full">
              <p className="text-gray-400 uppercase text-xs tracking-widest mb-4">Gêneros</p>
              <div className="flex flex-wrap justify-center gap-3">
                {standardGenres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => fetchRandomMovie({ type: 'standard', ...genre })}
                    className="rounded-full px-5 py-2 text-base font-medium transition-all duration-300 transform hover:scale-105 bg-white/10 text-gray-200 hover:bg-purple-600 hover:text-white backdrop-blur-md border border-white/10 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            {/* BLOCK 2: Special Collections */}
            <div className="w-full mt-8">
              <p className="text-yellow-500/80 uppercase text-xs tracking-widest mb-4">Coleções Especiais ✨</p>
              <div className="flex flex-wrap justify-center gap-3">
                {specialCollections.map((collection) => (
                  <button
                    key={collection.name}
                    onClick={() => fetchRandomMovie(collection as Category)}
                    className="rounded-full px-5 py-2 text-base font-medium transition-all duration-300 transform hover:scale-105 border border-yellow-500/30 bg-yellow-500/10 text-gray-200 hover:bg-yellow-500 hover:text-black hover:shadow-lg hover:shadow-yellow-500/50"
                  >
                    {collection.name}
                  </button>
                ))}
              </div>
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
                onClick={() => lastSelectedCategory && fetchRandomMovie(lastSelectedCategory)}
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
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 flex flex-col md:flex-row items-center justify-center gap-4 text-center pb-8">
        <p className="text-sm text-gray-500">
          Feito com 💜 para os amantes de cinema
        </p>
        {!movie && (
          <a href="/favoritos" className="hidden md:inline-flex items-center gap-2 px-6 py-2 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all hover:scale-105 active:scale-95 font-medium backdrop-blur-sm">
            ❤️ Meus Favoritos
          </a>
        )}
      </footer>

    </main>
  );
}
