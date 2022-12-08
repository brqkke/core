import { makeUser, useAppWithMockedDatabase } from '../utils';
import { Repositories } from '../../utils';
import { INestApplication } from '@nestjs/common';
import { User } from '../../entities/User';
import { invariant } from 'graphql/jsutils/invariant';
import { AuthService } from '../../auth/AuthService';
import request from 'supertest';

describe('GraphQL endpoint', () => {
  const testing = useAppWithMockedDatabase();
  let db: Repositories;
  let sessionToken: string;
  let app: INestApplication;
  let user: User;
  beforeAll(async () => {
    invariant(!!testing.testingModuleBuilder && !!testing.db);
    const moduleRef = await testing.testingModuleBuilder.compile();
    app = await moduleRef.createNestApplication().init();
    db = testing.db;
    user = await makeUser(db);
    sessionToken = await moduleRef
      .get(AuthService)
      .createUserSession(user)
      .then((s) => s.token);
  });

  it('should list vaults', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/graphql')
      .set('Authorization', sessionToken)
      .send({
        query: `
          query me{
            me {
              email
            }
          }
        `,
      });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      data: {
        me: {
          email: user.email,
        },
      },
    });
  });
});
