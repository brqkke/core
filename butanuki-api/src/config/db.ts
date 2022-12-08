import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AppConfigService } from './app.config.service';
import { BetterSqlite3ConnectionOptions } from 'typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions';

export default function makeDbConfigFromServiceConfig({
  config: {
    db: { host, password, port, database, username, useMockDb },
    nodeEnv,
  },
}: AppConfigService):
  | PostgresConnectionOptions
  | BetterSqlite3ConnectionOptions {
  if (useMockDb) {
    return {
      type: 'better-sqlite3',
      database: ':memory:',
      dropSchema: true,
      synchronize: true,
    };
  }
  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    entities: [`${__dirname}/../entities/*.{t,j}s`],
    migrations: [`${__dirname}/../migrations/*.{t,j}s`],
    database,
    synchronize: false,
    migrationsRun: nodeEnv === 'development',
    // logging: 'all',
    // logger: 'simple-console',
    logging: ['query', 'error', 'info', 'warn'],
    poolSize: 30,
  };
}
