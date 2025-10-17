import { InMemoryRepositoryAdapter } from '@infrastructure/adapters/in-memory-repository.adapter';

describe('InMemoryRepositoryAdapter', () => {
  let adapter: InMemoryRepositoryAdapter;

  beforeEach(() => {
    adapter = new InMemoryRepositoryAdapter();
  });

  describe('addFavorite', () => {
    it('should add a favorite and generate id and addedAt', async () => {
      const favorite = {
        imdbID: 'tt1234567',
        Title: 'Test Movie',
        Year: '2020',
        Poster: 'https://example.com/poster.jpg',
      };

      const result = await adapter.addFavorite(favorite);

      expect(result.id).toBeDefined();
      expect(result.imdbID).toBe(favorite.imdbID);
      expect(result.Title).toBe(favorite.Title);
      expect(result.addedAt).toBeInstanceOf(Date);
    });
  });

  describe('getFavorites', () => {
    it('should return empty array when no favorites exist', async () => {
      const result = await adapter.getFavorites();
      expect(result).toEqual([]);
    });

    it('should return all favorites sorted by addedAt descending', async () => {
      const favorite1 = {
        imdbID: 'tt1234567',
        Title: 'Movie 1',
        Year: '2020',
        Poster: 'poster1.jpg',
      };

      const favorite2 = {
        imdbID: 'tt7654321',
        Title: 'Movie 2',
        Year: '2021',
        Poster: 'poster2.jpg',
      };

      await adapter.addFavorite(favorite1);
      await new Promise(resolve => setTimeout(resolve, 10));
      await adapter.addFavorite(favorite2);

      const result = await adapter.getFavorites();

      expect(result).toHaveLength(2);
      expect(result[0].Title).toBe('Movie 2');
      expect(result[1].Title).toBe('Movie 1');
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite and return true when it exists', async () => {
      const favorite = await adapter.addFavorite({
        imdbID: 'tt1234567',
        Title: 'Test Movie',
        Year: '2020',
        Poster: 'poster.jpg',
      });

      const result = await adapter.removeFavorite(favorite.id);

      expect(result).toBe(true);

      const favorites = await adapter.getFavorites();
      expect(favorites).toHaveLength(0);
    });

    it('should return false when favorite does not exist', async () => {
      const result = await adapter.removeFavorite('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('findByImdbId', () => {
    it('should find favorite by imdbID', async () => {
      const favorite = await adapter.addFavorite({
        imdbID: 'tt1234567',
        Title: 'Test Movie',
        Year: '2020',
        Poster: 'poster.jpg',
      });

      const result = await adapter.findByImdbId('tt1234567');

      expect(result).not.toBeNull();
      expect(result?.imdbID).toBe('tt1234567');
    });

    it('should return null when favorite does not exist', async () => {
      const result = await adapter.findByImdbId('tt9999999');
      expect(result).toBeNull();
    });
  });
});
