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
    expect(users.pagination).toMatchObject({
      page: 0,
      count: 20,
      pages: 2,
      firstPage: 0,
      lastPage: 1,
      nextPage: 1,
      previousPage: 0,
    });
    expect(users.items).toHaveLength(10);
    const users2 = await pagination.paginate(
      mockedAppDB.db!.user.createQueryBuilder('user'),
      { page: 1, count: 10 },
    );
    expect(users2.pagination).toMatchObject({
      page: 1,
      count: 20,
      pages: 2,
      firstPage: 0,
      lastPage: 1,
      nextPage: 1, // this is the last page so it should be the same as the current page
      previousPage: 0,
    });
    expect(users2.items).toHaveLength(10);
    const users1Ids = new Set(users.items.map((u) => u.id));
    const users2Ids = new Set(users2.items.map((u) => u.id));
    //expect intersection to be empty
    users1Ids.forEach((id) => expect(users2Ids.has(id)).toBe(false));

    const users3 = await pagination.paginate(
      mockedAppDB.db!.user.createQueryBuilder('user'),
      { page: 2, count: 10 },
    );

    expect(users3.pagination).toMatchObject({
      page: 2,
      count: 20,
      pages: 2,
      firstPage: 0,
      lastPage: 1,
      nextPage: 1, // this is the last page so it should be the same as the current page
      previousPage: 1,
    });

    expect(users3.items).toHaveLength(0);
  });
});
