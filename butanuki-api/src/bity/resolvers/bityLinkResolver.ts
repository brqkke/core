import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../entities/User';
import { CurrentUser, Roles } from '../../decorator/user.decorator';
import { UserRole } from '../../entities/enums/UserRole';
import { BityService } from '../bity.service';
import { BadRequestException } from '@nestjs/common';

@Resolver()
export class BityLinkResolver {
  constructor(private bity: BityService) {}
  @Roles(UserRole.USER)
  @Mutation(() => User)
  async unlinkBity(@CurrentUser() user: User): Promise<User> {
    await this.bity.removeToken(user);
    user.token = undefined;
    return user;
  }

  @Roles(UserRole.USER)
  @Mutation(() => User)
  async linkBity(
    @CurrentUser() user: User,
    @Args('redirectedFrom', { type: () => String }) redirectedFrom: string,
  ): Promise<User> {
    const token = await this.bity.getTokenFromCodeRedirectUrl(redirectedFrom);
    if (!token || token.expired()) {
      console.log(token);
      throw new BadRequestException({ success: false });
    }

    await this.bity.useTokenOnUser(token, user);

    return user;
  }

  @Roles(UserRole.USER)
  @Query(() => String)
  linkUrl(): string {
    return this.bity.getBityLoginUrl();
  }
}
