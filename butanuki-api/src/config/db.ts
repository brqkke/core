import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AppConfigService } from './app.config.service';

export default function makeDbConfigFromServiceConfig({
  config: {
    db: { host, password, port, database, username },
    nodeEnv,
  },
}: AppConfigService): PostgresConnectionOptions {
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
  };
}
