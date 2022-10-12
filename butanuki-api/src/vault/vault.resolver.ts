import {
  Args,
  ID,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Vault } from '../entities/Vault';
import { VaultService } from './vault.service';
import { VaultInput } from './types';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { User } from '../entities/User';
import { UserRole } from '../entities/enums/UserRole';
import { Order } from '../entities/Order';

@Resolver(() => Vault)
export class VaultResolver {
  constructor(private vaultService: VaultService) {}

  @Roles(UserRole.USER)
  @Mutation(() => Vault)
  async addVault(
    @Args({
      name: 'data',
      type: () => VaultInput,
      nullable: false,
    })
    data: VaultInput,
    @CurrentUser() user: User,
  ): Promise<Vault> {
    return this.vaultService.createVault(data, user);
  }

  @Query(() => Vault)
  async vault(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Vault> {
    return this.vaultService.findUserVault(user, id);
  }

  @Roles(UserRole.USER)
  @Mutation(() => Vault)
  async deleteVault(
    @Args({
      name: 'vaultId',
      type: () => ID,
    })
    vaultId: string,
    @CurrentUser() user: User,
  ): Promise<Vault> {
    return this.vaultService.deleteVault(vaultId, user);
  }

  @ResolveField(() => [Order])
  async orders(@Root() vault: Vault) {
    return this.vaultService.findVaultOrders(vault);
  }
}
