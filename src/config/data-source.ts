import { DataSource } from 'typeorm';
import makeDbConfigFromServiceConfig from './db';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config.module';

const getConfig = async () => {
  const config = await NestFactory.create(AppConfigModule);
  const configService = config.get(ConfigService);
  const dataSource = new DataSource(
    makeDbConfigFromServiceConfig(configService),
  );
  return dataSource;
};

const config = getConfig();

export default config;
