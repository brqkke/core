import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';
import { VaultInput } from './types';
import { User } from '../entities/User';
import { Vault } from '../entities/Vault';
import { Order } from '../entities/Order';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../entities/enums/OrderStatus';

@Injectable()
export class VaultService {
  private db: Repositories;
  constructor(db: DataSource, private orderService: OrderService) {
    this.db = buildRepositories(db.manager);
  }

  createVault(input: VaultInput, user: User) {
    console.log(input);
    return this.db.vault.save({
      ...input,
      createdAt: new Date(),
      userId: user.id,
    });
  }

  deleteVault(id: string, user: User) {
    return this.db.em.transaction('SERIALIZABLE', async (em) => {
      const db = buildRepositories(em);
      const vault = await db.vault.findOneByOrFail({ id, userId: user.id });
      await db.order.update(
        {
          vaultId: vault.id,
          status: In([OrderStatus.FILLED_NEED_RENEW, OrderStatus.OPEN]),
        },
        { status: OrderStatus.CANCELLED, updatedAt: new Date() },
      );
      await db.vault.softRemove(vault);
      return vault;
    });
  }

  findVaultOrders(vault: Vault): Promise<Order[]> {
    return this.orderService.getVaultOrders(vault.id);
  }

  findUserVault(user: User, vaultId: string): Promise<Vault> {
    return this.db.vault.findOneByOrFail({ id: vaultId, userId: user.id });
  }
}
