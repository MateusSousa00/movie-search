export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface Favorite extends Movie {
  id: string;
  addedAt: string;
}

export interface SearchResponse {
  movies: Movie[];
  total: number;
}

export interface FavoritesResponse {
  favorites: Favorite[];
  total: number;
}

export interface AddFavoriteResponse {
  favorite: Favorite;
  message: string;
}
