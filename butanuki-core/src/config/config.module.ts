import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './app.config.service';
import { ConfigController } from './config.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local', '.env.development'],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
  ],
  providers: [AppConfigService, ConfigService],
  controllers: [ConfigController],
  exports: [AppConfigService],
})
export class AppConfigModule {}
