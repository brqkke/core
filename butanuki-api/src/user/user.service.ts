import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { User } from '../entities/User';
import { UserStatus } from '../entities/enums/UserStatus';

@Injectable()
export class UserService {
  private repository: Repository<User>;
  constructor(db: DataSource) {
    this.repository = db.getRepository(User);
  }

  async findUserOrInit({
    email,
    locale,
  }: {
    email: string;
    locale: string;
  }): Promise<User> {
    const lowerCaseEmail = email.toLowerCase();
    let user = await this.repository.findOneBy({
      email: lowerCaseEmail,
      status: UserStatus.ACTIVE,
    });
    if (user) {
      return user;
    }
    user = new User();
    user.email = lowerCaseEmail;
    user.locale = locale;
    return this.repository.save(user);
  }

  async findUserWithLoginToken(
    tempCode: string,
    email: string,
    withMfa: boolean,
  ): Promise<User | null> {
    return this.repository.findOneBy({
      email,
      tempCode,
      tempCodeExpireAt: MoreThan(Math.floor(Date.now() / 1000)),
      status: UserStatus.ACTIVE,
      mfaEnabled: withMfa,
    });
  }

  async setupMfa(user: User, mfaSecret: string): Promise<void> {
    user.mfaSecret = mfaSecret;
    await this.repository.save(user);
  }

  async removeMfa(user: User): Promise<void> {
    user.mfaSecret = null;
    await this.repository.save(user);
  }
}
