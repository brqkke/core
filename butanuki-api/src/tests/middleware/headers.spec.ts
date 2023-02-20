import request from 'supertest';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';

describe('index.html header', () => {
  let app: INestApplication;
  beforeAll(async () => {
    process.env.DB_USE_MOCK = 'true';
    app = await NestFactory.create(AppModule);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it.each(['', '/', '/hello', '/savings'])(
    'It should add header to preload /api/config when fetching %s',
    async (path) => {
      const response = await request(app.getHttpServer()).get(path);
      expect(response.status).toBe(200);
      expect(response.headers.link).toContain(
        '</api/config>; rel="preload"; as="fetch"',
      );
      expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    },
  );

  it.each(['?lang=fr', '/?lang=fr', '/hello?lang=fr', '/savings?lang=fr'])(
    'It should add header to preload /api/config with lang when fetching %s',
    async (path) => {
      const response = await request(app.getHttpServer()).get(path);
      expect(response.status).toBe(200);
      expect(response.headers.link).toContain(
        '</api/config?lang=fr>; rel="preload"; as="fetch"',
      );
      expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    },
  );

  it.each([
    ['/api/config?lang=fr', 'fr'],
    ['/api/config?lang=en', 'en'],
  ])(
    'should not add header to /config, and should override lang when passed in query',
    async (path, lang) => {
      const response = await request(app.getHttpServer()).get(path);
      expect(response.status).toBe(200);
      expect(response.headers.link).toBeUndefined();
      expect(response.body.locale).toBe(lang);
      expect(response.headers['content-type']).toBe(
        'application/json; charset=utf-8',
      );
    },
  );

  it('sould not temper with assets headers', async () => {
    const response = await request(app.getHttpServer()).get('/assets/test.js');
    expect(response.status).toBe(200);
    expect(response.headers.link).toBeUndefined();
    expect(response.headers['content-type']).toBe(
      'application/javascript; charset=UTF-8',
    );
  });
});
