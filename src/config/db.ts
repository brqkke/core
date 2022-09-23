import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default function makeDbConfigFromServiceConfig(
  config: ConfigService,
): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: config.getOrThrow('DB_HOST'),
    port: config.getOrThrow('DB_PORT'),
    username: config.getOrThrow('DB_USER'),
    password: config.getOrThrow('DB_PASSWORD'),
    entities: [`${__dirname}/../entities/*.{t,j}s`],
    migrations: [`${__dirname}/../migrations/*.{t,j}s`],
    database: config.get('DB_NAME'),
    synchronize: false,
    migrationsRun: config.getOrThrow('NODE_ENV') === 'development',
  };
}
