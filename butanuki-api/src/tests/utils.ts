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

export const makeUser = async (db: Repositories) => {
  const randomName = Math.random().toString(36).substring(2);
  const randomLastName = Math.random().toString(36).substring(2);
  const randomEmail = `${randomName}.${randomLastName}@example.com`;

  return db.user.save({
    email: randomEmail,
    locale: 'en',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    tempCodeExpireAt: 0,
    tempCode: '',
  });
};
