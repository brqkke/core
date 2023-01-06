import { Repositories } from '../utils';
import DataLoader from 'dataloader';

export const createUserHasOrderDataloader = (
  db: Repositories,
): DataLoader<string, boolean> =>
  new DataLoader(async (keys: string[]) => {
    const q = db.order
      .createQueryBuilder('order')
      .select('"order"."userId"', 'userId')
      .distinctOn(['"order"."userId"'])
      .where('"order"."userId" IN (:...keys)', { keys })
      .andWhere('"order"."status" = :status', { status: 'OPEN' });
    const data = await q.getRawMany<{ userId: string }>();
    const set = new Set(data.map((d) => d.userId));
    return keys.map((key) => set.has(key));
  });
