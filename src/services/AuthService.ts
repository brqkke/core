import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { AppConfigService } from './ConfigService';
import { MailerService } from './MailerService';

function genRandomString(length: number) {
  const list = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array(length)
    .fill('_')
    .map((_) => list[Math.round(Math.random() * list.length)])
    .join('');
}

@Injectable()
export class AuthService {
  constructor(
    private db: DataSource,
    private appConfig: AppConfigService,
    private mailer: MailerService,
  ) {}

  async sendUserLoginLink(user: User) {
    const tempCode = genRandomString(32);
    user.tempCode = tempCode;
    user.tempCodeExpireAt =
      Math.floor(Date.now() / 1000) + this.appConfig.config.singleLoginTokenTTL;
    await this.db.getRepository(User).save(user);
    return this.mailer.sendSingleUseLoginLink(user.email, tempCode);
  }
}
