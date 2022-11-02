import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { buildRepositories } from '../utils';
import { IsOrderStatusActive } from '../order/order.service';

@Injectable()
export class MigrateScriptService {
  constructor(private data: DataSource) {}

  public async initVaults(dryRunArg = 'false') {
    const dryRun = dryRunArg !== 'false';
    await this.data.manager.transaction(async (manager) => {
      const db = buildRepositories(manager);
      const activeOrders = await db.order.find({
        where: { status: IsOrderStatusActive() },
        relations: {
          user: true,
        },
      });

      for (const order of activeOrders) {
        //init vault for user
        //init order-template from order and set order-vault as vault
        //update order with order-template
        const vault = await db.vault.save({
          createdAt: new Date(),
          currency: order.currency,
          name: order.user?.locale === 'en' ? 'Piggy bank #1' : 'Tirelire #1',
          userId: order.userId,
        });
        const orderTemplate = await db.orderTemplate.save({
          createdAt: new Date(),
          vaultId: vault.id,
          name: order.user?.locale === 'en' ? 'DCA #1' : 'Ordre récurrent #1',
          currency: order.currency,
          amount: order.amount,
        });
        await db.order.update(order.id, {
          orderTemplateId: orderTemplate.id,
        });
      }
      if (dryRun) {
        throw new Error('Rollback');
      }
    });
  }
}
