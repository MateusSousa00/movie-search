import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Movie Search API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/favorites (GET)', () => {
    it('should return empty favorites list initially', () => {
      return request(app.getHttpServer())
        .get('/favorites')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('favorites');
          expect(res.body.favorites).toBeInstanceOf(Array);
        });
    });
  });

  describe('/favorites (POST)', () => {
    it('should add a favorite movie', () => {
      return request(app.getHttpServer())
        .post('/favorites')
        .send({
          imdbID: 'tt0372784',
          Title: 'Batman Begins',
          Year: '2005',
          Poster: 'https://example.com/poster.jpg',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('favorite');
          expect(res.body.favorite.Title).toBe('Batman Begins');
        });
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/favorites')
        .send({})
        .expect(400);
    });
  });
});
