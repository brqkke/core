import { Injectable } from '@nestjs/common';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { DCAInterval, EstimatorResult } from './types';
import { HistoricalRateService } from '../rate/historical-rate.service';

/*
[
  CloseTime,
  OpenPrice,
  HighPrice,
  LowPrice,
  ClosePrice,
  Volume,
  QuoteVolume
]
 */
type Holc = [number, number, number, number, number, number, number];

type Intervals =
  | '60'
  | '180'
  | '300'
  | '900'
  | '1800'
  | '3600'
  | '7200'
  | '14400'
  | '21600'
  | '43200'
  | '86400'
  | '259200'
  | '604800'
  | '604800_Monday';
type Response = {
  result?: {
    [key in Intervals]: Holc[];
  };
};
@Injectable()
export class DcaEstimatorService {
  constructor(private historicalRateService: HistoricalRateService) {}
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

  private countIntervals(
    startTimestamp: number,
    endTimestamp: number,
    interval: DCAInterval,
  ): number {
    const intervalInDays = this.intervalToDays(interval);
    const days = (endTimestamp - startTimestamp) / 86400;
    return Math.floor(days / intervalInDays);
  }

  async averageDCACost(
    currency: OrderCurrency,
    [start, end]: [string, string],
    interval: DCAInterval,
  ): Promise<EstimatorResult> {
    const { average, dayCounts } =
      await this.historicalRateService.getAveragePrice(
        currency,
        [start, end],
        interval,
      );

    return { averageBtcPrice: average, transactionCount: dayCounts };
  }

  // async dcaEstimator(
  //   currency: OrderCurrency,
  //   [start, end]: [number, number],
  //   interval: DCAInterval,
  //   periodicAmount: number,
  // ): Promise<EstimatorResult> {
  //   const { averageCost, periodCount } = await this.averageDCACost(
  //     currency,
  //     [start, end],
  //     interval,
  //   );
  //   const totalCost = periodicAmount * periodCount;
  //   const totalAmount =
  //     !!totalCost && !!averageCost ? totalCost / averageCost : 0;
  //   return {
  //     averagePrice: averageCost,
  //     totalAmount,
  //     totalCost,
  //     currency,
  //   };
  // }
}
