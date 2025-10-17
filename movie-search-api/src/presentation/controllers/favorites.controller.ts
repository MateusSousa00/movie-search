import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AddFavoriteUseCase } from '@application/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '@application/use-cases/remove-favorite.use-case';
import { GetFavoritesUseCase } from '@application/use-cases/get-favorites.use-case';
import type { AddFavoriteDto } from '@application/dto/movie.dto';
import { AddFavoriteSchema } from '@application/dto/movie.dto';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly addFavoriteUseCase: AddFavoriteUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
    private readonly getFavoritesUseCase: GetFavoritesUseCase,
  ) {}

  @Get()
  async getFavorites() {
    try {
      const favorites = await this.getFavoritesUseCase.execute();

      return {
        favorites,
        total: favorites.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async addFavorite(
    @Body(new ZodValidationPipe(AddFavoriteSchema)) dto: AddFavoriteDto,
  ) {
    try {
      const favorite = await this.addFavoriteUseCase.execute(dto);

      return {
        favorite,
        message: 'Movie added to favorites',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to add favorite',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async removeFavorite(@Param('id') id: string) {
    try {
      await this.removeFavoriteUseCase.execute(id);

      return {
        success: true,
        message: 'Favorite removed successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to remove favorite',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
