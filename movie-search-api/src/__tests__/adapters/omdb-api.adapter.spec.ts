import { OmdbApiAdapter } from '@infrastructure/adapters/omdb-api.adapter';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OmdbApiAdapter', () => {
  let adapter: OmdbApiAdapter;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockReturnValue('test-api-key'),
    } as any;

    adapter = new OmdbApiAdapter(mockConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return movies when API call is successful', async () => {
    const mockResponse = {
      data: {
        Search: [
          {
            imdbID: 'tt0372784',
            Title: 'Batman Begins',
            Year: '2005',
            Poster: 'https://example.com/poster.jpg',
          },
        ],
        Response: 'True',
      },
    };

    mockedAxios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    adapter = new OmdbApiAdapter(mockConfigService);
    const result = await adapter.searchMovies('batman');

    expect(result).toHaveLength(1);
    expect(result[0].Title).toBe('Batman Begins');
  });

  it('should return empty array when API returns no results', async () => {
    const mockResponse = {
      data: {
        Response: 'False',
        Error: 'Movie not found!',
      },
    };

    mockedAxios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    adapter = new OmdbApiAdapter(mockConfigService);
    const result = await adapter.searchMovies('nonexistent');

    expect(result).toEqual([]);
  });

  it('should handle N/A poster value', async () => {
    const mockResponse = {
      data: {
        Search: [
          {
            imdbID: 'tt1234567',
            Title: 'Test Movie',
            Year: '2020',
            Poster: 'N/A',
          },
        ],
        Response: 'True',
      },
    };

    mockedAxios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    adapter = new OmdbApiAdapter(mockConfigService);
    const result = await adapter.searchMovies('test');

    expect(result[0].Poster).toBe('');
  });

  it('should throw error when API call fails', async () => {
    mockedAxios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network error')),
    } as any);

    adapter = new OmdbApiAdapter(mockConfigService);

    await expect(adapter.searchMovies('test')).rejects.toThrow(
      'Failed to search movies from OMDb API',
    );
  });
});
