import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import makeDbConfigFromServiceConfig from './config/db';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { RecaptchaService } from './services/RecaptchaService';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { AppConfigService } from './services/ConfigService';
import { MailerTransportService } from './services/MailerTransportService';
import { MailerService } from './services/MailerService';
import { SSRService } from './services/SSRService';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigController } from './controllers/config.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local', '.env.development'],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: makeDbConfigFromServiceConfig,
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front-build'),
    }),
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    ConfigController,
  ],
  providers: [
    AppService,
    RecaptchaService,
    AuthService,
    UserService,
    AppConfigService,
    MailerTransportService,
    MailerService,
    SSRService,
  ],
})
export class AppModule {}
