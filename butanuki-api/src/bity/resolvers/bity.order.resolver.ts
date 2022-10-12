import { ResolveField, Resolver, Root } from '@nestjs/graphql';
import { BityPaymentDetails, Order } from '../../entities/Order';

@Resolver(() => Order)
export class BityOrderResolver {
  @ResolveField(() => BityPaymentDetails, { nullable: true })
  bankDetails(@Root() order: Order): BityPaymentDetails | null {
    if (!order.bankDetails) {
      return null;
    }
    try {
      return JSON.parse(order.bankDetails) as BityPaymentDetails;
    } catch (e) {
      return null;
    }
  }
}
