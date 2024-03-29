import { Repositories } from '../utils';
import DataLoader from 'dataloader';
import { Order } from '../entities/Order';
import { In } from 'typeorm';
import { OrderStatus } from '../entities/enums/OrderStatus';

export const createActiveOrderByTemplateIdDataloader = (db: Repositories) => {
  return new DataLoader<string, Order | null>(async (keys: string[]) => {
    // {
    //   where: {
    //     orderTemplateId: templateId,
    //       status: IsOrderStatusActive(),
    //   },
    //   order: { createdAt: 'DESC' },
    // }
    const data = await db.order.find({
      where: {
        orderTemplateId: In(keys),
        status: In([
          OrderStatus.FILLED_NEED_RENEW,
          OrderStatus.OPEN,
          OrderStatus.CANCELLED,
        ]),
      },
      order: { createdAt: 'DESC' },
    });
    const map = data.reduce((map, current) => {
      if (!current.orderTemplateId) {
        return map;
      }
      if (map.has(current.orderTemplateId)) {
        return map;
      }

      map.set(current.orderTemplateId, current);
      return map;
    }, new Map<string, Order>());

    return keys.map((id) => map.get(id) || null);
  });
};
