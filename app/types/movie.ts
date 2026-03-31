export interface MovieSearch {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
}

export interface MovieDetail extends MovieSearch {
  runtime: number | null;
}

export interface FavoriteMovie {
  movieId: number;
  title: string;
  release_date: string;
  rating: number;
  poster_path: string | null;
  note: string | null;
}
