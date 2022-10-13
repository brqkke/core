import {
  Args,
  ID,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { BityPaymentDetails, Order } from '../../entities/Order';
import { CurrentUser, Roles } from '../../decorator/user.decorator';
import { User } from '../../entities/User';
import { SetOrderDTO } from '../../dto/SetOrderDTO';
import {
  BadRequestException,
  forwardRef,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderService } from '../../order/order.service';
import { VaultService } from '../../vault/vault.service';
import { MailerService } from '../../emails/MailerService';
import { Vault } from '../../entities/Vault';
import { UserRole } from '../../entities/enums/UserRole';

@Resolver(() => Order)
export class BityOrderResolver {
  constructor(
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
    @Inject(forwardRef(() => VaultService))
    private vaultService: VaultService,
    private mailerService: MailerService,
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

  @Mutation(() => Vault)
  @Roles(UserRole.USER)
  async addOrder(
    @CurrentUser() user: User,
    @Args({ name: 'data', type: () => SetOrderDTO }) data: SetOrderDTO,
    @Args({ name: 'vaultId', type: () => ID }) vaultId: string,
    @Args({ name: 'replaceOrderId', type: () => ID, nullable: true })
    replaceOrderId?: string,
  ): Promise<Vault> {
    if (!user.token) {
      throw new BadRequestException({
        success: false,
        error: 'Bity not linked',
      });
    }
    const vault = await this.vaultService.findUserVault(user, vaultId);
    if (
      !data.cryptoAddress &&
      (await this.orderService.openOrdersAlreadyExists({
        amount: data.amount,
        currency: vault.currency,
        userId: user.id,
        vaultId: vault.id,
      }))
    ) {
      return vault;
    }

    if (!data.cryptoAddress) {
      throw new BadRequestException({
        success: false,
        error: 'You need to provide a destination address',
      });
    }
    const newOrder = await this.orderService.placeBityOrder({
      amount: data.amount,
      currency: vault.currency,
      cryptoAddress: data.cryptoAddress,
      token: user.token,
      vaultId: vault.id,
      replaceOrderId,
    });
    if (!newOrder) {
      throw new InternalServerErrorException();
    }
    await this.mailerService.sendNewOrderEmail(newOrder, user.email);
    return vault;
  }

  @Query(() => Order)
  order(@CurrentUser() user: User, @Args('id', { type: () => ID }) id: string) {
    return this.orderService.getOrder(user.id, id);
  }
}
