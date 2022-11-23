import { AbstractTask, Task } from '../Task';
import { buildRepositories, Repositories } from '../../utils';
import { DataSource } from 'typeorm';
import { AppConfigService } from '../../config/app.config.service';
import { HistoricalRateService } from '../../rate/historical-rate.service';

@Task({ name: 'FETCH_HISTORICAL_RATES' })
export class FetchHistoricalRates extends AbstractTask {
  private db: Repositories;

  constructor(
    db: DataSource,
    private appConfig: AppConfigService,
    private historicalRateService: HistoricalRateService,
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

    return task.lastRunAt < new Date(Date.now() - 4 * 60 * 60 * 1000);
  }

  async run() {
    await this.historicalRateService.updateRates();
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
