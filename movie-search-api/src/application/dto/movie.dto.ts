import { z } from 'zod';

export const MovieSchema = z.object({
  imdbID: z.string().min(1, 'imdbID is required'),
  Title: z.string().min(1, 'Title is required'),
  Year: z.string().min(1, 'Year is required'),
  Poster: z.string(), // Allow empty string for movies without posters
});

export const AddFavoriteSchema = z.object({
  imdbID: z.string().min(1, 'imdbID is required'),
  Title: z.string().min(1, 'Title is required'),
  Year: z.string().min(1, 'Year is required'),
  Poster: z.string(), // Allow empty string for movies without posters
});

export type MovieDto = z.infer<typeof MovieSchema>;
export type AddFavoriteDto = z.infer<typeof AddFavoriteSchema>;
