import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { MovieSearchPort } from '@domain/ports/movie-search.port';
import { Movie } from '@domain/entities/movie.entity';

interface OmdbSearchResponse {
  Search?: Array<{
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
  }>;
  Response: string;
  Error?: string;
}

@Injectable()
export class OmdbApiAdapter implements MovieSearchPort {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger(OmdbApiAdapter.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OMDB_API_KEY') || '';

    if (!this.apiKey) {
      this.logger.warn('OMDB_API_KEY is not configured');
    }

    this.axiosInstance = axios.create({
      baseURL: 'https://www.omdbapi.com',
      timeout: 5000,
    });
  }

  async searchMovies(query: string, page: number = 1): Promise<Movie[]> {
    try {
      const response = await this.axiosInstance.get<OmdbSearchResponse>('/', {
        params: {
          apikey: this.apiKey,
          s: query,
          type: 'movie',
          page: page,
        },
      });

      if (response.data.Response === 'False') {
        this.logger.warn(`OMDb API error: ${response.data.Error}`);
        return [];
      }

      if (!response.data.Search) {
        return [];
      }

      return response.data.Search.map(
        (item) =>
          new Movie(
            item.imdbID,
            item.Title,
            item.Year,
            item.Poster === 'N/A' ? '' : item.Poster,
          ),
      );
    } catch (error) {
      this.logger.error('Failed to search movies', error);
      throw new Error('Failed to search movies from OMDb API');
    }
  }
}
