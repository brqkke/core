import { AbstractTask, Task } from '../Task';
import { buildRepositories, Repositories } from '../../utils';
import { DataSource } from 'typeorm';
import { AppConfigService } from '../../config/app.config.service';
import { RateService } from '../../rate/rate.service';

@Task({ name: 'BTC_PRICE' })
export class Reporting extends AbstractTask {
  private db: Repositories;

  constructor(
    db: DataSource,
    private appConfig: AppConfigService,
    private rateService: RateService,
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

    return (
      task.lastRunAt <
      new Date(
        Date.now() -
          this.appConfig.config.backgroundAgent.bitcoinPriceRefreshInterval *
            1000,
      )
    ); //Run every day
  }

  async run() {
    await this.rateService.updateRates();
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
