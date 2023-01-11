import { ResolveField, Resolver, Root } from '@nestjs/graphql';
import { Order } from '../entities/Order';
import { Roles } from '../decorator/user.decorator';
import { UserRole } from '../entities/enums/UserRole';

@Resolver(() => Order)
export class OrderFieldResolver {
  @ResolveField(() => String)
  @Roles(UserRole.ADMIN)
  remoteId(@Root() order: Order): string {
    return order.remoteId;
  }
}
