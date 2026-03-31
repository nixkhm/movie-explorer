import { MovieSearch } from "../types/movie";
import MovieTile from "./MovieTile";

interface MovieGridProps {
  movies: MovieSearch[];
  onMovieClick: (id: number) => void;
}

export default function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  if (movies.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 max-w-7xl mx-auto px-6">
      {movies.map((movie) => (
        <MovieTile key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
}
