"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

interface Favorite {
  id: number;
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  overview: string;
  rating: number;
  note: string;
  addedAt: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (movie: {
    movieId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string;
    overview: string;
  }) => Promise<void>;
  removeFavorite: (movieId: number) => Promise<void>;
  updateFavorite: (
    movieId: number,
    rating: number,
    note: string,
  ) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
  getFavorite: (movieId: number) => Favorite | undefined;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // GET /favorite and set favorites
  useEffect(() => {
    fetch("/api/favorite")
      .then((res) => res.json())
      .then(setFavorites)
      .catch(console.error);
  }, []);

  // POST /favorite to add a favorited movie
  const addFavorite = useCallback(
    async (movie: {
      movieId: number;
      title: string;
      posterPath: string | null;
      releaseDate: string;
      overview: string;
    }) => {
      const res = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
      if (!res.ok) throw new Error("Failed to add favorite");
      const newFav = await res.json();
      setFavorites((prev) => [newFav, ...prev]);
    },
    [],
  );

  // DELETE /favorite/{movieId} to remove a favorited movie
  const removeFavorite = useCallback(async (movieId: number) => {
    const res = await fetch(`/api/favorite/${movieId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to remove favorite");
    setFavorites((prev) => prev.filter((f) => f.movieId !== movieId));
  }, []);

  // PATCH /favorite/{movieId} to update the rating/note of a favorited movie
  const updateFavorite = useCallback(
    async (movieId: number, rating: number, note: string) => {
      const res = await fetch(`/api/favorite/${movieId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, note }),
      });
      if (!res.ok) throw new Error("Failed to update favorite");
      const updated = await res.json();
      setFavorites((prev) =>
        prev.map((f) => (f.movieId === movieId ? updated : f)),
      );
    },
    [],
  );

  const isFavorite = useCallback(
    (movieId: number) => favorites.some((f) => f.movieId === movieId),
    [favorites],
  );

  const getFavorite = useCallback(
    (movieId: number) => favorites.find((f) => f.movieId === movieId),
    [favorites],
  );

  // prevents rerenders for non changes
  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      updateFavorite,
      isFavorite,
      getFavorite,
    }),
    [
      favorites,
      addFavorite,
      removeFavorite,
      updateFavorite,
      isFavorite,
      getFavorite,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}
