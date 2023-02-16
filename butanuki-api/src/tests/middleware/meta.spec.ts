import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { useAppWithMockedDatabase } from '../utils';
import { invariant } from 'graphql/jsutils/invariant';
import { JSDOM } from 'jsdom';

describe('index.html meta ssr', () => {
  let app: INestApplication;

  const testingModule = useAppWithMockedDatabase();

  beforeAll(async () => {
    invariant(!!testingModule.testingModuleBuilder);
    const moduleRef = await testingModule.testingModuleBuilder.compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('It should add meta tags to index.html on /savings', async () => {
    const response = await request(app.getHttpServer()).get('/savings');
    expect(response.status).toBe(200);

    const {
      window: { document },
    } = new JSDOM(response.text);

    const metaTagsTwitter = document.querySelectorAll('meta[name^="twitter:"]');
    expect(metaTagsTwitter.length).toBe(6);
    expect(
      [...metaTagsTwitter.values()].map((m) => m.getAttribute('name')),
    ).toEqual(
      expect.arrayContaining([
        'twitter:card',
        'twitter:site',
        'twitter:creator',
        'twitter:title',
        'twitter:description',
        'twitter:image',
      ]),
    );

    const metaTagsOg = document.querySelectorAll('meta[property^="og:"]');
    expect(metaTagsOg.length).toBe(3);
    expect(
      [...metaTagsOg.values()].map((m) => m.getAttribute('property')),
    ).toEqual(
      expect.arrayContaining(['og:title', 'og:description', 'og:image']),
    );
  });

  it('It should set the right image depending on the slug', async () => {
    for (const slug of ['cigarettes', 'beer']) {
      const responseCigarettes = await request(app.getHttpServer()).get(
        '/savings?slug=' + slug,
      );
      expect(responseCigarettes.status).toBe(200);
      const {
        window: { document },
      } = new JSDOM(responseCigarettes.text);
      const metaTagsOg = document.querySelector('meta[property="og:image"]');
      expect(metaTagsOg?.getAttribute('content')).toEqual(
        `https://butanuki.com/img/${slug}.jpg`,
      );
    }
  });
});
