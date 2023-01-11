import { Repositories } from '../utils';
import DataLoader from 'dataloader';
import { OrderStatus } from '../entities/enums/OrderStatus';

export const batchFunction = async (db: Repositories, keys: string[]) => {
  const q = db.order
    .createQueryBuilder('order')
    .select('"order"."userId"', 'userId')
    .distinctOn(['"order"."userId"'])
    .where('"order"."userId" IN (:...keys)', { keys })
    .andWhere('"order"."status" = :status', { status: OrderStatus.OPEN });
  const data = await q.getRawMany<{ userId: string }>();
  const set = new Set(data.map((d) => d.userId));
  return keys.map((key) => set.has(key));
};

export const createUserHasOrderDataloader = (
  db: Repositories,
): DataLoader<string, boolean> =>
  new DataLoader((keys: string[]) => batchFunction(db, keys));
