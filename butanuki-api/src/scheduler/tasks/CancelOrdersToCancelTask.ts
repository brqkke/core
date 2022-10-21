import { AbstractTask, Task } from '../Task';
import { DataSource } from 'typeorm';
import { buildRepositories, Repositories } from '../../utils';
import { BityService } from '../../bity/bity.service';
import { OrderService } from '../../order/order.service';
import { AppConfigService } from '../../config/app.config.service';
import { OrderStatus } from '../../entities/enums/OrderStatus';

@Task({
  name: 'CANCEL_PENDING_ORDERS',
})
export class CancelOrdersToCancelTask extends AbstractTask {
  private db: Repositories;
  constructor(
    dataSource: DataSource,
    private bity: BityService,
    private orders: OrderService,
    private appConfig: AppConfigService,
  ) {
    super();
    this.db = buildRepositories(dataSource.manager);
  }

  async run(): Promise<any> {
    const ordersToCancel = await this.orders.getOrdersScheduledForCancellation(
      this.appConfig.config.backgroundAgent.orderCheckBatchSize,
    );
    const results = await Promise.allSettled(
      ordersToCancel.map(async (order) => {
        const token = order.user?.token;
        if (!token) {
          return Promise.reject(order.id + ' => order.user.token is null');
        }
        const { response } = await this.bity.cancelBityOrder({
          id: order.remoteId,
          token,
        });
        if (response.status === 202 || response.status === 204) {
          await this.db.order.update(
            {
              id: order.id,
            },
            {
              updatedAt: new Date(),
              status: OrderStatus.CANCELLED,
            },
          );
        } else {
          console.log(response.data);
          return Promise.reject(
            `${order.id} => Got ${response.status} while trying to cancel order`,
          );
        }
      }),
    );
  }
}
