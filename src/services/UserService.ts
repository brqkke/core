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

  async findUserOrInit(email: string): Promise<User> {
    let user = await this.repository.findOneBy({
      email,
      status: UserStatus.ACTIVE,
    });
    if (user) {
      return user;
    }
    user = new User();
    user.email = email;
    return this.repository.save(user);
  }

  async findUserWithLoginToken(
    tempCode: string,
    email: string,
  ): Promise<User | null> {
    return this.repository.findOneBy({
      email,
      tempCode,
      tempCodeExpireAt: MoreThan(Math.floor(Date.now() / 1000)),
      status: UserStatus.ACTIVE,
    });
  }
}
