import { makeUser, useAppWithMockedDatabase } from '../utils';
import { User } from '../../entities/User';
import { UserRole } from '../../entities/enums/UserRole';
import * as hasOrderDataloader from '../../dataloader/user.has-order.dataloader';
import { AuthService } from '../../auth/AuthService';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('User fields should be batched', () => {
  const testing = useAppWithMockedDatabase();
  let admin: User;
  let sessionKey: string;
  let app: INestApplication;
  beforeAll(async () => {
    app = (
      await testing.testingModuleBuilder!.compile()
    ).createNestApplication();
    await app.init();

    admin = await makeUser(testing.db!, UserRole.ADMIN);
    await Promise.all(
      Array.from({ length: 10 }).map(async () => {
        await makeUser(testing.db!, UserRole.USER);
      }),
    );

    sessionKey = await app
      .get(AuthService)
      .createUserSession(admin)
      .then((session) => session.token);
  });

  const query = `
    query {
      users(pagination: { count: 10, page: 0 }) {
        pagination {
          count
        }
        items {
          id
          hasOpenOrders
        }
      }
    }
  `;

  it('should call the UserHasOrderDataloader dataloader function only once', async () => {
    const spy = jest.spyOn(hasOrderDataloader, 'batchFunction');

    const res = await request(app.getHttpServer())
      .post('/api/graphql')
      .set('Authorization', sessionKey)
      .send({
        query,
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      data: {
        users: {
          pagination: {
            count: 10 + 1, // 10 users + 1 admin
          },
          items: expect.any(Array),
        },
      },
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
