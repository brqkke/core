import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';
import { UpdateVaultInput, VaultInput } from './types';
import { User } from '../entities/User';
import { Vault } from '../entities/Vault';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../entities/enums/OrderStatus';
import { OrderTemplate } from '../entities/OrderTemplate';
import { AppConfigService } from '../config/app.config.service';
import { ErrorType, makeError } from '../error/ErrorTypes';

@Injectable()
export class VaultService {
  private db: Repositories;
  constructor(
    db: DataSource,
    private appConfig: AppConfigService,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
  ) {
    this.db = buildRepositories(db.manager);
  }

  async createVault(input: VaultInput, user: User) {
    const totalUserVaults = await this.db.vault.count({
      where: { userId: user.id },
    });
    if (totalUserVaults >= this.appConfig.config.vault.maxVaultsPerUser) {
      throw makeError(ErrorType.TooManyVaults);
    }
    return this.db.vault.save({
      ...input,
      createdAt: new Date(),
      userId: user.id,
    });
  }

  //Only name can be updated
  //Currency should not be updated because some orders may have been created with another currency
  async updateVault(id: string, input: UpdateVaultInput, user: User) {
    const vault = await this.findUserVault(user, id);
    vault.name = input.name;
    return this.db.vault.save(vault);
  }

  deleteVault(id: string, user: User) {
    return this.db.em.transaction('SERIALIZABLE', async (em) => {
      const db = buildRepositories(em);
      const vault = await db.vault.findOneOrFail({
        where: { id, userId: user.id },
        relations: { orderTemplates: true },
      });
      const templateIds = (vault.orderTemplates || []).map(
        (template) => template.id,
      );
      const date = new Date();
      if (templateIds.length) {
        await db.order.update(
          {
            orderTemplateId: In(templateIds),
            status: In([OrderStatus.FILLED_NEED_RENEW, OrderStatus.OPEN]),
          },
          { status: OrderStatus.CANCELLED, updatedAt: date },
        );
        await db.orderTemplate.softRemove(vault.orderTemplates || []);
      }
      await db.vault.softRemove(vault);

      return vault;
    });
  }

  findVaultOrderTemplates(vault: Vault): Promise<OrderTemplate[]> {
    return this.orderService.getVaultOrderTemplates(vault.id);
  }

  findUserVault(user: User, vaultId: string): Promise<Vault> {
    return this.db.vault.findOneByOrFail({ id: vaultId, userId: user.id });
  }
}
