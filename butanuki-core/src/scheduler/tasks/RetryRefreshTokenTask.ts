import { AbstractTask, Task } from '../Task';
import { DataSource, LessThan } from 'typeorm';
import { buildRepositories, Repositories } from '../../utils';
import { TokenStatus } from '../../entities/enums/TokenStatus';
import { AppConfigService } from '../../config/app.config.service';
import { BityService } from '../../bity/bity.service';

@Task({
  name: 'RETRY_REFRESH_TOKEN',
  interval: 60 * 1000,
})
export class RetryRefreshTokenTask extends AbstractTask {
  private db: Repositories;
  constructor(
    db: DataSource,
    private config: AppConfigService,
    private bityService: BityService,
  ) {
    super();
    this.db = buildRepositories(db.manager);
  }
  async run() {
    const tokensToRetry = await this.db.token.find({
      where: {
        status: TokenStatus.NEED_REFRESH_RETRY,
        lastRefreshTriedAt: LessThan(
          new Date(
            Date.now() - this.config.config.bity.refreshRetryDelay * 1000,
          ),
        ),
        //last refresh tried more than 3 hours ago
      },
      take: 10,
    });
    await Promise.allSettled(
      tokensToRetry.map((token) => this.bityService.refreshBityToken(token)),
    );
  }
}
