# Backend: Movie Search API (NestJS - Hexagonal Architecture)

This service is a robust API for searching movies and managing favorites, built with **NestJS 10** and following the **Hexagonal Architecture (Ports & Adapters)** pattern.

## Architecture Highlights: Hexagonal Architecture

The design ensures the **Domain Layer** (business logic) is isolated from external details (databases, APIs, HTTP frameworks).

### Architecture Layers

1.  **Domain Layer**: `Movie` and `Favorite` entities, and `MovieSearchPort` / `MovieRepositoryPort` interfaces.
2.  **Application Layer**: `SearchMoviesUseCase`, `AddFavoriteUseCase`, etc., for business logic orchestration.
3.  **Infrastructure Layer**: **Adapters** implementing the ports, e.g., `OmdbApiAdapter` and `InMemoryRepositoryAdapter`.
4.  **Presentation Layer**: `MoviesController` and `FavoritesController` handling REST endpoints.

### Key Features
- **Clean Architecture**: Clear separation of concerns for easy testing and maintenance.
- **In-Memory Storage**: Current implementation uses an in-memory Map. Easily replaceable with a database (e.g., PostgreSQL) by swapping the Repository Adapter.
- **Testing**: Comprehensive Jest unit tests (4 suites, 12+ scenarios) for use cases and repository logic.
- **Observability**: Sentry integration configured for error tracking.

---

## API Endpoints

The API is accessible at `http://localhost:3001`.

### Movies
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/movies/search?q={query}` | Search for movies by title. |

### Favorites
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/favorites` | Get all favorite movies. |
| `POST` | `/favorites` | Add a movie to favorites (requires `imdbID`, `Title`, `Year`, `Poster`). |
| `DELETE` | `/favorites/:id` | Remove a favorite by its internal ID. |

---

## Setup & Testing

### Local Development (without Docker)
```bash
cd movie-search-api
npm install
# Ensure .env has OMDb API Key
npm run start:dev
```

### Running Tests
Unit tests cover critical business logic in the Application and Infrastructure layers.

```bash
cd movie-search-api
npm test
```


