import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan } from 'typeorm';
import { User } from '../entities/User';
import { AppConfigService } from '../config/app.config.service';
import { MailerService } from '../emails/MailerService';
import { Session } from '../entities/Session';
import { UserStatus } from '../entities/enums/UserStatus';
import { genRandomString } from '../utils';

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

  async createUserSession(user: User): Promise<Session> {
    const session = new Session();
    session.user = user;
    session.token = genRandomString(128);
    session.expireAt =
      Math.round(Date.now() / 1000) + this.appConfig.config.sessionTokenTTL;
    return this.db.getRepository(Session).save(session);
  }

  async authenticateUser(sessionToken: string): Promise<User | null> {
    const sessionUser = await this.db.getRepository(Session).findOne({
      where: {
        token: sessionToken,
        expireAt: MoreThan(Math.round(Date.now() / 1000)),
        user: { status: UserStatus.ACTIVE },
      },
      relations: {
        user: {
          token: true,
        },
      },
    });

    return sessionUser?.user || null;
  }
}
