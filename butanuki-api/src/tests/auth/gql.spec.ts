import { makeUser, useAppWithMockedDatabase } from '../utils';
import { Repositories } from '../../utils';
import { INestApplication } from '@nestjs/common';
import { User } from '../../entities/User';
import { invariant } from 'graphql/jsutils/invariant';
import { AuthService } from '../../auth/AuthService';
import request from 'supertest';
import { UserRole } from '../../entities/enums/UserRole';

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

  it("can't list users if not admin", async () => {
    const res = await request(app.getHttpServer())
      .post('/api/graphql')
      .set('Authorization', sessionToken)
      .send({
        query: `
          query users{
            users(pagination: { count: 10, page: 0 }) {
              count
              items {
                email
              }
            }
          }
        `,
      });
    console.log(res.body);
    expect(res.body.errors[0].extensions.code).toBe('FORBIDDEN');
    expect(res.body).toMatchObject({
      data: null,
    });
    user.role = UserRole.ADMIN;
    await db.user.save(user);
    const res2 = await request(app.getHttpServer())
      .post('/api/graphql')
      .set('Authorization', sessionToken)
      .send({
        query: `
          query users{
            users(pagination: { count: 10, page: 0 }) {
              count
              items {
                email
              }
            }
          }
        `,
      });
    expect(res2.status).toBe(200);
    expect(res2.body).toMatchObject({
      data: {
        users: {
          count: 1,
          items: [
            {
              email: user.email,
            },
          ],
        },
      },
    });
  });
});
