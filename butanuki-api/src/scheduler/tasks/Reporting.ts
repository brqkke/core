import { AbstractTask, Task } from '../Task';
import { buildRepositories, Repositories } from '../../utils';
import { DataSource, MoreThan } from 'typeorm';
import { AppConfigService } from '../../config/app.config.service';
import { MailerService } from '../../emails/MailerService';
import { TokenStatus } from '../../entities/enums/TokenStatus';
import { OrderStatus } from '../../entities/enums/OrderStatus';
import { EventLogType } from '../../entities/EventLog';
import { BityReportingService } from '../../bity/bity.reporting.service';

@Task({ name: 'REPORTING' })
export class Reporting extends AbstractTask {
  private db: Repositories;

  constructor(
    db: DataSource,
    private appConfig: AppConfigService,
    private mailer: MailerService,
    private bityReporting: BityReportingService,
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

    if (!this.appConfig.config.backgroundAgent.reporting.enable) {
      this.log('Disabled');
      return false;
    }

    return (
      task.lastRunAt <
      new Date(
        Date.now() -
          this.appConfig.config.backgroundAgent.reporting.reportingInterval *
            1000,
      )
    ); //Run every day
  }

  async run() {
    try {
      const monthReport = await this.bityReporting.getMonthReporting(
        new Date(),
      );
      const monthReportText = `<pre>${JSON.stringify(
        monthReport,
        null,
        2,
      )}</pre>`;

      const totalEmails = await this.db.user.count();
      const totalLinkedAccount = await this.db.token.count();
      const totalBrokenLinks = await this.db.token.count({
        where: { status: TokenStatus.BROKEN },
      });

      const totalOpenOrders = await this.db.order.count({
        where: { status: OrderStatus.OPEN },
      });

      //Orders checked less than two months ago and two weeks ago
      const totalOpenOrdersRecentTwoWeeks = await this.db.order.count({
        where: {
          status: OrderStatus.OPEN,
          lastCheckedAt: MoreThan(
            new Date(Date.now() - 1000 * 3600 * 24 * 7 * 2),
          ),
        },
      });

      const totalOpenOrdersRecentTwoMonths = await this.db.order.count({
        where: {
          status: OrderStatus.OPEN,
          lastCheckedAt: MoreThan(
            new Date(Date.now() - 1000 * 3600 * 24 * 30 * 2),
          ),
        },
      });

      const totalBrokenTokenLastMonth = await this.db.eventLog.count({
        where: {
          type: EventLogType.BROKEN_TOKEN,
          createdAt: MoreThan(new Date(Date.now() - 1000 * 3600 * 24 * 30)),
        },
      });

      const content = `
NB comptes: ${totalEmails}<br>
Dont liés à bity: ${totalLinkedAccount}, (Dont cassés: ${totalBrokenLinks})<br>
NB d'ordres ouverts: ${totalOpenOrders},
<ul>
<li>Dont ordres vérifiés il y a moins de 2 mois : ${totalOpenOrdersRecentTwoMonths}</li>
<li>Dont ordres vérifiés il y a moins de 2 semaines : ${totalOpenOrdersRecentTwoWeeks}</li>
</ul><br>
NB envois de mails de reconnexion bity les 30 derniers jours: ${totalBrokenTokenLastMonth}
<br>${monthReportText}`;

      await this.mailer.sendReportingEmail(content);
      await this.db.task.update(
        {
          name: this.name,
        },
        {
          lastRunAt: new Date(),
        },
      );
    } catch (e) {
      this.log('Error while sending reporting', 'error');
      this.log(e, 'error');
      const task = await this.db.task.findOneOrFail({
        where: { name: this.name },
      });
      task.triesCount++;
      if (task.triesCount >= 3) {
        task.lastRunAt = new Date();
        task.triesCount = 0;
      }
      await this.db.task.save(task);
    }
  }
}
