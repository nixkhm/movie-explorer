import { MovieSearch } from "../types/movie";
import PosterPlaceholder from "./PosterPlaceholder";

interface MovieTileProps {
  movie: MovieSearch;
  onClick: (id: number) => void;
}

export default function MovieTile({ movie, onClick }: MovieTileProps) {
  const year = movie.release_date?.split("-")[0] || "N/A";
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : null;

  return (
    <div
      onClick={() => onClick(movie.id)}
      className="bg-third rounded-xl cursor-pointer flex flex-col w-full"
    >
      <div className="flex justify-center p-3 mt-2">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className="w-[220px] h-[330px] rounded-xl object-cover"
          />
        ) : (
          <PosterPlaceholder />
        )}
      </div>
      <div className="flex flex-col flex-1 px-4 pb-4">
        <h3 className="text-first font-extrabold text-xl text-center py-2">
          {movie.title}
        </h3>
        <p className="text-right text-second font-bold text-sm mb-2">{year}</p>
        <p className="text-first text-center text-sm leading-snug line-clamp-4">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
