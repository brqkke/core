import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth.session.guard';
import { RoleGuard } from './auth.role.guard';
import { AuthService } from './AuthService';
import { AppConfigModule } from '../config/config.module';
import { MailerModule } from '../emails/mailer.module';
import { AuthController } from './auth.controller';
import { RecaptchaService } from '../services/RecaptchaService';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user.module';

@Module({
  imports: [AppConfigModule, MailerModule, HttpModule, UserModule],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    RecaptchaService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
