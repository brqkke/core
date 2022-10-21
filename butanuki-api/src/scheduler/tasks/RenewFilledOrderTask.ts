import { AbstractTask, Task } from '../Task';
import { DataSource, EntityManager } from 'typeorm';
import { OrderService } from '../../order/order.service';
import { BityService } from '../../bity/bity.service';
import { AppConfigService } from '../../config/app.config.service';
import { Order } from '../../entities/Order';
import { buildRepositories } from '../../utils';
import { OrderStatus } from '../../entities/enums/OrderStatus';

@Task({ name: 'RENEW_FILLED_ORDER' })
export class RenewFilledOrderTask extends AbstractTask {
  private em: EntityManager;
  constructor(
    dataSource: DataSource,
    private order: OrderService,
    private bity: BityService,
    private appConfig: AppConfigService,
  ) {
    super();
    this.em = dataSource.manager;
  }

  async run(): Promise<any> {
    const ordersToRenew = await this.order.getOrdersToRenew(
      this.appConfig.config.backgroundAgent.orderCheckBatchSize,
    );

    const results = await Promise.allSettled(
      ordersToRenew.map(async (order) => {
        this.log(
          `Refreshing #${order.id} ${order.transferLabel} ${order.remoteId}`,
        );
        const token = order.user?.token;
        if (order.user !== undefined && order.user.token) {
          return await this.processOrder(order);
        } else {
          return Promise.reject(order.id + ' => order.user.token is null');
        }
      }),
    );
    console.log(
      results.map((result, i) => {
        return { order: ordersToRenew[i].transferLabel, ...result };
      }),
    );
  }

  async processOrder(orderDbWithUserAndToken: Order) {
    if (!orderDbWithUserAndToken.user?.token) {
      throw new Error('no token');
    }

    const renewOrderResult = await this.bity.renewOrder({
      order: orderDbWithUserAndToken,
      token: orderDbWithUserAndToken.user.token,
    });
    console.log('New order', renewOrderResult?.response);
    if (!renewOrderResult || renewOrderResult.response.status !== 200) {
      await this.em.getRepository(Order).update(
        {
          id: orderDbWithUserAndToken.id,
        },
        {
          updatedAt: new Date(),
          lastCheckedAt: new Date(),
        },
      );
      throw new Error("Can't renew order " + orderDbWithUserAndToken.id);
    }
    await this.em.transaction(async (em) => {
      const newOrder = renewOrderResult.response.data;
      const db = buildRepositories(em);
      await db.order.update(
        {
          id: orderDbWithUserAndToken.id,
        },
        {
          status: OrderStatus.FILLED,
          updatedAt: new Date(),
          lastCheckedAt: new Date(),
        },
      );
      await db.order.insert({
        remoteId: newOrder.id,
        transferLabel:
          newOrder.payment_details?.reference ||
          orderDbWithUserAndToken.transferLabel,
        createdAt: new Date(),
        userId: orderDbWithUserAndToken.userId,
        status: OrderStatus.OPEN,
        lastCheckedAt: new Date(),
        updatedAt: new Date(),
        currency: orderDbWithUserAndToken.currency,
        amount: orderDbWithUserAndToken.amount,
        bankDetails: JSON.stringify(newOrder.payment_details),
        redactedCryptoAddress: orderDbWithUserAndToken.redactedCryptoAddress,
        previousOrderId: orderDbWithUserAndToken.id,
      });
    });
  }
}
