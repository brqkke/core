import { AbstractTask, Task } from '../Task';
import { DataSource, LessThan } from 'typeorm';
import { buildRepositories, Repositories } from '../../utils';
import { TokenStatus } from '../../entities/enums/TokenStatus';
import { AppConfigService } from '../../config/app.config.service';
import { BityService } from '../../bity/bity.service';

@Task({
  name: 'RETRY_REFRESH_TOKEN',
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
    const treshold = new Date(
      Date.now() - this.config.config.bity.refreshRetryDelay * 1000,
    );
    const tokensToRetry = await this.db.token.find({
      where: [
        {
          status: TokenStatus.NEED_REFRESH_RETRY,
          lastRefreshTriedAt: LessThan(treshold),
          //last refresh tried more than 3 hours ago
        },
        {
          status: TokenStatus.NEED_REFRESH_RETRY,
          refreshTriesCount: 1,
        },
      ],
      take: 5,
    });
    for (const token of tokensToRetry) {
      await this.bityService
        .refreshBityToken(token, true)
        .catch((err) => console.log(token.id, err));
    }
  }
}
