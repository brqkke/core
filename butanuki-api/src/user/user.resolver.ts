import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/User';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { UserRole } from '../entities/enums/UserRole';
import { DataSource } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';

@Resolver(() => User)
export class UserResolver {
  private db: Repositories;

  constructor(db: DataSource) {
    this.db = buildRepositories(db.manager);
  }

  @Query(() => User)
  @Roles(UserRole.USER)
  me(@CurrentUser() user: User): User {
    return user;
  }

  @Mutation(() => User)
  @Roles(UserRole.USER)
  async updateLocale(
    @Args({ name: 'locale', type: () => String }) locale: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    if (['fr', 'en'].includes(locale)) {
      user.locale = locale;
    }
    await this.db.user.save(user);
    return user;
  }
}
