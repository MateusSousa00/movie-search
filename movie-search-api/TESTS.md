# Test Documentation

This document provides a comprehensive overview of the test suite for the Movie Search API.

## Test Structure

The project follows a clean architecture pattern with tests organized by layer:

```
src/__tests__/
├── adapters/          # Infrastructure adapter tests
├── controllers/       # Presentation layer tests
├── pipes/            # Common utilities tests
└── use-cases/        # Application layer tests

test/
└── app.e2e-spec.ts   # End-to-end integration tests
```

## Test Files Overview

### Use Case Tests

#### `add-favorite.use-case.spec.ts`
**Purpose**: Tests the business logic for adding movies to favorites

**Test Cases**:
- ✓ Should add a favorite when movie is not already favorited
- ✓ Should throw ConflictException when movie is already favorited

**Coverage**: Validates duplicate prevention and successful favorite creation

---

#### `get-favorites.use-case.spec.ts`
**Purpose**: Tests retrieval of user's favorite movies list

**Test Cases**:
- ✓ Should return all favorites from repository
- ✓ Should return empty array when no favorites exist

**Coverage**: Validates favorites list retrieval

---

#### `remove-favorite.use-case.spec.ts`
**Purpose**: Tests removing movies from favorites

**Test Cases**:
- ✓ Should remove a favorite when it exists
- ✓ Should throw NotFoundException when favorite does not exist

**Coverage**: Validates favorite removal and error handling for non-existent items

---

#### `search-movies.use-case.spec.ts`
**Purpose**: Tests movie search orchestration

**Test Cases**:
- ✓ Should return movies from search port
- ✓ Should return empty array when no movies found

**Coverage**: Validates search delegation to external API adapter

---

### Adapter Tests

#### `in-memory-repository.adapter.spec.ts`
**Purpose**: Tests the in-memory storage implementation

**Test Cases**:
- ✓ Should add a favorite
- ✓ Should remove a favorite
- ✓ Should get all favorites
- ✓ Should find by IMDB ID

**Coverage**: Validates CRUD operations on in-memory store

---

#### `omdb-api.adapter.spec.ts`
**Purpose**: Tests integration with OMDb API

**Test Cases**:
- ✓ Should return movies when API call is successful
- ✓ Should return empty array when API returns no results
- ✓ Should handle N/A poster value correctly
- ✓ Should throw error when API call fails

**Coverage**: Validates external API integration, error handling, and data transformation

---

### Controller Tests

#### `movies.controller.spec.ts`
**Purpose**: Tests movie search HTTP endpoint

**Test Cases**:
- ✓ Should return movies when search is successful
- ✓ Should throw BadRequest when query is empty
- ✓ Should throw InternalServerError when use case fails

**Coverage**: Validates HTTP request handling, query validation, and error responses

---

#### `favorites.controller.spec.ts`
**Purpose**: Tests favorites management HTTP endpoints

**Test Cases**:
- ✓ GET /favorites: Should return favorites list
- ✓ GET /favorites: Should throw error when use case fails
- ✓ POST /favorites: Should add a favorite successfully
- ✓ POST /favorites: Should propagate ConflictException
- ✓ DELETE /favorites/:id: Should remove a favorite successfully
- ✓ DELETE /favorites/:id: Should throw error when use case fails

**Coverage**: Validates complete CRUD operations via HTTP

---

### Pipe Tests

#### `zod-validation.pipe.spec.ts`
**Purpose**: Tests input validation using Zod schemas

**Test Cases**:
- ✓ Should pass validation with valid data
- ✓ Should throw BadRequestException with invalid data
- ✓ Should provide detailed error messages
- ✓ Should handle missing required fields

**Coverage**: Validates request body validation and error formatting

---

### E2E Tests

#### `app.e2e-spec.ts`
**Purpose**: Integration tests for the complete application

**Test Cases**:
- ✓ GET /favorites: Should return empty favorites list initially
- ✓ POST /favorites: Should add a favorite movie
- ✓ POST /favorites: Should return 400 for invalid data

**Coverage**: Validates end-to-end request/response flow with real NestJS application instance

---

## Running Tests

### Run All Unit Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

---

## Coverage Goals

**Current Coverage**: ~80%+

**Coverage by Layer**:
- ✅ Use Cases: 100%
- ✅ Adapters: 100%
- ✅ Controllers: 100%
- ✅ Pipes: 100%
- ⚠️  Config: 0% (optional, not critical)
- ⚠️  Modules: 0% (declarative, hard to test)

---

## Adding New Tests

### 1. Unit Test Template
```typescript
import { YourClass } from '@path/to/class';

describe('YourClass', () => {
  let instance: YourClass;
  let mockDependency: jest.Mocked<DependencyType>;

  beforeEach(() => {
    mockDependency = {
      method: jest.fn(),
    } as any;

    instance = new YourClass(mockDependency);
  });

  it('should do something', async () => {
    mockDependency.method.mockResolvedValue('result');

    const result = await instance.doSomething();

    expect(result).toBe('result');
    expect(mockDependency.method).toHaveBeenCalled();
  });
});
```

### 2. Controller Test Template
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourController } from '@presentation/controllers/your.controller';

describe('YourController', () => {
  let controller: YourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YourController],
      providers: [
        // Mock providers
      ],
    }).compile();

    controller = module.get<YourController>(YourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
```

### 3. E2E Test Template
```typescript
describe('/endpoint (METHOD)', () => {
  it('should do something', () => {
    return request(app.getHttpServer())
      .method('/endpoint')
      .send(data)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('property');
      });
  });
});
```

---

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock external dependencies (APIs, databases)
3. **Descriptive Names**: Test names should describe expected behavior
4. **Arrange-Act-Assert**: Follow AAA pattern for clarity
5. **Coverage**: Aim for 80%+ code coverage
6. **Fast**: Unit tests should run in milliseconds
7. **Deterministic**: Tests should always produce same results

---

## Troubleshooting

### Tests Failing After Config Changes
- Run `npm run build` to recompile TypeScript
- Check path mappings in `jest.config.js` and `test/jest-e2e.json`

### Module Resolution Errors
- Ensure all `@domain/*`, `@application/*` paths are mapped in Jest config
- Verify tsconfig paths match Jest moduleNameMapper

### E2E Tests Timeout
- Increase Jest timeout: `jest.setTimeout(10000)`
- Check if services are properly mocked

---

## Continuous Integration

Tests automatically run on:
- Pre-commit hooks (optional)
- Pull request creation
- Main branch merges

**CI Command**: `npm test && npm run test:e2e`
