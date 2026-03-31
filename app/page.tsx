"use client";
import { useState } from "react";
import Image from "next/image";
import Search from "./components/Search";
import MovieGrid from "./components/MovieGrid";
import { MovieSearch } from "./types/movie";
import MovieModal from "./components/MovieModal";
import { useFavorites } from "./context/FavoritesContext";

export default function Home() {
  const [results, setResults] = useState<MovieSearch[]>([]);
  const [currMovie, setCurrMovie] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // key to force remount on Clear
  const [searchKey, setSearchKey] = useState(0);

  // map favorited movies when toggled
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites } = useFavorites();
  const favoriteMovies: MovieSearch[] = favorites.map((f) => ({
    id: f.movieId,
    title: f.title,
    release_date: f.releaseDate ?? "",
    overview: f.overview,
    poster_path: f.posterPath,
  }));

  async function handleSearch(query: string) {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setShowFavorites(false);

    // GET /search and set results
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data.results);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setResults([]);
    setHasSearched(false);
    setError(null);
    // changes key to force remount
    setSearchKey((k) => k + 1);
  }

  function handleMovieClick(id: number) {
    // opens MovieModal
    setCurrMovie(id);
  }

  return (
    <main className="min-h-screen bg-first flex flex-col items-center gap-6">
      <Image
        src="/logo.png"
        alt="Movie Explorer"
        width={200}
        height={200}
        priority
        className="cursor-pointer w-36 sm:w-52 md:w-72 h-auto"
      />
      <div className="flex items-center gap-3 w-full max-w-lg">
        {/* Favorites Button */}
        <button
          onClick={() => {
            setShowFavorites((v) => !v);
            setSearchKey((k) => k + 1);
          }}
          className={`cursor-pointer font-semibold shrink-0 text-md px-3 py-2 rounded-full border-3 transition-colors ${
            showFavorites
              ? "border-second text-second bg-second/10"
              : "border-fourth text-fourth hover:border-second hover:text-second"
          }`}
          title="Favorites"
        >
          Favorites {showFavorites ? "★" : "☆"}
        </button>

        {/* Search & Clear Buttons */}
        <Search key={searchKey} onSearch={handleSearch} />
        {hasSearched && results.length > 0 && (
          <button
            onClick={handleClear}
            className="cursor-pointer font-semibold text-sm text-first bg-fourth shrink-0 rounded-full sm:px-5 py-3"
          >
            Clear
          </button>
        )}
      </div>

      {/* MovieModal Details */}
      <MovieModal movieId={currMovie} onClose={() => setCurrMovie(null)} />

      {/* Favorites Toggle */}
      {showFavorites ? (
        favoriteMovies.length > 0 ? (
          <MovieGrid movies={favoriteMovies} onMovieClick={handleMovieClick} />
        ) : (
          <p className="text-fourth font-semibold mt-4">
            No favorites yet. Search for a movie and favorite it.
          </p>
        )
      ) : (
        <>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && hasSearched && (
            <MovieGrid movies={results} onMovieClick={handleMovieClick} />
          )}
          {!hasSearched && <p>Search for a movie to get started.</p>}
        </>
      )}
    </main>
  );
}
