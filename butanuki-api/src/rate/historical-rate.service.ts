import { Injectable } from '@nestjs/common';
import { CryptowatchRateService } from './cryptowatch.rate.service';
import { DataSource } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { DCAInterval } from '../dca-estimator/types';

@Injectable()
export class HistoricalRateService {
  private db: Repositories;
  constructor(
    private cryptoWatchRateService: CryptowatchRateService,
    db: DataSource,
  ) {
    this.db = buildRepositories(db.manager);
  }

  private intervalToDays(interval: DCAInterval): number {
    switch (interval) {
      case DCAInterval.DAILY:
        return 1;
      case DCAInterval.WEEKLY:
        return 7;
      case DCAInterval.MONTHLY:
        return 30;
    }
  }

  public async getAveragePrice(
    currency: OrderCurrency,
    [start, end]: [string, string],
    interval: DCAInterval,
  ): Promise<{ average: number; dayCounts: number }> {
    const takeEvery = this.intervalToDays(interval);

    const q = this.db.em
      .createQueryBuilder()
      .from((qb) => {
        return qb
          .from('historical_rate', 'hr')
          .select('1/hr.rate', 'reverseRate')
          .addSelect('hr.timestamp', 'timestamp')
          .addSelect(
            'row_number() over (order by hr.timestamp)-1',
            'row_number',
          )
          .where('hr.currency = :currency', { currency })
          .andWhere('hr.timestamp >= :start', { start })
          .andWhere('hr.timestamp <= :end', { end })
          .orderBy('hr.timestamp', 'ASC');
      }, 'rates')
      .select('SUM(rates."reverseRate")', 'reverseRatesSum')
      .addSelect('COUNT(*)', 'dayCounts')
      .where('rates.row_number % :takeEvery = 0', { takeEvery });

    const result = await q.getRawOne<{
      reverseRatesSum: number;
      dayCounts: number;
    }>();
    if (result) {
      return {
        dayCounts: result.dayCounts,
        average: result.dayCounts / result.reverseRatesSum,
      };
    } else {
      return { average: 0, dayCounts: 0 };
    }
  }

  public async updateRates() {
    //find the latest timestamp
    //fetch the latest rates
    await Promise.all(
      Object.values(OrderCurrency).map(async (currency: OrderCurrency) => {
        const latest = await this.db.historicalRate.findOne({
          where: {
            currency,
          },
          order: { timestamp: 'DESC' },
        });
        const rates = await this.cryptoWatchRateService.fetchRates(
          currency,
          '86400',
          [
            //86400 = 1 day
            Math.round((latest?.timestamp.getTime() || 0) / 1000),
            Math.round(Date.now() / 1000),
          ],
        );
        if (!rates.result) {
          console.log('Error fetching rates', rates);
          return;
        }
        const entities = rates.result?.['86400'].map((rate) => {
          const [timestamp, openPrice, , closePrice] = rate;
          return this.db.historicalRate.create({
            currency,
            rate: (openPrice + closePrice) / 2,
            timestamp: new Date(timestamp * 1000),
          });
        });
        await this.db.historicalRate.upsert(entities, [
          'currency',
          'timestamp',
        ]);
      }),
    );
  }
}
