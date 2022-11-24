import { AbstractTask, Task } from '../Task';
import { buildRepositories, Repositories } from '../../utils';
import { DataSource } from 'typeorm';
import { AppConfigService } from '../../config/app.config.service';
import { HistoricalRateService } from '../../rate/historical-rate.service';
import { FiatHistoricalRateService } from '../../rate/fiat.historical.rate.service';

@Task({ name: 'FETCH_EARLY_HISTORICAL_RATES' })
export class FetchEarlyHistoricalRates extends AbstractTask {
  private db: Repositories;

  constructor(
    db: DataSource,
    private appConfig: AppConfigService,
    private historicalRateService: HistoricalRateService,
    private fiatHistoricalRateService: FiatHistoricalRateService,
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
    // await this.historicalRateService.updateRates();
    await this.fiatHistoricalRateService.initializePastRates();
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
