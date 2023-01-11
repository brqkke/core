import { INestApplication } from '@nestjs/common';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { DataSource } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';
import { UserRole } from '../entities/enums/UserRole';
import { UserStatus } from '../entities/enums/UserStatus';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { MailerTransportService } from '../emails/MailerTransportService';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { BityService } from '../bity/bity.service';
import { User } from '../entities/User';

if (process.env.JEST_WORKER_ID === undefined) {
  console.error("Can't import test utils outside of jest");
  process.exit(1);
}

const makeTestDbConfig = (): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_TEST_HOST || 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    entities: [`${__dirname}/../entities/*.{t,j}s`],
    migrations: [`${__dirname}/../migrations/*.{t,j}s`],
    // database: dbName,
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    logging: false,
    poolSize: 30,
  };
};

export const useAppWithMockedDatabase = (
  modules: ModuleMetadata['imports'] = [AppModule],
  mocks?:
    | undefined
    | ({ moduleMocker: ModuleMocker } & {
        mockEmail?: boolean;
      }),
): {
  testingModuleBuilder?: TestingModuleBuilder;
  db?: Repositories;
} => {
  const dbName = `butanuki_test_${Math.random().toString(36).substring(2)}`;
  const ref: {
    testingModuleBuilder?: TestingModuleBuilder;
    db?: Repositories;
  } = {};

  let datasource: DataSource;
  beforeAll(async () => {
    datasource = new DataSource(makeTestDbConfig());
    await datasource.initialize();
    await datasource.query(`CREATE DATABASE ${dbName};`);
    await datasource.destroy();
    await datasource.setOptions({ database: dbName });
    await datasource.initialize();
    await datasource.runMigrations();
    ref.testingModuleBuilder = Test.createTestingModule({
      imports: modules,
    })
      .overrideProvider(DataSource)
      .useValue(datasource);
    ref.db = buildRepositories(datasource.manager);
    if (mocks) {
      const { moduleMocker, mockEmail } = mocks;
      if (mockEmail) {
        ref.testingModuleBuilder = ref.testingModuleBuilder
          ?.overrideProvider(MailerTransportService)
          .useFactory({
            factory: () => {
              const mockMetadata = moduleMocker.getMetadata(
                MailerTransportService,
              ) as MockFunctionMetadata<any, any>;
              const Mock = moduleMocker.generateFromMetadata(mockMetadata);
              return new Mock();
            },
          });
      }
    }
  });

  afterAll(async () => {
    await datasource.dropDatabase();
    await datasource.destroy();
    await datasource.setOptions({ database: 'postgres' });
    await datasource.initialize();
    await datasource.query(`DROP DATABASE ${dbName};`);
    await datasource.destroy();
  });
  return ref;
};

export const makeUser = async (
  db: Repositories,
  role?: UserRole,
): Promise<User> => {
  const randomName = Math.random().toString(36).substring(2);
  const randomLastName = Math.random().toString(36).substring(2);
  const randomEmail = `${randomName}.${randomLastName}@example.com`;

  return db.user.save({
    email: randomEmail,
    locale: 'en',
    role: role ?? UserRole.USER,
    status: UserStatus.ACTIVE,
    tempCodeExpireAt: 0,
    tempCode: '',
    mfaEnabled: false,
  });
};

export const makeVault = async (
  db: Repositories,
  userId: string,
  currency: OrderCurrency = OrderCurrency.EUR,
) => {
  const randomName = Math.random().toString(36).substring(2);
  return db.vault.save({
    name: randomName,
    currency,
    userId,
    createdAt: new Date(),
  });
};

export const linkBityMock = async (
  db: Repositories,
  user: User,
  app: INestApplication,
) => {
  const token = await app
    .get(BityService)
    .getTokenFromCodeRedirectUrl(JSON.stringify({ userId: user.id }));
  expect(token).toBeDefined();
  await app.get(BityService).useTokenOnUser(token!, user);
};
