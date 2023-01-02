import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import makeDbConfigFromServiceConfig from '../config/db';
import { AppConfigService } from '../config/app.config.service';
import { AppConfigModule } from '../config/config.module';
import { PaginationService } from './pagination.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: makeDbConfigFromServiceConfig,
      inject: [AppConfigService],
      imports: [AppConfigModule],
    }),
  ],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class DatabaseModule {}
