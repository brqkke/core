import { AbstractTask, Task } from '../Task';
import { DataSource, Not } from 'typeorm';
import { buildRepositories, Repositories } from '../../utils';
import { UserStatus } from '../../entities/enums/UserStatus';
import { User } from '../../entities/User';
import crypto from 'crypto';
import { OrderStatus } from '../../entities/enums/OrderStatus';

@Task({
  name: 'CLEAN_USERS',
  interval: 60 * 1000,
})
export class CheckPendingOrdersTask extends AbstractTask {
  private db: Repositories;

  constructor(dataSource: DataSource) {
    super();
    this.db = buildRepositories(dataSource.manager);
  }

  async run(): Promise<any> {
    const usersToClean: User[] = await this.db.user.find({
      where: { status: UserStatus.TO_DISABLE },
    });
    const result = await Promise.allSettled(
      usersToClean.map(async (user) => {
        return this.db.em.transaction(async (em) => {
          const emailSha256 = crypto
            .createHash('sha256')
            .update(user.email)
            .digest('hex');

          const db = buildRepositories(em);
          await db.user.update(
            {
              id: user.id,
            },
            { status: UserStatus.DISABLED, email: emailSha256 },
          );
          await db.order.update(
            {
              userId: user.id,
              status: Not(OrderStatus.FILLED),
            },
            {
              status: OrderStatus.CANCELLED,
              updatedAt: new Date(),
            },
          );
          await db.session.update({ userId: user.id }, { expireAt: 0 });
          await db.token.delete({ userId: user.id });
        });
      }),
    );
    console.log(result);
  }
}
