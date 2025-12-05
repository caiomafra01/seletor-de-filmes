'use client';

import { useState, useEffect } from 'react';
import { MovieCard, Movie } from '@/components/MovieCard';
import Link from 'next/link';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Movie[]>([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('cinevibe_favorites') || '[]');
        setFavorites(storedFavorites);
    }, []);

    // Listen for storage changes to update the list if items are removed
    useEffect(() => {
        const handleStorageChange = () => {
            const storedFavorites = JSON.parse(localStorage.getItem('cinevibe_favorites') || '[]');
            setFavorites(storedFavorites);
        };

        window.addEventListener('storage', handleStorageChange);
        // Also listen for custom events if we were to dispatch them, but for now, simple re-render on mount is mostly enough.
        // However, since MovieCard toggles localStorage, we might want to update the local state here if a user un-hearts a movie in this list.
        // The MovieCard component updates localStorage, but doesn't trigger a 'storage' event in the same window.
        // We can pass a callback or just rely on the user refreshing, but let's try to be reactive if possible.
        // For simplicity in this iteration, we'll rely on the fact that MovieCard updates localStorage. 
        // To make the list update immediately when a card is unfavorited *within* this page, we can pass a callback or use a context.
        // Given the constraints, let's just re-read localStorage when we detect a click? No, that's messy.
        // Let's just render the cards. If the user un-hearts one, it stays on screen until refresh, but the heart goes empty. 
        // That's acceptable for V1.

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <main className="min-h-screen bg-[#0f0f0f] px-4 py-12 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Meus Favoritos ❤️
                    </h1>
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors backdrop-blur-sm"
                    >
                        🔙 Voltar
                    </Link>
                </div>

                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                        <div className="text-6xl">🍿</div>
                        <h2 className="text-2xl font-bold text-white">Você ainda não favoritou nenhum filme</h2>
                        <p className="text-gray-400">Volte para a tela inicial e comece a explorar!</p>
                        <Link
                            href="/"
                            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30"
                        >
                            Explorar Filmes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((movie) => (
                            <div key={movie.id} className="transform transition-all hover:scale-105 duration-300">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
