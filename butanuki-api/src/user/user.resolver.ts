import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User, UserSortFields, UserSortInput } from '../entities/User';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { UserRole } from '../entities/enums/UserRole';
import { DataSource } from 'typeorm';
import { base32Encode, buildRepositories, Repositories } from '../utils';
import { PaginatedUser, PaginationInput } from '../dto/Paginated';
import { PaginationService } from '../database/pagination.service';
import { MfaService } from '../mfa/mfa.service';
import { UserService } from './user.service';
import { Sort } from '../dto/Sort';
import { UserFilterInput } from '../dto/UserFilter';

@Resolver(() => User)
export class UserResolver {
  private db: Repositories;

  constructor(
    db: DataSource,
    private pagination: PaginationService,
    private mfaService: MfaService,
    private userService: UserService,
  ) {
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

  @Query(() => User)
  @Roles(UserRole.ADMIN)
  async user(@Args({ name: 'id', type: () => ID }) id: string): Promise<User> {
    return this.db.user.findOneOrFail({ where: { id } });
  }

  @Query(() => PaginatedUser)
  @Roles(UserRole.ADMIN)
  async users(
    @Args({ name: 'pagination', type: () => PaginationInput })
    pagination: PaginationInput,
    @Args({ name: 'query', type: () => String, nullable: true })
    query?: string,
    @Args({ name: 'sort', type: () => [UserSortInput], nullable: true })
    sort?: UserSortInput[],
    @Args({ name: 'filters', type: () => UserFilterInput, nullable: true })
    filters?: UserFilterInput,
  ): Promise<PaginatedUser> {
    const q = this.db.user.createQueryBuilder('u');
    if (!sort) {
      sort = [{ sortBy: UserSortFields.EMAIL, order: Sort.ASC }];
    }
    this.userService.applySortOnQuery(q, sort);
    if (filters) {
      this.userService.applyFiltersOnQuery(q, filters);
    }
    if (query) {
      this.userService.applySearchOnQuery(q, query);
    }
    return this.pagination.paginate(q, pagination);
  }

  @Mutation(() => String)
  @Roles(UserRole.USER)
  async setupMfa(@CurrentUser() user: User): Promise<string> {
    const secretBuffer = this.mfaService.generateMfaSecret();
    user.mfaSecret = base32Encode(secretBuffer);
    await this.db.user.save(user);
    // generate QR code string
    return this.mfaService.generateMfaQrCode({
      secret: user.mfaSecret,
      issuer: 'Butanuki',
      account: user.email,
    });
  }

  @Mutation(() => User)
  @Roles(UserRole.USER)
  async disableMfa(
    @Args({ name: 'code', type: () => String }) code: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    if (!user.mfaEnabled) {
      return user;
    }
    if (
      user.mfaSecret &&
      this.mfaService.verifyMfa({ mfaCode: code, mfaSecret: user.mfaSecret })
    ) {
      user.mfaEnabled = false;
      await this.db.user.save(user);
    }
    return user;
  }

  @Mutation(() => User)
  async enableMfa(
    @CurrentUser() user: User,
    @Args({ name: 'code', type: () => String }) code: string,
  ): Promise<User> {
    if (user.mfaEnabled) {
      return user;
    }
    if (
      user.mfaSecret &&
      this.mfaService.verifyMfa({ mfaCode: code, mfaSecret: user.mfaSecret })
    ) {
      user.mfaEnabled = true;
      await this.db.user.save(user);
    }
    return user;
  }
}
