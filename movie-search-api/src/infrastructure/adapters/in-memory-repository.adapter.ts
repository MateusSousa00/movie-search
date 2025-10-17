import { Injectable, Logger } from '@nestjs/common';
import { MovieRepositoryPort } from '@domain/ports/movie-repository.port';
import { Favorite } from '@domain/entities/movie.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryRepositoryAdapter implements MovieRepositoryPort {
  private readonly favorites = new Map<string, Favorite>();
  private readonly logger = new Logger(InMemoryRepositoryAdapter.name);

  async addFavorite(
    favorite: Omit<Favorite, 'id' | 'addedAt'>,
  ): Promise<Favorite> {
    const newFavorite = new Favorite(
      randomUUID(),
      favorite.imdbID,
      favorite.Title,
      favorite.Year,
      favorite.Poster,
      new Date(),
    );

    this.favorites.set(newFavorite.id, newFavorite);
    this.logger.log(`Added favorite: ${newFavorite.Title} (${newFavorite.id})`);

    return newFavorite;
  }

  async removeFavorite(id: string): Promise<boolean> {
    const deleted = this.favorites.delete(id);

    if (deleted) {
      this.logger.log(`Removed favorite: ${id}`);
    }

    return deleted;
  }

  async getFavorites(): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).sort(
      (a, b) => b.addedAt.getTime() - a.addedAt.getTime(),
    );
  }

  async findByImdbId(imdbID: string): Promise<Favorite | null> {
    for (const favorite of this.favorites.values()) {
      if (favorite.imdbID === imdbID) {
        return favorite;
      }
    }
    return null;
  }
}
