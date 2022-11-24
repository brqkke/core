import { Args, Float, Query, Resolver } from '@nestjs/graphql';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { RateService } from './rate.service';

@Resolver()
export class RateResolver {
  constructor(private rateService: RateService) {}

  @Query(() => Float)
  async currentPrice(
    @Args('currency', { type: () => OrderCurrency }) currency: OrderCurrency,
  ): Promise<number> {
    return this.rateService.getCachedRate(currency);
  }
}
