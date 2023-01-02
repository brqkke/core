import { makeUser, useAppWithMockedDatabase } from './utils';
import { BityClientService } from '../bity/bity.client.service';
import { MockBityService } from './bity.mock';
import { INestApplication } from '@nestjs/common';
import { PaginationService } from '../database/pagination.service';

describe('Pagination', () => {
  const mockedAppDB = useAppWithMockedDatabase();
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await mockedAppDB
      .testingModuleBuilder!.overrideProvider(BityClientService)
      .useClass(MockBityService)
      .compile();
    app = await moduleRef.createNestApplication().init();

    const db = mockedAppDB.db!;
    for (let i = 0; i < 20; i++) {
      await makeUser(db);
    }
  });

  it('should paginate', async () => {
    const pagination = app.get(PaginationService);
    const users = await pagination.paginate(
      mockedAppDB.db!.user.createQueryBuilder('user'),
      { page: 0, count: 10 },
    );
    expect(users.count).toBe(20);
    expect(users.items).toHaveLength(10);
    const users2 = await pagination.paginate(
      mockedAppDB.db!.user.createQueryBuilder('user'),
      { page: 1, count: 10 },
    );
    expect(users2.count).toBe(20);
    expect(users2.items).toHaveLength(10);
    const users1Ids = new Set(users.items.map((u) => u.id));
    const users2Ids = new Set(users2.items.map((u) => u.id));
    //expect intersection to be empty
    users1Ids.forEach((id) => expect(users2Ids.has(id)).toBe(false));

    const users3 = await pagination.paginate(
      mockedAppDB.db!.user.createQueryBuilder('user'),
      { page: 2, count: 10 },
    );
    expect(users3.count).toBe(20);
    expect(users3.items).toHaveLength(0);
  });
});
