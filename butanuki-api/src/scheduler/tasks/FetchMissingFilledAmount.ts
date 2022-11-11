import { AbstractTask, Task } from '../Task';
import { buildRepositories, Repositories } from '../../utils';
import { DataSource, In, IsNull } from 'typeorm';
import { AppConfigService } from '../../config/app.config.service';
import { BityService } from '../../bity/bity.service';
import { OrderStatus } from '../../entities/enums/OrderStatus';
import { TokenStatus } from '../../entities/enums/TokenStatus';

@Task({ name: 'FETCH_MISSING_FILLED_AMOUNT' })
export class FetchMissingFilledAmount extends AbstractTask {
  private db: Repositories;

  constructor(
    db: DataSource,
    private appConfig: AppConfigService,
    private bityService: BityService,
  ) {
    super();
    this.db = buildRepositories(db.manager);
  }

  async shouldRun(): Promise<boolean> {
    const task = await this.db.task.findOne({
      where: { name: this.name },
    });

    if (!task) {
      await this.db.task.insert({
        lastRunAt: new Date(0),
        name: this.name,
      });
      return true;
    }

    return false;
  }

  async run() {
    const users = await this.db.user.find({
      where: {
        token: {
          status: TokenStatus.ACTIVE,
        },
      },
      relations: {
        token: true,
      },
    });
    for (const user of users) {
      if (!user.token) {
        console.log(`User ${user.id} has no ACTIVE token`);
        continue;
      }
      const orders = await this.db.order.find({
        where: {
          filledAmount: IsNull(),
          status: In([OrderStatus.FILLED, OrderStatus.FILLED_NEED_RENEW]),
          userId: user.id,
        },
      });
      let token = user.token;
      for (const order of orders) {
        const { response, newToken } = await this.bityService.getBityOrder({
          orderId: order.remoteId,
          token,
        });
        token = newToken;
        if (response.status === 200 && response.data.output?.amount) {
          console.log(
            `Updating order ${order.id} with filledAmount ${response.data.output.amount} BTC`,
          );
          const amount = parseFloat(response.data.output.amount);
          await this.db.order.update(order.id, {
            filledAmount: amount,
          });
        }
      }
    }

    await this.db.task.update(
      {
        name: this.name,
      },
      {
        lastRunAt: new Date(),
      },
    );
  }
}
