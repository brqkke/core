import { Args, Query, registerEnumType, Resolver } from '@nestjs/graphql';
import { DcaEstimatorService } from './dca-estimator.service';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { DCAConfig, DCAInterval, EstimatorResult, ItemType } from './types';
import { RateService } from '../rate/rate.service';

registerEnumType(DCAInterval, {
  name: 'DCAInterval',
});

@Resolver(() => EstimatorResult)
export class DcaEstimatorResolver {
  constructor(
    private dcaEstimatorService: DcaEstimatorService,
    private rateService: RateService,
  ) {}

  @Query(() => EstimatorResult)
  async averageCostEstimator(
    @Args('currency', { type: () => OrderCurrency }) currency: OrderCurrency,
    @Args('start', { type: () => String }) start: string,
    @Args('end', { type: () => String }) end: string,
    @Args('interval', { type: () => DCAInterval }) interval: DCAInterval,
  ): Promise<EstimatorResult> {
    return this.dcaEstimatorService.averageDCACost(
      currency,
      [start, end],
      interval,
    );
  }

  @Query(() => [DCAConfig])
  async dcaEstimatorConfigs(): Promise<DCAConfig[]> {
    return [
      {
        slug: 'cigarettes',
        type: ItemType.CIGARETTES,
        interval: DCAInterval.DAILY,
        price: 10,
        emojis: '🚬🚬🚬🚬🚬🚬🚬',
      },
      {
        slug: 'coffee',
        type: ItemType.COFFEE,
        interval: DCAInterval.DAILY,
        price: 6,
        emojis: '☕☕☕☕☕☕☕',
      },
      {
        slug: 'beer',
        type: ItemType.BEER,
        interval: DCAInterval.DAILY,
        price: 7,
        emojis: '🍺🍺🍺🍺🍺🍺🍺',
      },
      {
        slug: 'fast-food',
        type: ItemType.FASTFOOD,
        interval: DCAInterval.DAILY,
        price: 8,
        emojis: '🍔🍟🥤🍗🍔🍟🥤',
      },
    ];
  }

  // @ResolveField(() => Float)
  // async currentPrice(
  //   @Root() estimatorResult: EstimatorResult,
  // ): Promise<number> {
  //   return (
  //     (await this.rateService.getCachedRate(estimatorResult.currency)) *
  //     estimatorResult.totalAmount
  //   );
  // }
}
