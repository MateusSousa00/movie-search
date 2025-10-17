import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SearchMoviesUseCase } from '@application/use-cases/search-movies.use-case';

@Controller('movies')
export class MoviesController {
  constructor(private readonly searchMoviesUseCase: SearchMoviesUseCase) {}

  @Get('search')
  async search(@Query('q') query: string, @Query('page') page?: string) {
    try {
      if (!query) {
        throw new HttpException(
          'Query parameter "q" is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const pageNumber = page ? parseInt(page, 10) : 1;
      const movies = await this.searchMoviesUseCase.execute(query, pageNumber);

      return {
        movies,
        total: movies.length,
        page: pageNumber,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to search movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
