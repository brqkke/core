import { Repositories } from '../utils';
import DataLoader from 'dataloader';
import { VaultStatistics } from '../vault/types';
import { OrderTemplate } from '../entities/OrderTemplate';
import { Order } from '../entities/Order';
import { OrderStatus } from '../entities/enums/OrderStatus';

export const createVaultStatisticsDataloader = (
  db: Repositories,
): DataLoader<string, VaultStatistics> =>
  new DataLoader(async (ids) => {
    const qb = db.vault
      .createQueryBuilder('vault')
      .withDeleted()
      .leftJoin(OrderTemplate, 'ot', `ot."vaultId" = vault.id`)
      .leftJoin(Order, 'o', `o."orderTemplateId" = ot.id`)
      .select('vault.id', 'id')
      .addSelect('SUM(o.amount)', 'totalSpent')
      .addSelect('SUM(o."filledAmount")', 'totalReceived')
      .groupBy('vault.id')
      .where('vault.id IN (:...ids)', { ids })
      .andWhere('o."filledAmount" IS NOT NULL')
      .andWhere('o."status" = :status', { status: OrderStatus.FILLED });

    const data = await qb.getRawMany<{
      totalSpent: number;
      totalReceived: number;
      id: string;
    }>();

    const map = data.reduce((map, current) => {
      map.set(current.id, {
        totalSpent: current.totalSpent,
        totalReceived: current.totalReceived,
      });
      return map;
    }, new Map<string, VaultStatistics>());
    return ids.map((id) => map.get(id) || { totalSpent: 0, totalReceived: 0 });
  });
