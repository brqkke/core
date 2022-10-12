import { DataSource } from 'typeorm';
import makeDbConfigFromServiceConfig from './db';
import { NestFactory } from '@nestjs/core';
import { AppConfigModule } from './config.module';
import { AppConfigService } from './app.config.service';

const getConfig = async () => {
  const config = await NestFactory.create(AppConfigModule);
  const configService = config.get(AppConfigService);
  const dataSource = new DataSource({
    ...makeDbConfigFromServiceConfig(configService),
    migrationsRun: false,
  });
  return dataSource;
};

const config = getConfig();

export default config;
