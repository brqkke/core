import { AlertService } from '../../alert/alert.service';
import { DataSource, MoreThan } from 'typeorm';
import { buildRepositories, Repositories } from '../../utils';
import { AbstractTask, Task } from '../Task';

@Task({
  name: 'REPORT_USER_GROWTH',
})
export class ReportUserGrowthTask extends AbstractTask {
  private db: Repositories;
  constructor(private readonly alertService: AlertService, db: DataSource) {
    super();
    this.db = buildRepositories(db.manager);
  }

  async run() {
    let task = await this.db.task.findOneBy({ name: this.name });
    if (!task) {
      task = await this.db.task.create({
        name: this.name,
        lastRunAt: new Date(0),
      });
    }
    const countNewUsersSinceLastRun = await this.db.user.count({
      where: {
        createdAt: MoreThan(task.lastRunAt),
      },
    });
    const treshold = 100; // send alert if more than 100 new users since last update
    const total = await this.db.user.count();
    if (countNewUsersSinceLastRun > treshold) {
      await this.alertService
        .send('info', `User count: ${total}`, 'telegram')
        .catch((e) => console.error(e));
      task.lastRunAt = new Date();
      await this.db.task.save(task);
    }
  }
}
