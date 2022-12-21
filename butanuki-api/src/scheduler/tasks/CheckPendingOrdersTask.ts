import { AbstractTask, Task } from '../Task';
import { DataSource } from 'typeorm';
import { BityService, GetOrderResponse } from '../../bity/bity.service';
import { OrderService } from '../../order/order.service';
import { AppConfigService } from '../../config/app.config.service';
import { buildRepositories, Repositories } from '../../utils';
import { Order } from '../../entities/Order';
import { OrderStatus } from '../../entities/enums/OrderStatus';
import { MailerService } from '../../emails/MailerService';

@Task({
  name: 'CHECK_PENDING_ORDERS',
})
export class CheckPendingOrdersTask extends AbstractTask {
  private db: Repositories;

  constructor(
    dataSource: DataSource,
    private bity: BityService,
    private orders: OrderService,
    private appConfig: AppConfigService,
    private mailer: MailerService,
  ) {
    super();
    this.db = buildRepositories(dataSource.manager);
  }

  async run(): Promise<any> {
    const ordersToCheck = await this.orders.getOrdersToCheck(
      this.appConfig.config.backgroundAgent.orderCheckBatchSize,
      this.appConfig.config.backgroundAgent.orderCheckInterval,
    );
    const results = await Promise.allSettled(
      ordersToCheck.map(async (order) => {
        this.log(`Retrieving ${order.remoteId}`);
        const token = order.user?.token;
        if (!token) {
          return Promise.reject(order.id + ' => order.user.token is null');
        }

        const { response: bityOrder } = await this.bity.getBityOrder({
          orderId: order.remoteId,
          token,
        });
        if (bityOrder.status !== 200) {
          this.log('Got status ' + bityOrder.status);
          this.log(bityOrder.data);
        }
        return await this.processOrder(order, bityOrder.data);
      }),
    );
    console.log(results);
  }

  async processOrder(orderDb: Order, orderBity: GetOrderResponse) {
    console.log({ orderDb, orderBity });
    if (orderBity.timestamp_executed) {
      console.log(
        'Payment was received for ' +
          orderDb.id +
          ' ' +
          orderDb.remoteId +
          ' ' +
          orderDb.transferLabel,
      );
      //TODO: send mail ?
      await this.db.order.update(
        {
          id: orderDb.id,
        },
        {
          status: OrderStatus.FILLED_NEED_RENEW,
          updatedAt: new Date(),
          lastCheckedAt: new Date(),
          filledAmount: parseFloat(orderBity.output?.amount || '0'),
        },
      );
    } else if (orderBity.timestamp_cancelled) {
      await this.db.order.update(
        {
          id: orderDb.id,
        },
        {
          status: OrderStatus.CANCELLED,
          updatedAt: new Date(),
          lastCheckedAt: new Date(),
        },
      );
      if (orderDb.user) {
        const template = await this.db.orderTemplate.findOneOrFail({
          where: {
            id: orderDb.orderTemplateId || '',
          },
          relations: {
            vault: true,
          },
        });
        await this.mailer.sendOrderCancelledEmail(
          orderDb,
          template,
          orderDb.user.email,
          orderDb.user.locale,
        );
      }
    } else {
      await this.db.order.update(
        {
          id: orderDb.id,
        },
        {
          lastCheckedAt: new Date(),
        },
      );
    }
  }
}
