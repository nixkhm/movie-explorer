"use client";

import { useState, useEffect } from "react";
import { MovieDetail } from "../types/movie";
import PosterPlaceholder from "./PosterPlaceholder";
import { useFavorites } from "../context/FavoritesContext";

interface MovieModalProps {
  movieId: number | null;
  onClose: () => void;
}

export default function MovieModal({ movieId, onClose }: MovieModalProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // favorited movie rating and note, saving makes these fields read-only
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  // context for favorites
  const {
    isFavorite,
    getFavorite,
    addFavorite,
    removeFavorite,
    updateFavorite,
  } = useFavorites();

  const favorited = movie ? isFavorite(movie.id) : false;
  const currentFav = movie ? getFavorite(movie.id) : undefined;

  // Updates state based on favorited status
  useEffect(() => {
    if (currentFav) {
      setRating(currentFav.rating);
      setNote(currentFav.note);
      setSaved(true);
    } else {
      setRating(0);
      setNote("");
      setSaved(false);
    }
  }, [currentFav?.rating, currentFav?.note, movie?.id]);

  // favorite toggle
  function handleToggleFavorite() {
    if (!movie) return;
    if (favorited) {
      removeFavorite(movie.id);
    } else {
      addFavorite({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        overview: movie.overview,
      });
    }
  }

  function handleSave() {
    if (!movie) return;
    updateFavorite(movie.id, rating, note);
    setSaved(true);
  }

  useEffect(() => {
    if (!movieId) return;

    // clears stale data
    setMovie(null);

    async function getDetails() {
      setLoading(true);
      setError(null);

      // GET /movie and set movie
      try {
        const response = await fetch(`/api/movie/${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
      } catch (e) {
        setError("Could not load movie details.");
      } finally {
        setLoading(false);
      }
    }

    getDetails();
  }, [movieId]);

  if (!movieId) return null;

  function formatRuntime(minutes: number | null) {
    if (!minutes) return "Runtime not available";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  const poster = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-first rounded-xl p-6 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-fourth hover:text-second cursor-pointer"
        >
          ✕
        </button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {movie && (
          <div className="flex gap-6">
            {/* Poster */}
            <div className="shrink-0">
              {poster ? (
                <img
                  src={poster}
                  alt={movie.title}
                  className="w-[200px] h-[300px] rounded-xl object-cover border-8 border-third"
                />
              ) : (
                <PosterPlaceholder />
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-third font-bold text-3xl">{movie.title}</h2>
              <p className="text-second text-lg font-semibold">
                {movie.release_date?.split("-")[0] || "N/A"}
              </p>
              <p className="text-sm">{formatRuntime(movie.runtime)}</p>
              <p className="mt-2">{movie.overview}</p>

              {/* Favorite Toggle */}
              <button
                onClick={handleToggleFavorite}
                className={`mt-4 cursor-pointer px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-colors ${
                  favorited
                    ? "border-second text-second hover:bg-second hover:text-white"
                    : "border-third text-third hover:bg-third hover:text-white"
                }`}
              >
                {favorited ? "★ Remove Favorite" : "☆ Add to Favorites"}
              </button>

              {favorited && (
                <div className="mt-4 border-2 border-third rounded-xl p-4 flex flex-col gap-3">
                  {/* Rating */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-fourth">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => {
                        setRating(parseInt(e.target.value));
                        setSaved(false);
                      }}
                      disabled={saved}
                      className="bg-first border-2 border-third rounded-lg px-3 py-2 text-fourth font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-default"
                    >
                      <option value={0}>No rating</option>
                      <option value={1}>1 ★</option>
                      <option value={2}>2 ★</option>
                      <option value={3}>3 ★</option>
                      <option value={4}>4 ★</option>
                      <option value={5}>5 ★</option>
                    </select>
                  </div>

                  {/* Note */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-fourth">
                      Note
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => {
                        setNote(e.target.value);
                        setSaved(false);
                      }}
                      readOnly={saved}
                      placeholder="Add a personal note..."
                      rows={4}
                      className="bg-first border-2 border-third rounded-lg px-3 py-2 text-fourth placeholder:text-fourth/40 resize-none read-only:opacity-60 read-only:cursor-default outline-none focus:border-second"
                    />
                  </div>

                  {/* Save Button */}
                  {!saved && (
                    <button
                      onClick={handleSave}
                      className="cursor-pointer self-end px-5 py-2 bg-third text-white font-semibold rounded-lg hover:bg-second transition-colors"
                    >
                      Save
                    </button>
                  )}

                  {/* Edit Button */}
                  {saved && (
                    <button
                      onClick={() => setSaved(false)}
                      className="cursor-pointer self-end px-5 py-2 border-2 border-third text-third font-semibold rounded-lg hover:bg-third hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
