import { ResolveField, Resolver, Root } from '@nestjs/graphql';
import { BityPaymentDetails, Order } from '../../entities/Order';
import { forwardRef, Inject } from '@nestjs/common';
import { OrderService } from '../../order/order.service';
import { VaultService } from '../../vault/vault.service';

@Resolver(() => Order)
export class BityOrderResolver {
  constructor(
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
    @Inject(forwardRef(() => VaultService))
    private vaultService: VaultService,
  ) {}

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
