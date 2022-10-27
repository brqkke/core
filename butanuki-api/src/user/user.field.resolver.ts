import {
  Field,
  ObjectType,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { User } from '../entities/User';
import { Roles } from '../decorator/user.decorator';
import { UserRole } from '../entities/enums/UserRole';
import { DataSource } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';
import { TokenStatus } from '../entities/enums/TokenStatus';
import { Vault } from '../entities/Vault';

@ObjectType('BityLinkStatus')
class BityLinkStatus {
  @Field(() => Boolean)
  linked: boolean;

  @Field(() => TokenStatus, { nullable: true })
  linkStatus: TokenStatus | null;
}

@Resolver(() => User)
export class UserFieldResolver {
  private db: Repositories;

  constructor(db: DataSource) {
    this.db = buildRepositories(db.manager);
  }

  @ResolveField(() => BityLinkStatus)
  @Roles(UserRole.USER)
  async bityTokenStatus(@Root() user: User): Promise<BityLinkStatus> {
    const token =
      user.token ||
      (await this.db.token.findOne({ where: { userId: user.id } }));
    return {
      linked: !!token,
      linkStatus: token?.status || null,
    };
  }

  @ResolveField(() => [Vault])
  @Roles(UserRole.USER)
  async vaults(@Root() user: User): Promise<Vault[]> {
    return this.db.vault.find({
      where: { userId: user.id },
      order: { createdAt: 'ASC' },
    });
  }
}