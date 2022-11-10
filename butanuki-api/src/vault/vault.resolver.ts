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
import { UpdateVaultInput, VaultInput, VaultStatistics } from './types';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { User } from '../entities/User';
import { UserRole } from '../entities/enums/UserRole';
import { OrderTemplate } from '../entities/OrderTemplate';
import { Dataloaders } from '../decorator/dataloader.decorator';
import { DLoaders } from '../dataloader/dataloaders';

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

  @Roles(UserRole.USER)
  @Mutation(() => Vault)
  async updateVault(
    @Args({
      name: 'id',
      type: () => ID,
    })
    id: string,
    @Args({
      name: 'data',
      type: () => UpdateVaultInput,
      nullable: false,
    })
    data: UpdateVaultInput,
    @CurrentUser() user: User,
  ): Promise<Vault> {
    return this.vaultService.updateVault(id, data, user);
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

  @ResolveField(() => [OrderTemplate])
  async orderTemplates(
    @Root() vault: Vault,
    @Dataloaders() dataloader: DLoaders,
  ): Promise<OrderTemplate[]> {
    return dataloader.orderTemplatesByVaultId.load(vault.id);
  }

  @ResolveField(() => VaultStatistics)
  async statistics(
    @Root() vault: Vault,
    @Dataloaders() dataloader: DLoaders,
  ): Promise<VaultStatistics> {
    return dataloader.vaultStatisticsByVaultId.load(vault.id);
  }
}
