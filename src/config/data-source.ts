import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import makeDbConfigFromServiceConfig from './db';
import { ConfigService } from '@nestjs/config';

const getConfig = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const AppDataSource = new DataSource(
    makeDbConfigFromServiceConfig(configService),
  );
  return AppDataSource;
};

const config = getConfig();

export default config;
